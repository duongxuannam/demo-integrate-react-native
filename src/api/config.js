import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const getConfigurationApp = (country) => api(`${API_URL.GET_ALL_SETTINGS}/customer/${country}`, API_METHOD.GET);
