import { LISTING_ACTION, APP_ACTION } from '../actionTypes';

const getHandleUnit = () => ({
  type: LISTING_ACTION.GET_HANDLE_UNIT,
});

const getHandleUnitDefault = () => ({
  type: LISTING_ACTION.GET_HANDLE_UNIT_DEFAULT,
});

const getLocationTypesDefault = () => ({
  type: LISTING_ACTION.GET_LOCATION_TYPES_DEFAULT,
});

const getAdditionalServicesDefault = () => ({
  type: LISTING_ACTION.GET_ADDITIONAL_SERVICES_DEFAULT,
});

const getLocationServicesDefault = () => ({
  type: LISTING_ACTION.GET_LOCATION_SERVICES_DEFAULT,
});

const getTransportTypes = () => ({
  type: LISTING_ACTION.GET_TRANSPORT_TYPES,
});

const getTransportTypesDefault = () => ({
  type: LISTING_ACTION.GET_TRANSPORT_TYPES_DEFAULT,
});

const getShipmentDetails = (shipmentId, noConfirm = false, countryCode, isDraftShipment = false, getSourceChat = true) => ({
  type: LISTING_ACTION.GET_SHIPMENT_DETAILS,
  shipmentId,
  noConfirm,
  countryCode,
  isDraftShipment,
  getSourceChat,
});

const getListingItems = (shipmentId) => ({
  type: LISTING_ACTION.GET_LISTING_ITEMS,
  shipmentId,
});

const getSummary = (shipmentId, callback) => ({
  type: LISTING_ACTION.GET_SUMMARY,
  shipmentId,
  callback,
});

const getAddresses = (shipmentId) => ({
  type: LISTING_ACTION.GET_ADDRESS,
  shipmentId,
});


const getAdvertDescription = (countryName) => ({
  type: LISTING_ACTION.GET_ADVERT_DESCRIPTION,
  countryName,
});

const requestBookNow = (quoteId) => ({
  type: LISTING_ACTION.REQUEST_BOOK_NOW,
  quoteId,
});

const createQuotes = (countryName) => ({
  type: LISTING_ACTION.CREATE_QUOTE,
  countryName,
});

const getAddressData = () => ({
  type: LISTING_ACTION.GET_ADDRESS_DATA,
});

const getAdditionalServices = () => ({
  type: LISTING_ACTION.GET_ADDITIONAL_SERVICES,
});

const callSaveDraft = (isLoggedin, itemInfoListing, isSwitchCountry, callback) => ({
  type: LISTING_ACTION.LISTING_SAVE_DRAFT,
  isLoggedin,
  itemInfoListing,
  isSwitchCountry,
  callback,
});

const callGetQuoteWithoutLoggedIn = (item) => ({
  type: LISTING_ACTION.SET_TEMP_GET_QUOTE,
  item,
});

const callGetQuote = (itemList) => ({
  type: LISTING_ACTION.LISTING_ITEMS_GET_QUOTE,
  itemList,
});

const getDistanceMatrix = (data) => ({
  type: LISTING_ACTION.GET_DISTANCE_MATRIX,
  data,
});

const updatePickupAddress = (pickupAddress) => ({
  type: LISTING_ACTION.UPDATE_PICKUP_ADDRESS,
  payload: { pickupAddress },
});

const updateDestinationAddress = (destinationAddress) => ({
  type: LISTING_ACTION.UPDATE_DESTINATION_ADDRESS,
  payload: { destinationAddress },
});

const saveListingItems = (listingItems, targetPrice, unitPrice) => ({
  type: LISTING_ACTION.SAVE_LISTING_ITEMS,
  listingItems,
  targetPrice,
  unitPrice,
});

const handleSend = (isRefresh = false) => ({
  type: LISTING_ACTION.HANDLE_SEND,
  isRefresh
});

const redirectManagementShipments = () => ({
  type: LISTING_ACTION.REDIRECT_MANAGEMENT_SHIPMENTS,
});

const setTitleShipment = (title, titleShort, totalWeight) => ({
  type: LISTING_ACTION.SET_TITLE_SHIPMENT,
  titleShipment: title,
  titleShort,
  totalWeight,
});

const saveListingAddress = (listingAddress) => ({
  type: LISTING_ACTION.SAVE_LISTING_ADDRESS,
  listingAddress,
});

const clearShipmentData = () => ({
  type: LISTING_ACTION.SET_TEMP_BOOKING,
  itemInfoListing: [],
});

