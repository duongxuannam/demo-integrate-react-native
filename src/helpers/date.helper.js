import moment from 'moment';
import APP from '../constants/app';
import I18n from '../config/locales';
// eslint-disable-next-line import/prefer-default-export
export const formatDate = (date, country, lang = 'en') => {
  let clientDate = '';
  const d = date.endsWith('Z') ? date : `${date}Z`;

  if (country === 'ph') {
    clientDate = moment(d).utcOffset(8).format('D-MMM');
  } else if (country === 'vn') {
    clientDate = lang && lang === 'vi' ? `${moment(d).utcOffset(7).format('D')}-Th${moment(d).utcOffset(7).format('MM')}` : moment(d).utcOffset(7).format('D-MMM');
  } else {
    clientDate = moment(d).utcOffset(7).format('D-MMM');
  }
  return clientDate;
};

export const dateClientWithISOString = (date) => {
  const d = date.endsWith('Z') ? date : `${date}Z`;
  return moment(d).utc().toISOString();
};

export const dateClientWithFormat = (date, format = null) => {
  const d = date.endsWith('Z') ? date : `${date}Z`;
  return format ? moment(d).local().format(format) : moment(d).local().toISOString();
};

export const lessThanHourAgo = (date, hours) => {
  const d = date.endsWith('Z') ? date : `${date}Z`;
  return moment(d).isAfter(moment().subtract(hours, 'hours'));
};

export const getFormatDate = (countryCode, languageCode) => {
  if (countryCode === 'vn') {
    return languageCode === 'vi'
      ? APP.DATE_TIME_FORMAT_VN
      : APP.DATE_TIME_FORMAT;
  }
  return APP.DATE_TIME_FORMAT;
};

export const getFormatDateDayMonth = (countryCode, languageCode) => {
  if (countryCode === 'vn') {
    return languageCode === 'vi'
      ? APP.DATE_DAY_MONTH_FORMAT_VN
      : APP.DATE_DAY_MONTH_FORMAT;
  }
  return APP.DATE_DAY_MONTH_FORMAT;
};

export const getFormatChat = (countryCode, languageCode) => {
  if (countryCode === 'vn') {
    return languageCode === 'vi'
      ? APP.DATE_TIME_FORMAT_CHAT_VN
      : APP.DATE_TIME_FORMAT_CHAT;
  }
  return APP.DATE_TIME_FORMAT_CHAT;
};

export const mapDayOfWeek = (date, languageCode) => {
  switch (moment(date).weekday()) {
    case 0:
      return I18n.t('shipment.communication.sunday', { locale: languageCode });
    case 1:
      return I18n.t('shipment.communication.monday', { locale: languageCode });
    case 2:
      return I18n.t('shipment.communication.tuesday', { locale: languageCode });
    case 3:
      return I18n.t('shipment.communication.wednesday', { locale: languageCode });
    case 4:
      return I18n.t('shipment.communication.thursday', { locale: languageCode });
    case 5:
      return I18n.t('shipment.communication.friday', { locale: languageCode });
    case 6:
      return I18n.t('shipment.communication.saturday', { locale: languageCode });
    default:
      return '';
  }
};

export const formatDateChat = (date, countryCode, languageCode) => {
  let formatHour = 'hh:mm a';
  const formatWeek = getFormatChat(countryCode, languageCode);
  if (countryCode === 'vn' && languageCode === 'vi') {
    formatHour = 'HH:mm';
  }
  return moment(date).calendar(null, {
    sameDay: `[${I18n.t('shipment.communication.to_day', {
      locale: languageCode,
    })}] ${formatHour}`,
    lastDay: `[${I18n.t('shipment.communication.yesterday', {
      locale: languageCode,
    })}] ${formatHour}`,
    // lastWeek: `[${mapDayOfWeek(date, languageCode)}] ${formatHour}`,
    lastWeek: `${formatWeek}`,
    sameElse: `${formatWeek}`,
  });
};
