import { put, all, select } from 'redux-saga/effects';
import { PROGRESS_ACTION, SHIPMENT_ACTION } from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import {
  getProgressDetail,
  updateProgress,
  getShipmentDetail,
  uploadPhotoProgress,
  removePhotoProgress,
  updateAddressProgress
} from '../../api/shipment';
import {
  bookedUI, dispatchUI, pickupUI, destinationUI
} from '../../model/progress';
import { PROGRESS_TYPE, MODE_SHIPMENT_DETAIL, ADDRESS_STATUS } from '../../constants/app';
import { ApiError } from '../../helpers/api';
import SYSTEM_POPUP from '../../constants/systemErrorType';

function* handleGetProgress(payload) {
  try {
    const {
      shipmentID, isIgnoreNavigation, isIgnoreGetDetail
    } = payload;
    const { token } = yield select((state) => state.auth);
    let { shipmentStatus } = payload;
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    if (!isIgnoreGetDetail) {
      yield put({
        type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS,
        shipmentId: shipmentID,
        isIgnoreGetProgressAPI: true,
      });
    }

    const response = yield getProgressDetail(shipmentID);
    if (response.isSuccess) {
      const { shipmentDetail } = yield select((state) => state.shipment);
      shipmentStatus = !shipmentStatus ? shipmentDetail.status : shipmentStatus;
      const data = {
        booked: bookedUI({ ...response.data.bookedSection }, shipmentStatus),
        dispatch: dispatchUI({ ...response.data.dispatchSection }),
        pickup: pickupUI({
          ...response.data.pickupSection,
          type: PROGRESS_TYPE.PICKUP,
          active: response.data.pickupSection.status === 'Completed',
          noEdit: false // !!response.data.pickupSection.status
        }),
        deliveryDestination: response.data.deliverySections.map((item) => destinationUI({ ...item, type: PROGRESS_TYPE.DESTINATION })),
        updatedAt: response.data.updatedAt,
      };
      yield put({ type: PROGRESS_ACTION.GET_PROGRESS_SUCCESS, ...data });
      if (!data.booked.active) {
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.BOOKED, idDestination: null }
        });
      } else if (!data.dispatch.active) {
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.DISPATCH, idDestination: null }
        });
      } else if (!data.pickup.active) {
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.PICKUP, idDestination: null }
        });
      } else {
        const deliveryNotCompletedList = data.deliveryDestination.filter((d) => d.status !== 'Completed');
        if (deliveryNotCompletedList.length > 0) {
          yield put({
            type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
            currentProgress: { type: PROGRESS_TYPE.DESTINATION, idDestination: deliveryNotCompletedList[0].addressId }
          });
        }
      }
      if (!isIgnoreNavigation) {
        NavigationService.navigate('ShipmentDetailStack', { tabMode: MODE_SHIPMENT_DETAIL.PROGRESS });
      }
    }
  } catch (error) {
    console.log('SET_PIN_FAIL: ', error);
    yield put({ type: PROGRESS_ACTION.GET_PROGRESS_FAIL, message: error });
    return error;
  }
}

function* handleUpdateProgress(payload) {
  try {
    const { param, shipmentID } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield updateProgress(shipmentID, param);
    console.log('PROGRESS RESPONSE: ', response);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.UPDATE_PROGRESS_SUCCESS,
        param,
      });
    }
  } catch (error) {
    yield put({ type: PROGRESS_ACTION.UPDATE_PROGRESS_FAIL, message: error });
    return error;
  }
}

function* handleUploadPhotoProgress(payload) {
  try {
    const { param, shipmentID } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield uploadPhotoProgress(shipmentID, param, token);
    console.log('PROGRESS RESPONSE: ', response);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO_SUCCESS,
        section: param.Section,
        shipmentID,
        index: param.Data.index,
        data: response.data
      });
    }
  } catch (error) {
    console.log('ERROR UPLOAD PROGRESS PHOTO: ', error);
    if (error instanceof ApiError) {
      yield put({
        type: PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* handleRemovePhotoProgress(payload) {
  try {
    const { param, shipmentID } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield removePhotoProgress(shipmentID, param);
    console.log('PROGRESS RESPONSE: ', response);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO_SUCCESS,
        section: param.Section,
        shipmentID,
        index: param.Data.index,
        data: response.data
      });
    }
  } catch (error) {
    console.log('ERROR UPLOAD PROGRESS PHOTO: ', error);
    if (error instanceof ApiError) {
      yield put({
        type: PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* handleUpdateAddressProgress(payload) {
  try {
    const { param, shipmentID } = payload;
    const { token, progress } = yield select((state) => ({
      token: state.auth.token,
      progress: state.progress
    }));

    if (!token) {
      NavigationService.navigate('Login');
      return;
    }


    if (param.stepDelivery === PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase()) && !progress.dispatch.active) {
      return yield put({
        type: PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: 'Need confirm dispatch first',
        }
      });
    }

    if (param.stepDelivery === PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase()) && !progress.pickup.active) {
      return yield put({
        type: PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: 'Need confirm pickup first',
        }
      });
    }

    const data = {
      shipmentaddressid: param.addressId,
      stepdelivery: param.stepDelivery,
      finaldestination: progress.deliveryDestination.filter((d) => d.status === ADDRESS_STATUS.IN_PROGRESS).length === 1
    };

    const response = yield updateAddressProgress(shipmentID, data);
    console.log('PROGRESS RESPONSE: ', response);
    if (response.isSuccess) {
      yield put({
        type: PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION_SUCCESS,
        param: {
          section: param.stepDelivery,
          addressId: param.addressId || null,
          active: true
        }
      });
      if (param.stepDelivery === PROGRESS_TYPE.DISPATCH.replace(/^\w/, (c) => c.toUpperCase())) {
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.PICKUP, idDestination: null }
        });
      }

      if (param.stepDelivery === PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase())) {
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.DESTINATION, idDestination: progress.deliveryDestination[0].addressId }
        });
      }

      if (param.stepDelivery === PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase())) {
        const destinationsNeedDelivery = progress.deliveryDestination.filter((d) => d.addressId !== param.addressId && d.status !== 'Completed');
        yield put({
          type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
          currentProgress: { type: PROGRESS_TYPE.DESTINATION, idDestination: (destinationsNeedDelivery.length > 0 && destinationsNeedDelivery[0].addressId) || param.addressId }
        });
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      yield put({
        type: PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

const progressSaga = {
  handleGetProgress,
  handleUpdateProgress,
  handleUploadPhotoProgress,
  handleRemovePhotoProgress,
  handleUpdateAddressProgress,
};

export default progressSaga;
