/* eslint-disable import/no-cycle */
import { takeLatest, all, takeEvery } from 'redux-saga/effects';
import appSaga from './appSaga';
import authSaga from './authSaga';
import {
  AUTH_ACTION, APP_ACTION, LISTING_ACTION, PROGRESS_ACTION, NOTIFICATION_ACTION, PAYMENT_ACTION, COMMUNICATION_ACTION,
} from '../actionTypes';
import listingSaga from './listingSaga';
import progressSaga from './progressSaga';
import notificationSage from './notificationSaga';
import { PAYMENT_METHOD } from '../../constants/app';
import paymentSaga from './paymentSaga';
import communicationSaga from './communicationSaga';

function* handleLogin() {
  yield takeLatest(AUTH_ACTION.CUSTOMER_LOGIN,
    authSaga.handleLogin);
}

function* handleRegister() {
  yield takeLatest(AUTH_ACTION.CUSTOMER_REGISTER,
    authSaga.handleRegister);
}

function* handleVerifyCode() {
  yield takeLatest(AUTH_ACTION.VERIFICATION_CODE,
    authSaga.handleVerifyCode);
}

function* handleResendCode() {
  yield takeLatest(AUTH_ACTION.RESEND_CODE,
    authSaga.handleResendCode);
}

// APP
function* handleUpdateProfile() {
  yield takeLatest(AUTH_ACTION.UPDATE_PROFILE,
    authSaga.handleUpdateProfile);
}

function* handleChangeAccount() {
  yield takeLatest(AUTH_ACTION.SELECT_ACCOUNT, authSaga.handleChangeAccount);
}

function* handleRequestLink() {
  yield takeLatest(AUTH_ACTION.REQUEST_LINK_RESET,
    authSaga.handleRequestLink);
}

function* handleResetPassword() {
  yield takeLatest(AUTH_ACTION.RESET_PASSWORD,
    authSaga.handleResetPassword);
}

function* handleUpdatePhone() {
  yield takeLatest(AUTH_ACTION.REQUEST_UPDATE_PHONE, authSaga.handleUpdatePhone);
}

// LISTING SAGA
function* handleUnitsSaga() {
  yield takeLatest(LISTING_ACTION.GET_HANDLE_UNIT, listingSaga.getHandleUnitSaga);
}

function* handleTransportTypesSaga() {
  yield takeLatest(LISTING_ACTION.GET_TRANSPORT_TYPES, listingSaga.getTransportTypeSaga);
}

function* hanldeGetAddressData() {
  yield takeLatest(LISTING_ACTION.GET_ADDRESS_DATA, listingSaga.getAddressDataSaga);
}

function* handleAdditionalServiceSaga() {
  yield takeLatest(LISTING_ACTION.GET_ADDITIONAL_SERVICES, listingSaga.getAdditionalServiceSaga);
}

function* handleGetShipmentDetail() {
  yield takeLatest(LISTING_ACTION.GET_SHIPMENT_DETAILS, listingSaga.handleGetShipmentDetail);
}

function* handleGetListingItems() {
  yield takeLatest(LISTING_ACTION.GET_LISTING_ITEMS, listingSaga.handleGetShipmentDetail);
}

function* handleGetSummary() {
  yield takeLatest(LISTING_ACTION.GET_SUMMARY, listingSaga.handleGetSummary);
}

function* handleGetAddresses() {
  yield takeLatest(LISTING_ACTION.GET_ADDRESS, listingSaga.handleGetAddresses);
}

function* handleGetAdvert() {
  yield takeLatest(LISTING_ACTION.GET_ADVERT_DESCRIPTION, listingSaga.handleGetAdvert);
}

function* handleBookNow() {
  yield takeLatest(LISTING_ACTION.REQUEST_BOOK_NOW, listingSaga.handleBookNow);
}

// function* handleGetConfigQuote() {
//   yield takeLatest(LISTING_ACTION.GET_SUMMARY_SUCCESS, listingSaga.handleGetConfigQuote);
// }

