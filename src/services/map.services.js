import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

const convertDestinatonsParams = (destinatons) => {
  let params = '';
  destinatons.forEach((destinaton) => {
    params += `${destinaton.latitude},${destinaton.longitude}|`
  });
  return params;
}

const API_KEY = 'AIzaSyCf08-veAl7V_yEzDjD5x2861kFtcpWmUo';
export const getAddress = (lat, long) => api(`${API_URL.GOOGLE_MAP_API}?address=${lat},${long}&key=${API_KEY}`, API_METHOD.POST);
export const getDistancematrix = (origins, destinatons) => {
  return api(`${API_URL.GOOGLE_MAP_DISTANCE_MATRIX}?origins=${origins.latitude},${origins.longitude}&destinations=${convertDestinatonsParams(destinatons)}&key=${API_KEY}`, API_METHOD.POST)
};