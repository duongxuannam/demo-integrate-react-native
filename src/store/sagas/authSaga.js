/* eslint-disable import/no-cycle */
import { put, all, select } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

import { requestLogin, updateUser } from '../../api/auth';
import { AUTH_ACTION, APP_ACTION, NOTIFICATION_ACTION, CHAT_ACTION } from '../actionTypes';

import NavigationService from '../../helpers/NavigationService';
import { LANGUAGES } from '../../constants/hardData';

function* handleLogin(data) {
  try {
    const {
      countryCode,
      phoneNumber,
      password,
    } = data.payload;
    const result = yield requestLogin(phoneNumber, countryCode, password);
    updateUser(result.access_token);
    const languageCode = yield select((state) => state.config.languageCode);
    const countrySelected = LANGUAGES.find((l) => l.countryCode === String(countryCode).toLowerCase());
    const languageDefault = countrySelected.language.find((l) => l.lang === languageCode) || LANGUAGES[3].language[0];
    yield all([
      put({
        type: AUTH_ACTION.DRIVER_LOGIN_SUCCESS,
        result,
      }),
      put({
        type: APP_ACTION.SAVE_CONFIG,
        payload: {
          countryCode: String(countryCode).toLowerCase(),
          languageCode: String(languageDefault.lang).toLowerCase()
        }
      })
    ]);
    yield put({
      type: CHAT_ACTION.LOGIN_FIREBASE
    });
    yield AsyncStorage.setItem('TOKEN', result.access_token);
    yield put({
      type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION,
    });
    NavigationService.navigate('ShipmentStack');
  } catch (error) {
    yield put({
      type: AUTH_ACTION.DRIVER_LOGIN_FAILURE,
      error,
    });
  }
}

const authSaga = {
  handleLogin,
};

export default authSaga;
