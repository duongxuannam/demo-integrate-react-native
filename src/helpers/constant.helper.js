const DEFAULT_RADIUS = 5; // KM
const MIN_RADIUS = 0; // KM
const MAX_RADIUS = 300; // KM
const MODE_SEARCH = {
  LOCATION: 'Location',
  ALONG_ROUTE: 'AlongRoute',
};

const APP_CONSTANT = {
  DEFAULT_RADIUS,
  MIN_RADIUS,
  MAX_RADIUS,
  MODE_SEARCH,
  SEARCH: 'New',
  WATCHING: 'Watching',
  MY_SHIPMENT: 'MyShipment',
};

export const QUOTE_STATUS = {
  ACCEPTED: 'Accepted'
};

export const BLUR_RADIUS = {
  MIN: 0,
  MAX: 10,
};

export const SHIPMENT_STATUS = {
  DRAFT: 1,
  WAITING_APPROVAL: 2,
  APPROVED: 3,
  HOLD: 4,
  BLOCKED: 5,
  UNLISTED: 6,
  BOOKED: 7, // Listing is booked by carrier
  IN_PROGRESS: 8, // Shipment is on the way to be delivered to destination(s)
  COMPLETED: 9, // Shipment is delivered to all destinations
  CANCELLED: 10, //  Shipment has been cancelled by the customer
};

export const PICK_STATUS = {
  IN_PROGRESS: 'InProgress', //  Driver/carrier had picked up shipment item(s)
  COMPLETED: 'Completed', // Driver/carrier had completed picking up shipment item(s) 2
};


export const STATUS_FILTER = {
  Upcoming: 'Upcoming',
  Completed: 'Completed',
  Cancelled: 'Cancelled'
};

export const SORT_FILTER = {
  LOW_TO_HIGH: 'low_to_high',
  HIGH_TO_LOW: 'hight_to_low',
  MOST_RECENT: 'most_recent',
  PRICE: 'price',
};

export default APP_CONSTANT;
