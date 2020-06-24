import APP_CONSTANT, { STATUS_FILTER } from '../../helpers/constant.helper';
import { LIST_VIEW_TYPE } from '../../constants/app';
import { googleMapPickup, googleMapDestination } from '../../model/shipment';

const initState = {
  // FILTER
  modeSearch: APP_CONSTANT.MODE_SEARCH.LOCATION,
  rootPickup: {},
  rootDelivery: {},
  anotherDelivery: [],
  anotherPickup: [],
  // BASIC FILED QUERY
  maxWeight: '',
  pickupStartDateFilter: null,
  pickupEndDateFilter: null,
  // IsWatchingTab: false,
  // IsMyShipmentTab: false,
  sortFilter: '', // "Expired", "ChangedStatusDate","Price", "NumberOfQuotes"
  sortFilterOrder: '',
  handlingUnitIdFilter: [],
  locationTypeIdFilter: [],
  total: 0,
  page: 1,
  // limit: 15,
  shipmentDataList: [],
  listViewType: LIST_VIEW_TYPE.LIST,
  listShipmentMapView: [
    {
      pickup: googleMapPickup({
        latitude: 10.8033169,
        longitude: 106.6409313,
        shipmentId: 'id1'
      }),
      destinations: [
        googleMapDestination({
          latitude: 10.7999648,
          longitude: 106.6699665,
        }),
        googleMapDestination({
          latitude: 10.7616855,
          longitude: 106.6693945,
        })
      ]
    },
    {
      pickup: googleMapPickup({
        latitude: 21.0298506,
        longitude: 105.8490128,
        shipmentId: 'id2'
      }),
      destinations: [
        googleMapDestination({
          latitude: 10.7567948,
          longitude: 106.6564053,
        }),
        googleMapDestination({
          latitude: 10.7758511,
          longitude: 106.634261,
        })
      ]
    },
  ],
  isLoading: false,
  shipmentExpandedId: null,
  dropdownSelected: {
    id: 1, icon: null, title: 'all', value: '', isActive: true
  },
  dropdownFilterSelected: {
    id: 1, status: 'upcoming', title: 'upcoming', value: 0,
  },
  StatusFilter: STATUS_FILTER.Upcoming, // "Upcoming", "Completed", "Cancelled"
  TabFilter: APP_CONSTANT.SEARCH,
  TextFilter: '',
  totalStatusFilter: {}
};

const setDataAnotherAddress = (rootData, anotherData, type) => {
  switch (type) {
    case 'pickup':
      if (rootData && rootData.address) {
        if (anotherData.length === 0) {
          return {
            anotherPickup: [{ isShow: true }]
          };
        }
      }
      break;
    case 'delivery': {
      if (rootData && rootData.address) {
        if (anotherData.length === 0) {
          return {
            anotherDelivery: [{ isShow: true }]
          };
        }
      }
      break;
    }
    default:
      break;
  }
};

