import { PAYMENT_ACTION } from '../actionTypes';

const getPaymentInformation = (shipmentId) => ({
  type: PAYMENT_ACTION.GET_PAYMENT_INFORMATION,
  shipmentId
});

const updateBankInstructions = (shipmentId, param = {}) => ({
  type: PAYMENT_ACTION.UPDATE_BANK_INSTRUCTIONS,
  shipmentId,
  param
});

const paymentRequestChange = (shipmentId, option = true) => ({
  type: PAYMENT_ACTION.PAYMENT_REQUEST_CHANGE,
  shipmentId,
  option
});

const downloadData = (itemDownload, message, isChat = false) => ({
  type: PAYMENT_ACTION.DOWNLOAD_DATA,
  itemDownload,
  message,
  isChat,
});

const paymentAction = {
  getPaymentInformation,
  updateBankInstructions,
  paymentRequestChange,
  downloadData,
};

export default paymentAction;
