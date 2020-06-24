import moment from 'moment';
import I18n from '../config/locales';
import { EXPRIRED_TIME_LEFT, ADDRESS_STATUS } from '../constants/app';
import { SHIPMENT_STATUS } from './constant.helper';

export const getTransportTypeName = (listTransportType, id) => {
  const transportItem = listTransportType.find((item) => item.id === id);
  return (transportItem && transportItem.name) || 'unknown';
};

export const getUnitName = (listUnit, id) => {
  const handleUnitItem = listUnit.find((item) => item.id === id);
  return (handleUnitItem && handleUnitItem.name) || 'unknown';
};

export const getAdditionalServices = (listAdditionalServices, id) => {
  const mappedItem = listAdditionalServices.find((item) => item.id === id);
  return (mappedItem && mappedItem.name) || 'unknown';
};

export const getLocationServicesName = (listLocations, id) => {
  const mappedItem = listLocations.find((item) => item.id === id);
  return (mappedItem && mappedItem.name) || 'unknown';
};

export const meterToKilometres = (unit) => Number((unit / 1000).toFixed(1));

export const roundToMatch = (value, number = 2) => Number(value).toFixed(number);

export const roundDecimalToMatch = (value, number = 2) => {
  const intValue = Number(value - 0);
  if (Number.isInteger(intValue)) {
    return intValue.toString();
  }
  return intValue.toFixed(number);
};

export const secondsToHms = (seconds) => {
  const h = Number((seconds / 3600).toFixed(1));
  const m = Math.floor(seconds % 3600 / 60);
  return h;
};

export const getDateString = (date, country = null, language = 'en', format = null) => {
  let formatString = format || 'DD-MMM-YYYY';
  const d = date.endsWith('Z') ? date : `${date}Z`;
  switch (country) {
    case 'vn':
      if (language === 'vi') {
        formatString = format || 'DD-[Th]MM-YYYY';
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
        formatString = format || 'DD-[Th]MM-YYYY';
      }
      return moment(d).add(duration, 'hours').local().format(formatString);
    default:
      return moment(d).add(duration, 'hours').local().format(formatString);
  }
};

export const parseUtcTime = (date) => {
  const d = date.endsWith('Z') ? date : `${date}Z`;
  return moment(d).utc().toISOString();
};

export const computeTimeLeft = (date) => {
  let res = '';
  const time = parseUtcTime(date);
  const timeLeft = moment(time).add(1, 'd').utc().toISOString();
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

const translationStatus = (value, languageCode) => I18n.t(`shipment_value.${value.toLowerCase()}`, { locale: languageCode || 'en' });

export const parseDriverStatus = (shipmentStatus, pickupStatus, destionations, languageCode) => {
  const statusKey = Object.keys(SHIPMENT_STATUS).find((key) => SHIPMENT_STATUS[key] === shipmentStatus);
  if (SHIPMENT_STATUS[statusKey] === SHIPMENT_STATUS.IN_PROGRESS) {
    if (pickupStatus === ADDRESS_STATUS.COMPLETED) {
      const desNotCompleted = destionations.map((des, index) => des.status === ADDRESS_STATUS.IN_PROGRESS && index + 1).filter((i) => i !== false).join(', ');
      return `${translationStatus(DRIVER_STATUS.WAITING_FOR_DELIVERY, languageCode)} ${desNotCompleted}`;
    }
    return translationStatus(DRIVER_STATUS.WAITING_FOR_PICKUP, languageCode);
  }
  return statusKey === SHIPMENT_VALUE.BOOKED ? translationStatus(DRIVER_STATUS.WAITING_FOR_DISPATCH, languageCode) : translationStatus(DRIVER_STATUS[statusKey], languageCode);
};

export const isBookedShipment = (shipmentStatus) => (shipmentStatus === SHIPMENT_STATUS.BOOKED
  || shipmentStatus === SHIPMENT_STATUS.IN_PROGRESS
  || shipmentStatus === SHIPMENT_STATUS.COMPLETED);

export const MsgCarrierBid = (listQuote, carrierBid, targetPrice, languageCode) => {
  let msg = '';
  const percentFair = (targetPrice / 100) * 10;
  const otherPercent = 11;
  const minFair = targetPrice - percentFair;
  const maxFair = targetPrice + percentFair;
  if (carrierBid < minFair
      || (carrierBid >= minFair && carrierBid <= maxFair)
  ) {
    let n = 1;
    listQuote.forEach((quote) => {
      if (quote.bid <= carrierBid) {
        n += 1;
      }
    });
    msg = I18n.t('bid.health_check.fair', {
      n,
      locale: languageCode
    });
  } else if (carrierBid > (targetPrice / 100) * otherPercent) {
    msg = I18n.t('bid.health_check.higher_bid', {
      n: otherPercent,
      locale: languageCode
    });
  } else {
    msg = I18n.t('bid.health_check.lower_bid', {
      n: otherPercent,
      locale: languageCode
    });
  }
  return msg;
};
