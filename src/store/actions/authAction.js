import {
  AUTH_ACTION,
} from '../actionTypes';

const login = (countryCode, phoneNumber, password) => ({
  type: AUTH_ACTION.DRIVER_LOGIN,
  payload: {
    countryCode,
    phoneNumber,
    password,
  },
});

const signOut = () => ({
  type: AUTH_ACTION.LOG_OUT,
});

const authAction = {
  login,
  signOut,
};

export default authAction;
