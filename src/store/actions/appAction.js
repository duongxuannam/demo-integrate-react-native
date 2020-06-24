import { APP_ACTION } from '../actionTypes';

const openModal = (modalStatus, modalData) => {
  return {
    type: APP_ACTION.OPEN_MODAL,
    modalStatus,
    modalData,
  };
};

const closeModal = () => ({
  type: APP_ACTION.CLOSE_MODAL,
});

const toggleDropDown = (measure) => ({
  type: APP_ACTION.TOGGLE_DROPDOWN,
  measure
});

const clearError = () => ({
  type: APP_ACTION.CLEAR_ERROR,
});

const updateConfig = (countryCode, languageCode, countryIndex, callingCode) => ({
  type: APP_ACTION.SAVE_CONFIG,
  payload: {
    countryCode,
    languageCode,
    countryIndex,
    callingCode,
  }
});

const toggleDropDownFilter = (measure) => ({
  type: APP_ACTION.TOGGLE_DROPDOWN_FILTER,
  measure
});

const appActions = {
  openModal,
  closeModal,
  toggleDropDown,
  clearError,
  updateConfig,
  toggleDropDownFilter
};

export default appActions;
