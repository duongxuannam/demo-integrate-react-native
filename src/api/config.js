import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const getConfigSettings = (countryCode) => api(`${API_URL.CONFIGURATION}/settings/driver/${countryCode}`, API_METHOD.GET);
