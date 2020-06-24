import {
  AUTH_ACTION,
} from '../actionTypes';

const login = (email, password) => ({
  type: AUTH_ACTION.CUSTOMER_LOGIN,
  payload: {
    email,
    password,
  },
});

const register = (data, callback) => ({
  type: AUTH_ACTION.CUSTOMER_REGISTER,
  payload: data,
  callback,
});

const verifyCode = (data, callback) => ({
  type: AUTH_ACTION.VERIFICATION_CODE,
  payload: data,
  callback,
});

const resendCode = (accessToken, callback) => ({
  type: AUTH_ACTION.RESEND_CODE,
  accessToken,
  callback,
});

const resetPassword = (data, callback) => ({
  type: AUTH_ACTION.RESET_PASSWORD,
  payload: data,
  callback
});

const requestLinkReset = (data, callback) => ({
  type: AUTH_ACTION.REQUEST_LINK_RESET,
  payload: data,
  callback,
});

const signOut = () => ({
  type: AUTH_ACTION.LOG_OUT,
});

const updatePhone = (data, callback) => ({
  type: AUTH_ACTION.REQUEST_UPDATE_PHONE,
  payload: data,
  callback,
});

const requestUpdateProfile = (data, accountsRender) => ({
  type: AUTH_ACTION.UPDATE_PROFILE,
  data,
  accountsRender,
});

const selectAccount = (accountSelect) => ({
  type: AUTH_ACTION.SELECT_ACCOUNT,
  data: accountSelect,
});

const authAction = {
  login,
  register,
  verifyCode,
  resendCode,
  resetPassword,
  requestLinkReset,
  signOut,
  updatePhone,
  requestUpdateProfile,
  selectAccount
};

export default authAction;
