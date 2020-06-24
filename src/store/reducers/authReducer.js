import { AUTH_ACTION } from '../actionTypes';
import authState from '../states/authState';
import FirebaseHelper from '../../helpers/firebaseHelper';

const authReducer = (state = authState.initState, action) => {
  switch (action.type) {
    case AUTH_ACTION.CUSTOMER_LOGIN_SUCCESS:
      return {
        ...state,
        accounts: action.accounts,
        resLogin: action.result,
        token: action.result.access_token,
        accountsRender: action.accountsRender,
        totalShipment: action.totalShipment,
      };
    case AUTH_ACTION.CUSTOMER_LOGIN_FAILURE:
      return {
        ...state,
        resLogin: action.error.data,
      };

    case AUTH_ACTION.CUSTOMER_REGISTER:
      return {
        ...state,
        error: null,
        registerSuccess: null,
      };
    case AUTH_ACTION.CUSTOMER_REGISTER_SUCCESS:
      return {
        ...state,
        responseRegister: {
          ...state.responseRegister,
          ...action.result,
        },
      };
    case AUTH_ACTION.CUSTOMER_REGISTER_FAILURE:
      return {
        ...state,
        responseRegister: {
          ...state.responseRegister,
          ...action.error,
        },
      };
    case AUTH_ACTION.LOG_OUT:
      FirebaseHelper().logout();
      return {
        ...authState.initState
      };
    case AUTH_ACTION.VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        isVerifyCode: true,
      };
    case AUTH_ACTION.SELECT_ACCOUNT_SUCCESS:
      return {
        ...state,
        accountSelect: action.account,
        token: action.token,
        totalShipment: action.totalShipment
      };
    case AUTH_ACTION.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        accountSelect: action.account,
        accountsRender: action.accountsRender,
      };
    default:
      return state;
  }
};

export default authReducer;
