import moment from 'moment';
import { ACCOUNT_TYPE } from '../constants/app';

export const addressFormat = (data) => ({
  id: data.id || null,
  name: data.name || null,
  pickupDate: data.time || null,
  type: 'pickup' || 'destination'
});

export const pickupFormat = (data) => ({
  pickupDate: data.pickupDate || null, // '2019-12-25T13:54:18.130Z',
  locationTypeId: data.locationTypeId || null, // 'b181a8e0-f0dd-46ba-bd6f-99318006069d',
  shipmentId: data.shipmentId || null, //  'fd5325ef-031d-4b7e-81a8-1aeed912ec02',
  address: data.address || null, //  '11dadas sdasdsad',
  longitude: data.longitude || null, //  '',
  latitude: data.latitude || null, //  '',
  locationServices: data.locationServices || [],
  id: data.id || null,
  //  [
  //   '7512b764-05ed-4d20-ba41-65bb12edc557',
  //   '676abf98-d8b9-4de2-a1fd-8b503bf678bf'
  // ],
});

export const destinationFormat = (data) => ({
  dateRangeType: data.dateRangeType || 0, // 1,
  earliestByDate: data.earliestByDate || null, // '2019-12-25T10:54:18.130Z',
  latestByDate: data.latestByDate || null, // '2019-12-27T10:54:18.130Z',
  earliestBy: data.earliestBy || null, // 1,
  latestBy: data.latestBy || null, // 2,
  locationTypeId: data.locationTypeId || null, // '24',
  address: data.address || null, // 'ersdsdfsf sdasdsad',
  longitude: data.longitude || null, // '',
  latitude: data.latitude || null, // '',
  locationServices: data.locationServices || [],
  id: data.id || null,
  // [
  //   '7512b764-05ed-4d20-ba41-65bb12edc557',
  //   '676abf98-d8b9-4de2-a1fd-8b503bf678bf'
  // ]
});

export const destinationSuport = (data) => ({
  ...data,
  earliestByDate: moment(data.earliestByDate.setHours(23, 59, 59, 999)).utc().toISOString(),
  latestByDate: moment(data.latestByDate.setHours(23, 59, 59, 999)).utc().toISOString(),
  locationTypeId: data.locationTypeId.value,
  locationServices: Object.keys(data.locationServices)
});

export const pickupSuport = (data) => {
  const early = new Date(data.pickupDate);
  return {
    ...data,
    pickupDate: moment(early.setHours(23, 59, 59, 999)).utc().toISOString(),
    locationTypeId: data.locationTypeId.value,
    locationServices: Object.keys(data.locationServices)
  };
};

export const locationTypeFormat = (input) => ({
  value: input.id || null,
  name: input.name || null,
});

export const locationServiceFormat = (input) => ({
  id: input.id || null,
  url: input.iconUrl || '',
  url_active: input.iconUrl || '',
  name: input.name || null,
  description: input.description || null,
});

const listingAddressFormat = (data) => ({
  id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
  // id: data.id || null,
});

export default listingAddressFormat;
