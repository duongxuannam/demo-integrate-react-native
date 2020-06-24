export const VERSION_API = 'v1';
const EX_API = 'http://qa.apis.cargopedia.success-ss.com.vn:7011';
// const EX_API = 'http://staging.apis.cargopedia.success-ss.com.vn:8011';
// const EX_API = 'https://apis.car.deliveree.com:8011';
const GOOGLE_API = 'https://maps.googleapis.com/maps/api';
const DELIVEREE_API = 'https://webapp.stg.deliveree.com/cargo_api';

const API_URL = {
  // AUTHENTICATE
  LOGIN: `/api/${VERSION_API}/customers/sign_in`,
  REGISTER: `/api/${VERSION_API}/customers/sign_up`,
  VERIFY_CODE: `/api/${VERSION_API}/customers/check_verification_code`,
  RESEND_CODE: `/api/${VERSION_API}/customers/resend_sms_token`,
  REQUEST_RESET_LINK: `/api/${VERSION_API}/customers/password`,
  REQUEST_RESET_PASSWORD: `/api/${VERSION_API}/customers/password`,

  // USER PROFILE
  GET_USERS: `/api/${VERSION_API}/customers/me?include[]=account_list&`,
  UPDATE_PROFILE: `/api/${VERSION_API}/customers/me`,
  CHANGE_ACCOUNT: `/api/${VERSION_API}/customers/switch`,
  // CONFIGURATION
  HANDLE_UNIT: `${EX_API}/${VERSION_API}/configuration/handling-units`,
  TRANSPORT_TYPE: `${EX_API}/${VERSION_API}/configuration/transport-types`,
  LOCATION_TYPE: `${EX_API}/${VERSION_API}/configuration/location-types`,
  LOCATION_SERVICES: `${EX_API}/${VERSION_API}/configuration/location-services`,
  ADDITIONAL_SERVICES: `${EX_API}/${VERSION_API}/configuration/additional-services`,
  ADVERT_DESCRIPTION: `${EX_API}/${VERSION_API}/configuration/mobile/advertisements`,
  GET_ALL_SETTINGS: `${EX_API}/${VERSION_API}/configuration/settings`,
  DELETE_REASONS: `${EX_API}/${VERSION_API}/configuration/reasons/DeleteShipment`,
  REASONS_REJECT_QUOTE: `${EX_API}/${VERSION_API}/configuration/reasons/RejectQuote`,
  REASONS_CANCEL_BOOKING: `${EX_API}/${VERSION_API}/configuration/reasons/CancelShipment`,

  // SHIPMENT
  SHIPMENT: `${EX_API}/${VERSION_API}/shipment`,
  GET_SHIPMENTS: `${EX_API}/${VERSION_API}/search/shipment/customer`,

  PIN_SHIPMENT: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/pin`,
  UNPIN_SHIPMENT: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/un-pin`,

  GET_CONFIG_QUOTE: `${DELIVEREE_API}/${VERSION_API}/quotes`,
  // GOOGLE API
  DISTANCE_MATRIX: `${GOOGLE_API}/directions/json?key=AIzaSyCf08-veAl7V_yEzDjD5x2861kFtcpWmUo`,
  // MAP
  GOOGLE_MAP_API: 'https://maps.googleapis.com/maps/api',
  GOOGLE_MAP_GEOCODE_API: 'https://maps.googleapis.com/maps/api/geocode/json',
  GOOGLE_MAP_DISTANCE_MATRIX: 'https://maps.googleapis.com/maps/api/distancematrix/json',

  // SYNC USER
  USER_SYNC: `${EX_API}/${VERSION_API}/users`,

  // NOTIFICATION
  NOTIFICATION: `${EX_API}/${VERSION_API}/notification/me`,
  REALTIME_NOTIFICATION: `${EX_API}/realtime/notify`,

  // Upload Attachment Chat
  CHAT_ATTACHMENT: `${EX_API}/${VERSION_API}/upload`,
};

export default API_URL;
