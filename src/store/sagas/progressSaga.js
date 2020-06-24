import { put, select } from 'redux-saga/effects';
import { PROGRESS_ACTION } from '../actionTypes';
import {
  getProgress,
  updateProgress,
  uploadProgressAttackment,
  uploadDispatchedAttackment,
  deleteProgressAttackment,
} from '../../api/progress';
import SYSTEM_POPUP from '../../constants/systemErrorTypes';

function* handleGetProgress(payload) {
  const { shipmentId, callback = () => {} } = payload;
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getProgress(shipmentId, countryCode);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.GET_PROGRESS_SUCCESS,
        data: { ...response.data },
      });
      callback();
    }
  } catch (error) {
    yield put({
      type: PROGRESS_ACTION.GET_PROGRESS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback();
    console.log('GET_PROGRESS_FAIL', error);
    return error;
  }
}

function* handleUpdateProgress(payload) {
  try {
    const { shipmentId, body } = payload;
    const response = yield updateProgress(shipmentId, body);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.GET_PROGRESS,
        shipmentId,
        callback: () => {},
      });
    }
  } catch (error) {
    yield put({
      type: PROGRESS_ACTION.UPDATE_PROGRESS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    console.log('UPDATE_PROGRESS_FAIL', error);
    return error;
  }
}

function* handleUploadProgressAttachment(payload) {
  try {
    const {
      shipmentId, section, file, id
    } = payload;
    const response = yield uploadProgressAttackment(id, section, file);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.GET_PROGRESS,
        shipmentId,
        callback: () => {},
      });
    }
  } catch (error) {
    yield put({
      type: PROGRESS_ACTION.UPLOAD_PROGRESS_ATTACHMENT_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      },
      callback: () => {},
    });
    console.log('UPLOAD_PROGRESS_ATTACHMENT_FAIL', error);
    return error;
  }
}

function* handleUploadDispatchedAttachment(payload) {
  try {
    const { shipmentId, file } = payload;
    const response = yield uploadDispatchedAttackment(shipmentId, file);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.GET_PROGRESS,
        shipmentId,
        callback: () => {},
      });
    }
  } catch (error) {
    yield put({
      type: PROGRESS_ACTION.UPLOAD_DISPATCHED_ATTACHMENT_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      },
      callback: () => {},
    });
    console.log('UPLOAD_DISPATCHED_ATTACHMENT_FAIL', error);
    return error;
  }
}

function* handleDeleteProgressAttachment(payload) {
  try {
    const { fileName, shipmentId } = payload;
    const response = yield deleteProgressAttackment(fileName);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.GET_PROGRESS,
        shipmentId,
        callback: () => {},
      });
    }
  } catch (error) {
    yield put({
      type: PROGRESS_ACTION.DELETE_PROGRESS_ATTACHMENT_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      },
      callback: () => {},
    });
    console.log('DELETE_PROGRESS_ATTACHMENT_FAIL', error);
    return error;
  }
}

const progressSaga = {
  handleGetProgress,
  handleUpdateProgress,
  handleUploadProgressAttachment,
  handleUploadDispatchedAttachment,
  handleDeleteProgressAttachment,
};

export default progressSaga;
