import { DRIVER_ACTION } from '../actionTypes';
import driverState from '../states/driverState';

const driverReducer = (state = driverState.initState, action) => {
  switch (action.type) {
    // PICKUP FILTER
    case DRIVER_ACTION.SET_DATA_ROOT_PICKUP_SUCCESS:
      return {
        ...state,
        rootPickup: action.data,
        ...driverState.setDataAnotherAddress(action.data, state.anotherPickup, 'pickup'),
      };
    case DRIVER_ACTION.SET_DATA_ANOTHER_PICKUP_SUCCESS:
      return {
        ...state,
        ...driverState.updateDataAnotherAddress(action.anotherPickupData, action.data, action.index, 'pickup')
      };
    case DRIVER_ACTION.REMOVE_PICKUP_ADDRESS_SUCCESS:
      return {
        ...state,
        ...driverState.resetPickupAddress(action.isRoot, action.index, state.anotherPickup),
      };
    // DELIVERY FILTER
    case DRIVER_ACTION.SET_DATA_ROOT_DELIVERY_SUCCESS:
      return {
        ...state,
        rootDelivery: action.data,
        ...driverState.setDataAnotherAddress(action.data, state.anotherDelivery, 'delivery')
      };
    // BASIC FILED QUERY
    case DRIVER_ACTION.SET_FIELD_QUERY_SUCCESS:
      return {
        ...state,
        ...action.data,
      };
    case DRIVER_ACTION.SET_DATA_ANOTHER_DELIVERY_SUCCESS:
      return {
        ...state,
        ...driverState.updateDataAnotherAddress(action.anotherDeliveryData, action.data, action.index, 'delivery')
      };
    case DRIVER_ACTION.REMOVE_DELIVERY_ADDRESS_SUCCESS:
      return {
        ...state,
        ...driverState.resetDeliveryAddress(action.isRoot, action.index, state.anotherDelivery),
      };
    case DRIVER_ACTION.SET_RADIUS_FOR_ADDRESS_SUCCESS:
      return {
        ...state,
        ...driverState.setRadiusForAddress(state, action.payload.isPickup, action.payload.typeAddress, action.payload.index, action.payload.data),
      };
    case DRIVER_ACTION.SET_COORS_ADDRESS_SUCCESS:
      return {
        ...state,
        ...driverState.setCoorsForAddress(state, action.payload.isPickup, action.payload.typeAddress, action.payload.index, action.coors),
      };
    case DRIVER_ACTION.SET_DATA_FOR_QUERY:
      return {
        ...state,
        isLoading: true,
      };
    case DRIVER_ACTION.SET_DATA_FOR_QUERY_SUCCESS:
      return {
        ...state,
        ...driverState.mapShipmentResult(state, { ...action.data }),
        isLoading: false,
      };
    case DRIVER_ACTION.SET_PIN_SUCCESS:
      return {
        ...state,
        ...driverState.updateShipmentPinSuccess(state, action.shipmentId, action.pinStatus)
      };
    case DRIVER_ACTION.SELECT_SHIPMENT:
      return {
        ...state,
        ...driverState.updateSelectShipmentId(state, action.shipmentId)
      };
    case DRIVER_ACTION.SELECT_SORT_ITEM:
      return {
        ...state,
        ...driverState.updateSortItem(action.sortItem)
      };
    case DRIVER_ACTION.CHANGE_LIST_VIEW_TYPE:
      return {
        ...state,
        listViewType: action.listViewType
      };
    case DRIVER_ACTION.SELECT_FILTER_ITEM:
      return {
        ...state,
        ...driverState.updateFilterItem(action.filterItem)
      };
    case DRIVER_ACTION.GET_TOP_LOWEST_BID_SUCCESS:
      return {
        ...state,
        topLowestBid: action.data,
      };
    case DRIVER_ACTION.GET_TOTAL_STATUS_FILTER_SUCCESS:
      return {
        ...state,
        totalStatusFilter: action.data,
      };
    default:
      return state;
  }
};

export default driverReducer;
