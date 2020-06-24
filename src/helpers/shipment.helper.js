import moment from 'moment';
import I18N from '../config/locales';
import { newLastDate, getDayFromTimeAddress } from './number';
import { getDistanceMatrix, editDestinationAddress } from '../api/listing';
import { getCoors } from '../services/map.services';
import { dateClientWithISOString } from './date.helper';
import {
  EARLY_DAY_PLUS,
  LATEST_DAY_PLUS,
  EXPRIRED_TIME_LEFT,
  DATE_FORMAT_VN,
} from '../constants/app';
import { isNumber, emailRex } from './regex';
import PROGRESS from '../constants/progress';

export const SHIPMENT_STATUS = {
  DRAFT: 1,
  WAITING_APPROVAL: 2,
  APPROVED: 3,
  HOLD: 4,
  BLOCKED: 5,
  UNLISTED: 6,
  BOOKED: 7,
  INPROGRESS: 8,
  COMPLETED: 9,
  CANCELLED: 10,
};

const translationStatus = (value, languageCode) => I18N.t(`shipment_value.${value.toLowerCase()}`, { locale: languageCode || 'en' });

export const SHIPMENT_VALUE = {
  DRAFT: 'DRAFT',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  HOLD: 'HOLD',
  BLOCKED: 'BLOCKED',
  UNLISTED: 'UNLISTED',
  BOOKED: 'BOOKED',
  INPROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  SCHEDULED: 'SCHEDULED',
};

export const DRIVER_STATUS = {
  WAITING_FOR_DISPATCH: 'WAITING_FOR_DISPATCH',
  WAITING_FOR_PICKUP: 'WAITING_FOR_PICKUP',
  WAITING_FOR_DELIVERY: 'WAITING_FOR_DELIVERY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const parseDriverStatus = (shipmentStatus, pickupStatus, destionations, languageCode) => {
  const statusKey = Object.keys(SHIPMENT_STATUS).find((key) => SHIPMENT_STATUS[key] === shipmentStatus);
  if (SHIPMENT_STATUS[statusKey] === SHIPMENT_STATUS.INPROGRESS) {
    if (pickupStatus === PROGRESS.ADDRESS_PROGRESS_STATUS.COMPLETED) {
      const desNotCompleted = destionations.map((des, index) => des.status === PROGRESS.ADDRESS_PROGRESS_STATUS.IN_PROGRESS && index + 1).filter((i) => i !== false).join(', ');
      return `${translationStatus(DRIVER_STATUS.WAITING_FOR_DELIVERY, languageCode)} ${desNotCompleted}`;
    }
    return translationStatus(DRIVER_STATUS.WAITING_FOR_PICKUP, languageCode);
  }
  return statusKey === SHIPMENT_VALUE.BOOKED ? translationStatus(DRIVER_STATUS.WAITING_FOR_DISPATCH, languageCode) : translationStatus(DRIVER_STATUS[statusKey], languageCode);
};

export const parseStatusToString = (number, languageCode) => {
  const statusKey = Object.keys(SHIPMENT_STATUS).find((key) => SHIPMENT_STATUS[key] === number);
  return statusKey === SHIPMENT_VALUE.BOOKED ? translationStatus(SHIPMENT_VALUE.SCHEDULED, languageCode)
    : translationStatus(SHIPMENT_VALUE[statusKey], languageCode);
};

export const getTransportTypeName = (listTransportType, id) => {
  const transport = listTransportType.find((item) => item.id === id);
  return (transport && transport.name) || null;
};
export const getTransportTypeObj = (listTransportType, id) => listTransportType.find((item) => item.id === id);
export const getUnitName = (listUnit, id) => {
  const unit = listUnit.find((item) => item.id === id);
  return (unit && unit.name) || null;
};
export const getUnitObj = (listUnit, id) => listUnit.find((item) => item.id === id);
export const getAdditionalServices = (listAdditionalServices, id) => {
  const addService = listAdditionalServices.find((item) => item.id === id);
  return (addService && addService.name) || null;
};
export const getAdditionalServicesObj = (listAdditionalServices, id) => listAdditionalServices.find((item) => item.id === id);
export const getLocationServicesName = (listLocations, id) => {
  const location = listLocations.find((item) => item.id === id);
  return (location && location.name) || null;
};
export const getLocationService = (listLocations, id) => listLocations.find((item) => item.id === id);
export const meterToKilometres = (unit) => Number((unit / 1000).toFixed(1));
export const secondsToHms = (seconds) => {
  const h = Math.floor(seconds / 3600);
  return h;
};

