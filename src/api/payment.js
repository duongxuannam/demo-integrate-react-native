import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import api from '../helpers/api';
import API_URL from '../constants/apiUrl';
import { IMAGE_REGEX } from '../helpers/regex';
import { API_METHOD } from '../constants/enumsAPI';

export const getPayment = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/payment`, API_METHOD.GET, null, {
  countryCode
});
export const requestChangePaymentMethod = (shipmentId, type, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/change-payment-method/${type}`, API_METHOD.POST, null, {
  countryCode
});
export const requestAmendPaymentMethod = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/payment-change-request/customer/cancel`, API_METHOD.PUT, null, {
  countryCode
});
export const uploadProof = (shipmentId, photo, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/upload-payment-proof-files`, API_METHOD.POST, photo, {
  countryCode
});
export const deleteProof = (shipmentId, proofId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/remove-uploaded-payment-proof-files/${proofId}`, API_METHOD.DELETE, null, {
  countryCode
});

export const sendAttachment = (data, countryCode) => api(`${API_URL.CHAT_ATTACHMENT}`, API_METHOD.POST, data, null, {
  countryCode
});

export const downloadData = (item) => new Promise((resolve, reject) => {
  const fileName = item.fullFileName;
  const appendExt = item.fullFileName.split('.');
  const appendExt1 = appendExt[appendExt.length - 1];

  const { dirs } = RNFetchBlob.fs;
  const path = Platform.OS === 'ios'
    ? `${dirs.MainBundleDir}/${fileName}`
    : `${dirs.DownloadDir}/${fileName}`;

  if (Platform.OS === 'ios' && IMAGE_REGEX.test(item.contentType)) {
    CameraRoll.save(item.imageUrl, {
      type: 'photo',
    }).then((res) => resolve({
      data: true,
      isSuccess: true,
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
      .fetch('GET', item.messageContent)
      .then((res) => {
        resolve({
          data: item,
          isSuccess: true,
        });
      });
  }
});

export const confirmPaymentCompleted = (shipmentId, countryCode) => api(`${API_URL.SHIPMENT}/${shipmentId}/completed-payment`, API_METHOD.PUT, null, {
  countryCode
});
