/* eslint-disable import/no-cycle */
import {
  login,
  register,
  checkVerificationCode,
  resendCode,
  requestResetLink,
  requestResetPassword,
  requestUpdatePhone,
  getAccounts,
  updateProfile,
  changeAccount,
  totalShipment,
} from '../api/auth';

export const requestLogin = async (data) => await login(data.email, data.password);
export const requestTotalShipment = (token, countryCode) => totalShipment(token, countryCode);
export const requestRegister = async (data) => await register(data);
export const requestVerifyCode = async (token, code) => await checkVerificationCode(token, code);
export const requestResendCode = async (token) => await resendCode(token);
export const requestLinkReset = async (email, redirectUrl) => await requestResetLink(email, redirectUrl);
export const requestResetPasswordAPI = async (resetToken, password, confirmPassword) => await requestResetPassword(resetToken, password, confirmPassword);
export const requestUpdatePhoneAPI = async (token, phone, countryCode) => await requestUpdatePhone(token, phone, countryCode);

export const requestGetAccounts = (token) => getAccounts(token);

export const requestUpdateProfile = (data) => updateProfile(data);

export const requestChangeAccount = (data) => changeAccount(data);

export default requestGetAccounts;