export const hmsToSeconds = (hours) => {
  const s = Math.floor(hours * 3600);
  return s;
};

export const transitFormat = (duration) => {
  const hoursDuration = secondsToHms(duration);
  return hoursDuration;
};

export const secondsToDay = (seconds) => {
  let res = 0;
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  if (d === 0) {
    res = 1;
  } else {
    if (h < 12) {
      res = d;
    }
    if (h > 12) {
      res = d + 1;
    }
  }
  return res;
};

export const convertPickupAdrress = (pickup) => ({
  address: pickup.address,
  latitude: pickup.location.latitude,
  longitude: pickup.location.longitude,
  shortAddress: pickup.shortAddress,
  minPickupDate: newLastDate(),
});


const setDataDes = async (pickup, des) => ({
  address: des.address,
  latitude: des.location.latitude,
  longitude: des.location.longitude,
  shortAddress: des.shortAddress,
  duration: await getDistanceMatrix(
    { latitude: pickup.location.latitude, longitude: pickup.location.longitude },
    { latitude: des.location.latitude, longitude: des.location.longitude }
  ),
});

export const convertDestinationAddress = async (pickup, destinations) => {
  const requests = destinations.map((des) => setDataDes(pickup, des));
  const results = await Promise.all(requests);
  return results;
};

export const getNameLocationType = (locationTypes, id) => {
  let objData = null;
  if (locationTypes.length) {
    objData = locationTypes.find((item) => item.id === id);
  }
  return (objData && objData.name) || null;
};

export const parseLocationServicesToObject = (locationServicesDefault, locationServicesSelected) => {
  let res = {};
  locationServicesDefault.forEach((data) => {
    locationServicesSelected.forEach((item) => {
      if (data.id === item) {
        const newData = {
          [item]: { ...data }
        };
        res = { ...res, ...newData };
      }
    });
  });
  return res;
};

export const convertTempAddress = (
  shipmentId,
  locationServicesDefault,
  locationTypesDefault,
  pickupAddress,
  destinationAddress,
  destionations,
  pickup,
) => {
  const pickupFormat = {
    address: pickupAddress.address,
    latitude: pickupAddress.latitude,
    longitude: pickupAddress.longitude,
    locationServices: parseLocationServicesToObject(locationServicesDefault, pickup.locationServices),
    locationTypeId: pickup.locationTypeId,
    pickupDate: new Date(pickup.pickupDate),
    minPickupDate: pickupAddress.minPickupDate,
    showMap: true,
    expanded: true,
    shipmentId,
    id: pickup.id,
    shortAddress: pickupAddress.shortAddress,
  };

  const destinations = destionations.map((destination, index) => ({
    id: destination.id,
    shipmentId,
    dateRangeType: destination.dateRangeType,
    earliestBy: destination.earliestBy,
    earliestByDate: destination.earliestByDate,
    latestBy: destination.latestBy,
    latestByDate: destination.latestByDate,
    locationTypeId: destination.locationTypeId,
    address: destination.address,
    shortAddress: destination.shortAddress,
    locationServices: parseLocationServicesToObject(locationServicesDefault, destination.locationServices),
    latitude: destination.location.latitude,
    longitude: destination.location.longitude,
    name: index + 1,
    showMap: true,
    expanded: true,
    duration: destinationAddress[index].duration,
    minday: computedMinday(destinationAddress[index].duration),
    isDeleted: false,
  }));
  return { pickup: pickupFormat, destinations };
};

export const computedMinday = (duration) => getDayFromTimeAddress(duration);


