import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

const convertDestinatonsParams = (destinatons) => {
  let params = '';
  destinatons.forEach((destinaton) => {
    params += `${(destinaton.location && destinaton.location.latitude) || destinaton.latitude},${(destinaton.location && destinaton.location.longitude) || destinaton.longitude}|`;
  });
  return params;
};

const API_KEY = 'AIzaSyCf08-veAl7V_yEzDjD5x2861kFtcpWmUo';
export const getAddress = (lat, long) => api(`${API_URL.GOOGLE_MAP_GEOCODE_API}?address=${lat},${long}&key=${API_KEY}`, API_METHOD.POST);
export const getCoors = (address) => api(`${API_URL.GOOGLE_MAP_GEOCODE_API}?address=${address}&key=${API_KEY}`, API_METHOD.GET);
export const getDistancematrixService = (origins, destinatons) => api(`${API_URL.GOOGLE_MAP_DISTANCE_MATRIX}?origins=${origins.latitude},${origins.longitude}&destinations=${convertDestinatonsParams(destinatons)}&key=${API_KEY}`, API_METHOD.POST);
export const getPlaceDetail = (placeid) => api(`${API_URL.GOOGLE_MAP_API}/place/details/json?placeid=${placeid}&fields=name,formatted_address&key=${API_KEY}`, API_METHOD.GET);
