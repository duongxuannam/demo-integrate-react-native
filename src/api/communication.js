import api from '../helpers/api';
import API_URL, { API_CONTENT_MODE } from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';

export const sendAttachment = (data) => {
  const formData = new FormData();
  // const imgFileName = data.name;
  const imgFileName = data.fileName || data.name;
  const imgSplit = imgFileName.split('.');
  formData.append('files', {
    uri: data.uri, // your file path string
    name: imgFileName,
    type: data.type || `image/${imgSplit[imgSplit.length - 1]}`,
  });
  return api(
    API_URL.CHAT_ATTACHMENT,
    API_METHOD.POST,
    formData,
    {},
    null,
    API_CONTENT_MODE.FORM_DATA,
  );
};


export const getCustomerInfo = (userId) => api(`${API_URL.USER_SYNC}/${userId}`, API_METHOD.GET);

const communicationAPI = null;

export default communicationAPI;
