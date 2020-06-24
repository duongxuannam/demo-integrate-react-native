import {
  PAYMENT_ACTION,
} from '../actionTypes';

const getPaymentMethod = (shipmentId, callback) => ({
  type: PAYMENT_ACTION.GET_PAYMENT,
  shipmentId,
  callback,
});

const requestChangePaymentMethod = (shipmentId, method, callback) => ({
  type: PAYMENT_ACTION.REQUEST_CHANGE_PAYMENT_METHOD,
  shipmentId,
  method,
  callback,
});

const amendPaymentMethod = (shipmentId, callback) => ({
  type: PAYMENT_ACTION.AMEND_PAYMENT_METHOD,
  shipmentId,
  callback,
});

const uploadProofPaymentMethod = (shipmentId, photo, callback) => ({
  type: PAYMENT_ACTION.UPLOAD_PROOF_PAYMENT_METHOD,
  shipmentId,
  photo,
  callback,
});

const deleteProofPaymentMethod = (shipmentId, proofId, callback) => ({
  type: PAYMENT_ACTION.DELETE_PROOF_PAYMENT_METHOD,
  shipmentId,
  proofId,
  callback,
});

const confirmCompletedPayment = (shipmentId, callback) => ({
  type: PAYMENT_ACTION.COFIRM_COMPLETED_PAYMENT_METHOD,
  shipmentId,
  callback,
});

const paymentAction = {
  getPaymentMethod,
  requestChangePaymentMethod,
  amendPaymentMethod,
  uploadProofPaymentMethod,
  deleteProofPaymentMethod,
  confirmCompletedPayment,
};

export default paymentAction;
