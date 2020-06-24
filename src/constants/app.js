export const DATE_FORMAT = 'DD-MMM-YYYY';
export const DATE_FORMAT_VN = 'DD-[Th]MMM-YYYY';
const DATE_TIME_FORMAT = 'hh:mm a, DD-MMM-YYYY';
const DATE_TIME_FORMAT_VN = 'HH:mm, DD-[Th]MM-YYYY';
const DATE_DAY_MONTH_FORMAT_VN = 'DD-[Th]MM';
const DATE_DAY_MONTH_FORMAT = 'DD-MMM';
const DATE_TIME_FORMAT_CHAT = 'DD-MMM-YYYY hh:mm a';
const DATE_TIME_FORMAT_CHAT_VN = 'DD-[Th]MM-YYYY HH:mm';

const PHOTO_ERROR_TYPE = {
  SIZE: 'size',
  FILE_TYPE: 'fileTypes',
};

const ADDRESS_TYPE = {
  PICKUP_ROOT: 'pickup_root',
  PICKUP_OTHER: 'pickup_other',
  DELIVERY_ROOT: 'delivery_root',
  DELIVERY_OTHER: 'delivery_other',
};

const APP = {
  DATE_FORMAT,
  DATE_FORMAT_VN,
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_VN,
  PHOTO_ERROR_TYPE,
  DATE_DAY_MONTH_FORMAT_VN,
  DATE_DAY_MONTH_FORMAT,
  ADDRESS_TYPE,
  DATE_TIME_FORMAT_CHAT,
  DATE_TIME_FORMAT_CHAT_VN,
};

export const MODAL_STATUS = {
  ADDRESS_AUTO_COMPLETE: 'ADDRESS_AUTO_COMPLETE',
  GOOGLEMAP_SHIPMENT_DETAIL: 'GOOGLEMAP_SHIPMENT_DETAIL',
};

export const LIST_VIEW_TYPE = {
  LIST: 'LIST',
  MAP: 'MAP'
};

export const MAP_POINT_TYPE = {
  TEXT: 'TEXT',
  BIG_TEXT: 'BIG_TEXT',
  FROM: 'FROM',
  TO: 'TO'
};

export const GOOGLE_MAPS_APIKEY = 'AIzaSyCf08-veAl7V_yEzDjD5x2861kFtcpWmUo';

export const EXPRIRED_TIME_LEFT = '0h 0m';

export const MODE_SHIPMENT_DETAIL = {
  DETAIL: 'DETAIL',
  QUOTE: 'QUOTE',
  PROGRESS: 'PROGRESS',
  COMMUNICATION: 'COMMUNICATION',
  PAYMENT: 'PAYMENT',
};

export const getMenuTabNotAccept = () => ([
  MODE_SHIPMENT_DETAIL.DETAIL,
  MODE_SHIPMENT_DETAIL.QUOTE
]);

export const getMenuTabAccept = () => ([
  MODE_SHIPMENT_DETAIL.DETAIL,
  MODE_SHIPMENT_DETAIL.PROGRESS,
  MODE_SHIPMENT_DETAIL.COMMUNICATION,
  MODE_SHIPMENT_DETAIL.PAYMENT
]);

export const PROGRESS_TYPE = {
  BOOKED: 'booked',
  DISPATCH: 'dispatched',
  PICKUP: 'pickup',
  DESTINATION: 'delivery',
};

export const LANGUAGE_DEFAULT = 'en';

export const PROGRESS_NAME = 'progress';

export const LISTING_STATUS = {
  DRAFT: 1,
  WAITING_APPROVAL: 2,
  APPROVED: 3,
  HOLD: 4,
  BLOCKED: 5,
  UN_LISTED: 6,
  BOOKED: 7,
  IN_PROGRESS: 8,
  COMPLETED: 9,
  CANCELLED: 10,
};

export const ADDRESS_STATUS = {
  IN_PROGRESS: 'InProgress',
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
  REJECT_BID: 16,
  STATUS_READ: 1,
  STATUS_UNREAD: 2,
  STATUS_ALL: '',
};

export const PAYMENT_METHOD = {
  BUSINESS_PROGRAM_INVOICE: 'BusinessProgramInvoice', // 1
  CASH: 'Cash', // 2
  BANK_TRANSFER: 'BankTransfer', // 3
};

export const TYPE_CHAT = {
  DRIVER_ADMIN_TYPE2: 'Type2',
  GROUP_Type3: 'Type3',
  DRIVER_CUSTOMER_TYPE4: 'Type4',
  DRIVER_ADMIN: 'DriverWithCS',
  GROUP: 'All',
  DRIVER_CUSTOMER: 'CustomerWithDriver',
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

export default APP;
