import { put, select } from 'redux-saga/effects';
import { PAYMENT_ACTION } from '../actionTypes';
import {
  getPayment,
  requestChangePaymentMethod,
  requestAmendPaymentMethod,
  uploadProof,
  deleteProof,
  confirmPaymentCompleted,
} from '../../api/payment';
import SYSTEM_POPUP from '../../constants/systemErrorTypes';

function* handleGetPaymentMethod(payload) {
  const { shipmentId, callback } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getPayment(shipmentId, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.GET_PAYMENT_SUCCESS,
        payment: response.data,
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.GET_PAYMENT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('GET_PAYMENT_FAILED', error);
    callback();
    return error;
  }
}

function* handleRequestChangePaymentMethod(payload) {
  const { shipmentId, callback, method } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield requestChangePaymentMethod(shipmentId, method, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      const requestChanege = yield getPayment(shipmentId, countryCode);
      yield put({
        type: PAYMENT_ACTION.REQUEST_CHANGE_PAYMENT_METHOD_SUCCESS,
        payment: requestChanege.data,
      });
      callback(true, null);
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.REQUEST_CHANGE_PAYMENT_METHOD_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, true);
    console.log('REQUEST_CHANGE_PAYMENT_METHOD_FAILED', error);
    callback();
    return error;
  }
}

function* handleUploadProofPaymentMethod(payload) {
  const { shipmentId, callback, photo } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield uploadProof(shipmentId, photo, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.UPLOAD_PROOF_PAYMENT_METHOD_SUCCESS,
        proofs: response.data[0],
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.UPLOAD_PROOF_PAYMENT_METHOD_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('UPLOAD_PROOF_PAYMENT_METHOD_FAILED', error);
    callback();
    return error;
  }
}

function* handleDeleteProofPaymentMethod(payload) {
  const { shipmentId, callback, proofId } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield deleteProof(shipmentId, proofId, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.DELETE_PROOF_PAYMENT_METHOD_SUCCESS,
        proofId
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.DELETE_PROOF_PAYMENT_METHOD_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('REMOVE_PROOF_PAYMENT_METHOD_FAILED', error);
    callback();
    return error;
  }
}

function* handleAmendChangePaymentMethod(payload) {
  const { shipmentId, callback } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield requestAmendPaymentMethod(shipmentId, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.AMEND_PAYMENT_METHOD_SUCCESS,
        payment: response.data,
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.AMEND_PAYMENT_METHOD_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('AMEND_PAYMENT_METHOD_FAILED', error);
    callback();
    return error;
  }
}

function* handleConfirmPaymentCompleted(payload) {
  const { shipmentId, callback } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield confirmPaymentCompleted(shipmentId, countryCode);
    console.log('response', response);
    if (response.isSuccess) {
      yield put({
        type: PAYMENT_ACTION.COFIRM_COMPLETED_PAYMENT_METHOD_SUCCESS,
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PAYMENT_ACTION.COFIRM_COMPLETED_PAYMENT_METHOD_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('COFIRM_COMPLETED_PAYMENT_METHOD_FAILED', error);
    callback();
    return error;
  }
}

const paymentSaga = {
  handleGetPaymentMethod,
  handleRequestChangePaymentMethod,
  handleUploadProofPaymentMethod,
  handleAmendChangePaymentMethod,
  handleDeleteProofPaymentMethod,
  handleConfirmPaymentCompleted,
};

export default paymentSaga;