const updateDataAnotherAddress = (anotherAddress, data, index, type) => {
  if (type === 'pickup') {
    let res = anotherAddress.map((item, i) => {
      if (i === index) {
        anotherAddress[i] = {
          ...anotherAddress[i],
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
      return { ...anotherAddress[i] };
    });
    if (res.length < 2) {
      if (index === 0) {
        res = [...res, { isShow: true }];
      }
    }
    return { anotherPickup: res };
  }
  let res = anotherAddress.map((item, i) => {
    if (i === index) {
      anotherAddress[i] = {
        ...anotherAddress[i],
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
    return { ...anotherAddress[i] };
  });

  if (res.length < 2) {
    if (index === 0) {
      res = [...res, { isShow: true }];
    }
  }
  return { anotherDelivery: res };
};

const resetPickupAddress = (isRoot, index, anotherPickup) => {
  if (isRoot) {
    if (anotherPickup.length === 1) {
      if (anotherPickup[0] && anotherPickup[0].address) {
        return {
          rootPickup: anotherPickup[0],
          anotherPickup: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }],
        };
      }
    }

    if (anotherPickup.length === 2) {
      if (anotherPickup[1] && anotherPickup[1].address) {
        return {
          rootPickup: anotherPickup[0],
          anotherPickup: [anotherPickup[1], { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
        };
      }
      return {
        rootPickup: anotherPickup[0],
        anotherPickup: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
      };
    }

    return {
      rootPickup: {},
      anotherPickup: [],
    };
  }

  if (index === 0) {
    if (anotherPickup[index + 1] && anotherPickup[index + 1].address) {
      return {
        anotherPickup: [anotherPickup[index + 1], { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
      };
    }
    return {
      anotherPickup: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
    };
  }
  const res = anotherPickup.map((item, i) => {
    if (i === index) {
      return { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS };
    }
    return { ...item };
  });
  return {
    anotherPickup: res,
  };
};

const resetDeliveryAddress = (isRoot, index, anotherDelivery) => {
  if (isRoot) {
    if (anotherDelivery.length === 1) {
      if (anotherDelivery[0] && anotherDelivery[0].address) {
        return {
          rootDelivery: anotherDelivery[0],
          anotherDelivery: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }],
        };
      }
    }

    if (anotherDelivery.length === 2) {
      if (anotherDelivery[1] && anotherDelivery[1].address) {
        return {
          rootDelivery: anotherDelivery[0],
          anotherDelivery: [anotherDelivery[1], { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
        };
      }
      return {
        rootDelivery: anotherDelivery[0],
        anotherDelivery: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
      };
    }

    return {
      rootDelivery: {},
      anotherDelivery: [],
    };
  }

  if (index === 0) {
    if (anotherDelivery[index + 1] && anotherDelivery[index + 1].address) {
      return {
        anotherDelivery: [anotherDelivery[index + 1], { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
      };
    }
    return {
      anotherDelivery: [{ isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS }]
    };
  }
  const res = anotherDelivery.map((item, i) => {
    if (i === index) {
      anotherDelivery[i] = { isShow: true, radius: APP_CONSTANT.DEFAULT_RADIUS };
    }
    return { ...anotherDelivery[i] };
  });
  return {
    anotherDelivery: res,
  };
};

const setRadiusForAddress = (state, isPickup, typeAddress, index, data) => {
  if (isPickup) {
    if (typeAddress === 'root') {
      return {
        ...state,
        rootPickup: {
          ...state.rootPickup,
          radius: data,
        }
      };
    }
    const res = state.anotherPickup.map((item, i) => {
      if (i === index) {
        state.anotherPickup[i] = {
          ...state.anotherPickup[i],
          radius: data,
        };
      }
      return { ...state.anotherPickup[i] };
    });
    return {
      ...state,
      anotherPickup: res,
    };
  }

  if (typeAddress === 'root') {
    return {
      ...state,
      rootDelivery: {
        ...state.rootDelivery,
        radius: data,
      }
    };
  }

  const res = state.anotherDelivery.map((item, i) => {
    if (i === index) {
      state.anotherDelivery[i] = {
        ...state.anotherDelivery[i],
        radius: data,
      };
    }
    return { ...state.anotherDelivery[i] };
  });
  return {
    ...state,
    anotherDelivery: res,
  };
};

const setCoorsForAddress = (state, isPickup, typeAddress, index, data) => {
  if (isPickup) {
    if (typeAddress === 'root') {
      return {
        ...state,
        rootPickup: {
          ...state.rootPickup,
          latitude: data.latitude,
          longitude: data.longitude
        }
      };
    }
    const res = state.anotherPickup.map((item, i) => {
      if (i === index) {
        state.anotherPickup[i] = {
          ...state.anotherPickup[i],
          latitude: data.latitude,
          longitude: data.longitude
        };
      }
      return { ...state.anotherPickup[i] };
    });
    return {
      ...state,
      anotherPickup: res,
    };
  }

  if (typeAddress === 'root') {
    return {
      ...state,
      rootDelivery: {
        ...state.rootDelivery,
        latitude: data.latitude,
        longitude: data.longitude
      }
    };
  }

  const res = state.anotherDelivery.map((item, i) => {
    if (i === index) {
      state.anotherDelivery[i] = {
        ...state.anotherDelivery[i],
        latitude: data.latitude,
        longitude: data.longitude
      };
    }
    return { ...state.anotherDelivery[i] };
  });
  return {
    ...state,
    anotherDelivery: res,
  };
};

const mapShipmentResult = (state, resultData) => {
  console.log('PAGE: ', resultData.data.page, '--', state.page);
  let shipmentList = [...state.shipmentDataList];
  if (resultData.data.page === 1) {
    shipmentList = [...resultData.data.data];
  } else if (resultData.data.page === (state.page + 1)) {
    shipmentList = [...state.shipmentDataList, ...resultData.data.data];
  }
  return {
    shipmentDataList: shipmentList,
    total: resultData.data.total,
    page: resultData.data.page,
    limit: resultData.data.limit,
  };
};

const updateShipmentPinSuccess = (state, shipmentId, pinStatus) => {
  const shipmentItem = state.shipmentDataList.find((item) => item.id === shipmentId);
  if (shipmentItem) {
    shipmentItem.isPin = !pinStatus;
  }
  return {
    shipmentDataList: [...state.shipmentDataList]
  };
};

const updateSelectShipmentId = (state, shipmentId) => {
  if (state.shipmentExpandedId === shipmentId) {
    return {
      shipmentExpandedId: null
    };
  }

  return {
    shipmentExpandedId: shipmentId
  };
};

const updateSortItem = (sortItem) => ({ dropdownSelected: sortItem });
const updateFilterItem = (filterItem) => ({ dropdownFilterSelected: filterItem });

const driverState = {
  initState,
  resetPickupAddress,
  setDataAnotherAddress,
  updateDataAnotherAddress,
  resetDeliveryAddress,
  setRadiusForAddress,
  mapShipmentResult,
  updateShipmentPinSuccess,
  updateSelectShipmentId,
  updateSortItem,
  updateFilterItem,
  setCoorsForAddress,
};

export default driverState;
