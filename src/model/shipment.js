import { MAP_POINT_TYPE } from '../constants/app';

export const googleMapPickup = (data) => ({
  coordinate: {
    latitude: data.latitude || 10.7751766,
    longitude: data.longitude || 106.68081
  },
  shipmentId: data.shipmentId || 'id1',
  detail: {
    listing_start: '05:13, 13-May-19',
    days_left: '3 days',
    pickup: 'Commercial (with loading dock or forklift)',
    delivery: 'Commercial (with ...)',
    items: '2',
    weight: '396.2 Kg',
    size: 'L(3 ft 3 in), W(3 ft 3 in), H(3 ft 3 in)',
    quotes: '3'
  },
  showDetail: false,
  type: MAP_POINT_TYPE.FROM
});

export const googleMapDestination = (data) => ({
  latitude: data.latitude || 10.7616855,
  longitude: data.longitude || 106.6693945,
  type: MAP_POINT_TYPE.TO
});

const shipmentModel = {
  googleMapPickup,
  googleMapDestination
};

export default shipmentModel;
