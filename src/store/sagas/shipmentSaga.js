import {
  put,
  all,
  call,
  race,
  select
} from 'redux-saga/effects';
import moment from 'moment';
import {
  SHIPMENT_ACTION, PROGRESS_ACTION, PAYMENT_ACTION, CHAT_ACTION
} from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import {
  requestHandleUnits,
  requestLocationTypes,
  requestTransportTypes,
  requestAdditionalServices,
  requestLocationServices,
  getShipmentDetail,
  requestCreateQuote,
  getQuoteDetail,
  getProgressDetail
} from '../../api/shipment';
import { ApiError } from '../../helpers/api';
import SYSTEM_POPUP from '../../constants/systemErrorType';
import { dateClientWithFormat } from '../../helpers/date.helper';
import { MODE_SHIPMENT_DETAIL } from '../../constants/app';

function* getHandleUnitSaga(payload) {
  try {
    const { countryName } = payload;
    const handleUnits = yield requestHandleUnits(countryName);
    const defaultHandleUnits = yield requestHandleUnits('en-US');
    yield put({
      type: SHIPMENT_ACTION.GET_HANDLE_UNIT_SUCCESS,
      handleUnits: handleUnits.data,
      defaultHandleUnits: defaultHandleUnits.data,
    });
  } catch (error) {
    console.log('ERROR GET HANDLE UNIT: ', error);
    if (error instanceof ApiError) {
      const errorObject = error.getErrorObject();
      yield put({
        type: SHIPMENT_ACTION.GET_HANDLE_UNIT_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* getLocationTypes(payload) {
  try {
    const { countryName } = payload;
    const locationTypes = yield requestLocationTypes(countryName);
    const defaultLocationTypes = yield requestLocationTypes('en-US');
    const defaultTransportTypes = yield requestTransportTypes('en-US');
    const defaultAdditionalServices = yield requestAdditionalServices('en-US');
    const defaultLocationServices = yield requestLocationServices('en-US');
    yield put({
      type: SHIPMENT_ACTION.GET_LOCATION_TYPE_SUCCESS,
      locationTypes: locationTypes.data,
      defaultLocationTypes: defaultLocationTypes.data,
      defaultTransportTypes: defaultTransportTypes.data,
      defaultAdditionalServices: defaultAdditionalServices.data,
      defaultLocationServices: defaultLocationServices.data,
    });
  } catch (error) {
    console.log('GET_LOCATION_TYPE_FAILED: ', error);
    if (error instanceof ApiError) {
      const errorObject = error.getErrorObject();
      console.log('GET_LOCATION_TYPE_FAILED 2: ', errorObject);
      yield put({
        type: SHIPMENT_ACTION.GET_LOCATION_TYPE_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    } else {
      yield put({
        type: SHIPMENT_ACTION.GET_LOCATION_TYPE_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* handleSetShipmentDetail(payload) {
  try {
    const {
      shipmentId, isMultipleSize, isCheckNewDetail,
      isIgnoreGetProgressAPI, isIgnoreGetCustomerInfo, navCommunicationTab
    } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      yield put({ type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_FAIL, message: '' });
      NavigationService.navigate('Login');
      return;
    }

    yield put({
      type: PAYMENT_ACTION.GET_PAYMENT_INFORMATION,
      shipmentId
    });
    const response = yield getShipmentDetail(shipmentId);
    yield put({
      type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_SUCCESS,
      data: response.data,
    });

    if (response.data.status > 6 && response.data.status < 10) {
      yield !isIgnoreGetProgressAPI && put({
        type: PROGRESS_ACTION.GET_PROGRESS,
        shipmentID: shipmentId,
        isIgnoreNavigation: true,
        isIgnoreGetDetail: true,
      });

      yield !isIgnoreGetCustomerInfo && put({
        type: CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION,
        shipmentId,
        customerId: response.data.createdBy,
        isIgnoreNavigation: true,
        isIgnoreGetDetail: true,
      });
      if (navCommunicationTab) {
        NavigationService.navigate('ShipmentDetailStack', { tabMode: MODE_SHIPMENT_DETAIL.COMMUNICATION });
      }
    }

    if (!isCheckNewDetail && !navCommunicationTab) {
      const currentNavigation = NavigationService.getCurrentRoute();
      const mainTabNavigator = currentNavigation.routes[0].routes[0];

      NavigationService.navigate('ShipmentDetailStack', { isScroll: isMultipleSize });
    }
  } catch (error) {
    console.log('SET_SHIPMENT_DETAILS_FAIL: ', error);
    yield put({ type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_FAIL, message: error });
    return error;
  }
}

function* handleSetQuoteDetail(payload) {
  try {
    const { shipmentId } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const {
      page,
      sortFilter,
      sortFilterOrder
    } = yield select((state) => state.shipment);
    const limitPagination = yield select((state) => state.config.dataConfig.Pagination);

    const query = {
      ShipmentId: shipmentId,
      Page: page,
      Limit: limitPagination,
      Sort: sortFilter,
      SortOrder: sortFilterOrder,
    };

    const response = yield getQuoteDetail(query);

    yield put({
      type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_QUOTE_DETAIL_FAIL: ', error);
    yield put({ type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_FAIL, message: error });
    return error;
  }
}

function* handleSetQuoteDetailLoadMore(payload) {
  try {
    const { shipmentId } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const {
      page,
      sortFilter,
      sortFilterOrder,
      totalPage
    } = yield select((state) => state.shipment);
    const limitPagination = yield select((state) => state.config.dataConfig.Pagination);

    if ((page + 1) === totalPage) {
      console.log('Page is reach total page');
      return;
    }

    const query = {
      ShipmentId: shipmentId,
      Page: page < totalPage ? page + 1 : page,
      Limit: limitPagination,
      Sort: sortFilter,
      SortOrder: sortFilterOrder,
    };

    yield put({
      type: SHIPMENT_ACTION.SET_LOAD_MORE_QUOTE_DETAIL_SUCCESS,
      page: (page < totalPage) ? (page + 1) : page,
    });

    const response = yield getQuoteDetail(query);
    yield put({
      type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_QUOTE_DETAIL_FAIL: ', error);
    if (error instanceof ApiError) {
      const errorObject = error.getErrorObject();
      yield put({
        type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_FAIL,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* handleCreateQuote(payload) {
  try {
    console.log('DATA', payload);
    const { dataQuote } = payload;
    const cloneTransitTime = dataQuote.listAddress.map((addressItem) => {
      const updatedItem = dataQuote.transitData.find((t) => t && t.id === addressItem.id) || addressItem;
      return {
        shipmentAddressId: updatedItem.id,
        proposedDate: moment(dateClientWithFormat(updatedItem.proposedDate || updatedItem.pickupDate || updatedItem.earliestByDate)).utc().toISOString(),
        locationServices: updatedItem.locationServices.map((l) => ({
          id: l.id,
          isConfirmation: l.isAgreed !== null ? l.isAgreed : true,
        }))
      };
    });

    const cloneAdditionalServices = (dataQuote.additionalPlaceBidData && dataQuote.additionalPlaceBidData.map((a) => ({
      id: a.id,
      isConfirmation: a.isAgreed
    }))) || [];

    const data = {
      shipmentId: dataQuote.shipmentId,
      price: dataQuote.bidPrice,
      transitTimes: cloneTransitTime,
      additionalServices: cloneAdditionalServices
    };
    const result = yield requestCreateQuote(data);
    console.log('Result: ', result);

    if (result.isSuccess) {
      yield all([
        put({
          type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS,
          shipmentId: dataQuote.shipmentId,
          isMultipleSize: false,
          isCheckNewDetail: true
        }),
        put({
          type: SHIPMENT_ACTION.SET_QUOTE_DETAIL,
          shipmentId: dataQuote.shipmentId,
        })
      ]);
      NavigationService.back();
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.log('ERROR: ', error.getErrorObject());
      const { dataQuote } = payload;
      const {
        page,
        sortFilter,
        sortFilterOrder
      } = yield select((state) => state.shipment);
      const limitPagination = yield select((state) => state.config.dataConfig.Pagination);

      const query = {
        ShipmentId: dataQuote.shipmentId,
        Page: page,
        Limit: limitPagination,
        Sort: sortFilter,
        SortOrder: sortFilterOrder,
      };

      const res = yield getShipmentDetail(dataQuote.shipmentId);
      const res2 = yield getQuoteDetail(query);

      yield all([put({
        type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_SUCCESS,
        data: res.data,
      }),

      put({
        type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_SUCCESS,
        data: { ...res2 },
      })]);

      yield put({
        type: SHIPMENT_ACTION.CREATE_QUOTE_FAILED,
        error: {
          type: SYSTEM_POPUP.PLACE_BID,
          error: error.message,
          isGoBack: error.status === 400
        }
      });
    }
  }
}

const shipmentSaga = {
  getHandleUnitSaga,
  getLocationTypes,
  handleSetShipmentDetail,
  handleSetQuoteDetail,
  handleSetQuoteDetailLoadMore,
  handleCreateQuote
};

export default shipmentSaga;
