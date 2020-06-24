import { SHIPMENT_ACTION } from '../actionTypes';

const getHandleUnit = () => ({
  type: SHIPMENT_ACTION.GET_HANDLE_UNIT,
});

const getLocationType = () => ({
  type: SHIPMENT_ACTION.GET_LOCATION_TYPE,
});

const setShipmentDetail = (
  shipmentId,
  isMultipleSize = false,
  isCheckNewDetail = false,
  isIgnoreGetProgressAPI = false,
  isIgnoreGetCustomerInfo = false,
  navCommunicationTab = false,
) => ({
  type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS,
  shipmentId,
  isMultipleSize,
  isCheckNewDetail,
  isIgnoreGetProgressAPI,
  isIgnoreGetCustomerInfo,
  navCommunicationTab,
});

const setQuoteDetail = (shipmentId) => ({
  type: SHIPMENT_ACTION.SET_QUOTE_DETAIL,
  shipmentId
});

const setQuoteDetailSort = (sortFilter, sortFilterOrder) => ({
  type: SHIPMENT_ACTION.SET_QUOTE_DETAIL_SORT,
  sortFilter,
  sortFilterOrder
});

const setQuoteDetailLoadMore = (shipmentId) => ({
  type: SHIPMENT_ACTION.SET_LOAD_MORE_QUOTE_DETAIL,
  shipmentId
});

const createQuote = (dataQuote) => ({
  type: SHIPMENT_ACTION.CREATE_QUOTE,
  dataQuote
});

const shipmentAction = {
  getHandleUnit,
  getLocationType,
  setShipmentDetail,
  setQuoteDetail,
  setQuoteDetailSort,
  setQuoteDetailLoadMore,
  createQuote
};

export default shipmentAction;
