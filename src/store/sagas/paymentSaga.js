import {
  put, all, call, race, select
} from 'redux-saga/effects';
import Toast from 'react-native-root-toast';
import { PAYMENT_ACTION } from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import {
  paymentInfoFormat
} from '../../model/paymentInfoModel';
import {
  getPaymentInformation,
  updateBankInstructions,
  paymentRequestChange,
  downloadData,
} from '../../api/shipment';

function* handleGetPaymentInformation(payload) {
  try {
    const { shipmentId } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield getPaymentInformation(shipmentId);
    if (response.isSuccess) {
      const dataFormat = paymentInfoFormat(response.data);
      yield put({
        type: PAYMENT_ACTION.GET_PAYMENT_INFORMATION_SUCCESS,
        data: dataFormat,
      });
    }
  } catch (error) {
    console.log('GET_PAYMENT_INFORMATION_FAILED: ', error);
    yield put({ type: PAYMENT_ACTION.GET_PAYMENT_INFORMATION_FAILED, message: error });
    return error;
  }
}

function* handleUpdateBankInstructions(payload) {
  try {
    const { param, shipmentId } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield updateBankInstructions(shipmentId, param);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.UPDATE_BANK_INSTRUCTIONS_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('UPDATE_BANK_INSTRUCTIONS_FAILED: ', error);
    yield put({ type: PAYMENT_ACTION.UPDATE_BANK_INSTRUCTIONS_FAILED, message: error });
    return error;
  }
}

function* handlePaymentRequestChange(payload) {
  try {
    const { shipmentId, option } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield paymentRequestChange(shipmentId, option);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.PAYMENT_REQUEST_CHANGE_SUCCESS,
        option
      });
    }
  } catch (error) {
    console.log('PAYMENT_REQUEST_CHANGE_FAILED: ', error);
    yield put({ type: PAYMENT_ACTION.PAYMENT_REQUEST_CHANGE_FAILED, message: error });
    return error;
  }
}

function* handleDownloadData(payload) {
  try {
    const { itemDownload, message, isChat } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield downloadData(itemDownload, isChat);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.DOWNLOAD_DATA_SUCCESS,
        itemDownload: response.data,
      });

      Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  } catch (error) {
    console.log('DOWNLOAD_DATA_FAILED: ', error);
    yield put({ type: PAYMENT_ACTION.DOWNLOAD_DATA_FAILED, message: error });
    return error;
  }
}


const paymentSaga = {
  handleGetPaymentInformation,
  handleUpdateBankInstructions,
  handlePaymentRequestChange,
  handleDownloadData,
};

export default paymentSaga;
