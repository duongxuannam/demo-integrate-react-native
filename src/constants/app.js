import { Dimensions } from 'react-native';

export const ACCOUNT_TYPE = {
  COMPANY: 'COMPANY',
  PERSONAL: 'PERSONAL',
};

export const LATEST_DAY_PLUS = 2;
export const EARLY_DAY_PLUS = 1;

export const DATE_FORMAT = 'DD-MMM-YYYY';
export const DATE_FORMAT_VN = 'DD-[Th]MM-YYYY';
export const DATE_TIME_FORMAT = 'hh:mm a, DD-MMM-YYYY';
export const DATE_TIME_FORMAT_VN = 'HH:mm, DD-[Th]MM-YYYY';
export const DATE_TIME_FORMAT_CHAT = 'DD-MMM-YYYY hh:mm a';
export const DATE_TIME_FORMAT_CHAT_VN = 'DD-[Th]MM-YYYY HH:mm';

export const DATE_RANGE_TYPE = {
  DAYS: 0,
  DATE_RANGE: 1,
};

export const QUERY = {
  LITMIT: 10,
  TAB_FILTER: {
    PENDING: 'Pending',
    DRAFT: 'Draft',
    PAST: 'Past',
  }
};

export const VALIDATE_TYPE = {
  EARLY_DATE: 'EARLY_DATE',
  LATEST_DATE: 'LATEST_DATE',
  EARLY_DAY: 'EARLY_DAY',
  LATEST_DAY: 'LATEST_DAY',
  ADDRESS: 'ADDRESS',
  LOCATION_TYPE: 'LOCATION_TYPE',
  LOCATION_SERVICE: 'LOCATION_SERVICE',
  // EARLY_DATE: 'EARLY_DATE',
};

export const COMMON = {
  COUNTDOWN_CONFIRM_SHIPMENT: 20,
  LIMIT_PICKUP_DATE: 14, // days
};

export const UPDATE_PRICE_FAIL = {
  SHIPMENT_CANNOT_EDIT_TARGET_PRICE: 'ShipmentCanNotEditTargetPrice',
  COUNTRY_CODE_NOT_EMPTY: 'CountryCodeNotEmpty',
  TARGET_PRICE_CANNOT_LESS_THAN_MIN_TARGET_PRICE: 'TargetPriceCanNotLessThanMinTargerPrice',
};

export const MODAL_STATUS = {
  ADDRESS_AUTO_COMPLETE: 'ADDRESS_AUTO_COMPLETE',
};
export const EXPRIRED_TIME_LEFT = '0h 0m';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const APP = {
  ACCOUNT_TYPE,
  DATE_FORMAT,
  DATE_RANGE_TYPE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
};

export const SHIPMENT_DETAIL_SECTION = {
  SUMMARY: 'SUMMARY',
  PHOTOS: 'PHOTOS',
  LTL_SHIPMENT: 'LTL_SHIPMENT'
};

export const SHIPMENT_TAB = {
  SHIPMENT: 'SHIPMENT',
  QUOTES: 'QUOTES',
  PROGRESS: 'PROGRESS',
  COMMUNICATION: 'COMMUNICATION',
  PAYMENT: 'PAYMENT',
};

export const QUOTE_STATUS = {
  NEW: 'New',
  REJECTED: 'Rejected',
};

export const PAYMENT_STATUS = {
  NEW: 'New',
  COMPLETED: 'Completed',
};

export const NOTIFICATION_TYPE = {
  NEW_BID: 1,
  NEW_PHOTO: 2,
  NEW_NOTE: 3,
  NEW_PROGRESS: 4,
  SHIPMENT_COMPLETED: 5,
  NEW_STATUS: 6,
  PAYMENT_METHOD_ACCEPTED: 7,

  SHIPMENT_UPDATED: 8,
  SHIPMENT_CANCELLED: 9,
  NEW_PHOTO_DRIVER: 10,
  NEW_NOTE_DRIVER: 11,
  REQUEST_CHANGE_PAYMENT_METHOD: 12,

  PAYMENT_METHOD_DECLINE: 13,
  PAYMENT_CHANGE_REQUEST_CANCEL_BY_CUSTOMER: 14,
  ACCEPT_BID: 15,
  
  STATUS_READ: 1,
  STATUS_UNREAD: 2,
  STATUS_ALL: '',
};

export const PAYMENT_METHOD = {
  BUSINESS_PROGRAM_INVOICE: 1,
  CASH: 2,
  BANK_TRANSFER: 3,
};

export const PAYMENT_METHOD_VALUE = {
  BANK_TRANSFER: 'BankTransfer',
  CASH: 'Cash',
  BUSINESS_PROGRAM_INVOICE: 'BusinessProgramInvoice',
};

export const PAYMENT_REQUEST_CHANGE = {
  NEW: 1,
  APPROVED: 2,
  CANCELLED: 3,
};

export const FILE_TYPE = {
  PDF: 'pdf',
  MS_POWERPOINT: 'vnd.ms-powerpoint',
  MS_POWERPOINT_OPEN_XML: 'vnd.openxmlformats-officedocument.presentationml.presentation',
  MS_WORD: 'msword',
  MS_WORDX: 'vnd.openxmlformats-officedocument.wordprocessingml.document',
  MS_WORD_OPEN_XML: 'mswvnd.openxmlformats-officedocument.wordprocessingml.documentord',
  MS_EXCEL: 'vnd.ms-excel',
  MS_EXCEL_OPEN_XML: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  TXT: 'text/plain',
  CSV: 'text/comma-separated-values',
};

export const TYPE_CHAT = {
  CUSTOMER_ADMIN_TYPE1: 'Type1',
  GROUP_TYPE3: 'Type3',
  CUSTOMER_DRIVER_TYPE4: 'Type4',
  CUSTOMER_ADMIN: 'CustomerWithCS',
  GROUP: 'All',
  CUSTOMER_DRIVER: 'CustomerWithDriver',
};

export default APP;
