import moment from 'moment';
import { put, all, select } from 'redux-saga/effects';
import { DRIVER_ACTION } from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import {
  searchShipment,
  pinShipment,
  getTopLowestBid,
} from '../../api/driver';
import {
  setDeliveryFilter,
  setPickupsFilter,
} from '../../helpers/filter.helper';

import { getTotalStatusFilter } from '../../api/shipment';

import APP_CONSTANT from '../../helpers/constant.helper';
import { getPlaceDetail } from '../../api/googleApi';
import SYSTEM_POPUP from '../../constants/systemErrorType';
import { ApiError } from '../../helpers/api';

// Pickup
function* handleSetDataRootPickup(payload) {
  try {
    const { data } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_DATA_ROOT_PICKUP_SUCCESS,
        data,
      }),
      put({
        type: DRIVER_ACTION.SET_COORS_ADDRESS,
        data: {
          placeId: data.place_id,
          isPickup: true,
          typeAddress: 'root',
          index: null,
        }
      }),
    ]);
  } catch (error) {
    console.log('SET_DATA_ROOT_PICKUP_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_ROOT_PICKUP_FAIL, message: error });
    return error;
  }
}

function* handleSetDataAnotherPickup(payload) {
  try {
    const { data, index, anotherPickupData } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_DATA_ANOTHER_PICKUP_SUCCESS,
        data,
        index,
        anotherPickupData,
      }),
      put({
        type: DRIVER_ACTION.SET_COORS_ADDRESS,
        data: {
          placeId: data.place_id,
          isPickup: true,
          typeAddress: 'another',
          index,
        }
      }),
    ]);
  } catch (error) {
    console.log('SET_DATA_ROOT_PICKUP_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_ANOTHER_PICKUP_FAIL, message: error });
    return error;
  }
}

function* handleRemovePickupAddress(payload) {
  try {
    const { isRoot, index } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.REMOVE_PICKUP_ADDRESS_SUCCESS,
        isRoot,
        index,
      }),
      put({
        type: DRIVER_ACTION.SET_DATA_FOR_QUERY,
      })
    ]);
  } catch (error) {
    console.log('REMOVE_PICKUP_ADDRESS_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.REMOVE_PICKUP_ADDRESS_FAIL, message: error });
    return error;
  }
}

// Delivery
function* handleSetDataRootDelivery(payload) {
  try {
    const { data } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_DATA_ROOT_DELIVERY_SUCCESS,
        data,
      }),
      put({
        type: DRIVER_ACTION.SET_COORS_ADDRESS,
        data: {
          placeId: data.place_id,
          isPickup: false,
          typeAddress: 'root',
          index: null,
        }
      }),
    ]);
  } catch (error) {
    console.log('SET_DATA_ROOT_DELIVERY_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_ROOT_DELIVERY_FAIL, message: error });
    return error;
  }
}

function* handleSetDataAnotherDelivery(payload) {
  try {
    const { data, index, anotherDeliveryData } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_DATA_ANOTHER_DELIVERY_SUCCESS,
        data,
        index,
        anotherDeliveryData,
      }),
      put({
        type: DRIVER_ACTION.SET_COORS_ADDRESS,
        data: {
          placeId: data.place_id,
          isPickup: false,
          typeAddress: 'another',
          index,
        }
      }),
    ]);
  } catch (error) {
    console.log('SET_DATA_ANOTHER_DELIVERY_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_ANOTHER_DELIVERY_FAIL, message: error });
    return error;
  }
}

function* handleRemoveDeliveryAddress(payload) {
  try {
    const { isRoot, index } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.REMOVE_DELIVERY_ADDRESS_SUCCESS,
        isRoot,
        index,
      }),
      put({
        type: DRIVER_ACTION.SET_DATA_FOR_QUERY,
      })
    ]);
  } catch (error) {
    console.log('REMOVE_DELIVERY_ADDRESS_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.REMOVE_DELIVERY_ADDRESS_FAIL, message: error });
    return error;
  }
}

function* handleSetFieldForQuery(payload) {
  try {
    const { data } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_FIELD_QUERY_SUCCESS,
        data,
      }),
      put({
        type: DRIVER_ACTION.SET_DATA_FOR_QUERY,
      })
    ]);
  } catch (error) {
    console.log('SET_FIELD_QUERY_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_FIELD_QUERY_FAIL, message: error });
    return error;
  }
}