const saveAddressAsDraft = (addressData, infoData = null, isSwitchCountry, callback = () => {}) => ({
  type: LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT,
  addressData,
  infoData,
  isSwitchCountry,
  callback,
});

const saveAddressQuote = (addressData) => ({
  type: LISTING_ACTION.SAVE_ADDRESS_QUOTE,
  addressData,
});

const saveStateAddress = (tempAddress) => ({
  type: LISTING_ACTION.SAVE_STATE_ADDRESS,
  payload: { tempAddress },
});

const updatePickupDate = (pickupDate) => ({
  type: LISTING_ACTION.UPDATE_PICKUP_DATE,
  payload: { pickupDate },
});


const updateSwitchCountry = () => ({
  type: APP_ACTION.CHANGED_COUNTRY,
});

const editShipmentStatus = () => ({
  type: LISTING_ACTION.SET_EDITING,
});

const unListShipment = (callback) => ({
  type: LISTING_ACTION.UN_LIST,
  callback,
});

const deleteAll = (shipmentId, reasons, callback) => ({
  type: LISTING_ACTION.DELETE_ALL,
  shipmentId,
  reasons,
  callback,
});

const deleteRelated = (shipmentId, reasons, callback) => ({
  type: LISTING_ACTION.DELETE_RELATED,
  shipmentId,
  reasons,
  callback,
});

const getDeleteReasons = () => ({
  type: LISTING_ACTION.GET_DELETE_REASON,
});

const updateBasicShipment = (shipmentId, fieldsUpdate, callback) => ({
  type: LISTING_ACTION.UPDATE_BASIC_SHIPMENT,
  shipmentId,
  fieldsUpdate,
  callback,
});

const uploadPhotoShipment = (shipmentId, files) => ({
  type: LISTING_ACTION.UPLOAD_PHOTO_SHIPMENT,
  files,
  shipmentId,
});

const deletePhotoShipment = (photoId) => ({
  type: LISTING_ACTION.DELETE_PHOTO_SHIPMENT,
  photoId,
});

const updatingAddress = (address) => ({
  type: LISTING_ACTION.UPDATING_ADDRESS,
  address,
});

const setAddressDataUpdating = (payload, index, callback = null) => ({
  type: LISTING_ACTION.SET_DATA_ADDRESS_UPDATING,
  payload,
  index,
  callback,
});

const removeAddressPhoto = (photoId, callback = null) => ({
  type: LISTING_ACTION.REMOVE_ADDRESS_PHOTO,
  photoId,
  callback,
});

const updateStatusUpdatingAddress = () => ({
  type: LISTING_ACTION.UPDATE_STATUS_ADDRESS_UPDATING,
});

const editPickupAddress = (id, body, lat, long, callback = null) => ({
  type: LISTING_ACTION.EDIT_PICKUP_ADDRESS,
  id,
  body,
  lat,
  long,
  callback,
});

const editDestinationAddress = (id, body, lat, long, callback = null) => ({
  type: LISTING_ACTION.EDIT_DESTINATION_ADDRESS,
  id,
  body,
  lat,
  long,
  callback,
});

const setPhotoRemove = (photo, index) => ({
  type: LISTING_ACTION.SET_PHOTO_REMOVE,
  photo,
  index,
});

const editingRemoveItem = (item) => ({
  type: LISTING_ACTION.EDITING_REMOVE_ITEM,
  item,
});

const editingAddItem = (item) => ({
  type: LISTING_ACTION.EDITING_ADD_ITEM,
  item,
});

const editingDuplicateItem = (item) => ({
  type: LISTING_ACTION.EDITING_DUPLICATE_ITEM,
  item,
});

const editingRemoveAddress = (item) => ({
  type: LISTING_ACTION.EDITING_REMOVE_ADDRESS,
  item,
});

const editingAddAddress = (item) => ({
  type: LISTING_ACTION.EDITING_ADD_ADDRESS,
  item,
});

const editingDuplicateAddress = (item) => ({
  type: LISTING_ACTION.EDITING_DUPLICATE_ADDRESS,
  item,
});

const getListShipments = (query) => ({
  type: LISTING_ACTION.GET_LIST_SHIPMENTS,
  query,
});

const loadMoreAction = (query) => ({
  type: LISTING_ACTION.SET_LOAD_MORE,
  query,
});