function* handleSaveDraft() {
  yield takeLatest(LISTING_ACTION.LISTING_SAVE_DRAFT, listingSaga.saveDraftSaga);
}

function* handleGetQuote() {
  yield takeLatest(LISTING_ACTION.LISTING_ITEMS_GET_QUOTE, listingSaga.getQuoteSaga);
}

function* handleSaveListingItems() {
  yield takeLatest(LISTING_ACTION.SAVE_LISTING_ITEMS, listingSaga.handleSaveListingItems);
}

function* handleSaveListingAddress() {
  yield takeLatest(LISTING_ACTION.SAVE_LISTING_ITEMS_SUCCESS, listingSaga.handleSaveListingAddress);
}

function* handleUpdateShipment() {
  yield takeLatest(LISTING_ACTION.SAVE_LISTING_ADDRESS_SUCCESS, listingSaga.handleUpdateShipment);
}

function* handleGetHandleUnitDefault() {
  yield takeLatest(LISTING_ACTION.GET_HANDLE_UNIT_DEFAULT, listingSaga.handleGetHandleUnitDefault);
}

function* handleGetLocationTypesDefault() {
  yield takeLatest(LISTING_ACTION.GET_LOCATION_TYPES_DEFAULT, listingSaga.handleGetLocationTypesDefault);
}

function* handleGetAdditionalServicesDefault() {
  yield takeLatest(LISTING_ACTION.GET_ADDITIONAL_SERVICES_DEFAULT, listingSaga.handleGetAdditionalServicesDefault);
}

function* handleGetLocationServicesDefault() {
  yield takeLatest(LISTING_ACTION.GET_LOCATION_SERVICES_DEFAULT, listingSaga.handleGetLocationServicesDefault);
}

function* handleSend() {
  yield takeLatest(LISTING_ACTION.HANDLE_SEND, listingSaga.handleSend);
}

function* handleGetTransportTypesDefault() {
  yield takeLatest(LISTING_ACTION.GET_TRANSPORT_TYPES_DEFAULT, listingSaga.handleGetTransportTypesDefault);
}

function* handleGetDistanceMatrix() {
  yield takeLatest(LISTING_ACTION.GET_DISTANCE_MATRIX, listingSaga.handleGetDistanceMatrix);
}

function* handleSaveAddressAsDraft() {
  yield takeLatest(LISTING_ACTION.SAVE_ADDRESS_AS_DRAFT, listingSaga.handleSaveAddressAsDraft);
}

function* handleSaveAddressQuote() {
  yield takeLatest(LISTING_ACTION.SAVE_ADDRESS_QUOTE, listingSaga.handleSaveAddressQuote);
}

function* handleSaveStateAddress() {
  yield takeLatest(LISTING_ACTION.SAVE_STATE_ADDRESS, listingSaga.handleSaveStateAddress);
}

function* handleUpdateLanguage() {
  yield takeLatest(APP_ACTION.UPDATE_LANGUAGE, listingSaga.handleUpdateCountry);
}

function* handleSetEditing() {
  yield takeLatest(LISTING_ACTION.SET_EDITING, listingSaga.handleSetEditing);
}

function* handleUnListShipment() {
  yield takeLatest(LISTING_ACTION.UN_LIST, listingSaga.handleUnListShipment);
}

function* handleGetDeleteReasons() {
  yield takeLatest(LISTING_ACTION.GET_DELETE_REASON, listingSaga.handleGetDeleteReasons);
}

function* handleDeleteAll() {
  yield takeLatest(LISTING_ACTION.DELETE_ALL, listingSaga.handleDeleteAll);
}

function* handleDeleteRelated() {
  yield takeLatest(LISTING_ACTION.DELETE_RELATED, listingSaga.handleDeleteRelated);
}

function* handleUpdateBasicShipment() {
  yield takeLatest(LISTING_ACTION.UPDATE_BASIC_SHIPMENT, listingSaga.handleUpdateBasicShipment);
}

