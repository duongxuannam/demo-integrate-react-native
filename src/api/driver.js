import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const searchShipment = (query) => api(`${API_URL.SEARCH_SHIPMENT}`, API_METHOD.POST, query);

export const pinShipment = (shipmentID, pinStatus) => (!pinStatus ? api(API_URL.PIN_SHIPMENT.replace('[shipment_id]', shipmentID), API_METHOD.POST)
  : api(API_URL.UNPIN_SHIPMENT.replace('[shipment_id]', shipmentID), API_METHOD.DELETE));

export const getTopLowestBid = (shipmentID, bidPrice) => api(`${API_URL.SHIPMENT}/top-lowest-bid`, API_METHOD.POST, {
  ShipmentId: shipmentID,
  Price: bidPrice
});
