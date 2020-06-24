import { configQuoteFormat } from '../../model/bookNowModel';
import { QUERY } from '../../constants/app';

const initState = {
  currentStep: 1,
  defaultHandleUnits: [],
  defaultLocationTypes: [],
  handleUnits: [],
  transportTypes: [],
  defaultAdditionalServices: [],
  additionalServices: [],
  locationTypes: [],
  defaultLocationServices: [],
  transportTypesDefault: [],
  locationServices: [],
  advertInfo: {},
  listingItems: [],
  addresses: {
    pickup: {},
    destinations: [],
  },
  // pickup address to show in the step address
  pickupAddress: {},
  destinationAddress: {},
  pickupDate: null,
  tempAddress: [],
  //
  dataStep1: [],
  dataStep2: {},
  targetPrice: 0,
  unitPrice: '',
  titleShipment: '',
  titleShort: '',
  summary: [],
  summaryShipment: [],
  configQuote: configQuoteFormat({}),
  tempBooking: [],
  getQuoteData: [],
  shipmentId: null,
  shipmentDetail: {},
  totalDuration: null,
  isEditing: false,
  totalWeight: 0,
  deleteReasons: [],
  cancelReasons: [],
  updatingAddress: false,
  updatingAddressData: {},
  imageUploadSelected: [],
  imageRemoveSelected: [],
  dataStep1Editing: [],
  dataStep2Editing: {
    pickup: {},
    destinations: []
  },
  shipments: [],
  total: 0,
  page: 1,
  limit: QUERY.LITMIT,
  isLoading: false,
  quoteDetail: {},
  reasonsRejectQuote: [],
  // FILTER
  tabFilter: QUERY.TAB_FILTER.PENDING,
  fromDate: '',
  toDate: '',
  textFilter: '',
  //
  isDraftShipment: false,
  resetFilter: false,
  draftId: null,
  draftItem: [],
  draftAddress: {},
  transportTypeId: null,
};

const initialAddressState = {
  pickupAddress: [],
  destinationAddress: {},
  addresses: {
    pickup: {},
    destinations: [],
  },
  pickupDate: null,
};

const setListingItemBooking = (listBooking) => ({
  tempBooking: [...listBooking]
});

const setDraftItem = (draftItem, draftId) => ({
  draftItem,
  shipmentId: draftItem.id,
  draftId,
});

const addGetQuoteData = (currentData, item) => ({
  getQuoteData: [...currentData, ...item]
});

const handleSummary = (shipmentDetail, shipmentAddress) => {
  const source = [];
  if (shipmentDetail && shipmentAddress) {
    const objShipmentDetail = {
      type: 'detail',
      source: shipmentDetail,
    };
    const objPickup = {
      type: 'location',
      source: {
        pickup: true,
        item: { ...shipmentAddress.pickup }
      },
    };

    source.push({ ...objShipmentDetail }, { ...objPickup });

    shipmentAddress.destinations.forEach((item) => {
      source.push({
        type: 'location',
        source: {
          pickup: false,
          item,
        }
      });
    });
    return {
      summary: source,
    };
  }
};

const handleSummaryInShipment = (shipmentDetail, isDraftShipment = false) => {
  const source = [];
  if (isDraftShipment) {
    return;
  }

  if (shipmentDetail) {
    const objShipmentDetail = {
      type: 'detail',
      source: {
        title: shipmentDetail.title,
        description: `${shipmentDetail.id.slice(shipmentDetail.id.length - 5)}`,
      },
    };
    const objPickup = {
      type: 'location',
      source: {
        pickup: true,
        item: { ...shipmentDetail.addresses.pickup }
      },
    };

    source.push({ ...objShipmentDetail }, { ...objPickup });

    shipmentDetail.addresses.destinations.forEach((item) => {
      source.push({
        type: 'location',
        source: {
          pickup: false,
          item,
        }
      });
    });
    return {
      summaryShipment: source,
    };
  }
};

const updatePhotoShipment = (shipmentDetail, photoId) => {
  const newPhotos = shipmentDetail.photos.filter((photo) => photo.fileName !== photoId);
  return {
    shipmentDetail: {
      ...shipmentDetail,
      photos: newPhotos,
    }
  };
};

