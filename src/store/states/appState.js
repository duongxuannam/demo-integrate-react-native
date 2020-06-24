const initState = {
  countryCode: null,
  languageCode: 'en',
  countryIndex: null,
  callingCode: null,
  errorMessage: null,
  isLoading: false,
  isFailure: false,
  pageRequired: null,
  longitude: null,
  latitude: null,
  modalStatus: null,
  modalData: null,
  updatingCountry: {},
  openAddressModal: false,
  configs: {},
};

const setRequestSuccess = () => ({
  errorMessage: null,
  isLoading: false,
});

const setRequestFailse = (message) => ({
  errorMessage: message,
  isLoading: false,
});

const setPageRequiredName = (pageName) => ({
  pageRequired: pageName
});

const closeModal = () => ({
  modalStatus: null,
  modalData: null,
});

const appState = {
  initState,
  setRequestSuccess,
  setRequestFailse,
  setPageRequiredName,
  closeModal,
};

export default appState;
