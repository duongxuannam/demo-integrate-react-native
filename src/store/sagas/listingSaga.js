import {
  put, all, race, select, call
} from 'redux-saga/effects';
import moment from 'moment';
import { LISTING_ACTION, APP_ACTION, COMMUNICATION_ACTION } from '../actionTypes';
import { configQuoteFormat } from '../../model/bookNowModel';
import {
  getHandleUnits,
  getLocationTypes,
  getLocationServices,
  getAdvertDescription,
  getTransportTypes,
  getShipmentDetail,
  getListingItems,
  getAddresses,
  updateShipment,
  requestBookNow,
  createQuote,
  // getConfigQuoteElements,
  getAdditionalServices,
  saveDraftApi,
  // getQuoteApi,
  getDistanceMatrix,
  saveDraftAddressesApi,
  getDeleteReasons,
  deleteAll,
  deleteRelated,
  uploadPhotoShipment,
  deletePhotoShipment,
  editPickupAddress,
  editDestinationAddress,
  uploadAddressPhoto,
  updateListingShipmentItems,
  updateListingShipmentAddress,
  getListShipments,
  acceptQuote,
  rejectQuote,
  getQuoteDetail,
  getReasonsRejectQuote,
  pinShipment,
  cancelBooking,
  bookAgainShipment,
  getReasonsCancelBooking,
} from '../../api/listing';
import HandleUnit from '../../model/handleUnit';
import TransportType from '../../model/transportType';
import LocationType from '../../model/locationType';
import {
  locationTypeFormat,
  locationServiceFormat,
  pickupFormat,
  pickupSuport,
  destinationFormat,
  destinationSuport,
} from '../../model/listingAddress';
import AdditionalService from '../../model/additionalService';
import NavigationService from '../../helpers/NavigationService';
import { getAddress, getDistancematrixService } from '../../services/map.services';
import {
  convertPickupAdrress,
  convertDestinationAddress,
  convertTempAddress,
  SHIPMENT_STATUS,
  secondsToDay,
  meterToKilometres,
  convertTempBooking,
  computeDifferenceAddress,
  updateBasicDestination,
  IsShipmentBooked,
  hmsToSeconds,
  getUnitObj,
} from '../../helpers/shipment.helper';
import { dateClientWithISOString } from '../../helpers/date.helper';
import { LATEST_DAY_PLUS, EARLY_DAY_PLUS, QUERY } from '../../constants/app';
import SYSTEM_POPUP from '../../constants/systemErrorTypes';

