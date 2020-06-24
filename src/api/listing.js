import axios from 'axios';
import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const getHandleUnits = (languageCode = 'en', countryCode = 'vn') => api(`${API_URL.HANDLE_UNIT}?culture=${languageCode}-${countryCode}`, API_METHOD.GET, null, {
  countryCode
});

export const getTransportTypes = (languageCode = 'en', countryCode = 'vn') => api(`${API_URL.TRANSPORT_TYPE}?culture=${languageCode}-${countryCode}`, API_METHOD.GET, null, {
  countryCode
});

export const getLocationTypes = (languageCode = 'en', countryCode = 'vn') => api(`${API_URL.LOCATION_TYPE}?culture=${languageCode}-${countryCode}`, API_METHOD.GET, null, {
  countryCode
});

export const getLocationServices = (languageCode = 'en', countryCode = 'vn') => api(`${API_URL.LOCATION_SERVICES}?culture=${languageCode}-${countryCode}`, API_METHOD.GET, null, {
  countryCode
});

export const getAdditionalServices = (languageCode = 'en', countryCode = 'vn') => api(`${API_URL.ADDITIONAL_SERVICES}?culture=${languageCode}-${countryCode}`, API_METHOD.GET, null, {
  countryCode
});

export const saveDraftApi = (bookingList, countryCode) => {
  const listParams = bookingList.map((b) => ({
    HandlingUnitId: b.handleUnitSelected.id,
    UnitQuantity: b.unitQuantity,
    Length: b.length,
    Width: b.width,
    Height: b.height,
    Weight: b.weight,
    Description: b.goodDesc,
    AdditionalServices: b.itemServices.map((i) => i.id),
  }));
  return api(API_URL.SHIPMENT, API_METHOD.POST, {
    Status: 'Draft',
    TransportTypeId: bookingList[0].transportModeSelected.id,
    // TransportTypeId: 'baf35bbf-468f-4af6-b60f-8b0452e146e5',
    Items: [...listParams]
  }, {
    countryCode
  });
};

export const saveDraftAddressesApi = (shipmentId, addressesInfor, countryCode) => {
  const pickupParams = {
    PickupDate: addressesInfor.pickup.pickupDate,
    LocationTypeId: addressesInfor.pickup.locationTypeId,
    ShipmentId: shipmentId,
    Address: addressesInfor.pickup.address,
    LocationServices: addressesInfor.pickup.locationServices.map((item) => item),
    Location: {
      latitue: addressesInfor.pickup.latitude,
      longitude: addressesInfor.pickup.longitude,
    },
    ShortAddress: addressesInfor.pickup.shortAddress,
  };

  const listParams = addressesInfor.destinations.map((destination) => ({
    DateRangeType: destination.dateRangeType,
    EarliestByDate: destination.earliestByDate || null,
    LatestByDate: destination.latestByDate || null,
    EarliestBy: destination.earliestBy || null,
    LatestBy: destination.latestBy || null,
    LocationTypeId: destination.locationTypeId,
    ShipmentId: shipmentId,
    Address: destination.address,
    LocationServices: destination.locationServices.map((i) => i),
    Location: {
      latitue: destination.latitude,
      longitude: destination.longitude,
    },
    ShortAddress: destination.shortAddress,
  }));
  return api(`${API_URL.SHIPMENT}/address`, API_METHOD.POST, {
    Pickup: pickupParams,
    Destinations: listParams,
  }, {
    countryCode
  });
};

export const getQuoteApi = (bookingList) => {
  const listParams = bookingList.map((b) => ({
    HandlingUnitId: b.handleUnitSelected.id,
    UnitQuantity: b.unitQuantity,
    Length: b.length,
    Width: b.width,
    Height: b.height,
    Weight: b.weight,
    TransportTypeId: b.transportModeSelected.id,
    Description: b.goodDesc,
    AdditionalServices: b.itemServices.map((i) => i.id)
  }));
  return null;
  // return api(API_URL.SHIPMENT, API_METHOD.POST, {
  //   Status: 'Draft',
  //   Items: [...listParams]
  // });
};

export const getAdvertDescription = (countryCode) => api(`${API_URL.ADVERT_DESCRIPTION}?culture=en-US`, API_METHOD.GET, null, {
  countryCode
});

