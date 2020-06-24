import Config from "react-native-config";

export const GOOGLE_API_KEY = 'AIzaSyCf08-veAl7V_yEzDjD5x2861kFtcpWmUo';

export default {
  API_RETRIES: parseInt(Config.API_RETRIES, undefined),
  API_TIMEOUT: parseInt(Config.API_TIMEOUT, undefined),
  API_VERSION_NUMBER: parseInt(Config.API_VERSION_NUMBER, undefined),
  BASE_URL: 'https://auth.stg.deliveree.com',
  ENVIRONMENT: Config.ENVIRONMENT,
};