function* handleUploadPhotoShipment() {
  yield takeLatest(LISTING_ACTION.UPLOAD_PHOTO_SHIPMENT, listingSaga.handleUploadPhotoShipment);
}

function* handleDeletePhotoShipment() {
  yield takeLatest(LISTING_ACTION.DELETE_PHOTO_SHIPMENT, listingSaga.handleDeletePhotoShipment);
}

function* handleSetDataAddressUpdating() {
  yield takeLatest(LISTING_ACTION.SET_DATA_ADDRESS_UPDATING, listingSaga.handleSetDataAddressUpdating);
}

function* handleEditPickupAddress() {
  yield takeLatest(LISTING_ACTION.EDIT_PICKUP_ADDRESS, listingSaga.handleEditPickupAddress);
}

function* handleEditDestinationAddress() {
  yield takeLatest(LISTING_ACTION.EDIT_DESTINATION_ADDRESS, listingSaga.handleEditDestinationAddress);
}

function* handleAfterEditPickupAddress() {
  yield takeLatest(LISTING_ACTION.EDIT_PICKUP_ADDRESS_SUCCESS, listingSaga.handleAfterEditPickupAddress);
}

function* handleAfterEditDestinationAddress() {
  yield takeLatest(LISTING_ACTION.UPDATE_DESTINATION_SHIPMENT_DETAIL, listingSaga.handleAfterEditDestinationAddress);
}

function* handleGetAllSettingsAfterChangedCountry() {
  yield takeLatest([APP_ACTION.CHANGED_COUNTRY, AUTH_ACTION.CUSTOMER_LOGIN_SUCCESS, APP_ACTION.SET_APP_DATA], appSaga.handleGetConfigurationApp);
}

function* handleGetListShipments() {
  yield takeLatest(LISTING_ACTION.GET_LIST_SHIPMENTS, listingSaga.handleGetListShipments);
}

function* handleLoadMore() {
  yield takeLatest(LISTING_ACTION.SET_LOAD_MORE, listingSaga.handleSetDataForQueryLoadMore);
}

function* handleAcceptQuote() {
  yield takeLatest(LISTING_ACTION.ACCEPT_QUOTE, listingSaga.handleAcceptQuote);
}

function* handleRejectQuote() {
  yield takeLatest(LISTING_ACTION.REJECT_QUOTE, listingSaga.handleRejectQuote);
}

function* handleGetQuoteDetail() {
  yield takeLatest(LISTING_ACTION.GET_QUOTE_DETAIL, listingSaga.handleGetQuoteDetail);
}

function* handleGetReasonsRejectQuote() {
  yield takeLatest(LISTING_ACTION.GET_REASONS_REJECT_QUOTE, listingSaga.handleGetReasonsRejectQuote);
}

function* handleGetReasonsCancelBooking() {
  yield takeLatest(LISTING_ACTION.GET_REASONS_CANCEL_BOOKING, listingSaga.handleGetReasonsCancelBooking);
}

function* handleSetFieldForQuery() {
  yield takeLatest(LISTING_ACTION.SET_FIELD_QUERY, listingSaga.handleSetFieldForQuery);
}

function* handleSetDataForQuery() {
  yield takeLatest(LISTING_ACTION.SET_DATA_FOR_QUERY, listingSaga.handleSetDataForQuery);
}

function* handleFind() {
  yield takeLatest(LISTING_ACTION.HANDLE_FIND, listingSaga.handleSetDataForQuery);
}

function* handleGetProgress() {
  yield takeLatest(PROGRESS_ACTION.GET_PROGRESS, progressSaga.handleGetProgress);
}

function* handleUpdateProgress() {
  yield takeLatest(PROGRESS_ACTION.UPDATE_PROGRESS, progressSaga.handleUpdateProgress);
}

