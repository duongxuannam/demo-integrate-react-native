export const VERSION_API = 'v1';
const EX_API = 'http://qa.apis.cargopedia.success-ss.com.vn:7011';
// const EX_API = 'http://staging.apis.cargopedia.success-ss.com.vn:8011';
// const EX_API = 'https://apis.car.deliveree.com:8011';
const DELIVEREE_API = 'https://auth.stg.deliveree.com';

export const API_CONTENT_MODE = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data'
};

const API_URL = {
  // AUTHENTICATE
  LOGIN: `${DELIVEREE_API}/api/${VERSION_API}/drivers/sign_in`,

  // SHIPMENT
  SHIPMENT: `${EX_API}/${VERSION_API}/shipment`,
  // CONFIGURATION
  CONFIGURATION: `${EX_API}/${VERSION_API}/configuration`,

  SUMMARY_HANDLE_UNIT: `${EX_API}/${VERSION_API}/search/summary-handling-unit`,
  SUMMARY_LOCATION_TYPE: `${EX_API}/${VERSION_API}/search/summary-location-type`,
  SEARCH_SHIPMENT: `${EX_API}/${VERSION_API}/search/shipment/driver`,

  PIN_SHIPMENT: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/pin`,
  UNPIN_SHIPMENT: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/un-pin`,

  CREATE_QUOTE: `${EX_API}/${VERSION_API}/shipment/quote`,

  // UPLOAD PROGRESS PHOTO
  UPLOAD_PROGRESS_PHOTO: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/progress-attachment/[progress_status]`,
  REMOVE_PROGRESS_PHOTO: `${EX_API}/${VERSION_API}/shipment/[file_name]/progress-attachment`,

  CONFIRM_ADDRESS_DESTINATION: `${EX_API}/${VERSION_API}/shipment/[shipment_id]/comfirm-completed-step`,

  // SYNC USER
  USER_SYNC: `${EX_API}/${VERSION_API}/users`,

  // GOOGLE API
  GOOGLE_MAP_API: 'https://maps.googleapis.com/maps/api',

  // NOTIFICATION
  NOTIFICATION: `${EX_API}/${VERSION_API}/notification/me`,
  REALTIME_NOTIFICATION: `${EX_API}/realtime/notify`,

  // CHAT
  CHAT_ATTACHMENT: `${EX_API}/${VERSION_API}/upload`,
};

export default API_URL;