function* getHandleUnitSaga() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getHandleUnits(languageCode, countryCode);
    const filterData = response.data.map((d) => HandleUnit(d));
    yield put({
      type: LISTING_ACTION.GET_HANDLE_UNIT_SUCCESS,
      handleUnits: [...filterData],
    });
  } catch (error) {
    console.log('ERROR GET HANDLE UNIT: ', error);
    yield put({
      type: LISTING_ACTION.GET_HANDLE_UNIT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* getTransportTypeSaga() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getTransportTypes(languageCode, countryCode);
    yield put({
      type: LISTING_ACTION.GET_TRANSPORT_TYPES_SUCCESS,
      transportTypes: response.data.map((item) => TransportType(item))
    });
  } catch (error) {
    console.log('ERROR GET TRANSPORT UNIT: ', error);
    yield put({
      type: LISTING_ACTION.GET_TRANSPORT_TYPES_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* getAdditionalServiceSaga() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getAdditionalServices(languageCode, countryCode);
    yield put({
      type: LISTING_ACTION.GET_ADDITIONAL_SERVICES_SUCCESS,
      additionalServices: response.data.map((item) => AdditionalService(item))
    });
  } catch (error) {
    console.log('ERROR GET ADDITIONAL UNIT: ', error);
    yield put({
      type: LISTING_ACTION.GET_ADDITIONAL_SERVICES_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* saveDraftSaga(action) {
  try {
    const {
      isLoggedin, itemInfoListing, isSwitchCountry, callback,
    } = action;
    const countryCode = yield select((state) => state.app.countryCode);
    const { draftId, draftItem, transportTypeId } = yield select((state) => state.listing);
    if (!isLoggedin) {
      // USER NOT LOGGED IN
      yield put({ type: LISTING_ACTION.SET_TEMP_BOOKING, itemInfoListing });
      yield put({ type: APP_ACTION.REQUIRE_LOGIN_PAGE, pageRequiredName: 'BookingStack' });
      NavigationService.navigate('LoginStack');
      return;
    }
    let response = null;
    if (draftId) {
      const bodyItems = [];
      itemInfoListing.forEach((item) => {
        bodyItems.push({
          id: item.id,
          handlingUnitId: item.handlingUnitId || item.handleUnitSelected.id,
          unitQuantity: item.unitQuantity,
          length: item.length,
          width: item.width,
          height: item.height,
          weight: item.weight,
          description: item.description || '',
          additionalServices: item.itemServices || item.additionalServices,
          shipmentId: draftId,
          isDeleted: item.isDelete || item.isDeleted || false,
        });
      });
      // const itemDelete = draftItem.find((item) => item.isDeleted);
      // console.log('itemDelete', itemDelete);
      // if (itemDelete) {
      //   bodyItems.push(itemDelete);
      // }
      // console.log('bodyItems', bodyItems);
      response = yield updateListingShipmentItems(draftId, bodyItems, countryCode, transportTypeId || itemInfoListing[0].transportModeSelected.id, true);
    } else {
      response = yield saveDraftApi(itemInfoListing, countryCode);
    }
    // console.log('response111111111', response);
    if (response) {
      yield put({
        type: LISTING_ACTION.LISTING_SAVE_DRAFT_SUCCESS,
        draftItem: response.items || response.data,
        draftId: draftId || response.id,
      });
      if (isSwitchCountry) {
        yield put({ type: APP_ACTION.CHANGED_COUNTRY });
        callback(true, null);
      }
    }
  } catch (error) {
    console.log('ERROR LISTING_SAVE_DRAFT_FAILED: ', error);
    yield put({
      type: LISTING_ACTION.LISTING_SAVE_DRAFT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* getAddressDataSaga() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const [data] = yield race([
      all([
        getLocationTypes(languageCode, countryCode),
        getLocationServices(languageCode, countryCode),
      ])
    ]);

    yield put({
      type: LISTING_ACTION.GET_ADDRESS_DATA_SUCCESS,
      locationTypes: data[0].data.map((item) => locationTypeFormat(item)),
      locationServices: data[1].data.map((item) => locationServiceFormat(item)),
    });
  } catch (error) {
    console.log('ERROR GET_ADDRESS_DATA_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_ADDRESS_DATA_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* getQuoteSaga(action) {
  try {
    const { itemList } = action;
    const isEditing = yield select((state) => state.listing.isEditing);
    if (isEditing) {
      // Get store
      const {
        shipmentDetail,
        defaultLocationServices,
        defaultLocationTypes,
      } = yield select((state) => state.listing);
      if (shipmentDetail.addresses) {
        const pickupAddress = convertPickupAdrress(shipmentDetail.addresses.pickup);
        const destinationAddress = yield convertDestinationAddress(shipmentDetail.addresses.pickup, shipmentDetail.addresses.destinations);
        destinationAddress.forEach((des) => {
          des.duration = des.duration.routes[0].legs[0].duration.value;
        });
        const tempAddress = convertTempAddress(shipmentDetail.id,
          defaultLocationServices,
          defaultLocationTypes,
          pickupAddress,
          destinationAddress,
          shipmentDetail.addresses.destinations,
          shipmentDetail.addresses.pickup);
        yield put({
          type: LISTING_ACTION.EDITING_STEP2,
          pickupAddress,
          destinationAddress,
          tempAddress,
          pickupDate: dateClientWithISOString(shipmentDetail.addresses.pickup.pickupDate),
        });
      }
    }

    yield put({
      type: LISTING_ACTION.LISTING_ITEMS_GET_QUOTE_SUCCESS,
      itemList,
    });
  } catch (error) {
    console.log('ERROR LISTING_GET_QUOTE_FAILED: ', error);
    yield put({
      type: LISTING_ACTION.LISTING_ITEMS_GET_QUOTE_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetShipmentDetail(data) {
  try {
    const {
      noConfirm, shipmentId, isDraftShipment, countryCode, getSourceChat,
    } = data;
    const response = yield getShipmentDetail(shipmentId, countryCode);
    yield put({
      type: LISTING_ACTION.GET_SHIPMENT_DETAILS_SUCCESS,
      response,
      isDraftShipment
    });

    if (noConfirm) {
      yield put({
        type: LISTING_ACTION.SET_CURRENT_STEP,
        step: 4,
      });
      NavigationService.navigate('ShipmentStack', { noConfirm: true });
    }

    if (isDraftShipment) {
      yield put({
        type: LISTING_ACTION.SET_EDITING,
        isDraftShipment,
      });
    }

    if (getSourceChat) {
      yield put({
        type: COMMUNICATION_ACTION.CREATE_CONNECTION_CHAT,
        shipmentCode: response.data.code,
        shipmentStatus: response.data.status,
      });
    }

  } catch (error) {
    console.log('GET_SHIPMENT_DETAILS_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_SHIPMENT_DETAILS_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetListingItems(data) {
  try {
    const response = yield getListingItems(data.shipmentId);
    yield put({
      type: LISTING_ACTION.GET_LISTING_ITEMS_SUCCESS,
      response,
    });
  } catch (error) {
    console.log('GET_LISTING_ITEMS_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_LISTING_ITEMS_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetSummary(data) {
  try {
    const listingItems = yield select((state) => state.listing.dataStep1);
    const listingAddress = yield select((state) => state.listing.dataStep2);
    const { defaultHandleUnits } = yield select((state) => state.listing);
    let totalWeight = 0;
    const shipmentItemDetail = {
      items: [],
      totalWeight: null,
    };

    // Set totalWeight
    listingItems.forEach((item) => {
      if (!item.isDeleted) {
        totalWeight += item.weight * item.unitQuantity;
      }
    });
    shipmentItemDetail.totalWeight = totalWeight;

    // Set items
    const unitQuantity = {};
    listingItems.forEach((item) => {
      if (!item.isDeleted) {
        if (item.handleUnitSelected) {
          unitQuantity[item.unitQuantity === 1 ? item.handleUnitSelected.name : item.handleUnitSelected.names] = (unitQuantity[item.unitQuantity === 1 ? item.handleUnitSelected.name : item.handleUnitSelected.names] || 0) + item.unitQuantity;
        } else {
          const unitObj = getUnitObj(defaultHandleUnits, item.handlingUnitId);
          console.log('unitObj', unitObj);
          unitQuantity[item.unitQuantity === 1 ? unitObj.name : unitObj.names] = (unitQuantity[item.unitQuantity === 1 ? unitObj.name : unitObj.names] || 0) + item.unitQuantity;
        }
      }
    });
    const items = [];
    Object.keys(unitQuantity).forEach((key) => {
      items.push({
        handlingUnitName: key,
        quantity: unitQuantity[key],
      });
    });
    shipmentItemDetail.items = items;

    yield put({
      type: LISTING_ACTION.GET_SUMMARY_SUCCESS,
      response: {
        shipmentItemDetail,
        shipmentAddress: listingAddress,
      },
    });

    data.callback(true, null);
  } catch (error) {
    console.log('GET_SUMMARY_FAIURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_SUMMARY_FAIURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetAddresses(data) {
  try {
    const response = yield getAddresses(data.shipmentId);
    yield put({
      type: LISTING_ACTION.GET_ADDRESS_SUCCESS,
      response,
    });
  } catch (error) {
    console.log('GET_ADDRESS_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_ADDRESS_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetDistanceMatrix(data) {
  try {
    const { destinations, pickup, addressKey } = data.data;
    const request = [];
    const loopObject = Object.values(destinations);
    const keysObject = Object.keys(destinations);
    // if update destination, just find one destination need to update
    if (addressKey) {
      keysObject.map((value) => {
        if (value === addressKey.toString()) {
          request.push(getDistanceMatrix(pickup, destinations[value]));
        }
        return true;
      });
    } else {
      loopObject.forEach((value) => {
        if (value.address) {
          request.push(getDistanceMatrix(pickup, value));
        }
      });
    }
    const [result] = yield race([
      all(request)
    ]);
    // add result into destinations
    if (addressKey) {
      destinations[addressKey].duration = result[0].routes[0].legs[0].duration.value;
    } else {
      let numSupport = 0;
      keysObject.forEach((value) => {
        if (destinations[value].address) {
          destinations[value].duration = result[numSupport].routes[0].legs[0].duration.value;
          numSupport += 1;
          return true;
        }
      });
    }
    yield put({ type: LISTING_ACTION.GET_DISTANCE_MATRIX_SUCCESS, payload: { pickupAddress: pickup, destinationAddress: destinations } });
  } catch (error) {
    console.log('GET_DISTANCE_MATRIX_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.GET_DISTANCE_MATRIX_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleUpdateShipment() {
  try {
    const countryCode = yield select((state) => state.app.countryCode);
    const { BufferTime } = yield select((state) => state.app.configs);
    const {
      shipmentId,
      dataStep2,
      titleShipment,
      targetPrice,
      unitPrice,
    } = yield select((state) => state.listing);
    const distanceMatrix = yield getDistancematrixService(dataStep2.pickup, dataStep2.destinations);
    const objData = {
      Title: titleShipment,
      Status: SHIPMENT_STATUS.WAITING_APPROVAL,
      CountryCode: countryCode,
      CustomerPrice: targetPrice,
      TotalDistance: null,
      CustomerCurrency: unitPrice,
    };

    // SET TOTAL DISTANCE
    let totalDistance = 0;
    let totalDuration = 0;
    distanceMatrix.rows[0].elements.forEach((item) => {
      totalDistance += item.distance.value;
      totalDuration += item.duration.value;
    });
    objData.TotalDistance = meterToKilometres(totalDistance);
    const totalTransit = totalDuration + hmsToSeconds(BufferTime) * dataStep2.destinations.length;
    objData.TotalDuration = totalTransit;
    const response = yield updateShipment(shipmentId, objData, countryCode);
    if (response && response.id) {
      yield put({
        type: LISTING_ACTION.UPDATE_SHIPMENT_SUCCESS,
        response,
      });
      NavigationService.navigate('ShipmentStack');
    }
  } catch (error) {
    console.log('UPDATE_SHIPMENT_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.UPDATE_SHIPMENT_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetAdvert() {
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getAdvertDescription(countryCode);
    const errorMessage = yield select((state) => state.app.errorMessage);
    if (response.isSuccess) {
      yield put({
        type: LISTING_ACTION.GET_ADVERT_DESCRIPTION_SUCCESS,
        response: response.data[0],
        errorMessage
      });
    }
  } catch (error) {
    console.log('ERROR GET ADVERT DESCRIPTION: ', error);
    yield put({
      type: LISTING_ACTION.GET_ADVERT_DESCRIPTION_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleBookNow(data) {
  try {
    const response = yield requestBookNow(data.quoteId);
    console.log('handleBookNow', response);
    yield put({
      type: LISTING_ACTION.REQUEST_BOOK_NOW_SUCCESS,
      response,
    });
  } catch (error) {
    console.log('REQUEST_BOOK_NOW_FAILURE: ', error);
    yield put({
      type: LISTING_ACTION.REQUEST_BOOK_NOW_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleSaveListingItems(data) {
  try {
    const {
      isEditing,
      titleShipment,
      dataStep2,
      dataStep1,
      draftId,
      draftItem,
      draftAddress,
      transportTypeId,
    } = yield select((state) => state.listing);
    const countryCode = yield select((state) => state.app.countryCode);
    const { BufferTime } = yield select((state) => state.app.configs);

    if (draftId) {
      const bodyItems = [];
      if (draftItem.length) {
        draftItem.forEach((item, index) => {
          if (item.id) {
            bodyItems.push({
              id: item.id,
              length: item.length,
              height: item.height,
              weight: item.weight,
              width: item.width,
              description: item.description,
              additionalServices: item.additionalServices,
              shipmentId: item.shipmentId,
              unitQuantity: item.unitQuantity,
              handlingUnitId: item.handlingUnitId,
              isDeleted: item.isDeleted,
            });
          } else {
            bodyItems.push({
              handlingUnitId: item.handleUnitSelected.id,
              unitQuantity: item.unitQuantity,
              length: item.length,
              width: item.width,
              height: item.height,
              weight: item.weight,
              description: item.description || '',
              additionalServices: item.itemServices,
              shipmentId: draftId,
              isDeleted: false,
            });
          }
        });
      }
      const bodyAddress = {};
      const bodyDestinations = [];
      if (draftAddress.pickup) {
        bodyAddress.pickup = {
          id: draftAddress.pickup.id,
          shipmentId: draftId,
          pickupDate: dataStep2.pickup.pickupDate,
          locationTypeId: dataStep2.pickup.locationTypeId,
          address: dataStep2.pickup.address,
          shortAddress: dataStep2.pickup.shortAddress,
          location: {
            latitude: dataStep2.pickup.latitude,
            longitude: dataStep2.pickup.longitude,
          },
          locationServices: dataStep2.pickup.locationServices,
        };
      } else {
        bodyAddress.pickup = {
          shipmentId: draftId,
          pickupDate: dataStep2.pickup.pickupDate,
          locationTypeId: dataStep2.pickup.locationTypeId,
          address: dataStep2.pickup.address,
          shortAddress: dataStep2.pickup.shortAddress,
          location: {
            latitude: dataStep2.pickup.latitude,
            longitude: dataStep2.pickup.longitude,
          },
          locationServices: dataStep2.pickup.locationServices,
        };
      }

      dataStep2.destinations.forEach((item, index) => {
        if (draftAddress.destinations && draftAddress.destinations[index]) {
          bodyDestinations.push({
            id: draftAddress.destinations[index].id,
            isDeleted: false,
            ShipmentId: draftId,
            DateRangeType: draftAddress.destinations[index].dateRangeType,
            EarliestByDate: draftAddress.destinations[index].earliestByDate,
            LatestByDate: draftAddress.destinations[index].latestByDate,
            EarliestBy: draftAddress.destinations[index].earliestBy,
            LatestBy: draftAddress.destinations[index].latestBy,
            LocationTypeId: draftAddress.destinations[index].locationTypeId,
            Address: draftAddress.destinations[index].address,
            ShortAddress: draftAddress.destinations[index].shortAddress,
            Location: draftAddress.destinations[index].location,
            LocationServices: draftAddress.destinations[index].locationServices
          });
        } else {
          bodyDestinations.push({
            isDeleted: false,
            ShipmentId: draftId,
            DateRangeType: item.dateRangeType,
            EarliestByDate: item.earliestByDate,
            LatestByDate: item.latestByDate,
            EarliestBy: item.earliestBy,
            LatestBy: item.latestBy,
            LocationTypeId: item.locationTypeId,
            Address: item.address,
            ShortAddress: item.shortAddress,
            Location: {
              latitude: item.latitude,
              longitude: item.longitude,
            },
            LocationServices: item.locationServices
          });
        }
      });
      bodyAddress.destinations = bodyDestinations;
      if (bodyItems.length) {
        console.log('bodyItems', bodyItems);
        yield updateListingShipmentItems(draftId, bodyItems, countryCode, transportTypeId || dataStep1[0].transportModeSelected.id);
      }
      console.log('bodyAddress', bodyAddress);
      const resUpdateAddress = yield updateListingShipmentAddress(draftId, bodyAddress, countryCode);

      const distanceMatrix = yield getDistancematrixService(dataStep2.pickup, dataStep2.destinations);
      const objData = {
        Title: titleShipment,
        CustomerPrice: data.targetPrice,
        CountryCode: countryCode,
        TotalDistance: null,
        CustomerCurrency: data.unitPrice,
        Status: SHIPMENT_STATUS.WAITING_APPROVAL
      };
      console.log('objData', objData);
      // SET TOTAL DISTANCE
      let totalDistance = 0;
      let totalDuration = 0;
      distanceMatrix.rows[0].elements.forEach((item) => {
        totalDistance += item.distance.value;
        totalDuration += item.duration.value;
      });
      objData.TotalDistance = meterToKilometres(totalDistance);
      const totalTransit = totalDuration + hmsToSeconds(BufferTime) * dataStep2.destinations.length;
      objData.TotalDuration = totalTransit;
      const response = yield updateShipment(draftId, objData, countryCode);
      console.log('updateShipment response', response);
      if (response && response.id) {
        yield put({
          type: LISTING_ACTION.UPDATE_SHIPMENT_SUCCESS,
          response,
        });
        NavigationService.navigate('ShipmentStack');
      }
      return;
    }

    if (isEditing) {
      const shipmentDetail = yield select((state) => state.listing.shipmentDetail);
      const bodyItems = [];
      const dataStep1Editing = yield select((state) => state.listing.dataStep1Editing);
      dataStep1Editing.forEach((item) => {
        if (typeof item.id === 'string') {
          bodyItems.push({
            id: item.id,
            handlingUnitId: item.handleUnitSelected.id,
            unitQuantity: item.unitQuantity,
            length: item.length,
            width: item.width,
            height: item.height,
            weight: item.weight,
            description: item.goodDesc || '',
            additionalServices: item.itemServices.map((res) => res.id),
            shipmentId: item.shipmentId || shipmentDetail.id,
            isDeleted: item.isDelete,
          });
        } else {
          bodyItems.push({
            handlingUnitId: item.handleUnitSelected.id,
            unitQuantity: item.unitQuantity,
            length: item.length,
            width: item.width,
            height: item.height,
            weight: item.weight,
            description: item.goodDesc || '',
            additionalServices: item.itemServices.map((res) => res.id),
            shipmentId: item.shipmentId || shipmentDetail.id,
            isDeleted: item.isDelete,
          });
        }
      });
      const dataStep2Editing = yield select((state) => state.listing.dataStep2Editing);
      const bodyAddress = {};
      bodyAddress.pickup = {
        id: dataStep2Editing.pickup.id,
        pickupDate: dataStep2Editing.pickup.pickupDate,
        locationTypeId: dataStep2Editing.pickup.locationTypeId,
        address: dataStep2Editing.pickup.address,
        note: dataStep2Editing.pickup.note || null,
        locationServices: dataStep2Editing.pickup.locationServices,
        location: {
          latitude: dataStep2Editing.pickup.latitude,
          longitude: dataStep2Editing.pickup.longitude,
        },
        shortAddress: dataStep2Editing.pickup.shortAddress,
      };

      const bodyAddressDestination = [];
      dataStep2Editing.destinations.forEach((des) => {
        if (!des.shipmentId) {
          delete des.id;
          des.shipmentId = shipmentDetail.id;
          bodyAddressDestination.push({
            dateRangeType: des.dateRangeType,
            dateRangeTypeValue: des.dateRangeType === 0 ? 'Days' : 'DateRange',
            earliestByDate: des.earliestByDate,
            latestByDate: des.latestByDate,
            earliestBy: des.earliestBy,
            latestBy: des.latestBy,
            locationTypeId: typeof des.locationTypeId === 'object' ? des.locationTypeId.id : des.locationTypeId,
            address: des.address,
            note: des.note || null,
            shipmentId: des.shipmentId,
            locationServices: Array.isArray(des.locationServices) ? des.locationServices : Object.keys(des.locationServices),
            location: {
              latitude: des.latitude,
              longitude: des.longitude,
            },
            shortAddress: des.shortAddress,
            isDeleted: false,
          });
        } else {
          bodyAddressDestination.push({
            id: des.id,
            dateRangeType: des.dateRangeType,
            dateRangeTypeValue: des.dateRangeType === 0 ? 'Days' : 'DateRange',
            earliestByDate: des.earliestByDate,
            latestByDate: des.latestByDate,
            earliestBy: des.earliestBy,
            latestBy: des.latestBy,
            locationTypeId: typeof des.locationTypeId === 'object' ? des.locationTypeId.id : des.locationTypeId,
            address: des.address,
            note: des.note || null,
            locationServices: Array.isArray(des.locationServices) ? des.locationServices : Object.keys(des.locationServices),
            location: {
              latitude: des.latitude,
              longitude: des.longitude,
            },
            shortAddress: des.shortAddress,
            isDeleted: des.isDeleted,
          });
        }
      });
      bodyAddress.destinations = bodyAddressDestination;
      // UPDATE ITEM AND ADDRESS
      const resUpdateItem = yield updateListingShipmentItems(shipmentDetail.id, bodyItems, countryCode, dataStep1Editing[0].transportModeSelected.id);
      const resUpdateAddress = yield updateListingShipmentAddress(shipmentDetail.id, bodyAddress, countryCode);
      const { isDraftShipment } = yield select((state) => state.listing);
      const distanceMatrix = yield getDistancematrixService(dataStep2Editing.pickup, dataStep2Editing.destinations);
      const objData = {
        Title: titleShipment,
        CustomerPrice: data.targetPrice,
        CountryCode: countryCode,
        TotalDistance: null,
        CustomerCurrency: data.unitPrice,
      };
      if (isDraftShipment) {
        objData.Status = SHIPMENT_STATUS.WAITING_APPROVAL;
      }
      console.log('objData', objData);
      // SET TOTAL DISTANCE
      let totalDistance = 0;
      let totalDuration = 0;
      distanceMatrix.rows[0].elements.forEach((item) => {
        totalDistance += item.distance.value;
        totalDuration += item.duration.value;
      });
      objData.TotalDistance = meterToKilometres(totalDistance);
      const totalTransit = totalDuration + hmsToSeconds(BufferTime) * dataStep2Editing.destinations.length;
      objData.TotalDuration = totalTransit;
      const response = yield updateShipment(shipmentDetail.id, objData, countryCode);
      if (response && response.id) {
        yield put({
          type: LISTING_ACTION.UPDATE_SHIPMENT_SUCCESS,
          response,
        });
        NavigationService.navigate('ShipmentStack');
      }
      return;
    }
    const response = yield saveDraftApi(data.listingItems, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.SAVE_LISTING_ITEMS_SUCCESS,
        shipmentItems: response,
        targetPrice: data.targetPrice,
        unitPrice: data.unitPrice,
      });
    }
  } catch (error) {
    console.log('ERROR handleSaveListingItems: ', error);
    yield put({
      type: LISTING_ACTION.SAVE_LISTING_ITEMS_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleSaveListingAddress(data) {
  try {
    const shipmentId = yield select((state) => state.listing.shipmentId);
    const addresses = yield select((state) => state.listing.dataStep2);
    const countryCode = yield select((state) => state.app.countryCode);
    const response = yield saveDraftAddressesApi(shipmentId, addresses, countryCode);
    if (response) {
      yield put({ type: LISTING_ACTION.SAVE_LISTING_ADDRESS_SUCCESS, listingItems: response });
    }
  } catch (error) {
    console.log('ERROR handleSaveListingAddress: ', error);
    yield put({
      type: LISTING_ACTION.SAVE_LISTING_ADDRESS_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleGetHandleUnitDefault() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getHandleUnits(languageCode, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.GET_HANDLE_UNIT_DEFAULT_SUCCESS,
        handleUnits: response.data.map((item) => HandleUnit(item))
      });
    }
  } catch (error) {
    console.log('GET_HANDLE_UNIT_DEFAULT_FAILED: ', error);
    yield put({
      type: LISTING_ACTION.GET_HANDLE_UNIT_DEFAULT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleGetLocationTypesDefault() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getLocationTypes(languageCode, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.GET_LOCATION_TYPES_DEFAULT_SUCCESS,
        locationTypes: response.data.map((item) => LocationType(item))
      });
    }
  } catch (error) {
    console.log('GET_LOCATION_TYPES_DEFAULT_FAILED: ', error);
    yield put({
      type: LISTING_ACTION.GET_LOCATION_TYPES_DEFAULT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleGetAdditionalServicesDefault() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getAdditionalServices(languageCode, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.GET_ADDITIONAL_SERVICES_DEFAULT_SUCCESS,
        defaultAdditionalServices: response.data.map((item) => AdditionalService(item))
      });
    }
  } catch (error) {
    console.log('GET_ADDITIONAL_SERVICES_DEFAULT_FAILED ', error);
    yield put({
      type: LISTING_ACTION.GET_ADDITIONAL_SERVICES_DEFAULT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleGetLocationServicesDefault() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getLocationServices(languageCode, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.GET_LOCATION_SERVICES_DEFAULT_SUCCESS,
        locationServices: response.data,
      });
    }
  } catch (error) {
    console.log('GET_LOCATION_SERVICES_DEFAULT_FAILED ', error);
    yield put({
      type: LISTING_ACTION.GET_LOCATION_SERVICES_DEFAULT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleGetTransportTypesDefault() {
  try {
    const { countryCode, languageCode } = yield select((state) => state.app);
    const response = yield getTransportTypes(languageCode, countryCode);
    if (response) {
      yield put({
        type: LISTING_ACTION.GET_TRANSPORT_TYPES_DEFAULT_SUCCESS,
        transportTypes: response.data,
      });
    }
  } catch (error) {
    console.log('GET_TRANSPORT_TYPES_DEFAULT_FAILED ', error);
    yield put({
      type: LISTING_ACTION.GET_TRANSPORT_TYPES_DEFAULT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleSend(action) {
  try {
    yield put({
      type: LISTING_ACTION.HANDLE_SEND_SUCCESS,
    });
    // NavigationService.navigate('BookingStack', { isRefresh: !action.isRefresh });
  } catch (error) {
    console.log('HANDLE_SEND_FAILED ', error);
  }
}

function* handleSaveAddressAsDraft(data) {
  try {
    // if exists infodata
    const { isSwitchCountry, callback, infoData } = data;
    const {
      shipmentId,
      draftId,
      draftAddress,
      dataStep1,
      draftItem,
      transportTypeId,
    } = yield select((state) => state.listing);
    const countryCode = yield select((state) => state.app.countryCode);
    let shipmentID = data.addressData.pickup.shipmentId;
    if (infoData && !draftId) {
      const response = yield saveDraftApi(data.infoData, countryCode);
      if (!response) {
        yield put({
          type: LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT_FAILED,
          error: {
            type: SYSTEM_POPUP.GENERAL,
            error: error.message,
          }
        });
        if (isSwitchCountry) {
          yield put({ type: APP_ACTION.CHANGED_COUNTRY });
          callback(true);
        }
        return;
      }
      shipmentID = response.id;
    } else {
      shipmentID = draftId;
    }
    console.log('shipmentID', shipmentID);
    // format data
    let pickup = pickupSuport(data.addressData.pickup);
    pickup.shipmentId = shipmentID;
    pickup = pickupFormat(pickup);
    const newDestinations = [];
    data.addressData.destinations.map((item) => {
      const newItem = destinationSuport(item);
      newItem.ShipmentId = shipmentID;
      newDestinations.push(destinationFormat(newItem));
      return true;
    });
    const newAddresses = { pickup, destinations: newDestinations };
    let responseDraftAddress = '';
    // end format data
    if (draftId && draftAddress.pickup) {
      console.log('draftAddress', draftAddress);
      // update address
      const bodyAddress = {};
      bodyAddress.pickup = {
        ...pickup,
        id: draftAddress.pickup.id,
        location: draftAddress.pickup.location,
      };
      const bodyAddressDestination = [];
      data.addressData.destinations.forEach((des, index) => {
        if (typeof des.id === 'string') {
          bodyAddressDestination.push({
            id: des.id,
            dateRangeType: des.dateRangeType,
            dateRangeTypeValue: des.dateRangeType === 0 ? 'Days' : 'DateRange',
            earliestByDate: des.earliestByDate,
            latestByDate: des.latestByDate,
            earliestBy: des.earliestBy,
            latestBy: des.latestBy,
            locationTypeId: typeof des.locationTypeId === 'object' ? des.locationTypeId.id : des.locationTypeId,
            address: des.address,
            note: des.note || null,
            locationServices: Array.isArray(des.locationServices) ? des.locationServices : Object.keys(des.locationServices),
            location: {
              latitude: des.latitude,
              longitude: des.longitude,
            },
            shortAddress: des.shortAddress,
            isDeleted: false,
            shipmentId: draftId,
          });
        } else {
          bodyAddressDestination.push({
            dateRangeType: des.dateRangeType,
            dateRangeTypeValue: des.dateRangeType === 0 ? 'Days' : 'DateRange',
            earliestByDate: des.earliestByDate,
            latestByDate: des.latestByDate,
            earliestBy: des.earliestBy,
            latestBy: des.latestBy,
            locationTypeId: typeof des.locationTypeId === 'object' ? des.locationTypeId.id : des.locationTypeId,
            address: des.address,
            note: des.note || null,
            shipmentId: draftId,
            locationServices: Array.isArray(des.locationServices) ? des.locationServices : Object.keys(des.locationServices),
            location: {
              latitude: des.latitude,
              longitude: des.longitude,
            },
            shortAddress: des.shortAddress,
            isDeleted: false,
          });
        }
      });
      let addressDeleted = [];
      if (draftAddress && draftAddress.destinations) {
        addressDeleted = draftAddress.destinations.filter((add) => add.isDeleted);
      }
      bodyAddressDestination.push(...addressDeleted);
      bodyAddress.destinations = bodyAddressDestination;
      console.log('bodyAddress', bodyAddress);
      responseDraftAddress = yield updateListingShipmentAddress(draftId, bodyAddress, countryCode, true);
    } else {
      responseDraftAddress = yield saveDraftAddressesApi(shipmentID, newAddresses, countryCode);
    }
    console.log('responseDraftAddress', responseDraftAddress);
    if (!responseDraftAddress) {
      yield put({
        type: LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT_FAILED,
        error: {
          type: SYSTEM_POPUP.GENERAL,
          error: error.message,
        }
      });
      if (isSwitchCountry) {
        yield put({ type: APP_ACTION.CHANGED_COUNTRY });
        callback(true);
      }
      return;
    }

    if (draftId && draftAddress.pickup) {
      pickup.id = responseDraftAddress.data.pickup.id;
      responseDraftAddress.data.destinations.map((item, key) => {
        newDestinations[key].id = item.id;
        return true;
      });
    } else {
      pickup.id = responseDraftAddress.pickup.id;
      responseDraftAddress.destinations.map((item, key) => {
        newDestinations[key].id = item.id;
        return true;
      });
    }

    const bodyItems = [];
    if (draftId && draftItem.length) {
      draftItem.forEach((item) => {
        if (item.id) {
          bodyItems.push({
            id: item.id,
            length: item.length,
            height: item.height,
            weight: item.weight,
            width: item.width,
            description: item.description,
            additionalServices: item.additionalServices || item.itemServices,
            shipmentId: item.shipmentId,
            unitQuantity: item.unitQuantity,
            handlingUnitId: item.handlingUnitId || item.handleUnitSelected.id,
            isDeleted: item.isDeleted,
          });
        } else {
          bodyItems.push({
            handlingUnitId: item.handleUnitSelected.id,
            unitQuantity: item.unitQuantity,
            length: item.length,
            width: item.width,
            height: item.height,
            weight: item.weight,
            description: item.description || '',
            additionalServices: item.itemServices,
            shipmentId: draftId,
            isDeleted: false,
          });
        }
      });
    }

    if (bodyItems.length) {
      console.log('bodyItems', bodyItems);
      yield updateListingShipmentItems(draftId, bodyItems, countryCode, transportTypeId || draftItem[0].handlingUnitId || draftItem[0].transportModeSelected.id);
    }

    yield put({
      type: LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT_SUCCESS,
      payload: {
        dataStep2: { pickup, destinations: newDestinations },
        shipmentId: shipmentID,
        draftId: shipmentID,
        draftAddress: draftId && draftAddress.pickup ? responseDraftAddress.data : responseDraftAddress,
        draftItem: [],
      },
    });

    if (isSwitchCountry) {
      yield put({ type: APP_ACTION.CHANGED_COUNTRY });
      callback(true);
    }
  } catch (error) {
    const { callback, isSwitchCountry } = data;
    console.log('SAVE_ADDRESS_AS_DRAFT_FAILED ', error);
    yield put({
      type: LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    if (isSwitchCountry) {
      yield put({ type: APP_ACTION.CHANGED_COUNTRY });
      callback(true);
    }
  }
}

function* handleSaveAddressQuote(data) {
  // format data
  let pickup = pickupSuport(data.addressData.pickup);
  pickup = pickupFormat(pickup);
  const newDestinations = [];
  data.addressData.destinations.map((item) => {
    const newItem = destinationSuport(item);
    newDestinations.push(destinationFormat(newItem));
    return true;
  });

  try {
    // const newAddresses = { pickup, destinations: newDestinations };
    const dataStep1 = yield select((state) => state.listing.dataStep1);
    const countryCode = yield select((state) => state.app.countryCode);
    const isEditing = yield select((state) => state.listing.isEditing);
    const services = yield select((state) => state.listing.defaultAdditionalServices);

    const items = dataStep1.map((item) => {
      let isStackable = true;
      item.itemServices.forEach((s) => {
        const array = services.filter((value) => value.id === s.id);
        if (array.length > 0 && array[0].name === 'Not Stackable') {
          isStackable = false;
        }
      });
      return ({
        weight: item.weight,
        quantity: item.unitQuantity,
        stackable: isStackable,
        dimensions: [item.length, item.weight, item.height]
      });
    });
    let locs = yield select((state) => state.listing.destinationAddress);
    locs = Object.values(locs);
    const locations = [];
    locs.map((item) => {
      locations.push({
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address
      });
      return true;
    });

    let quoteId = '';
    const configQuote = yield select((state) => state.listing.configQuote);
    if (configQuote) {
      quoteId = configQuote.quote.id;
    }
    const response = yield createQuote({
      quoteId, pickup, locations, items
    }, countryCode);
    console.log('configQuoteconfigQuote', response);
    if (isEditing) {
      yield put({
        type: LISTING_ACTION.EDITING_REPLACE_ADDRESS_DATA,
        dataStep2: { pickup, destinations: newDestinations },
      });
    }
    if (response) {
      yield put({
        type: LISTING_ACTION.SAVE_ADDRESS_QUOTE_SUCCESS,
        payload: {
          dataStep2: { pickup, destinations: newDestinations },
          currentStep: 3,
          pickupAddress: {},
          destinationAddress: {},
          configQuote: response,
          pickupDate: null,
        }
      });
    } else {
      yield put({
        type: LISTING_ACTION.SAVE_ADDRESS_QUOTE_FAILED,
        error: 'error.get_quote_fail',
        payload: {
          dataStep2: { pickup, destinations: newDestinations },
          currentStep: 3,
          pickupAddress: {},
          destinationAddress: {},
          configQuote: configQuoteFormat({}),
          pickupDate: null,
        }
      });
      return;
    }
  } catch (error) {
    console.log('ERROR DATA: ', error);
    const isEditing = yield select((state) => state.listing.isEditing);
    if (isEditing) {
      yield put({
        type: LISTING_ACTION.EDITING_REPLACE_ADDRESS_DATA,
        dataStep2: { pickup, destinations: newDestinations },
      });
    }
    yield put({
      type: LISTING_ACTION.SAVE_ADDRESS_QUOTE_FAILED,
      error: 'error.get_quote_fail',
      payload: {
        dataStep2: { pickup, destinations: newDestinations },
        currentStep: 3,
        pickupAddress: {},
        destinationAddress: {},
        pickupDate: null,
        configQuote: configQuoteFormat({})
      }
    });
  }
}

function* handleUpdateCountry(data) {
  const newCountryCode = data.payload.countryCode;
  const currentCountryCode = yield select((state) => state.app.countryCode);
  const currentStep = yield select((state) => state.listing.currentStep);
  const token = yield select((state) => state.auth.token);
  yield put({
    type: APP_ACTION.CHANGE_COUNTRY_SUCCESS,
    payload: data.payload,
  });
  if (currentCountryCode !== newCountryCode) {
    yield put({
      type: APP_ACTION.CHANGED_COUNTRY
    });
    NavigationService.navigate('BookingStack');
  }
}

function* handleSetEditing(payload) {
  const {
    shipmentDetail,
    defaultHandleUnits,
    transportTypesDefault,
    defaultAdditionalServices,
  } = yield select((state) => state.listing);
  const { isDraftShipment } = payload;
  const tempBooking = convertTempBooking(shipmentDetail, defaultHandleUnits, transportTypesDefault, defaultAdditionalServices);
  yield put({
    type: LISTING_ACTION.SET_EDITING_SUCCESS,
    tempBooking,
    isDraftShipment,
  });
  if (isDraftShipment) {
    NavigationService.navigate('BookingStack', { isDraftShipment: true });
  } else {
    NavigationService.navigate('BookingStack', { isRefresh: true });
  }
}

function handleSaveStateAddress() {
  NavigationService.navigate('LoginStack');
}

function* handleUnListShipment(data) {
  try {
    const { id } = yield select((state) => state.listing.shipmentDetail);
    const countryCode = yield select((state) => state.app.countryCode);
    const response = yield updateShipment(id, { Status: SHIPMENT_STATUS.UNLISTED }, countryCode);
    if (response && response.id) {
      yield put({
        type: LISTING_ACTION.UN_LIST_SUCCESS,
        response,
      });
      data.callback(true);
    }
  } catch (error) {
    console.log('UN_LIST_FAILED');
    yield put({
      type: LISTING_ACTION.UN_LIST_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetDeleteReasons() {
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getDeleteReasons(countryCode);
    console.log('handleGetDeleteReasons response: ', response)
    if (response && response.data) {
      yield put({
        type: LISTING_ACTION.GET_DELETE_REASON_SUCCESS,
        response: response.data,
      });
    }
  } catch (error) {
    console.log('GET_DELETE_REASON_FAIL');
    yield put({
      type: LISTING_ACTION.GET_DELETE_REASON_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleDeleteAll(data) {
  try {
    const { shipmentId, reasons, callback } = data;
    const { countryCode } = yield select((state) => state.app);
    const { tabFilter, fromDate, toDate, textFilter } = yield select((state) => state.listing);
    const response = yield deleteAll(shipmentId, reasons, countryCode);
    if (response && response.isSuccess) {
      yield put({
        type: LISTING_ACTION.DELETE_ALL_SUCCESS,
      });
      callback(true, null);
    }
  } catch (error) {
    console.log('DELETE_ALL_FAILED');
    const { callback } = data;
    yield put({
      type: LISTING_ACTION.DELETE_ALL_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, error.data.message);
  }
}

function* handleDeleteRelated(data) {
  try {
    const { shipmentId, reasons, callback } = data;
    const { countryCode } = yield select((state) => state.app);
    const { tabFilter, fromDate, toDate, textFilter } = yield select((state) => state.listing);
    const query = {
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter
      },
      Limit: 10,
      Page: 1
    };
    const response = yield deleteRelated(shipmentId, reasons, countryCode);
    if (response && response.isSuccess) {
      yield put({
        type: LISTING_ACTION.DELETE_RELATED_SUCCESS,
      });
      callback(true, null);
    }
  } catch (error) {
    console.log('DELETE_RELATED_FAILED');
    const { callback } = data;
    yield put({
      type: LISTING_ACTION.DELETE_RELATED_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, error.data.message);
  }
}

function* handleUpdateBasicShipment(data) {
  try {
    const { shipmentId, fieldsUpdate, callback } = data;
    const countryCode = yield select((state) => state.app.countryCode);
    console.log('fieldsUpdate', fieldsUpdate);
    const response = yield updateShipment(shipmentId, fieldsUpdate, countryCode);
    if (response && response.id) {
      yield put({
        type: LISTING_ACTION.UPDATE_BASIC_SHIPMENT_SUCCESS,
        fieldsUpdate,
      });
      callback(true, null);
    }
  } catch (error) {
    console.log('UPDATE_BASIC_SHIPMENT_FAILURE');
    const { callback } = data;
    yield put({
      type: LISTING_ACTION.UPDATE_BASIC_SHIPMENT_FAILURE,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, error.data.message);
  }
}

function* handleUploadPhotoShipment(data) {
  try {
    const token = yield select((state) => state.auth.token);
    const { shipmentId, files } = data;
    const response = yield uploadPhotoShipment(token, shipmentId, files);
    if (response && response.data.isSuccess) {
      yield put({
        type: LISTING_ACTION.UPLOAD_PHOTO_SHIPMENT_SUCCESS,
        photos: response.data.data,
      });
    }
  } catch (error) {
    console.log('UPLOAD_PHOTO_SHIPMENT_FAIL', error);
    yield put({
      type: LISTING_ACTION.UPLOAD_PHOTO_SHIPMENT_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleDeletePhotoShipment(data) {
  try {
    const { photoId } = data;
    const { token } = yield select((state) => state.auth);
    const { countryCode } = yield select((state) => state.app);
    const response = yield deletePhotoShipment(token, photoId, countryCode);
    if (response && response.data.isSuccess) {
      yield put({
        type: LISTING_ACTION.DELETE_PHOTO_SHIPMENT_SUCCESS,
        photoId,
      });
    }
  } catch (error) {
    console.log('DELETE_PHOTO_SHIPMENT_FAIL', error);
    yield put({
      type: LISTING_ACTION.DELETE_PHOTO_SHIPMENT_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleSetDataAddressUpdating(data) {
  try {
    const { payload, callback, index } = data;
    yield put({
      type: LISTING_ACTION.SET_DATA_ADDRESS_UPDATING_SUCCESS,
      payload,
      index,
    });
    if (callback) {
      callback(true);
    }
  } catch (error) {
    console.log('SET_DATA_ADDRESS_UPDATING_ERROR', error);
  }
}

const setBody = async (id, photo, token, countryCode) => {
  const formData = new FormData();
  const photoName = photo.name || photo.fileName;
  const imgSplit = photoName.split('.');
  formData.append('files', {
    uri: photo.uri,
    type: photo.type || photo.contentType || `image/${imgSplit[imgSplit.length - 1]}`,
    name: photoName,
  });
  const res = await uploadAddressPhoto(token, id, formData, countryCode);
  return res;
};
const uploadImage = async (id, photos, token, countryCode) => {
  const requests = photos.map((photo) => setBody(id, photo, token, countryCode));
  const results = await Promise.all(requests);
  return results;
};

const updateDestinationAddress = async (pickupDate, diff, destination, countryCode) => {
  let response = {};
  const duration = diff.routes[0].legs[0].duration.value;
  const diffDay = secondsToDay(duration);
  const desEarliestByDate = moment(destination.earliestByDate).utc().toISOString();
  const minDesDate = moment(pickupDate).add(diffDay, 'd').utc().toISOString();
  if (desEarliestByDate < minDesDate) {
    const res = await editDestinationAddress(destination.id, {
      dateRangeType: 1,
      earliestByDate: minDesDate,
      latestByDate: moment(minDesDate).add(2, 'd'),
      earliestBy: diffDay,
      latestBy: diffDay + 2,
      location: {
        latitude: destination.location.latitude,
        longitude: destination.location.longitude,
      }
    }, countryCode);
    if (res.id) {
      response = res;
    }
  }
  return response;
};

const callApiUpdateDestination = async (pickupdate, diff, dess, countryCode) => {
  const requests = dess.map((des) => updateDestinationAddress(pickupdate, diff, des, countryCode));
  const results = await Promise.all(requests);
  return results;
};

const requestUpdateDestination = async (pickupDate, diffs, dess, countryCode) => {
  const requests = diffs.map((diff) => callApiUpdateDestination(pickupDate, diff, dess, countryCode));
  const results = await Promise.all(requests);
  return results[0];
};

const callApiDeletePhoto = async (token, id, countryCode) => {
  const res = await deletePhotoShipment(token, id, countryCode);
  return { res, id };
};

const requestRemoveShipmentPhoto = async (token, imageRemoveSelected, countryCode) => {
  const requests = imageRemoveSelected.map((img) => {
    if (img.imageUrl) {
      return callApiDeletePhoto(token, img.fileName, countryCode);
    }
  });
  const result = await Promise.all(requests);
  return result;
};

function* handleEditPickupAddress(payload) {
  try {
    const shipmentDetail = yield select((state) => state.listing.shipmentDetail);
    const { countryCode } = yield select((state) => state.app);
    const titleDetail = shipmentDetail.title;
    const {
      id, body, lat, long
    } = payload;
    console.log('body', body);
    const response = yield editPickupAddress(id, body, countryCode);
    if (response && response.id) {
      const getPickupSateFromDetail = titleDetail.split('to')[0].split('from')[1];
      const newTitle = titleDetail.replace(getPickupSateFromDetail, ` ${body.ShortAddress} `);
      yield updateShipment(shipmentDetail.id, {
        Title: newTitle,
      }, countryCode);
      const newShipmentDetail = yield getShipmentDetail(shipmentDetail.id, countryCode);
      yield put({
        type: LISTING_ACTION.EDIT_PICKUP_ADDRESS_SUCCESS,
        response,
        newData: payload,
        newShipmentDetail: newShipmentDetail.data,
      });
    }
  } catch (error) {
    console.log('EDIT_PICKUP_ADDRESS_ERROR', error);
    yield put({
      type: LISTING_ACTION.EDIT_PICKUP_ADDRESS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleAfterEditPickupAddress(payload) {
  try {
    const token = yield select((state) => state.auth.token);
    const { BufferTime } = yield select((state) => state.app.configs);
    const countryCode = yield select((state) => state.app.countryCode);
    const {
      imageUploadSelected,
      shipmentDetail,
      updatingAddressData,
      imageRemoveSelected,
    } = yield select((state) => state.listing);
    // REMOVE PHOTO
    if (imageRemoveSelected.length) {
      yield requestRemoveShipmentPhoto(token, imageRemoveSelected, countryCode);
    }
    // UPLOAD PHOTO
    if (imageUploadSelected.length) {
      yield uploadImage(payload.newData.id, imageUploadSelected, token, countryCode);
    }

    const pickupDate = payload.newData.body.PickupDate;
    // UPDATE DESTINATIONS DATE
    if (moment(dateClientWithISOString(pickupDate)) > moment(dateClientWithISOString(updatingAddressData.pickupDate)).add(15, 'minute')) {
      yield updateBasicDestination(shipmentDetail.addresses.destinations, pickupDate);
    }
    // UPDATE DESTINATIONS DISTANCE
    const pickupLat = shipmentDetail.addresses.pickup.location.latitude;
    const pickupLong = shipmentDetail.addresses.pickup.location.longitude;
    const { destinations } = shipmentDetail.addresses;
    if (updatingAddressData.address !== updatingAddressData.prevAddress) {
      const differences = yield computeDifferenceAddress({
        latitude: pickupLat,
        longitude: pickupLong,
      }, destinations);
      yield requestUpdateDestination(shipmentDetail.addresses.pickup.pickupDate, differences, destinations, countryCode);
      // SET TOTAL DISTANCE
      const distanceMatrix = yield getDistancematrixService({ latitude: pickupLat, longitude: pickupLong }, destinations);
      let totalDistance = 0;
      let totalDuration = 0;
      distanceMatrix.rows[0].elements.forEach((item) => {
        totalDistance += item.distance.value;
        totalDuration += item.duration.value;
      });
      const distanceKm = meterToKilometres(totalDistance);
      const totalTransit = totalDuration + hmsToSeconds(BufferTime) * shipmentDetail.addresses.destinations.length;
      yield updateShipment(shipmentDetail.id, {
        TotalDistance: distanceKm,
        TotalDuration: totalTransit,
      }, countryCode);
    }
    const afterUpdateToTalDistance = yield getShipmentDetail(shipmentDetail.id, countryCode);
    yield put({
      type: LISTING_ACTION.HANDLE_AFTER_EDIT_PICKUP_ADDRESS_SUCCESS,
      newShipmentDetail: afterUpdateToTalDistance.data,
    });
  } catch (error) {
    console.log('handleAfterEditPickupAddress', error);
    yield put({
      type: LISTING_ACTION.HANDLE_AFTER_EDIT_PICKUP_ADDRESS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleEditDestinationAddress(payload) {
  try {
    const shipmentDetail = yield select((state) => state.listing.shipmentDetail);
    const countryCode = yield select((state) => state.app.countryCode);
    const { destinations } = shipmentDetail.addresses;
    const titleDetail = shipmentDetail.title;
    const {
      id, body, lat, long
    } = payload;
    // UPDATE DESTINATION DATE BASE ON DIFF WITH PICKUP ADDRESS
    const pickupLat = shipmentDetail.addresses.pickup.location.latitude;
    const pickupLong = shipmentDetail.addresses.pickup.location.longitude;
    const differences = yield computeDifferenceAddress({
      latitude: pickupLat,
      longitude: pickupLong,
    }, destinations);
    const duration = differences[0].routes[0].legs[0].duration.value;
    const diffDay = secondsToDay(duration);

    if (moment(body.earliestByDate).diff(moment(shipmentDetail.addresses.pickup.pickupDate), 'd') < diffDay) {
      body.earliestByDate = moment(shipmentDetail.addresses.pickup.pickupDate).add(diffDay, 'd');
      body.earliestBy = diffDay;
      body.latestBy = diffDay + LATEST_DAY_PLUS;
    }

    const response = yield editDestinationAddress(id, body, countryCode);
    if (response && response.id) {
      const isLastDestination = destinations.map((des) => des.id === id && (des === destinations[destinations.length - 1])).indexOf(true) > -1;
      let newTitle = '';
      // UPDATE TITLE IF LAST DESTINATION
      if (isLastDestination) {
        const getDesSateFromDetail = titleDetail.split('to')[1].split('for')[0];
        newTitle = titleDetail.replace(`to ${getDesSateFromDetail.trim()}`, `to ${body.ShortAddress}`);
        yield updateShipment(shipmentDetail.id, {
          Title: newTitle,
        }, countryCode);
      }
      const newShipmentDetail = yield getShipmentDetail(shipmentDetail.id, countryCode);
      yield put({
        type: LISTING_ACTION.UPDATE_DESTINATION_SHIPMENT_DETAIL,
        response,
        newData: payload,
        newShipmentDetail: newShipmentDetail.data,
      });
    }
  } catch (error) {
    console.log('UPDATE_DESTINATION_SHIPMENT_DETAIL_FAIL', error);
    yield put({
      type: LISTING_ACTION.UPDATE_DESTINATION_SHIPMENT_DETAIL_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      },
    });
  }
}

function* handleAfterEditDestinationAddress(payload) {
  try {
    const token = yield select((state) => state.auth.token);
    const { BufferTime } = yield select((state) => state.app.configs);
    const countryCode = yield select((state) => state.app.countryCode);
    const {
      imageUploadSelected,
      shipmentDetail,
      updatingAddressData,
      imageRemoveSelected,
    } = yield select((state) => state.listing);
    // REMOVE PHOTO
    if (imageRemoveSelected.length) {
      yield requestRemoveShipmentPhoto(token, imageRemoveSelected, countryCode);
    }
    // UPLOAD PHOTO
    if (imageUploadSelected.length) {
      yield uploadImage(payload.newData.id, imageUploadSelected, token, countryCode);
    }
    // SET TOTAL DISTANCE
    const pickupLat = shipmentDetail.addresses.pickup.location.latitude;
    const pickupLong = shipmentDetail.addresses.pickup.location.longitude;
    const { destinations } = shipmentDetail.addresses;
    if (updatingAddressData.address !== updatingAddressData.prevAddress) {
      const distanceMatrix = yield getDistancematrixService({
        latitude: pickupLat,
        longitude: pickupLong,
      }, destinations);
      let totalDistance = 0;
      let totalDuration = 0;
      distanceMatrix.rows[0].elements.forEach((item) => {
        totalDistance += item.distance.value;
        totalDuration += item.duration.value;
      });
      const distanceKm = meterToKilometres(totalDistance);
      const totalTransit = totalDuration + hmsToSeconds(BufferTime) * destinations.length;
      yield updateShipment(shipmentDetail.id, {
        TotalDistance: distanceKm,
        TotalDuration: totalTransit,
      }, countryCode);
    }
    const afterUpdateToTalDistance = yield getShipmentDetail(shipmentDetail.id, countryCode);
    yield put({
      type: LISTING_ACTION.HANDLE_AFTER_EDIT_DESTINATION_ADDRESS_SUCCESS,
      newShipmentDetail: afterUpdateToTalDistance.data,
    });
  } catch (error) {
    console.log('handleAfterEditDestinationAddress', error);
    yield put({
      type: LISTING_ACTION.HANDLE_AFTER_EDIT_DESTINATION_ADDRESS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetListShipments(payload) {
  try {
    const countryCode = yield select((state) => state.app.countryCode);
    const response = yield getListShipments(payload.query, countryCode);
    if (response.isSuccess) {
      yield put({
        type: LISTING_ACTION.GET_LIST_SHIPMENTS_SUCCESS,
        data: { ...response },
      });
    }
  } catch (error) {
    console.log('GET_LIST_SHIPMENTS_FAIL', error);
    yield put({
      type: LISTING_ACTION.GET_LIST_SHIPMENTS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleSetDataForQueryLoadMore(payload) {
  try {
    // Pickup Filter
    const { page, total } = yield select((state) => state.listing);
    const countryCode = yield select((state) => state.app.countryCode);
    const totalPage = Math.floor(total / QUERY.LITMIT) + (total % QUERY.LITMIT !== 0 ? 1 : 0);
    if (page === totalPage) {
      return;
    }
    const newQuery = {
      ...payload.query,
      page: page + 1,
    };
    const response = yield getListShipments(newQuery, countryCode);
    yield put({
      type: LISTING_ACTION.GET_LIST_SHIPMENTS_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_DATA_FOR_QUERY_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.GET_LIST_SHIPMENTS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleAcceptQuote(payload) {
  try {
    const {
      quoteId, shipmentId, paymentMethod, callback
    } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield acceptQuote(quoteId, shipmentId, paymentMethod, countryCode);
    yield put({
      type: LISTING_ACTION.ACCEPT_QUOTE_SUCCESS,
      data: { ...response },
    });
    callback(true, null);
  } catch (error) {
    const { callback } = payload;
    console.log('ACCEPT_QUOTE_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.ACCEPT_QUOTE_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, error.data.message);
    return error;
  }
}

function* handleRejectQuote(payload) {
  try {
    const { quoteId, reasonId, callback, shipmentId } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield rejectQuote(quoteId, reasonId, shipmentId, countryCode);
    console.log('handleRejectQuote', response);
    yield put({
      type: LISTING_ACTION.REJECT_QUOTE_SUCCESS,
      data: { ...response },
      quoteId,
    });
    callback(true, null);
  } catch (error) {
    console.log('REJECT_QUOTE_FAIL: ', error);
    const { callback } = payload;
    yield put({
      type: LISTING_ACTION.REJECT_QUOTE_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, error.data.message);
    return error;
  }
}

function* handleGetQuoteDetail(payload) {
  try {
    const { query, callback } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield getQuoteDetail(query, countryCode);
    if (response.isSuccess) {
      yield put({
        type: LISTING_ACTION.GET_QUOTE_DETAIL_SUCCESS,
        data: response.data,
      });
      callback();
    }
  } catch (error) {
    const { callback } = payload;
    console.log('GET_QUOTE_DETAIL_FAILED', error);
    callback();
    yield put({
      type: LISTING_ACTION.GET_QUOTE_DETAIL_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetReasonsRejectQuote() {
  try {
    const response = yield getReasonsRejectQuote();
    if (response && response.isSuccess) {
      yield put({
        type: LISTING_ACTION.GET_REASONS_REJECT_QUOTE_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('GET_REASONS_REJECT_QUOTE_FAILED');
    yield put({
      type: LISTING_ACTION.GET_REASONS_REJECT_QUOTE_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleGetReasonsCancelBooking() {
  try {
    const { countryCode } = yield select((state) => state.app);
    const response = yield getReasonsCancelBooking(countryCode);
    if (response && response.isSuccess) {
      yield put({
        type: LISTING_ACTION.GET_REASONS_CANCEL_BOOKING_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('GET_REASONS_CANCEL_BOOKING_FAILED');
    yield put({
      type: LISTING_ACTION.GET_REASONS_CANCEL_BOOKING_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
  }
}

function* handleSetFieldForQuery(payload) {
  try {
    const { data } = payload;
    yield all([
      put({
        type: LISTING_ACTION.SET_FIELD_QUERY_SUCCESS,
        data,
      }),
      put({
        type: LISTING_ACTION.SET_DATA_FOR_QUERY,
      })
    ]);
  } catch (error) {
    console.log('SET_FIELD_QUERY_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.SET_FIELD_QUERY_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleSetDataForQuery() {
  try {
    // Pickup Filter
    const {
      tabFilter,
      fromDate,
      toDate,
      textFilter,
    } = yield select((state) => state.listing);
    const countryCode = yield select((state) => state.app.countryCode);
    const query = {
      Page: 1,
      Limit: 15,
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter,
      }
    };
    const response = yield getListShipments(query, countryCode);
    console.log('response', response);
    yield put({
      type: LISTING_ACTION.SET_DATA_FOR_QUERY_SUCCESS,
      data: { ...response },
    });
  } catch (error) {
    console.log('SET_DATA_FOR_QUERY_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.SET_DATA_FOR_QUERY_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleSetPin(payload) {
  try {
    const { shipmentId, pinStatus } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield pinShipment(shipmentId, pinStatus, countryCode);
    if (response.isSuccess) {
      yield put({ type: LISTING_ACTION.SET_PIN_SUCCESS, shipmentId, pinStatus });
    }
  } catch (error) {
    console.log('SET_PIN_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.SET_PIN_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleCancelBooking(payload) {
  try {
    const { shipmentId, reasons, callback } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield cancelBooking(shipmentId, reasons, countryCode);
    if (response.isSuccess) {
      yield put({ type: LISTING_ACTION.CANCEL_BOOKING_SUCCESS });
      callback(true, null);
    }
  } catch (error) {
    const { callback } = payload;
    console.log('CANCEL_BOOKING_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.CANCEL_BOOKING_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    callback(null, true);
    return error;
  }
}

function* handleBookAgainShipment(payload) {
  try {
    const { shipmentId } = payload;
    const { countryCode } = yield select((state) => state.app);
    const response = yield bookAgainShipment(shipmentId, countryCode);
    if (response.isSuccess) {
      yield put({
        type: LISTING_ACTION.BOOK_AGAIN_SUCCESS,
        data: response.data,
      });
      NavigationService.navigate('ShipmentStack', { noConfirm: true });
    }
  } catch (error) {
    console.log('BOOK_AGAIN_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.BOOK_AGAIN_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleDeleteShipmentData(payload) {
  try {
    const {
      dataDelete,
      body,
      shipmentId,
      transportTypeId
    } = payload;
    const { countryCode } = yield select((state) => state.app);
    let response = null;
    if (dataDelete === 'items') {
      response = yield updateListingShipmentItems(shipmentId, body, countryCode, transportTypeId);
    } else {
      response = yield updateListingShipmentAddress(shipmentId, body, countryCode);
    }
    console.log('handleDeleteShipmentData res', response);
    if (response.isSuccess) {
      if (dataDelete === 'items') {
        yield put({
          type: LISTING_ACTION.DELETE_SHIPMENT_DATA_SUCCESS,
          data: response.data[0],
          typeDelete: 'items',
        });
      } else {
        yield put({
          type: LISTING_ACTION.DELETE_SHIPMENT_DATA_SUCCESS,
          data: response.data.destinations[0],
          typeDelete: 'address'
        });
      }
    }
  } catch (error) {
    console.log('DELETE_SHIPMENT_DATA_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.DELETE_SHIPMENT_DATA_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

function* handleRedirectManagementShipments() {
  try {
    yield put({ type: LISTING_ACTION.REDIRECT_MANAGEMENT_SHIPMENTS_SUCCESS });
    NavigationService.navigate('ManagementShipmentStack');
  } catch (error) {
    console.log('REDIRECT_MANAGEMENT_SHIPMENTS_FAIL: ', error);
    yield put({
      type: LISTING_ACTION.REDIRECT_MANAGEMENT_SHIPMENTS_FAIL,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      }
    });
    return error;
  }
}

const listingSaga = {
  getHandleUnitSaga,
  getTransportTypeSaga,
  getAddressDataSaga,
  getAdditionalServiceSaga,
  saveDraftSaga,
  handleGetAdvert,
  handleGetShipmentDetail,
  handleGetListingItems,
  handleGetSummary,
  handleGetAddresses,
  handleUpdateShipment,
  getQuoteSaga,
  handleGetDistanceMatrix,
  handleSaveListingItems,
  handleBookNow,
  handleSaveListingAddress,
  handleGetHandleUnitDefault,
  handleGetAdditionalServicesDefault,
  handleGetLocationServicesDefault,
  handleSend,
  handleGetTransportTypesDefault,
  handleSaveAddressAsDraft,
  handleSaveAddressQuote,
  handleSaveStateAddress,
  handleUpdateCountry,
  handleSetEditing,
  handleGetLocationTypesDefault,
  handleUnListShipment,
  handleGetDeleteReasons,
  handleDeleteRelated,
  handleDeleteAll,
  handleUpdateBasicShipment,
  handleUploadPhotoShipment,
  handleDeletePhotoShipment,
  handleSetDataAddressUpdating,
  handleEditPickupAddress,
  handleEditDestinationAddress,
  handleAfterEditPickupAddress,
  handleAfterEditDestinationAddress,
  handleGetListShipments,
  handleSetDataForQueryLoadMore,
  handleAcceptQuote,
  handleRejectQuote,
  handleGetQuoteDetail,
  handleGetReasonsRejectQuote,
  handleGetReasonsCancelBooking,
  handleSetFieldForQuery,
  handleSetDataForQuery,
  handleSetPin,
  handleCancelBooking,
  handleBookAgainShipment,
  handleRedirectManagementShipments,
  handleDeleteShipmentData,
};

export default listingSaga;
