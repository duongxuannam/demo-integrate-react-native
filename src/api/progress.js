import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const getProgress = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/progress`, API_METHOD.GET, null, {
  countryCode
});
export const updateProgress = (shipmentId, body) => api(`${API_URL.SHIPMENT}/${shipmentId}/progress`, API_METHOD.PUT, body);
export const uploadDispatchedAttackment = (shipmentId, file) => api(`${API_URL.SHIPMENT}/${shipmentId}/dispatched-attachment`, API_METHOD.POST, file, {
  'Content-Type': 'multipart/form-data',
});
export const uploadProgressAttackment = (id, section, file) => api(`${API_URL.SHIPMENT}/${id}/progress-attachment/${section}`, API_METHOD.POST, file, {
  'Content-Type': 'multipart/form-data',
});
export const deleteProgressAttackment = (fileName) => api(`${API_URL.SHIPMENT}/${fileName}/progress-attachment`, API_METHOD.DELETE);
