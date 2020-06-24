import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const requestLogin = (phone, countryCode, password) => api(API_URL.LOGIN, API_METHOD.POST, {
  country_code: countryCode,
  phone,
  password
});

export const updateUser = (token) => api(API_URL.USER_SYNC, API_METHOD.POST, {}, {
  Authorization: `Bearer ${token}`
});
