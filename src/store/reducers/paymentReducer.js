import { PAYMENT_ACTION } from '../actionTypes';
import paymentState from '../states/paymentState';
import { PAYMENT_STATUS } from '../../constants/app';

const paymentReducer = (state = paymentState.initState, action) => {
  switch (action.type) {
    case PAYMENT_ACTION.GET_PAYMENT_SUCCESS:
      return {
        ...state,
        data: action.payment
      };
    case PAYMENT_ACTION.REQUEST_CHANGE_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        data: action.payment
      };
    case PAYMENT_ACTION.AMEND_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          requestChange: null
        }
      };
    case PAYMENT_ACTION.UPLOAD_PROOF_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          paymentProofs: [
            ...state.data.paymentProofs,
            action.proofs,
          ]
        }
      };
    case PAYMENT_ACTION.DELETE_PROOF_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          paymentProofs: state.data.paymentProofs.filter((proof) => proof.fileName !== action.proofId)
        }
      };
    case PAYMENT_ACTION.COFIRM_COMPLETED_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          requestChange: null,
          paymentStatus: PAYMENT_STATUS.COMPLETED
        }
      };
    default:
      return state;
  }
};

export default paymentReducer;