// STEP 1
export const convertTempBooking = (
  data,
  defaultHandleUnits,
  transportTypesDefault,
  defaultAdditionalServices,
) => {
  if (data.items.length > 0) {
    let count = 0;
    const convertDataTemp = data.items.map((booking, index) => {
      if (booking == null) {
        return null;
      }
      count += 1;
      // const bookDesc = Boolean(dataStep1 && dataStep1.length > 0 && dataStep1[index] && dataStep1[index].goodDesc !== booking.description)
      return {
        id: booking.id,
        name: `${count}`,
        handleUnitSelected: defaultHandleUnits.find((item) => item.id === booking.handlingUnitId),
        isFirstItem: index === 0,
        unitQuantity: booking.unitQuantity,
        length: booking.length,
        width: booking.width,
        height: booking.height,
        weight: booking.weight,
        goodDesc: booking.description,
        itemServices: booking.additionalServices.length > 0 ? parseItemServices(booking.additionalServices, defaultAdditionalServices) : [],
        transportModeSelected: transportTypesDefault.find((item) => item.id === data.transportTypeId),
        shipmentId: data.id,
        isDelete: false,
      };
    });
    return convertDataTemp;
  }
};

const parseItemServices = (additionalServices, defaultAdditionalServices) => {
  const res = [];
  defaultAdditionalServices.forEach((item) => {
    additionalServices.find((add) => {
      if (item.id === add) {
        res.push(item);
      }
    });
  });
  return res;
};

export const callApiGetCoors = async (destination) => {
  const destinationCoors = await getCoors(destination.address);
  const destinationLat = destinationCoors.results[0].geometry.location.lat;
  const destinationLong = destinationCoors.results[0].geometry.location.lng;
  return { latitude: destinationLat, longitude: destinationLong };
};

export const computeLatLongDestinations = async (destinations) => {
  const requests = destinations.map((des) => callApiGetCoors(des));
  const results = await Promise.all(requests);
  return results;
};


export const callApiComputeDiff = async (pickupCoors, destination) => {
  const destinationLat = destination.location.latitude;
  const destinationLong = destination.location.longitude;
  const res = await getDistanceMatrix(pickupCoors, { latitude: destinationLat, longitude: destinationLong });
  return res;
};

export const computeDifferenceAddress = async (pickupCoors, destinations) => {
  const requests = destinations.map((des) => callApiComputeDiff(pickupCoors, des));
  const results = await Promise.all(requests);
  return results;
};

const requestUpdateDestinations = async (des, pickupDate) => {
  let res = null;
  if (dateClientWithISOString(pickupDate) >= dateClientWithISOString(des.earliestByDate)) {
    res = await editDestinationAddress(des.id, {
      dateRangeType: 1,
      earliestByDate: moment(pickupDate).add(EARLY_DAY_PLUS, 'd').utc().toISOString(),
      latestByDate: moment(pickupDate).add(des.earliestBy + LATEST_DAY_PLUS, 'd').utc().toISOString(),
      earliestBy: 1,
      latestBy: 3,
      location: {
        latitude: des.location.latitude,
        longitude: des.location.longitude,
      }
    });
  } else {
    res = await editDestinationAddress(des.id, {
      dateRangeType: 1,
      earliestByDate: des.earliestByDate,
      latestByDate: des.latestByDate,
      earliestBy: moment(dateClientWithISOString(des.earliestByDate)).diff(moment(dateClientWithISOString(pickupDate)), 'd'),
      latestBy: moment(dateClientWithISOString(des.latestByDate)).diff(moment(dateClientWithISOString(pickupDate)), 'd'),
      location: {
        latitude: des.location.latitude,
        longitude: des.location.longitude,
      }
    });
  }
  return res;
};

export const updateBasicDestination = async (destionations, pickupDate) => {
  const requests = destionations.map((des) => requestUpdateDestinations(des, pickupDate));
  const results = await Promise.all(requests);
  return results;
};

export const parseUtcTime = (date) => {
  const d = date.endsWith('Z') ? date : `${date}Z`;
  return moment(d).utc().toISOString();
};


