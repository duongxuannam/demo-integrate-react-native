import moment from 'moment';

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
  shortAddress: data.shortAddress || null,
  id: data.id || null,
});

export const destinationFormat = (data) => ({
  dateRangeType: data.dateRangeType || 0, // 1,
  earliestByDate: data.earliestByDate || null, // '2019-12-25T10:54:18.130Z',
  latestByDate: data.latestByDate || null, // '2019-12-27T10:54:18.130Z',
  earliestBy: data.earliestBy || null, // 1,
  latestBy: data.latestBy || null, // 2,
  locationTypeId: data.locationTypeId || null, // '24',
  address: data.address || null, // 'ersdsdfsf sdasdsad',
  shortAddress: data.shortAddress || null, // 'ersdsdfsf sdasdsad',
  longitude: data.longitude || null, // '',
  latitude: data.latitude || null, // '',
  locationServices: data.locationServices || [],
  id: data.id || null,
});

export const destinationSuport = (data) => ({
  ...data,
  earliestByDate: moment(data.earliestByDate).utc().toISOString(),
  latestByDate: moment(data.latestByDate).utc().toISOString(),
  locationTypeId: data.locationTypeId,
  locationServices: Object.keys(data.locationServices)
});

export const pickupSuport = (data) => {
  const pickupDate = moment(data.pickupDate).utc().toISOString();
  const time = new Date(pickupDate);
  const now = new Date();
  time.setHours(now.getHours(), now.getMinutes());
  return {
    ...data,
    pickupDate: moment(time).utc().toISOString(),
    locationTypeId: data.locationTypeId,
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
  url_active: input.iconUrlActive || '',
  name: input.name || null,
  description: input.description || null,
});

const listingAddressFormat = (data) => ({
  id: data.id || null,
});

export default listingAddressFormat;