const setDataAddressUpdate = (state, payload, index) => {
  if (payload.photos) {
    state.updatingAddressData.photos.filter((photo, i) => i === index && (state.updatingAddressData.photos[i] = payload.photos));
    return {
      ...state,
      imageUploadSelected: [
        ...state.imageUploadSelected,
        { ...payload.photos },
      ],
      updatingAddressData: {
        ...state.updatingAddressData,
        photos: state.updatingAddressData.photos,
      },
    };
  }
  return {
    ...state,
    updatingAddressData: {
      ...state.updatingAddressData,
      ...payload,
    },
  };
};

const removeAddressPhoto = (updatingAddressData, file, index) => {
  updatingAddressData.photos.filter((photo, i) => i === index && (updatingAddressData.photos[i] = null));
  return {
    photos: updatingAddressData.photos,
  };
};

const updateSummaryShipment = (summaryShipment, payload) => {
  const res = [];
  summaryShipment.forEach((data) => {
    if (data && data.source && data.source.item && data.source.item.id === payload.id) {
      delete payload.photos;
      res.push({
        ...data,
        source: {
          ...data.source,
          item: {
            ...data.source.item,
            ...payload,
          }
        }
      });
    } else {
      res.push(data);
    }
  });
  return {
    summaryShipment: res,
  };
};

const updateImageUploadSelected = (images, photo) => {
  const res = images.filter((img) => img.path !== photo.path);
  return {
    imageUploadSelected: res,
  };
};

const updateUpdatingAddressData = (updatingAddressData, photo, index) => {
  updatingAddressData.photos.filter((img) => updatingAddressData.photos[index] = null);
  return {
    photos: updatingAddressData.photos
  };
};

const upDataStep1Editing = (dataStep1Editing, item, type) => {
  switch (type) {
    case 'remove':
      dataStep1Editing.map((data, index) => {
        if (data.id === item.booking.id) {
          if (item.booking.shipmentId) {
            dataStep1Editing[index].isDelete = true;
          } else {
            dataStep1Editing.splice(index, 1);
          }
        }
      });
      break;
    case 'replace':
      dataStep1Editing.map((data, index) => {
        item.forEach((res) => {
          if (data.id === res.id) {
            dataStep1Editing[index] = { ...res };
          }
        });
      });
      break;
    default:
      break;
  }
};

const upDataStep2Editing = (state, item, type) => {
  switch (type) {
    case 'remove':
      state.dataStep2Editing.destinations.map((data, index) => {
        if (data.id === item.id) {
          if (item.shipmentId) {
            state.dataStep2Editing.destinations[index].isDeleted = true;
          } else {
            state.dataStep2Editing.destinations.splice(index, 1);
          }
        }
      });
      break;
    case 'replace':
      state.dataStep2Editing.pickup = {
        ...state.dataStep2Editing.pickup,
        ...item.pickup,
      };
      if (state.dataStep2Editing.destinations && state.dataStep2Editing.destinations.length && state.shipmentDetail.addresses) {
        state.dataStep2Editing.destinations.forEach((data, index) => {
          item.destinations.forEach((res) => {
            if (data.id === res.id) {
              state.dataStep2Editing.destinations[index] = {
                ...state.dataStep2Editing.destinations[index],
                ...res
              };
            }
          });
        });
      } else {
        state.dataStep2Editing.destinations = item.destinations;
      }
      break;
    default:
      break;
  }
};

const parseSummaryShipment = (shipmentDetail, summaryShipment) => {
  summaryShipment.filter((item, i) => {
    if (item.type === 'detail') {
      summaryShipment[i].source.title = shipmentDetail.title;
    } else if (item.type === 'location' && item.source.pickup) {
      summaryShipment[i] = {
        ...summaryShipment[i],
        source: {
          ...summaryShipment[i].source,
          item: {
            ...summaryShipment[i].source.item,
            ...shipmentDetail.addresses.pickup,
          }
        }
      };
    } else {
      shipmentDetail.addresses.destinations.forEach((des) => {
        if (des.id === summaryShipment[i].source.item.id) {
          summaryShipment[i] = {
            ...summaryShipment[i],
            source: {
              ...summaryShipment[i].source,
              item: {
                ...summaryShipment[i].source.item,
                ...des,
              }
            }
          };
        }
      });
    }
  });
  return {
    summaryShipment,
  };
};