export const computeTimeLeft = (date, expriredTime) => {
  let res = '';
  const time = parseUtcTime(date);
  const timeLeft = moment(time).add(expriredTime, 'h').utc().toISOString();
  const now = moment(new Date()).utc().toISOString();
  const minutesDiff = moment(timeLeft).diff(now, 'minutes');
  const hoursLeft = Math.floor(minutesDiff / 60);
  const minutesLeft = Math.round(minutesDiff % 60);
  if (minutesDiff <= 0) {
    res = EXPRIRED_TIME_LEFT;
  } else {
    res = `${hoursLeft}h ${minutesLeft}m`;
  }
  return res;
};

export const getDateString = (date, country = null, language = 'en', format = null) => {
  let formatString = format || 'DD-MMM-YYYY';
  const d = date.endsWith('Z') ? date : `${date}Z`;
  switch (country) {
    case 'vn':
      if (language === 'vi') {
        formatString = format || DATE_FORMAT_VN;
      }
      return moment(d).local().format(formatString);
    default:
      return moment(d).local().format(formatString);
  }
};

export const getExpiredString = (date, country = null, language = 'en', format = null, duration = 24) => {
  let formatString = format || 'DD-MMM-YYYY';
  const d = date.endsWith('Z') ? date : `${date}Z`;
  switch (country) {
    case 'vn':
      if (language === 'vi') {
        formatString = format || DATE_FORMAT_VN;
      }
      return moment(d).add(duration, 'hours').local().format(formatString);
    default:
      return moment(d).add(duration, 'hours').local().format(formatString);
  }
};

export const IsCanEditShipment = (shipmentStatus) => !(shipmentStatus === SHIPMENT_STATUS.APPROVED
    || shipmentStatus === SHIPMENT_STATUS.UNLISTED
    || shipmentStatus === SHIPMENT_STATUS.BOOKED
    || shipmentStatus === SHIPMENT_STATUS.INPROGRESS
    || shipmentStatus === SHIPMENT_STATUS.COMPLETED);

export const IsShipmentBooked = (shipmentStatus) => (shipmentStatus === SHIPMENT_STATUS.BOOKED
  || shipmentStatus === SHIPMENT_STATUS.INPROGRESS
  || shipmentStatus === SHIPMENT_STATUS.COMPLETED);

export const IsCanCommunication = (shipmentStatus) => (shipmentStatus === SHIPMENT_STATUS.WAITING_APPROVAL
  || shipmentStatus === SHIPMENT_STATUS.APPROVED
  || shipmentStatus === SHIPMENT_STATUS.HOLD
  || shipmentStatus === SHIPMENT_STATUS.BLOCKED
  || shipmentStatus === SHIPMENT_STATUS.UNLISTED
  || shipmentStatus === SHIPMENT_STATUS.BOOKED
  || shipmentStatus === SHIPMENT_STATUS.INPROGRESS
  || shipmentStatus === SHIPMENT_STATUS.COMPLETED);

export const HideDriverInfoCommunication = (shipmentStatus) => (shipmentStatus === SHIPMENT_STATUS.DRAFT
  || shipmentStatus === SHIPMENT_STATUS.WAITING_APPROVAL
  || shipmentStatus === SHIPMENT_STATUS.APPROVED);

export const parseSettingsToObj = (settings) => {
  let res = {};
  settings.forEach((item) => {
    res = {
      ...res,
      [item.key]: isNumber(item.value) ? item.value - 0 : item.value,
    };
  });
  return res;
};

const validEmailWithSplitNote = (note) => {
  const notesArr = note.split(' ');
  const res = [];
  notesArr.forEach((data) => {
    if (emailRex(data)) {
      res.push(true);
    }
  });
  return res.indexOf(true) > -1;
};

export const checkValidNote = (note, countryCode) => {
  if (note) {
    const isFormatEmail = emailRex(note) || validEmailWithSplitNote(note);
    const isFormatPhone = /[+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,15}/gm.test(note);
    return !(isFormatEmail || isFormatPhone);
  }
  return true;
};