export const getShipmentDetail = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/detail`, API_METHOD.GET, null, {
  countryCode
});
export const getListingItems = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/items`, API_METHOD.GET);
export const getSummary = (shipmentId) => api(`${API_URL.SHIPMENT}/${shipmentId}/summary`, API_METHOD.GET);
export const getAddresses = (shipmentId) => api(`${API_URL.SHIPMENT}/${shipmentId}/addresses`, API_METHOD.GET);
export const getDistanceMatrix = (origins, destinations) => api(`${API_URL.DISTANCE_MATRIX}&origin=${origins.latitude},${origins.longitude}&destination=${destinations.latitude},${destinations.longitude}`, API_METHOD.GET);
export const updateShipment = (shipmentId, body, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}`, API_METHOD.PUT, body, {
  countryCode
});

export const requestBookNow = (quoteId) => api(`${API_URL.GET_CONFIG_QUOTE}/${quoteId}`, API_METHOD.GET);
export const saveAddressDraft = (data) => api(`${API_URL.SHIPMENT}/address`, API_METHOD.POST, data);

export const createQuote = (data, countryCode) => {
  const body = {
    quoteId: data.quoteId || '',
    country_code: countryCode,
    pickup_time: data.pickup.pickupDate, // '2020-1-2T18:36:28+07:00',
    locations: data.locations,
    items: data.items
  };
  return api(`${API_URL.GET_CONFIG_QUOTE}`, API_METHOD.POST, {
    ...body,
  });
};

export const getDeleteReasons = (countryCode) => api(`${API_URL.DELETE_REASONS}`, API_METHOD.GET, null, {countryCode});
export const getReasonsRejectQuote = () => api(`${API_URL.REASONS_REJECT_QUOTE}`, API_METHOD.GET);
export const getReasonsCancelBooking = (countryCode) => api(`${API_URL.REASONS_CANCEL_BOOKING}`, API_METHOD.GET, null, {
  countryCode
});
export const deleteAll = (shipmentId, reasons, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/all`, API_METHOD.DELETE, {
  deleteReasonsId: reasons,
}, {
  countryCode
});
export const deleteRelated = (shipmentId, reasons, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/related`, API_METHOD.DELETE, {
  deleteReasonsId: reasons,
}, {
  countryCode
});

export const uploadPhotoShipment = (token, shipmentId, files) => axios.post(`${API_URL.SHIPMENT}/${shipmentId}/photos`, files, {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
});

export const deletePhotoShipment = (token, photoId, countryCode) => axios.delete(`${API_URL.SHIPMENT}/photos/${photoId}`, {
  Authorization: `Bearer ${token}`,
  countryCode
});
export const editPickupAddress = (pickupId, body, countryCode) => api(`${API_URL.SHIPMENT}/address/${pickupId}/pickup`, API_METHOD.PUT, body, {
  countryCode
});
export const editDestinationAddress = (destinationId, body, countryCode) => api(`${API_URL.SHIPMENT}/address/${destinationId}/destination`, API_METHOD.PUT, body, {
  countryCode
});
export const uploadAddressPhoto = (token, addressId, files, countryCode) => axios.post(`${API_URL.SHIPMENT}/address/${addressId}/photo`, files, {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
  countryCode
});

export const updateListingShipmentItems = (shipmentId, items, countryCode, transportTypeId, isSaveDraft = false) => api(`${API_URL.SHIPMENT}/${shipmentId}/items`, API_METHOD.PUT, {
  items,
  transportTypeId,
  isSaveDraft
}, {
  countryCode
});

export const updateListingShipmentAddress = (shipmentId, address, countryCode, isSaveDraft = false) => api(`${API_URL.SHIPMENT}/${shipmentId}/addresses`, API_METHOD.PUT, {
  address,
  isSaveDraft,
}, {
  countryCode
});

export const getListShipments = (query, countryCode) => api(`${API_URL.GET_SHIPMENTS}`, API_METHOD.POST, query, {
  countryCode
});
export const acceptQuote = (quoteId, shipmentId, paymentMethod, countryCode) => api(`${API_URL.SHIPMENT}/${quoteId}/quote-accept`, API_METHOD.PUT, {
  shipmentId,
  paymentMethod,
}, {
  countryCode
});

export const rejectQuote = (quoteId, reasonId, shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${quoteId}/quote-reject`, API_METHOD.PUT, {
  shipmentId,
  listReasonId: reasonId,
}, {
  countryCode
});

export const getQuoteDetail = (query, countryCode) => api(`${API_URL.SHIPMENT}/quote-detail`, API_METHOD.POST, query, {
  countryCode
});
export const pinShipment = (shipmentID, pinStatus, countryCode) => (!pinStatus ? api(API_URL.PIN_SHIPMENT.replace('[shipment_id]', shipmentID), API_METHOD.POST, null, {
  countryCode
})
  : api(API_URL.UNPIN_SHIPMENT.replace('[shipment_id]', shipmentID), API_METHOD.DELETE, null, {
    countryCode
  }));

export const cancelBooking = (shipmentID, reasonIds, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentID}/cancel-booked`, API_METHOD.PUT, {
  reasonIds: ['1'],
}, {
  countryCode,
});

export const bookAgainShipment = (shipmentID, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentID}/book-again`, API_METHOD.PUT, null, {
  countryCode
});

export const updateShipmentChat = (shipmentId, params, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/chat`, API_METHOD.POST, params, {
  countryCode
});