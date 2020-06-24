import axios from 'axios';
import { Platform } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import FormData from 'form-data';
import RNFetchBlob from 'rn-fetch-blob';
import api from '../helpers/api';
import { validateIsFilePDF } from '../helpers/regex';
import API_URL, { API_CONTENT_MODE } from '../constants/apiUrl';
import { API_METHOD } from '../constants/enumsAPI';
import { PROGRESS_TYPE } from '../constants/app';

export const requestHandleUnits = (countryName = 'en-US') => api(`${API_URL.SUMMARY_HANDLE_UNIT}?culture=${countryName}`, API_METHOD.GET);
export const requestLocationTypes = (countryName = 'en-US') => api(`${API_URL.SUMMARY_LOCATION_TYPE}?culture=${countryName}`, API_METHOD.GET);
export const requestTransportTypes = (countryName = 'en-US') => api(`${API_URL.CONFIGURATION}/transport-types?culture=${countryName}`, API_METHOD.GET);
export const requestAdditionalServices = (countryName = 'en-US') => api(`${API_URL.CONFIGURATION}/additional-services?culture=${countryName}`, API_METHOD.GET);
export const requestLocationServices = (countryName = 'en-US') => api(`${API_URL.CONFIGURATION}/location-services?culture=${countryName}`, API_METHOD.GET);

export const getShipmentDetail = (shipmentId) => api(`${API_URL.SHIPMENT}/${shipmentId}/detail`, API_METHOD.GET);

export const requestCreateQuote = (data) => api(`${API_URL.CREATE_QUOTE}`, API_METHOD.POST, data);

export const getQuoteDetail = (query) => api(`${API_URL.SHIPMENT}/quote-detail`, API_METHOD.POST, query);

export const getProgressDetail = (shipmentId) => api(`${API_URL.SHIPMENT}/${shipmentId}/progress`, API_METHOD.GET);

export const updateProgress = (shipmentId, params) => api(`${API_URL.SHIPMENT}/${shipmentId}/progress`, API_METHOD.PUT, params);

export const uploadPhotoProgress = (shipmentId, params) => {
  const isFilePDF = validateIsFilePDF(params.Data.driverFiles);
  let section = params.Section;
  if (section === PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase())) {
    section = 'Delivery';
  }

  const apiUrl = API_URL.UPLOAD_PROGRESS_PHOTO.replace('[shipment_id]', shipmentId).replace('[progress_status]', section);
  const formData = new FormData();
  const imgSplit = isFilePDF ? null : params.Data.driverFiles.fileName.split('.');
  formData.append('files', {
    uri: params.Data.driverFiles.uri, // your file path string
    name: isFilePDF ? params.Data.driverFiles.name : params.Data.driverFiles.fileName,
    type: isFilePDF ? params.Data.driverFiles.type : (`image/${imgSplit[imgSplit.length - 1]}`)
  });
  return api(
    apiUrl,
    API_METHOD.POST,
    formData,
    {},
    null,
    API_CONTENT_MODE.FORM_DATA
  );
};

export const removePhotoProgress = (shipmentId, params) => {
  const apiUrl = API_URL.REMOVE_PROGRESS_PHOTO.replace('[file_name]', params.Data.driverFiles.fileName);
  return api(
    apiUrl,
    API_METHOD.DELETE
  );
};

export const updateAddressProgress = (shipmentId, params) => api(API_URL.CONFIRM_ADDRESS_DESTINATION.replace('[shipment_id]', shipmentId), API_METHOD.PUT, params);

export const getTotalStatusFilter = () => api(`${API_URL.SEARCH_SHIPMENT}/total`, API_METHOD.GET);

export const getPaymentInformation = (shipmentId) => api(
  `${API_URL.SHIPMENT}/${shipmentId}/payment`,
  API_METHOD.GET,
);

export const updateBankInstructions = (shipmentId, params) => api(
  `${API_URL.SHIPMENT}/${shipmentId}/bank-instructions`,
  API_METHOD.PUT,
  params
);

export const paymentRequestChange = (shipmentId, option) => {
  if (option) {
    return api(
      `${API_URL.SHIPMENT}/${shipmentId}/payment-change-request/accept`,
      API_METHOD.PUT
    );
  }

  return api(
    `${API_URL.SHIPMENT}/${shipmentId}/payment-change-request/decline`,
    API_METHOD.PUT
  );
};

export const downloadData = (item, chat = false) => new Promise((resolve, reject) => {
  const fileName = item.fullFileName;
  const appendExt = item.fullFileName.split('.');
  const appendExt1 = appendExt[appendExt.length - 1];

  const { dirs } = RNFetchBlob.fs;
  const path = Platform.OS === 'ios'
    ? `${dirs.MainBundleDir}/${fileName}`
    : `${dirs.DownloadDir}/${fileName}`;

  if (Platform.OS === 'ios' && String(appendExt1).match(/jpg|jpeg|png/g)) {
    CameraRoll.save(item.imageUrl, {
      type: 'photo'
    }).then((res) => resolve({
      data: true,
      isSuccess: true
    }));
  } else {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: `${appendExt1}`,
      indicator: true,
      IOSBackgroundTask: true,
      path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path,
        description: 'download file',
      },
    })
      .fetch('GET', chat ? item.messageContent : item.imageUrl)
      .then(res => {
        resolve({
          data: item,
          isSuccess: true,
        });
      });
  }
});

export const updateShipmentChat = (shipmentId, params) => api(
  `${API_URL.SHIPMENT}/${shipmentId}/chat`,
  API_METHOD.POST,
  params
);