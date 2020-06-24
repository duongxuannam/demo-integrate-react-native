import { CONFIG_ACTION } from '../actionTypes';

const updateLanguage = (languageCode) => ({
  type: CONFIG_ACTION.UPDATE_LANGUAGE,
  languageCode
});

const setConfigSetting = (countryCode) => ({
  type: CONFIG_ACTION.GET_CONFIG_SETTING,
  countryCode
});

const configActions = {
  updateLanguage,
  setConfigSetting
};

export default configActions;
