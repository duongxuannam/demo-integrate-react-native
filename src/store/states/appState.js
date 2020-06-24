const initState = {
  countryCode: null,
  languageCode: 'en',
  callingCode: null,
  errorMessage: null,
  isLoading: false,
  longitude: null,
  latitude: null,
  modalStatus: null,
  modalData: null,
  openAddressModal: false,
  dropDownStatus: false,
  dropdownPos: null,
  dropDownFilterStatus: false,
  dropDownFilterPos: null,
  addressData: [],
  addressPos: null,
};

const setRequestSuccess = () => ({
  errorMessage: null,
  isLoading: false,
});

const setRequestFalse = (message) => ({
  errorMessage: message,
  isLoading: false,
});

const closeModal = () => ({
  modalStatus: null,
  modalData: null,
});

const appState = {
  initState,
  setRequestSuccess,
  setRequestFalse,
  closeModal,
};

export default appState;
