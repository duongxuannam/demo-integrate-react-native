/* eslint-disable import/no-cycle */
import { put, select } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { Freshchat } from 'react-native-freshchat-sdk';

import {
  requestLogin,
  requestRegister,
  requestVerifyCode,
  requestResendCode,
  requestLinkReset,
  requestResetPasswordAPI,
  requestUpdatePhoneAPI,
  requestGetAccounts,
  requestUpdateProfile,
  requestChangeAccount,
  requestTotalShipment,
} from '../../services/auth.service';
import { AUTH_ACTION, NOTIFICATION_ACTION, COMMUNICATION_ACTION } from '../actionTypes';
import { LANGUAGES } from '../../constants/hardData';
import { accountFormat } from '../../model/customerProfile';
import COUNTRY_CALLING_CODE from '../../constants/countryNumberCode';
import { updateUser } from '../../api/auth';
import { ACCOUNT_TYPE } from '../../constants/app';
import FirebaseHelper from '../../helpers/firebaseHelper';

function* handleLogin(data) {
  try {
    const result = yield requestLogin(data.payload);
    const accounts = yield requestGetAccounts(result.access_token);
    let totalShipment = null;
    if (result.access_token) {
      totalShipment = yield requestTotalShipment(result.access_token);
    }
    const accountsRender = [];
    // for the personal account
    let account = accountFormat(accounts.object);
    accountsRender.push(account);
    // for the company account
    accounts.object.accounts.map((item) => {
      account = accountFormat(item);
      accountsRender.push(account);
    });
    FirebaseHelper().loginWithAnonymous();
    yield put({
      type: AUTH_ACTION.CUSTOMER_LOGIN_SUCCESS,
      result,
      accounts: accounts.object,
      accountsRender,
      totalShipment: totalShipment.data,
    });
    yield AsyncStorage.setItem('TOKEN', result.access_token);
    yield put({
      type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION,
    })
  } catch (error) {
    yield put({
      type: AUTH_ACTION.CUSTOMER_LOGIN_FAILURE,
      error,
    });
  }
}

function* handleRegister(data) {
  try {
    const result = yield requestRegister(data.payload);
    updateUser(result.object, result.access_token);
    yield put({
      type: AUTH_ACTION.CUSTOMER_REGISTER_SUCCESS,
      result,
    });
    data.callback(result);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.CUSTOMER_REGISTER_FAILURE,
      error: error.data,
    });
    data.callback(error.data);
  }
}

function* handleVerifyCode(data) {
  try {
    const result = yield requestVerifyCode(data.payload.token, data.payload.code);
    yield put({
      type: AUTH_ACTION.VERIFICATION_CODE_SUCCESS,
      result,
    });
    data.callback(result);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.VERIFICATION_CODE_FAILURE,
      error: error.data,
    });
    data.callback(error.data);
  }
}

function* handleResendCode(data) {
  try {
    const result = yield requestResendCode(data.accessToken);
    yield put({
      type: AUTH_ACTION.RESEND_CODE_SUCCESS,
      result,
    });
    data.callback(result, null);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.RESEND_CODE_FAILURE,
      error: error.data,
    });
    data.callback(null, error.data);
  }
}

function* handleRequestLink(data) {
  try {
    const result = yield requestLinkReset(data.payload.email, data.payload.redirectURL);
    yield put({
      type: AUTH_ACTION.REQUEST_LINK_RESET_SUCCESS,
      result,
    });
    data.callback(result, null);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.REQUEST_LINK_RESET_FAILURE,
      error: error.data,
    });
    data.callback(null, error.data);
  }
}

function* handleResetPassword(data) {
  try {
    const result = yield requestResetPasswordAPI(data.payload.resetPasswordToken,
      data.payload.password, data.payload.rePassword);
    yield put({
      type: AUTH_ACTION.RESET_PASSWORD_SUCCESS,
      result,
    });
    data.callback(true, null);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.RESET_PASSWORD_FAILURE,
      error: error.data,
    });
    data.callback(null, error.data || true);
  }
}

