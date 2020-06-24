import { APP_ACTION } from '../actionTypes';

const updateLanguage = (countryCode, languageCode, countryIndex, callingCode) => ({
  type: APP_ACTION.UPDATE_LANGUAGE,
  payload: {
    countryCode,
    languageCode,
    countryIndex,
    callingCode,
  }
});

const clearPageRequire = () => ({
  type: APP_ACTION.REQUIRE_LOGIN_PAGE,
  pageRequiredName: null,
});

export const updatePosition = (longitude, latitude) => ({
  type: APP_ACTION.UPDATE_POSITION,
  payload: {
    longitude,
    latitude,
  }
});

export const openModal = (modalStatus, modalData) => ({
  type: APP_ACTION.OPEN_MODAL,
  modalStatus,
  modalData,
});

export const openAddressModal = () => ({
  type: APP_ACTION.OPEN_ADDRESS_MODAL,
});

export const closeModal = () => ({
  type: APP_ACTION.CLOSE_MODAL,
});

export const closeAddressModal = () => ({
  type: APP_ACTION.CLOSE_ADDRESS_MODAL,
});

const setAppData = (data) => ({
  type: APP_ACTION.SET_APP_DATA,
  payload: data,
});

const clearError = () => ({
  type: APP_ACTION.CLEAR_ERROR,
});

const appActions = {
  updateLanguage,
  clearPageRequire,
  updatePosition,
  openModal,
  closeModal,
  setAppData,
  openAddressModal,
  closeAddressModal,
  clearError,
};

export default appActions;
