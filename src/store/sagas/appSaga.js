import { put, all, race, select, call } from 'redux-saga/effects';
import { APP_ACTION } from '../actionTypes';
import { getConfigurationApp } from '../../api/config';
import { parseSettingsToObj } from '../../helpers/shipment.helper';

function* handleGetConfigurationApp() {
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getConfigurationApp(countryCode);
    const settingsData = parseSettingsToObj(response.data);
    if (response.isSuccess) {
      yield put({
        type: APP_ACTION.GET_CONFIGURATION_APP_SUCCESS,
        data: settingsData,
      });
    }
  } catch (error) {
    yield put({
      type: APP_ACTION.GET_CONFIGURATION_APP_FAIL,
      message: error
    });
    console.log('GET_CONFIGURATION_APP_FAIL', error);
    return error;
  }
}
const appSaga = {
  handleGetConfigurationApp,
};

export default appSaga;
