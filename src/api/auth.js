import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const login = async (loginData, password) => api(API_URL.LOGIN,
  API_METHOD.POST,
  { login: loginData, password });

export const totalShipment = (token, countryCode) => api(`${API_URL.SHIPMENT}/total-shipment`, API_METHOD.GET, null, {
  countryCode
});

export const register = async (data) => api(API_URL.REGISTER,
  API_METHOD.POST,
  {
    first_name: data.firstName,
    last_name: data.lastName,
    password: data.password,
    email: data.email,
    phone: data.phone,
    country_code: data.country.cca2,
    referral_code: data.referralCode,
  });

export const resetPassword = async (loginData, password) => api(API_URL.LOGIN,
  API_METHOD.POST,
  { login: loginData, password });

export const checkVerificationCode = async (token, code) => api(API_URL.VERIFY_CODE, API_METHOD.POST, {
  sms_token: code,
}, {
  Authorization: token,
});

export const resendCode = async (token) => api(API_URL.RESEND_CODE, API_METHOD.POST, null, {
  Authorization: token,
});

export const requestResetLink = async (email, redirectURL) => {
  return api(API_URL.REQUEST_RESET_LINK, API_METHOD.POST, {
    login: email,
    forgot_password_redirect_url: redirectURL
  });
};

export const requestResetPassword = async (resetToken, password, confirmPassword) => {
  return api(API_URL.REQUEST_RESET_PASSWORD, API_METHOD.PUT, {
    reset_password_token: resetToken,
    password,
    password_confirmation: confirmPassword
  });
};

export const requestUpdatePhone = async (token, phone, countryCode) => {
  return api(API_URL.UPDATE_PROFILE, API_METHOD.PUT, {
    phone,
    country_code: countryCode
  }, {
    Authorization: token
  });
};

export const getAccounts = (token) => api(API_URL.GET_USERS, API_METHOD.GET, null, { Authorization: `Bearer ${token}` });

export const updateProfile = (data) => api(API_URL.UPDATE_PROFILE, API_METHOD.PUT, data);

export const changeAccount = (data) => api(API_URL.CHANGE_ACCOUNT, API_METHOD.POST, data);

export const updateUser = (data, token) => api(API_URL.USER_SYNC, API_METHOD.POST, {
  name: data.name,
  firstname: data.first_name,
  lastname: data.last_name,
  email: data.email,
  countrycode: data.country_code,
  phone: data.phone,
  referralcode: data.referral_code,
  avatarsquare: data.avatar_square,
  businessname: data.business_name,
  smsconfirmedat: data.sms_confirmed_at,
  linkadmin: data.link_admin,
  Role: data.Role || 1,
  referenceid: data.parentId || null
}, {
  Authorization: `Bearer ${token}`
});
