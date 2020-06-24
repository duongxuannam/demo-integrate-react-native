import { AsyncStorage } from 'react-native';
import axios from 'axios';
import axiosInstance from './axios';
import API_URL, { API_CONTENT_MODE } from '../constants/apiUrl';
import SYSTEM_POPUP from '../constants/systemErrorType';

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        return axios(originalRequest);
      }
      return Promise.reject(error);
    } catch (e) {
      // console.log("session has expired")
      // store.dispatch(navLogout())
      return Promise.reject(error);
    }
  }
);

export class ApiError extends Error {
  status = null;

  data = null;

  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }

  getErrorMessage() {
    if (this.message && this.message) {
      return this.message;
    }

    if (this.data && this.data.errors) {
      return this.data.errors.message || '';
    }

    return '';
  }

  getErrorObject() {
    return {
      type: SYSTEM_POPUP.GENERAL,
      status: this.status,
      message: this.message,
      data: this.data
    };
  }
}

/**
 * Set authorization token for all apis
 *
 * @param {string} token An authorization token from server
 */
export function setAuthorizationHeader(token, type) {
  axiosInstance.defaults.headers.common.Authorization = `${type} ${token}`;
}

/**
 * Handle all errors from server and application
 *
 * @param {Error} error An error from axios library
 * @return {Object}
 */
export function handlingErrors(error) {
  let message;
  let status;
  let data;
  try {
    if (error.response) {
      // tslint:disable-next-line:no-console
      console.log('API_ERROR', error.response);

      if (error.response.status === 400 && error.response.config.url === API_URL.CREATE_QUOTE && error.response.config.method === 'post') {
        return new ApiError(error.response.status, error.response.data.error, error.response.data);
      }

      if (error.response.status === 401) {
        // store.dispatch(logout());
      }

      if (error.response.status === 413) {
        message = 'File too large';
        data = { error: 'File too large' };
        status = error.response.status;
        return new ApiError(status, message, data);
      }

      message = error.response.data.message || error.response.data.error;
      data = error.response.data;
      status = error.response.data.status;
    } else {
      message = error.message;
    }
  } catch (e) {
    message = e.message;
  }

  return new ApiError(status, message, data);
}

const verifyHeader = (headers = {}) => (
  Boolean(typeof headers === 'object' && Object.keys(headers).length)
);

/**
 * As middleware for API calling
 *
 * @param {string} url URL endpoint
 * @param {RequestMethodType} method Rest API method
 * @param {Object} data Body of rest API
 * @param {Object} headers Header of rest API
 * @return {Promise}
 */
export default (
  url,
  method,
  data,
  headers,
  params,
  mode = 'json'
) => new Promise(async (resolve, reject) => {
  try {
    let defaultHeader = {
      'Content-type': 'application/json',
      CountryCode: 'vn',
    };

    /** for action has no token */
    if (url !== API_URL.LOGIN
      && url !== API_URL.REGISTER
      && url !== API_URL.VERIFY_EMAIL
      && !verifyHeader(headers)
    ) {
      const token = await AsyncStorage.getItem('TOKEN');
      const countryCode = await AsyncStorage.getItem('COUNTRY_CODE');
      if (token) {
        if (mode === API_CONTENT_MODE.FORM_DATA) {
          defaultHeader = {
            'Content-type': API_CONTENT_MODE.FORM_DATA,
            Authorization: `Bearer ${token}`,
            CountryCode: `${countryCode}`,
          };
        } else {
          defaultHeader = {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
            CountryCode: `${countryCode}`,
          };
        }
      }
    }

    const response = await axiosInstance.request({
      data,
      headers: {
        ...defaultHeader,
        ...headers
      },
      params: {
        ...params
      },
      method,
      url
    });
    resolve(response.data);
  } catch (error) {
    reject(handlingErrors(error));
  }
});
