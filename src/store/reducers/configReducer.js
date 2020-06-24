import { AsyncStorage } from 'react-native';
import {
  APP_ACTION,
  CONFIG_ACTION,
} from '../actionTypes';
import configState from '../states/configState';

const configReducer = (state = configState.initState, action) => {
  switch (action.type) {
    case APP_ACTION.SAVE_CONFIG:
      AsyncStorage.setItem('COUNTRY_CODE', action.payload.countryCode);
      return {
        ...state,
        countryCode: action.payload.countryCode || 'vn',
        languageCode: action.payload.languageCode || 'en',
        callingCode: action.payload.callingCode || null,
      };
    case CONFIG_ACTION.UPDATE_LANGUAGE:
      return {
        ...state,
        languageCode: action.languageCode
      };
    case CONFIG_ACTION.GET_CONFIG_SETTING_SUCCESS:
      return {
        ...state,
        dataConfig: action.data,
      };
    default:
      return state;
  }
};

export default configReducer;