const mapShipmentResult = (state, resultData) => {
  console.log('PAGE: ', resultData, '--', state.page);
  let shipmentList = [...state.shipments];
  if (resultData.data.page === 1) {
    shipmentList = [...resultData.data.data];
  } else if (resultData.data.page === (state.page + 1)) {
    shipmentList = [...state.shipments, ...resultData.data.data];
  }
  return {
    shipments: shipmentList,
    total: resultData.data.total,
    page: resultData.data.page,
    limit: resultData.data.limit,
  };
};

const updateShipmentDetail = (state, fieldsUpdate) => {
  if (Object.keys(fieldsUpdate).indexOf('customerPrice') > -1) {
    return {
      shipmentDetail: {
        ...state.shipmentDetail,
        shipmentDetail: {
          ...state.shipmentDetail.shipmentDetail,
          customerPrice: fieldsUpdate.customerPrice - 0,
        }
      }
    };
  }
  return {
    shipmentDetail: {
      ...state.shipmentDetail,
      ...fieldsUpdate,
    }
  };
};

const updateShipmentPinSuccess = (state, shipmentId, pinStatus) => {
  const shipmentItem = state.shipments.find((item) => item.id === shipmentId);
  if (shipmentItem) {
    shipmentItem.isPined = !pinStatus;
  }
  return {
    shipments: [...state.shipments]
  };
};

const updateDraftShipment = (state, id, type) => {
  console.log("updateDraftShipment", id, type);
  if (type === 'items') {
    state.draftItem.filter((data) => data.id !== id);
    return {
      draftItem: state.draftItem
    };
  }
  state.draftAddress.destinations.filter((des) => des.id !== id);
  return {
    draftAddress: {
      ...state.draftAddress,
      destinations: state.draftAddress.destinations.filter((des) => des.id !== id)
    }
  };
};

const updateDraftItems = (draftItem, item, type) => {
  console.log('updateDraftItems state', draftItem);
  console.log('updateDraftItems item', item);
  console.log('updateDraftItems type', type);
  switch (type) {
    case 'remove':
      draftItem.forEach((data, index) => {
        if (data.id === item.booking.id) {
          if (item.booking.shipmentId) {
            draftItem[index].isDeleted = true;
          } else {
            draftItem.splice(index, 1);
          }
        }
      });
      break;
    case 'save':
      item.forEach((res) => {
        draftItem.forEach((data, index) => {
          if (data.id === res.id) {
            draftItem[index] = { ...res };
          }
        });
      });
      break;
    default:
      break;
  }
};

const updateDraftAddress = (state, address, type) => {
  console.log('updateDraftAddress address', address);
  console.log('updateDraftAddress type', type);
  switch (type) {
    case 'remove':
      state.draftAddress.destinations.forEach((data, index) => {
        console.log('data', data);
        if (data.id === address.id) {
          if (typeof data.id === 'string') {
            console.log('address.shipmentId')
            state.draftAddress.destinations[index].isDeleted = true;
          } else {
            state.draftAddress.destinations.splice(index, 1);
          }
        }
      });
      break;
    case 'replace':
      state.draftAddress.pickup = {
        ...state.draftAddress.pickup,
        ...address.pickup,
      };
      if (state.draftAddress.destinations && state.draftAddress.destinations.length) {
        state.draftAddress.destinations.forEach((data, index) => {
          address.destinations.forEach((res) => {
            if (data.id === res.id) {
              state.draftAddress.destinations[index] = {
                ...state.draftAddress.destinations[index],
                ...res
              };
            }
          });
        });
      } else {
        state.draftAddress.destinations = address.destinations;
      }
      break;
    default:
      break;
  }
};

const listingState = {
  initState,
  setListingItemBooking,
  setDraftItem,
  addGetQuoteData,
  handleSummary,
  initialAddressState,
  handleSummaryInShipment,
  updatePhotoShipment,
  setDataAddressUpdate,
  removeAddressPhoto,
  updateSummaryShipment,
  updateImageUploadSelected,
  updateUpdatingAddressData,
  upDataStep1Editing,
  upDataStep2Editing,
  parseSummaryShipment,
  mapShipmentResult,
  updateShipmentDetail,
  updateShipmentPinSuccess,
  updateDraftShipment,
  updateDraftItems,
  updateDraftAddress,
};

export default listingState;
