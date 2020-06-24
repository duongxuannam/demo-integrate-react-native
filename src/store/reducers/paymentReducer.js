import { PAYMENT_ACTION } from '../actionTypes';
import paymentState from '../states/paymentState';

const paymentReducer = (state = paymentState.initState, action) => {
  switch (action.type) {
    case PAYMENT_ACTION.GET_PAYMENT_INFORMATION_SUCCESS:
      return {
        ...state,
        data: action.data,
      };
    case PAYMENT_ACTION.PAYMENT_REQUEST_CHANGE_SUCCESS:
      return {
        ...state,
        ...paymentState.updatePaymentRequestChange(state, action.option)
      };
    case PAYMENT_ACTION.UPDATE_BANK_INSTRUCTIONS_SUCCESS:
      return {
        ...state,
        ...paymentState.updatePaymentBankInfo(state, action.data)
      };
    default:
      return state;
  }
};

export default paymentReducer;