function* handleSetRadius(payload) {
  try {
    const {
      isPickup,
      typeAddress,
      index,
      data
    } = payload;
    yield all([
      put({
        type: DRIVER_ACTION.SET_RADIUS_FOR_ADDRESS_SUCCESS,
        payload: {
          isPickup,
          typeAddress,
          index,
          data,
        },
      }),
      put({
        type: DRIVER_ACTION.SET_DATA_FOR_QUERY,
      })
    ]);
  } catch (error) {
    console.log('SET_RADIUS_FOR_ADDRESS_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_RADIUS_FOR_ADDRESS_FAIL, message: error });
    return error;
  }
}

function* handleSetDataForQuery() {
  try {
    // Pickup Filter
    const {
      modeSearch,
      rootPickup,
      anotherPickup,
      rootDelivery,
      anotherDelivery,
      maxWeight,
      sortFilter,
      handlingUnitIdFilter,
      locationTypeIdFilter,
      pickupStartDateFilter,
      pickupEndDateFilter,
      sortFilterOrder,
      // IsWatchingTab,
      TabFilter,
      StatusFilter,
      TextFilter,
    } = yield select((state) => state.driver);
    const limitPagination = yield select((state) => state.config.dataConfig.Pagination);
    const pickupsFilter = setPickupsFilter(rootPickup, anotherPickup);
    const deliveriesFilter = setDeliveryFilter(rootDelivery, anotherDelivery);
    const statusFilterValue = TabFilter === APP_CONSTANT.MY_SHIPMENT ? StatusFilter : '';
    const textFilterValue = TabFilter === APP_CONSTANT.MY_SHIPMENT ? TextFilter : '';
    const query = {
      Page: 1,
      Limit: limitPagination,
      query: TabFilter === APP_CONSTANT.MY_SHIPMENT ? {
        TabFilter,
        StatusFilter: statusFilterValue,
        TextFilter: textFilterValue,
        FromDate: moment().startOf('day').subtract(1, 'year').utc()
          .toISOString(),
        ToDate: moment().endOf('day').utc().toISOString(),
        sortFilter,
        sortFilterOrder,
      } : {
        LocationOptionFilter: modeSearch,
        maxWeight,
        pickupStartDateFilter,
        pickupEndDateFilter,
        sortFilter,
        sortFilterOrder,
        handlingUnitIdFilter,
        locationTypeIdFilter,
        pickupsFilter,
        deliveriesFilter,
        // IsWatchingTab,
        TabFilter,
        StatusFilter: statusFilterValue,
        TextFilter: textFilterValue,
      },
    };
    console.log('query', query);
    const response = yield searchShipment(query);
    console.log('response', response);
    yield put({
      type: DRIVER_ACTION.SET_DATA_FOR_QUERY_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_DATA_FOR_QUERY_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_FOR_QUERY_FAIL, message: error });
    return error;
  }
}

function* handleSetDataForQueryLoadMore() {
  try {
    // Pickup Filter
    const {
      rootPickup,
      anotherPickup,
      rootDelivery,
      anotherDelivery,
      maxWeight,
      pickupStartDateFilter,
      pickupEndDateFilter,
      sortFilter,
      sortFilterOrder,
      sort,
      sortOrder,
      handlingUnitIdFilter,
      locationTypeIdFilter,
      IsWatchingTab,
      page,
      total,
      TabFilter,
      StatusFilter,
      TextFilter,
    } = yield select((state) => state.driver);
    const limitPagination = yield select((state) => state.config.dataConfig.Pagination);
    const pickupsFilter = setPickupsFilter(rootPickup, anotherPickup);
    const deliveriesFilter = setDeliveryFilter(rootDelivery, anotherDelivery);
    const statusFilterValue = TabFilter === APP_CONSTANT.MY_SHIPMENT ? StatusFilter : '';
    const textFilterValue = TabFilter === APP_CONSTANT.MY_SHIPMENT ? TextFilter : '';
    const totalPage = Math.floor(total / 15) + (total % 15 !== 0 ? 1 : 0);
    if (page === totalPage) {
      console.log('Page is reach total page');
      return;
    }
    const query = {
      Page: page < totalPage ? page + 1 : page,
      Limit: limitPagination,
      query: TabFilter === APP_CONSTANT.MY_SHIPMENT ? {
        TabFilter,
        StatusFilter: statusFilterValue,
        TextFilter: textFilterValue,
        FromDate: moment().startOf('day').subtract(1, 'year').utc()
          .toISOString(),
        ToDate: moment().endOf('day').utc().toISOString(),
        sortFilter,
        sortFilterOrder,
      } : {
        maxWeight,
        pickupStartDateFilter,
        pickupEndDateFilter,
        sortFilter,
        sort,
        sortFilterOrder,
        sortOrder,
        handlingUnitIdFilter,
        locationTypeIdFilter,
        pickupsFilter,
        deliveriesFilter,
        IsWatchingTab,
      },
    };
    console.log('query Load more', query);
    const response = yield searchShipment(query);
    console.log('response Load more', response);
    yield put({
      type: DRIVER_ACTION.SET_DATA_FOR_QUERY_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_DATA_FOR_QUERY_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_DATA_FOR_QUERY_FAIL, message: error });
    return error;
  }
}

function* handleSetPin(payload) {
  try {
    const { shipmentId, pinStatus } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const response = yield pinShipment(shipmentId, pinStatus);
    console.log('RESPONE: ', response);
    if (response.isSuccess) {
      yield put({ type: DRIVER_ACTION.SET_PIN_SUCCESS, shipmentId, pinStatus });
    }
  } catch (error) {
    console.log('SET_PIN_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.SET_PIN_FAILED, message: error });
    return error;
  }
}

function* handleGetTopLowestBid(payload) {
  try {
    const { shipmentId, bidPrice } = payload;
    const response = yield getTopLowestBid(shipmentId, bidPrice);
    if (response.isSuccess) {
      yield put({
        type: DRIVER_ACTION.GET_TOP_LOWEST_BID_SUCCESS,
        data: response.data
      });
    }
  } catch (error) {
    console.log('GET_TOP_LOWEST_BID_FAIL: ', error);
    yield put({ type: DRIVER_ACTION.GET_TOP_LOWEST_BID_FAIL, message: error });
    return error;
  }
}

function* handleSetCoorAddress(payload) {
  try {
    const addressDetail = yield getPlaceDetail(payload.data.placeId);
    const coorsAddress = {
      longitude: addressDetail.result.geometry.location.lng,
      latitude: addressDetail.result.geometry.location.lat,
    };
    yield put({
      type: DRIVER_ACTION.SET_COORS_ADDRESS_SUCCESS,
      coors: coorsAddress,
      payload: payload.data,
    });
  } catch (error) {
    console.log('SET_COORS_ADDRESS_FAIL: ', error);
    if (error instanceof ApiError) {
      yield put({
        type: DRIVER_ACTION.SET_COORS_ADDRESS_FAIL,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
    }
  }
}

function* handleGetTotalStatusFilter() {
  try {
    const {token} = yield select(state => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const response = yield getTotalStatusFilter();
    console.log('RESPONE: ', response);
    if (response.isSuccess) {
      yield put({type: DRIVER_ACTION.GET_TOTAL_STATUS_FILTER_SUCCESS, data: response.data});
    }
  } catch (error) {
    console.log('GET_TOTAL_STATUS_FILTER_FAILED: ', error);
    yield put({type: DRIVER_ACTION.GET_TOTAL_STATUS_FILTER_FAILED, message: error});
    return error;
  }
}

const driverSaga = {
  handleSetDataRootPickup,
  handleSetDataAnotherPickup,
  handleRemovePickupAddress,
  handleSetDataRootDelivery,
  handleSetDataAnotherDelivery,
  handleRemoveDeliveryAddress,
  handleSetDataForQuery,
  handleSetFieldForQuery,
  handleSetRadius,
  handleSetDataForQueryLoadMore,
  handleSetPin,
  handleGetTopLowestBid,
  handleSetCoorAddress,
  handleGetTotalStatusFilter,
};

export default driverSaga;
