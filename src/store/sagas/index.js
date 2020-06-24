/* eslint-disable import/no-cycle */
import { takeLatest, takeEvery, all } from 'redux-saga/effects';
import { SHIPMENT_ACTION, DRIVER_ACTION, AUTH_ACTION, PROGRESS_ACTION, CONFIG_ACTION, NOTIFICATION_ACTION, PAYMENT_ACTION, CHAT_ACTION } from '../actionTypes';
import shipmentSaga from './shipmentSaga';
import driverSaga from './driverSaga';
import authSaga from './authSaga';
import progressSaga from './progressSaga';
import configSaga from './configSaga';
import notificationSage from './notificationSaga';
import paymentSaga from './paymentSaga';
import chatSaga from './chatSaga';
import { NOTIFICATION_TYPE } from '../../constants/app';

// LISTING SAGA
function* handleGetHandleUnits() {
  yield takeLatest(SHIPMENT_ACTION.GET_HANDLE_UNIT, shipmentSaga.getHandleUnitSaga);
}

function* handleGetLocationTypes() {
  yield takeLatest(SHIPMENT_ACTION.GET_LOCATION_TYPE, shipmentSaga.getLocationTypes);
}
// Pickup
function* handleSetDataRootPickup() {
  yield takeLatest(DRIVER_ACTION.SET_DATA_ROOT_PICKUP, driverSaga.handleSetDataRootPickup);
}

function* handleSetDataAnotherPickup() {
  yield takeLatest(DRIVER_ACTION.SET_DATA_ANOTHER_PICKUP, driverSaga.handleSetDataAnotherPickup);
}

function* handleRemovePickupAddress() {
  yield takeLatest(DRIVER_ACTION.REMOVE_PICKUP_ADDRESS, driverSaga.handleRemovePickupAddress);
}
// Delivery
function* handleSetDataRootDelivery() {
  yield takeLatest(DRIVER_ACTION.SET_DATA_ROOT_DELIVERY, driverSaga.handleSetDataRootDelivery);
}

function* handleSetDataAnotherDelivery() {
  yield takeLatest(DRIVER_ACTION.SET_DATA_ANOTHER_DELIVERY, driverSaga.handleSetDataAnotherDelivery);
}

function* handleRemoveDeliveryAddress() {
  yield takeLatest(DRIVER_ACTION.REMOVE_DELIVERY_ADDRESS, driverSaga.handleRemoveDeliveryAddress);
}

function* handleSetRadius() {
  yield takeLatest(DRIVER_ACTION.SET_RADIUS_FOR_ADDRESS, driverSaga.handleSetRadius);
}

function* handleSetDataForQuery() {
  yield takeLatest([DRIVER_ACTION.SET_COORS_ADDRESS_SUCCESS, DRIVER_ACTION.SET_DATA_FOR_QUERY], driverSaga.handleSetDataForQuery);
}

function* handleSetFieldForQuery() {
  yield takeLatest(DRIVER_ACTION.SET_FIELD_QUERY, driverSaga.handleSetFieldForQuery);
}

function* handleSetFieldForQueryLoadMore() {
  yield takeLatest(DRIVER_ACTION.SET_LOAD_MORE, driverSaga.handleSetDataForQueryLoadMore);
}

function* handleSetPinShipment() {
  yield takeLatest(DRIVER_ACTION.SET_PIN, driverSaga.handleSetPin);
}

function* handleGetTopLowestBid() {
  yield takeLatest(DRIVER_ACTION.GET_TOP_LOWEST_BID, driverSaga.handleGetTopLowestBid);
}

function* handleSetShipmentDetail() {
  yield takeLatest(SHIPMENT_ACTION.SET_SHIPMENT_DETAILS, shipmentSaga.handleSetShipmentDetail);
}

function* handleCreateQuoteSaga() {
  yield takeLatest(SHIPMENT_ACTION.CREATE_QUOTE, shipmentSaga.handleCreateQuote);
}

function* handleLoginSaga() {
  yield takeLatest(AUTH_ACTION.DRIVER_LOGIN, authSaga.handleLogin);
}

function* handleSetQuoteDetail() {
  yield takeLatest(SHIPMENT_ACTION.SET_QUOTE_DETAIL, shipmentSaga.handleSetQuoteDetail);
}

function* handleSetQuoteDetailLoadMore() {
  yield takeLatest(SHIPMENT_ACTION.SET_LOAD_MORE_QUOTE_DETAIL, shipmentSaga.handleSetQuoteDetailLoadMore);
}

function* handleGetProgress() {
  yield takeLatest(PROGRESS_ACTION.GET_PROGRESS, progressSaga.handleGetProgress);
}

function* handleUpdateProgress() {
  yield takeLatest(PROGRESS_ACTION.UPDATE_PROGRESS, progressSaga.handleUpdateProgress);
}

function* handleGetConfigSetting() {
  yield takeLatest(CONFIG_ACTION.GET_CONFIG_SETTING, configSaga.getConfigSettingByCountCode);
}

function* handleUploadPhotoProgress() {
  yield takeLatest(PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO, progressSaga.handleUploadPhotoProgress);
}

