import {
  APP_ACTION,
  SHIPMENT_ACTION,
  PROGRESS_ACTION,
  PAYMENT_ACTION,
  CHAT_ACTION,
} from '../actionTypes';
import appState from '../states/appState';

const appReducer = (state = appState.initState, action) => {
  switch (action.type) {
    case SHIPMENT_ACTION.GET_HANDLE_UNIT:
    case SHIPMENT_ACTION.GET_LOCATION_TYPE:
    case SHIPMENT_ACTION.CREATE_QUOTE:
    case PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO:
    case PAYMENT_ACTION.DOWNLOAD_DATA:
    case SHIPMENT_ACTION.SET_SHIPMENT_DETAILS:
    case CHAT_ACTION.SEND_ATTACHMENT:
      // START REQUEST
      return {
        ...state,
        isLoading: true,
      };
    // REQUEST SUCCESS
    case SHIPMENT_ACTION.GET_HANDLE_UNIT_SUCCESS:
    case SHIPMENT_ACTION.GET_LOCATION_TYPE_SUCCESS:
    case PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO_SUCCESS:
    case PAYMENT_ACTION.DOWNLOAD_DATA_SUCCESS:
    case SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_SUCCESS:
    case SHIPMENT_ACTION.SET_SHIPMENT_DETAILS_FAIL:
    case CHAT_ACTION.SEND_ATTACHMENT_SUCCESS:
      return {
        ...state,
        ...appState.setRequestSuccess(),
      };
    // REQUEST FAILURE
    case SHIPMENT_ACTION.GET_HANDLE_UNIT_FAILED:
    case SHIPMENT_ACTION.GET_LOCATION_TYPE_FAILED:
    case PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO_FAILED:
    case PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO_FAILED:
      return {
        ...state,
        ...appState.setRequestFalse(action.error),
      };
    // HANDLE ADDRESS GOOGLE MODAL
    case APP_ACTION.OPEN_MODAL:
      return {
        ...state,
        modalStatus: action.modalStatus,
        modalData: action.modalData,
      };
    case APP_ACTION.CLOSE_MODAL:
      return {
        ...state,
        ...appState.closeModal(),
      };
    case APP_ACTION.TOGGLE_DROPDOWN_ADDRESS:
      return {
        ...state,
        addressData: [...action.data],
        addressPos: action.pos,
      };
    case SHIPMENT_ACTION.CREATE_QUOTE_FAILED:
      console.log('QUOTE FAILED: ', action);
      return {
        ...state,
        ...appState.setRequestFalse(action.error),
      };
    case APP_ACTION.TOGGLE_DROPDOWN:
      return {
        ...state,
        dropDownStatus: !state.dropDownStatus,
        dropDownPos: action.measure || null,
      };
    case APP_ACTION.TOGGLE_DROPDOWN_FILTER:
      return {
        ...state,
        dropDownFilterStatus: !state.dropDownFilterStatus,
        dropDownFilterPos: action.measure || null,
      };
    case APP_ACTION.CLEAR_ERROR:
      return {
        ...state,
        errorMessage: null,
      };
    default:
      return state;
  }
};

export default appReducer;
