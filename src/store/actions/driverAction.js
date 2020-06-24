import { DRIVER_ACTION, APP_ACTION } from '../actionTypes';

// PICKUP FILTER
const getDataAddressDropdown = (data, pos) => ({
  type: APP_ACTION.TOGGLE_DROPDOWN_ADDRESS,
  data,
  pos
});

const setDataRootPickup = (data) => ({
  type: DRIVER_ACTION.SET_DATA_ROOT_PICKUP,
  data,
});

const setDataAnotherPickup = (anotherPickup, data, index) => ({
  type: DRIVER_ACTION.SET_DATA_ANOTHER_PICKUP,
  data,
  index,
  anotherPickupData: anotherPickup,
});

const removePickupAddress = (isRoot, index) => ({
  type: DRIVER_ACTION.REMOVE_PICKUP_ADDRESS,
  isRoot,
  index,
});

// DELIVERY FILTER
const setDataRootDelivery = (data) => ({
  type: DRIVER_ACTION.SET_DATA_ROOT_DELIVERY,
  data,
});

const setDataAnotherDelivery = (anotherDelivery, data, index) => ({
  type: DRIVER_ACTION.SET_DATA_ANOTHER_DELIVERY,
  data,
  index,
  anotherDeliveryData: anotherDelivery,
});

const removeDeliveryAddress = (isRoot, index) => ({
  type: DRIVER_ACTION.REMOVE_DELIVERY_ADDRESS,
  isRoot,
  index,
});

const setFieldQuery = (data) => ({
  type: DRIVER_ACTION.SET_FIELD_QUERY,
  data,
});

const setRadius = (data, isPickup, typeAddress, index) => ({
  type: DRIVER_ACTION.SET_RADIUS_FOR_ADDRESS,
  data,
  isPickup,
  typeAddress,
  index,
});

const loadMoreAction = () => ({
  type: DRIVER_ACTION.SET_LOAD_MORE
});

const setPinAction = (shipmentId, pinStatus) => ({
  type: DRIVER_ACTION.SET_PIN,
  shipmentId,
  pinStatus
});

const selectShipment = (shipmentId) => ({
  type: DRIVER_ACTION.SELECT_SHIPMENT,
  shipmentId,
});

const selectSortItem = (sortItem) => ({
  type: DRIVER_ACTION.SELECT_SORT_ITEM,
  sortItem
});

const selectFilterItem = (filterItem) => ({
  type: DRIVER_ACTION.SELECT_FILTER_ITEM,
  filterItem
});

const changeListViewType = (listViewType) => ({
  type: DRIVER_ACTION.CHANGE_LIST_VIEW_TYPE,
  listViewType
});

const getTopLowestBid = (shipmentId, bidPrice) => ({
  type: DRIVER_ACTION.GET_TOP_LOWEST_BID,
  shipmentId,
  bidPrice
});

const getTotalStatusFilter = () => ({
  type: DRIVER_ACTION.GET_TOTAL_STATUS_FILTER,
});

const driverAction = {
  getDataAddressDropdown,
  setDataRootPickup,
  setDataAnotherPickup,
  removePickupAddress,
  removeDeliveryAddress,
  setDataRootDelivery,
  setDataAnotherDelivery,
  setFieldQuery,
  setRadius,
  loadMoreAction,
  setPinAction,
  selectShipment,
  selectSortItem,
  changeListViewType,
  selectFilterItem,
  getTopLowestBid,
  getTotalStatusFilter,
};

export default driverAction;