function* handleRemovePhotoProgress() {
  yield takeEvery(PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO, progressSaga.handleRemovePhotoProgress);
}

function* handleUpdateAddressProgress() {
  yield takeEvery(PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION, progressSaga.handleUpdateAddressProgress);
}

function* handleSetCoorAddress() {
  yield takeEvery(DRIVER_ACTION.SET_COORS_ADDRESS, driverSaga.handleSetCoorAddress);
}

function* handleGetNotification() {
  yield takeLatest(NOTIFICATION_ACTION.GET_NOTIFICATION, notificationSage.handleGetNotification);
}

function* handleGetNotificationLoadMore() {
  yield takeLatest(NOTIFICATION_ACTION.GET_NOTIFICATION_LOAD_MORE, notificationSage.handleGetNotificationLoadMore);
}

function* handleGetNotificationDetail() {
  yield takeLatest(NOTIFICATION_ACTION.GET_NOTIFICATION_DETAIL, notificationSage.handleGetNotificationDetail);
}

function* handleMarkAsReadNotification() {
  yield takeLatest(NOTIFICATION_ACTION.MARK_AS_READ_NOTIFICATION, notificationSage.handleMarkAsReadNotification);
}

function* handleGetTotalStatusFilter() {
  yield takeLatest(DRIVER_ACTION.GET_TOTAL_STATUS_FILTER, driverSaga.handleGetTotalStatusFilter);
}

function* handleGetTotalUnreadNotification() {
  yield takeLatest(NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION, notificationSage.handleGetTotalUnreadNotification);
}

function* handleGetPaymentInformation() {
  yield takeLatest(PAYMENT_ACTION.GET_PAYMENT_INFORMATION, paymentSaga.handleGetPaymentInformation);
}

function* handleUpdateBankInstructions() {
  yield takeLatest(PAYMENT_ACTION.UPDATE_BANK_INSTRUCTIONS, paymentSaga.handleUpdateBankInstructions);
}

function* handlePaymentRequestChange() {
  yield takeLatest(PAYMENT_ACTION.PAYMENT_REQUEST_CHANGE, paymentSaga.handlePaymentRequestChange);
}

function* handleDownloadData() {
  yield takeLatest(PAYMENT_ACTION.DOWNLOAD_DATA, paymentSaga.handleDownloadData);
}

function* handleSendChatAttachment() {
  yield takeLatest(CHAT_ACTION.SEND_ATTACHMENT, chatSaga.handleSendAttachment);
}

function* handleGetCustomerInfoCommunication() {
  yield takeLatest(CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION, chatSaga.handleGetCustomerInfoCommunication);
}

function* handleGetSourceChat() {
  yield takeEvery(CHAT_ACTION.SET_SOURCE_CHAT, chatSaga.handleGetSourceChat);
}

function* handleLoginFirebase() {
  yield takeLatest(CHAT_ACTION.LOGIN_FIREBASE, chatSaga.handleLoginFirebase);
}

function* handleUpdateShipmentChat() {
  yield takeLatest(CHAT_ACTION.UPDATE_SHIPMENT_CHAT, chatSaga.handleUpdateShipmentChat);
}

function* handleDriverLogout() {
  yield takeLatest(AUTH_ACTION.LOG_OUT, chatSaga.handleLogOutFireBase);
}

function* handleSetSourceChatOff() {
  yield takeEvery(CHAT_ACTION.SET_SOURCE_CHAT_OFF, chatSaga.handleSetSourceChatOff);
}

export default function* rootSaga() {
  yield all([
    handleGetHandleUnits(),
    handleGetLocationTypes(),
    handleSetDataRootPickup(),
    handleSetDataForQuery(),
    handleSetDataAnotherPickup(),
    handleRemovePickupAddress(),
    handleSetFieldForQuery(),
    handleSetDataRootDelivery(),
    handleSetDataAnotherDelivery(),
    handleRemoveDeliveryAddress(),
    handleSetRadius(),
    handleSetFieldForQueryLoadMore(),
    handleSetPinShipment(),
    handleSetShipmentDetail(),
    handleLoginSaga(),
    handleCreateQuoteSaga(),
    handleSetQuoteDetail(),
    handleSetQuoteDetailLoadMore(),
    handleGetConfigSetting(),
    handleGetTotalStatusFilter(),
    // PROGRESS
    handleGetProgress(),
    handleUpdateProgress(),
    handleUploadPhotoProgress(),
    handleRemovePhotoProgress(),
    handleUpdateAddressProgress(),
    handleGetTopLowestBid(),
    handleSetCoorAddress(),
    // NOTIFICATION
    handleGetNotification(),
    handleGetNotificationLoadMore(),
    handleGetNotificationDetail(),
    handleMarkAsReadNotification(),
    handleGetTotalUnreadNotification(),
    // PAYMENT
    handleGetPaymentInformation(),
    handleUpdateBankInstructions(),
    handlePaymentRequestChange(),
    handleDownloadData(),
    // CHAT
    handleSendChatAttachment(),
    handleGetCustomerInfoCommunication(),
    handleGetSourceChat(),
    handleUpdateShipmentChat(),
    handleLoginFirebase(),
    handleDriverLogout(),
    handleSetSourceChatOff(),
  ]);
}
