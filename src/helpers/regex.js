import googlePhoneNumber from 'google-libphonenumber';
import { getDistance } from 'geolib';
import { Platform } from 'react-native';
import { FILE_TYPE } from '../constants/app';

export const formatMetricsWithCommas = (text) => String(text).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const validatePhoneNumberWithCountry = (phoneNumber, countryCode) => {
  try {
    const phoneUtils = googlePhoneNumber.PhoneNumberUtil.getInstance();
    const phoneObject = phoneUtils.parse(phoneNumber, countryCode);
    return phoneUtils.isValidNumberForRegion(phoneObject, countryCode);
  } catch (ex) {
    return false;
  }
};

const bytesToSize = (bytes) => (bytes / 1024 ** 2);

export const validateFile = (file) => {
  const regexImgMime = /image\/(jpg|jpeg|pjpeg|x-png|gif|png)$/i;
  const typeFromName = Platform.OS === 'android' ? `image/${file.fileName.split('.')[1]}` : file.type;
  if (regexImgMime.test(file.type) || regexImgMime.test(typeFromName)) {
    if (bytesToSize(file.fileSize) <= 5) {
      return true;
    }
    return {
      type: 'size',
      file,
    };
  }
  return {
    type: 'type',
    file,
  };
};

export const validateIsFileImage = (file) => {
  if (file.fileName === null || file.fileName === undefined) {
    return false;
  }
  const regexImgMime = /image\/(jpg|jpeg|pjpeg|x-png|gif|png)$/i;
  const typeFromName = Platform.OS === 'android' ? `image/${file.fileName.split('.')[1]}` : file.type;
  if (regexImgMime.test(file.type) || regexImgMime.test(typeFromName) || regexImgMime.test(file.contentType)) {
    return true;
  }
  return false;
};

export const validateFilePDF = (file) => {
  const regexPDFMime = /\/(pdf)$/i;
  if (regexPDFMime.test(file.type) || regexPDFMime.test(file.contentType)) {
    if (bytesToSize(file.size) <= 5) {
      return true;
    }
    return {
      type: 'size',
      file,
    };
  }
  return {
    type: 'type',
    file,
  };
};

export const validateIsFilePDF = (file) => {
  if (file.contentType === null) {
    return false;
  }
  const regexPDFMime = /\/(pdf)$/i;
  if (regexPDFMime.test(file.type) || regexPDFMime.test(file.contentType)) {
    return true;
  }
  return false;
};

export const getDistanceBetween2Coordinate = (coord1, coord2) => getDistance(coord1, coord2);

export const decodedData = (bytes) => {
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
};

export const validateFileAttachment = (file, limitSize = 5) => {
  const regexImgMime = 'image/(jpg|jpeg|pjpeg|x-png|gif|png)';
  const regexDocMime = `application/(${FILE_TYPE.PDF}|${FILE_TYPE.MS_POWERPOINT}|${FILE_TYPE.MS_POWERPOINT_OPEN_XML}|${FILE_TYPE.MS_WORD}|${FILE_TYPE.MS_WORD_OPEN_XML}|${FILE_TYPE.MS_EXCEL}|${FILE_TYPE.MS_EXCEL_OPEN_XML}|${FILE_TYPE.MS_WORDX})`;
  const myRegexImage = new RegExp(regexImgMime, 'g');
  const myRegexDoc = new RegExp(regexDocMime, 'g');
  const myRegexTextPlain = new RegExp(FILE_TYPE.TXT, 'g');
  const myRegexCSV = new RegExp(FILE_TYPE.CSV, 'g');
  if (Array.isArray(myRegexImage.exec(file.type)) || Array.isArray(myRegexDoc.exec(file.type))
  || Array.isArray(myRegexTextPlain.exec(file.type)) || Array.isArray(myRegexCSV.exec(file.type))) {
    if (bytesToSize(file.size) < limitSize) {
      return true;
    }
    return {
      type: 'size',
      file,
    };
  }
  return {
    type: 'type',
    file,
  };
};

export const IMAGE_REGEX = /image\/(jpg|jpeg|pjpeg|x-png|gif|png)$/i;