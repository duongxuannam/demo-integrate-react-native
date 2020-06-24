import { put } from 'redux-saga/effects';
import { getConfigSettings } from '../../api/config';
import { CONFIG_ACTION } from '../actionTypes';
import { configModel } from '../../model/configData';

function* getConfigSettingByCountCode(payload) {
  try {
    const { countryCode } = payload;
    const response = yield getConfigSettings(countryCode);
    if (response.isSuccess) {
      yield put({
        type: CONFIG_ACTION.GET_CONFIG_SETTING_SUCCESS,
        data: configModel(response.data)
      });
    }
  } catch (error) {
    console.log('GET_CONFIG_SETTING_FAILED: ', error);
    yield put({ type: CONFIG_ACTION.GET_CONFIG_SETTING_FAILED, message: error });
  }
}

const configSaga = {
  getConfigSettingByCountCode
};

export default configSaga;