function* handleUploadProgressAttachment() {
  yield takeLatest(PROGRESS_ACTION.UPLOAD_PROGRESS_ATTACHMENT, progressSaga.handleUploadProgressAttachment);
}

function* handleUploadDispatchedAttachment() {
  yield takeLatest(PROGRESS_ACTION.UPLOAD_DISPATCHED_ATTACHMENT, progressSaga.handleUploadDispatchedAttachment);
}

function* handleDeleteProgressAttachment() {
  yield takeLatest(PROGRESS_ACTION.DELETE_PROGRESS_ATTACHMENT, progressSaga.handleDeleteProgressAttachment);
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

function* handleGetTotalUnreadNotification() {
  yield takeLatest(NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION, notificationSage.handleGetTotalUnreadNotification);
}

function* handleSetPinShipment() {
  yield takeLatest(LISTING_ACTION.SET_PIN, listingSaga.handleSetPin);
}

function* handleCancelBooking() {
  yield takeLatest(LISTING_ACTION.CANCEL_BOOKING, listingSaga.handleCancelBooking);
}

function* handleBookAgainShipment() {
  yield takeLatest(LISTING_ACTION.BOOK_AGAIN, listingSaga.handleBookAgainShipment);
}

function* handleRedirectManagementShipments() {
  yield takeLatest(LISTING_ACTION.REDIRECT_MANAGEMENT_SHIPMENTS, listingSaga.handleRedirectManagementShipments);
}

function* handleDeleteShipmentData() {
  yield takeLatest(LISTING_ACTION.DELETE_SHIPMENT_DATA, listingSaga.handleDeleteShipmentData);
}

function* handleGetPaymentMethod() {
  yield takeLatest(PAYMENT_ACTION.GET_PAYMENT, paymentSaga.handleGetPaymentMethod);
}

function* handleRequestChangePaymentMethod() {
  yield takeLatest(PAYMENT_ACTION.REQUEST_CHANGE_PAYMENT_METHOD, paymentSaga.handleRequestChangePaymentMethod);
}

function* handleUploadProofPaymentMethod() {
  yield takeLatest(PAYMENT_ACTION.UPLOAD_PROOF_PAYMENT_METHOD, paymentSaga.handleUploadProofPaymentMethod);
}

function* handleDeleteProofPaymentMethod() {
  yield takeLatest(PAYMENT_ACTION.DELETE_PROOF_PAYMENT_METHOD, paymentSaga.handleDeleteProofPaymentMethod);
}

function* handleAmendChangePaymentMethod() {
  yield takeLatest(PAYMENT_ACTION.AMEND_PAYMENT_METHOD, paymentSaga.handleAmendChangePaymentMethod);
}

function* handleConnectionFirebase() {
  yield takeLatest(COMMUNICATION_ACTION.CREATE_CONNECTION_CHAT, communicationSaga.createFirebaseConnection);
}

function* handleSendAttachment() {
  yield takeLatest(COMMUNICATION_ACTION.SEND_ATTACHMENT, communicationSaga.handleSendAttachment);
}

function* handleDownloadData() {
  yield takeLatest(COMMUNICATION_ACTION.DOWNLOAD_DATA, communicationSaga.handleDownloadData);
}

function* handleConfirmPaymentCompleted() {
  yield takeLatest(PAYMENT_ACTION.COFIRM_COMPLETED_PAYMENT_METHOD, paymentSaga.handleConfirmPaymentCompleted);
}

function* handleUpdateShipmentChat() {
  yield takeLatest(COMMUNICATION_ACTION.UPDATE_SHIPMENT_CHAT, communicationSaga.handleUpdateShipmentChat);
}

function* handleLoginFirebase() {
  yield takeLatest(COMMUNICATION_ACTION.LOGIN_FIREBASE, communicationSaga.handleLoginFirebase);
}

function* handleDriverLogout() {
  yield takeLatest(AUTH_ACTION.LOG_OUT, communicationSaga.handleLogOutFireBase);
}

function* handleChangeAccountFireBase() {
  yield takeLatest(COMMUNICATION_ACTION.LOGOUT_FIREBASE, communicationSaga.handleLogOutFireBase);
}

function* handleSetSourceChatOff() {
  yield takeEvery(COMMUNICATION_ACTION.SET_SOURCE_CHAT_OFF, communicationSaga.handleSetSourceChatOff);
}

function* handleDiscardListingDraft() {
  yield takeEvery(LISTING_ACTION.LISTING_DISCARD_DRAFT, listingSaga.handleRedirectManagementShipments);
}

export default function* rootSaga() {
  yield all([
    handleLogin(),
    handleRegister(),
    handleVerifyCode(),
    handleResendCode(),
    handleUpdateProfile(),
    handleChangeAccount(),
    handleResetPassword(),
    handleRequestLink(),
    handleUpdatePhone(),
    handleBookNow(),
    handleUpdateLanguage(),
    // handleGetAccountAfterLogin(),
    // LISTING
    handleGetAdvert(),
    handleUnitsSaga(),
    handleTransportTypesSaga(),
    hanldeGetAddressData(),
    handleAdditionalServiceSaga(),
    handleGetShipmentDetail(),
    handleGetListingItems(),
    handleGetSummary(),
    handleGetAddresses(),
    handleUpdateShipment(),
    handleSaveDraft(),
    handleGetQuote(),
    handleGetDistanceMatrix(),
    handleSaveListingItems(),
    handleSaveListingAddress(),
    handleGetHandleUnitDefault(),
    handleGetAdditionalServicesDefault(),
    handleGetLocationServicesDefault(),
    handleSend(),
    handleGetTransportTypesDefault(),
    handleSaveAddressAsDraft(),
    handleSaveAddressQuote(),
    handleSaveStateAddress(),
    handleSetEditing(),
    handleGetLocationTypesDefault(),
    handleUnListShipment(),
    handleGetDeleteReasons(),
    handleDeleteAll(),
    handleDeleteRelated(),
    handleUpdateBasicShipment(),
    handleUploadPhotoShipment(),
    handleDeletePhotoShipment(),
    handleSetDataAddressUpdating(),
    handleEditPickupAddress(),
    handleAfterEditPickupAddress(),
    handleEditDestinationAddress(),
    handleAfterEditDestinationAddress(),
    handleGetAllSettingsAfterChangedCountry(),
    handleGetListShipments(),
    handleLoadMore(),
    handleAcceptQuote(),
    handleRejectQuote(),
    handleGetQuoteDetail(),
    handleGetReasonsRejectQuote(),
    handleSetFieldForQuery(),
    handleSetDataForQuery(),
    handleFind(),
    handleGetProgress(),
    handleUpdateProgress(),
    handleUploadProgressAttachment(),
    handleUploadDispatchedAttachment(),
    handleDeleteProgressAttachment(),
    handleDiscardListingDraft(),
    // NOTIFICATION
    handleGetNotification(),
    handleGetNotificationLoadMore(),
    handleGetNotificationDetail(),
    handleMarkAsReadNotification(),
    handleGetTotalUnreadNotification(),
    handleSetPinShipment(),
    handleCancelBooking(),
    handleBookAgainShipment(),
    handleRedirectManagementShipments(),
    handleGetPaymentMethod(),
    handleRequestChangePaymentMethod(),
    handleUploadProofPaymentMethod(),
    handleAmendChangePaymentMethod(),
    handleDeleteProofPaymentMethod(),
    handleDeleteShipmentData(),
    // COMMUNICATION
    handleConnectionFirebase(),
    handleSendAttachment(),
    handleDownloadData(),
    handleConfirmPaymentCompleted(),
    handleUpdateShipmentChat(),
    handleLoginFirebase(),
    handleDriverLogout(),
    handleChangeAccountFireBase(),
    handleGetReasonsCancelBooking(),
    handleSetSourceChatOff(),
  ]);
}