function* handleUpdatePhone(data) {
  try {
    const result = yield requestUpdatePhoneAPI(data.payload.token, data.payload.phone, data.payload.countryCode);
    yield put({
      type: AUTH_ACTION.REQUEST_UPDATE_PHONE_SUCCESS,
      result,
    });
    data.callback(result, null);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.REQUEST_UPDATE_PHONE_FAILURE,
      error: error.data,
    });
    data.callback(null, error.data);
  }
}

function* handleUpdateProfile(action) {
  try {
    const { data, accountsRender } = action;
    const result = yield requestUpdateProfile(data);
    const account = accountFormat(result.object);
    // update account render
    accountsRender.map((item, index) => {
      if (result.object.id === item.id) {
        accountsRender[index] = account;
      }
    });

    yield put({
      type: AUTH_ACTION.UPDATE_PROFILE_SUCCESS,
      account,
      accountsRender,
    });
  } catch (error) {
    yield put({
      type: AUTH_ACTION.UPDATE_PROFILE_FAILURE,
      error: error.data,
    });
  }
}

function* handleChangeAccount(action) {
  try {
    let { id } = action.data;
    if (action.data.company_id) { id = action.data.company_id; }
    const result = yield requestChangeAccount({ account_id: id });
    const { accounts, accountsRender } = yield select((state) => state.auth);
    let totalShipment = null;
    if (Array.isArray(accountsRender) && accountsRender.length > 0) {
      const accountItem = accountsRender.find((item) => item.id === id);
      const data = {
        name: accountItem.name,
        first_name: accountItem.firstName || accounts.first_name,
        last_name: accountItem.lastName || accounts.last_name,
        email: accountItem.email,
        country_code: accountItem.country_code || accounts.country_code,
        phone: accountItem.phone,
        referral_code: accountItem.referral_code || null,
        avatar_square: accountItem.logo_url || '',
        business_name: accountItem.business_name || null,
        sms_confirmed_at: accountItem.sms_confirmed_at || accounts.sms_confirmed_at,
        link_admin: null,
        Role: 1,
        parentId: accountItem && accountItem.type === ACCOUNT_TYPE.COMPANY ? accounts.id : null,
      };
      updateUser(data, result.access_token);
      yield AsyncStorage.setItem('TOKEN', result.access_token);
      yield put({
        type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION,
      });
    }
    const countryCode = result.object.country_code.toLowerCase();
    if (result.access_token) {
      totalShipment = yield requestTotalShipment(result.access_token, countryCode);
    }
    // get country index
    let countryIndex = null;
    let callingCode = null;
    // get country in support list
    LANGUAGES.map((item, index) => {
      if (item.countryCode === countryCode) {
        countryIndex = index;
        callingCode = item.callingCode;
        return true;
      }
      return false;
    });
    // if country is not in the support list, get from global list
    if (!countryIndex) {
      callingCode = COUNTRY_CALLING_CODE[countryCode];
    }

    // update data
    yield put({
      type: AUTH_ACTION.SELECT_ACCOUNT_SUCCESS,
      account: accountFormat(action.data),
      token: result.access_token,
      countryCode,
      countryIndex,
      callingCode,
      totalShipment: totalShipment.data,
    });
    Freshchat.resetUser();
    AsyncStorage.setItem('TOKEN', result.access_token);
  } catch (error) {
    yield put({
      type: AUTH_ACTION.SELECT_ACCOUNT_FAILURE,
      error: error.data,
    });
  }
}

const authSaga = {
  handleLogin,
  handleRegister,
  handleVerifyCode,
  handleResendCode,
  handleRequestLink,
  handleResetPassword,
  handleUpdatePhone,
  handleUpdateProfile,
  handleChangeAccount,
};

export default authSaga;