const acceptQuote = (quoteId, shipmentId, paymentMethod, callback) => ({
  type: LISTING_ACTION.ACCEPT_QUOTE,
  quoteId,
  shipmentId,
  paymentMethod,
  callback,
});

const rejectQuote = (quoteId, reasonId, shipmentId, callback) => ({
  type: LISTING_ACTION.REJECT_QUOTE,
  quoteId,
  reasonId,
  callback,
  shipmentId,
});

const getQuoteDetail = (query, callback = () => {}) => ({
  type: LISTING_ACTION.GET_QUOTE_DETAIL,
  query,
  callback,
});

const getReasonRejectQuote = () => ({
  type: LISTING_ACTION.GET_REASONS_REJECT_QUOTE,
});

const getReasonCancelBooking = () => ({
  type: LISTING_ACTION.GET_REASONS_CANCEL_BOOKING,
});

const setFieldQuery = (data) => ({
  type: LISTING_ACTION.SET_FIELD_QUERY,
  data,
});

const setCurrentStep = (step) => ({
  type: LISTING_ACTION.SET_CURRENT_STEP,
  step,
});

const setPinAction = (shipmentId, pinStatus) => ({
  type: LISTING_ACTION.SET_PIN,
  shipmentId,
  pinStatus
});

const cancelBooking = (shipmentId, reasons, callback) => ({
  type: LISTING_ACTION.CANCEL_BOOKING,
  shipmentId,
  reasons,
  callback,
});

const bookAgainShipment = (shipmentId) => ({
  type: LISTING_ACTION.BOOK_AGAIN,
  shipmentId,
});

const deleteShipmentData = (shipmentId, body, dataDelete, transportTypeId) => ({
  type: LISTING_ACTION.DELETE_SHIPMENT_DATA,
  shipmentId,
  body,
  dataDelete,
  transportTypeId,
});

const updateDraftItems = (items, typeUpdate) => ({
  type: LISTING_ACTION.UPDATE_DRAFT_ITEMS,
  items,
  typeUpdate,
});

const updateDraftAddress = (address, typeUpdate) => ({
  type: LISTING_ACTION.UPDATE_DRAFT_ADDRESS,
  address,
  typeUpdate,
});

const setTransportTypeId = (transportTypeId) => ({
  type: LISTING_ACTION.SET_TRANSPORT_TYPE_ID,
  transportTypeId,
});

const discardListingDraft = () => ({
  type: LISTING_ACTION.LISTING_DISCARD_DRAFT,
});

const listingAction = {
  getHandleUnit,
  getTransportTypes,
  getAddressData,
  getAdditionalServices,
  callSaveDraft,
  getAdvertDescription,
  requestBookNow,
  getShipmentDetails,
  getListingItems,
  getSummary,
  getAddresses,
  createQuotes,
  callGetQuoteWithoutLoggedIn,
  callGetQuote,
  getDistanceMatrix,
  updatePickupAddress,
  updateDestinationAddress,
  saveListingItems,
  getHandleUnitDefault,
  getAdditionalServicesDefault,
  getLocationServicesDefault,
  handleSend,
  setTitleShipment,
  saveListingAddress,
  clearShipmentData,
  getTransportTypesDefault,
  saveAddressAsDraft,
  saveAddressQuote,
  saveStateAddress,
  updatePickupDate,
  updateSwitchCountry,
  editShipmentStatus,
  getLocationTypesDefault,
  unListShipment,
  getDeleteReasons,
  deleteAll,
  deleteRelated,
  updateBasicShipment,
  uploadPhotoShipment,
  updatingAddress,
  deletePhotoShipment,
  setAddressDataUpdating,
  removeAddressPhoto,
  updateStatusUpdatingAddress,
  editPickupAddress,
  setPhotoRemove,
  editingRemoveItem,
  editingAddItem,
  editingDuplicateItem,
  editingRemoveAddress,
  editingAddAddress,
  editingDuplicateAddress,
  editDestinationAddress,
  getListShipments,
  loadMoreAction,
  acceptQuote,
  rejectQuote,
  getQuoteDetail,
  getReasonRejectQuote,
  setFieldQuery,
  redirectManagementShipments,
  setCurrentStep,
  setPinAction,
  cancelBooking,
  bookAgainShipment,
  deleteShipmentData,
  updateDraftItems,
  updateDraftAddress,
  setTransportTypeId,
  getReasonCancelBooking,
  discardListingDraft,
};

export default listingAction;
