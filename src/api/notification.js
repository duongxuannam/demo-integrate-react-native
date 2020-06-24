import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const getNotification = (page, status = '', limit, codeCountry) => api(
  `${API_URL.NOTIFICATION}?Page=${page}&Status=${status}&Limit=${limit}&culture=${codeCountry}`,
  API_METHOD.GET
);

export const getNotificationDetail = (notificationId) => api(`${API_URL.NOTIFICATION}/${notificationId}`, API_METHOD.GET);

export const markAsRead = (notificationId) => api(
  `${API_URL.NOTIFICATION}/${notificationId}/mark-as-read`,
  API_METHOD.POST
);

export const getTotalUnreadNotification = () => api(`${API_URL.NOTIFICATION}/unread`, API_METHOD.GET);
