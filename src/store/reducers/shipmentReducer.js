import { SHIPMENT_ACTION, DRIVER_ACTION } from '../actionTypes';
import shipmentState from '../states/shipmentState';

const shipmentReducer = (state = shipmentState.initState, action) => {
  switch (action.type) {
    case SHIPMENT_ACTION.GET_HANDLE_UNIT_SUCCESS:
      return {
        ...state,
        handleUnits: action.handleUnits,
        defaultHandleUnits: action.defaultHandleUnits,
      };
    case SHIPMENT_ACTION.GET_LOCATION_TYPE_SUCCESS:
      return {
        ...state,
        locationTypes: action.locationTypes,
        defaultLocationTypes: action.defaultLocationTypes,
        defaultTransportTypes: action.defaultTransportTypes,
        defaultAdditionalServices: action.defaultAdditionalServices,
        defaultLocationServices: action.defaultLocationServices,
      };
    case SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_SUCCESS:
      return {
        ...state,
        shipmentDetail: action.data,
        ...shipmentState.handleSummaryInShipment(action.data)
      };
    case DRIVER_ACTION.SET_PIN_SUCCESS:
      return {
        ...state,
        shipmentDetail: {
          ...state.shipmentDetail,
          isPin: !action.pinStatus,
          shipmentDetail: state.shipmentDetail.shipmentDetail ? {
            ...state.shipmentDetail.shipmentDetail,
            totalWatching: !action.pinStatus ? state.shipmentDetail.shipmentDetail.totalWatching + 1 : state.shipmentDetail.shipmentDetail.totalWatching - 1
          } : { ...state.shipmentDetail }
        },
      };
    case SHIPMENT_ACTION.SET_QUOTE_DETAIL:
      return {
        ...state,
        isLoading: true,
        quoteItemsList: []
      };
    case SHIPMENT_ACTION.SET_QUOTE_DETAIL_SUCCESS:
      return {
        ...state,
        ...shipmentState.mapQuoteDetailResult(state, { ...action.data }),
        isLoading: false,
      };
    case SHIPMENT_ACTION.SET_QUOTE_DETAIL_SORT:
      return {
        ...state,
        sortFilter: action.sortFilter,
        sortFilterOrder: action.sortFilterOrder,
        page: 0,
        quoteItemsList: []
      };
    case SHIPMENT_ACTION.SET_LOAD_MORE_QUOTE_DETAIL_SUCCESS:
      return {
        ...state,
        page: action.page
      };
    default:
      return state;
  }
};

export default shipmentReducer;
