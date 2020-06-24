import googlePhoneNumber from 'google-libphonenumber';
import { getDistance } from 'geolib';
import {Platform} from 'react-native';
import { FILE_TYPE } from '../constants/app';

export const emailRex = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const pwdRex = (password) => {
  const re = /^.{6,}$/;
  return re.test(String(password));
};

export const validatePhoneNumberWithCountry = (phoneNumber, countryCode) => {
  try {
    const phoneUtils = googlePhoneNumber.PhoneNumberUtil.getInstance();
    const phoneObject = phoneUtils.parse(phoneNumber, countryCode);
    return phoneUtils.isValidNumberForRegion(phoneObject, countryCode);
  } catch (ex) {
    return false;
  }
};

export const formatMetricsWithCommas = (text) => String(text).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const positiveValue = (value) => {
  const re = /^\d+(\.\d{1,2})?$/;
  return re.test(String(value));
}

export const formatPrice = (price) => {
  return formatMetricsWithCommas(String(price));
}

export const setUnitPrice = (countryName) => {
  let unitPrice = '';
  switch (countryName) {
    case 'vn':
      unitPrice = '₫';
      break;
    case 'th':
      unitPrice = '฿';
      break;
    case 'id':
      unitPrice = 'Rp';
      break;
    case 'ph':
      unitPrice = '₱';
      break;
    default:
      break;
  }
  return unitPrice;
}

export const truncateString = (string, maxLength) => {
  if (string.toString().length <= maxLength) return string;
  return `${string.substring(0, maxLength)}...`;
}

const bytesToSize = (bytes) => Math.round(bytes / 1024 ** 2, 2);

export const validateFileProof = (file, limitSize = 8) => {
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

export const validateFile = (file, limitSize = 8) => {
  const regexImgMime = /image\/(jpg|jpeg|pjpeg|x-png|gif|png)$/i;
  const typeFromName = Platform.OS === 'android' ? `image/${file.fileName.split('.')[1]}` : file.type;
  if (regexImgMime.test(file.type) || regexImgMime.test(typeFromName)) {
    if (bytesToSize(file.fileSize) < limitSize) {
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


// export const validateFilePDF = (file, limitSize = 8) => {
//   const regexPDFMime = /\/(pdf,xls,xlsx,txt)$/i;
//   if (regexPDFMime.test(file.type) || regexPDFMime.test(file.contentType)) {
//     if (bytesToSize(file.size) < limitSize) {
//       return true;
//     }
//     return {
//       type: 'size',
//       file,
//     };
//   }
//   return {
//     type: 'type',
//     file,
//   };
// };

export const validateFilePDF = (file, limitSize = 8) => {
  const regexPDFMime = /\/(pdf)$/i;
  if (regexPDFMime.test(file.type) || regexPDFMime.test(file.contentType)) {
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
// export const validateFiles = (files) => {
//   const validImg = [];
//   const invalidImg = [];
//   const regexImgMime = IMAGE_REGEX;
//   files.forEach((file) => {
//     if (regexImgMime.test(file.type) || file.type === `application/${FILE_TYPE.PDF}`) {
//       if (bytesToSize(file.size) < 8) {
//         validImg.push(file);
//       } else {
//         invalidImg.push({ type: 'size', file });
//       }
//     } else {
//       invalidImg.push({ type: 'type', file });
//     }
//   });
//   return { validImg, invalidImg };
// };

export const validateFiles = (files, Platform) => {
  const validImg = [];
  const invalidImg = [];
  const regexImgMime = /image\/(jpg|jpeg|pjpeg|x-png|gif|png)$/i;
  files.forEach((file) => {
    if (regexImgMime.test(file.mime)) {
      if (bytesToSize(file.size) < 8) {
        file.uri = file.path;
        file.name = Platform.OS === 'android' ? file.path.split('react-native-image-crop-picker/')[1] : file.filename;
        file.type = file.mime;
        validImg.push(file);
      } else {
        invalidImg.push({ type: 'size', file });
      }
    } else {
      invalidImg.push({ type: 'type', file });
    }
  });
  return { validImg, invalidImg };
};


export const roundDecimalToMatch = (value, number = 2) => {
  const intValue = Number(value - 0);
  if (Number.isInteger(intValue)) {
    return intValue.toString();
  }
  return intValue.toFixed(number);
};

export const setFilesFormData = (files) => {
  const res = [];
  files.forEach((file) => {
    const nameFile = file.path.split('react-native-image-crop-picker/')[1];
    res.push(nameFile);
  });
  return res;
};

export const isNumber = (text) => {
  const reg = /^\d+$/;
  return reg.test(text);
}

export const getDistanceBetween2Coordinate = (coord1, coord2) => getDistance(coord1, coord2);

export const decodedData = (bytes) => {
  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
};