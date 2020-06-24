import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';
import { GOOGLE_MAPS_APIKEY } from '../constants/app';

export const getPlaceDetail = (placeid) => api(`${API_URL.GOOGLE_MAP_API}/place/details/json?placeid=${placeid}&key=${GOOGLE_MAPS_APIKEY}`, API_METHOD.GET);
