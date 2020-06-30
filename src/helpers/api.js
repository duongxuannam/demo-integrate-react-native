/* eslint-disable no-async-promise-executor */
/* eslint-disable no-tabs */
import {AsyncStorage} from 'react-native';
import axios from 'axios';
import axiosInstance from './axios';
import API_URL from '../constants/apiUrl';

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401) {
        // const stateFromStore = store.getState();
        // const data = new RefreshTokenDTO(stateFromStore.Auth.user.email ? stateFromStore.Auth.user.email : '',
        //     stateFromStore.Auth.user.refreshToken ? stateFromStore.Auth.user.refreshToken : '')
        // const credentials: any = await getRefreshToken(data);
        // if (credentials !== null) {
        //     store.dispatch(refreshTokenSuccess(credentials))
        // }
        // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${credentials.token}`;
        // originalRequest.headers.Authorization = `Bearer ${credentials.token}`;

        return axios(originalRequest);
      }
      return Promise.reject(error);
    } catch (e) {
      // console.log("session has expired")
      // store.dispatch(navLogout())
      return Promise.reject(error);
    }
  },
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
      return this.data.errors.message || 'Unknown API Error';
    }

    return 'Unknown API Error';
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

      if (error.response.status === 401) {
        // store.dispatch(logout());
      }

      if (error.response.status === 413) {
        message = 'File too large';
        data = {error: 'File too large'};
        status = error.response.status;
        return new ApiError(status, message, data);
      }

      message = error.response.data.message;
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

const verifyHeader = (headers = {}) =>
  Boolean(typeof headers === 'object' && Object.keys(headers).length);

/**
 * As middleware for API calling
 *
 * @param {string} url URL endpoint
 * @param {RequestMethodType} method Rest API method
 * @param {Object} data Body of rest API
 * @param {Object} headers Header of rest API
 * @return {Promise}
 */
export default (url, method, data, headers) =>
  new Promise(async (resolve, reject) => {
    try {
      let defaultHeader = {
        'Content-type': 'application/json',
      };
      /** for action has no token */
      if (url !== API_URL.LOGIN && url !== API_URL.REGISTER) {
        const token = await AsyncStorage.getItem('TOKEN');
        if (token) {
          defaultHeader = {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
        }
      }

      const response = await axiosInstance.request({
        data,
        headers: {
          ...defaultHeader,
          ...headers,
        },
        method,
        url,
        timeout: 100000,
      });
      resolve(response.data);
    } catch (error) {
      reject(handlingErrors(error));
    }
  });
