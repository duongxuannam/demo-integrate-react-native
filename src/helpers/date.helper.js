import moment from 'moment';
import {
  DATE_TIME_FORMAT_VN,
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_CHAT,
  DATE_TIME_FORMAT_CHAT_VN,
} from "../constants/app";
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

export const getDateFormatByCountry = (countryCode, languageCode = 'en') => {
  if (countryCode === 'vn') {
    return languageCode === 'en' ? 'DD-MMM-YYYY' : 'DD-[Th]MM YYYY';
  }
  return 'DD-MMM-YYYY';
};

export const getFormatDate = (countryCode, languageCode) => {
  if (countryCode === 'vn') {
    return languageCode === 'vi'
      ? DATE_TIME_FORMAT_VN
      : DATE_TIME_FORMAT;
  }
  return DATE_TIME_FORMAT;
};

export const mapDayOfWeek = (date, languageCode) => {
  switch (moment(date).weekday()) {
    case 0:
      return I18n.t('communication.sunday', { locale: languageCode });
    case 1:
      return I18n.t('communication.monday', { locale: languageCode });
    case 2:
      return I18n.t('communication.tuesday', { locale: languageCode });
    case 3:
      return I18n.t('communication.wednesday', { locale: languageCode });
    case 4:
      return I18n.t('communication.thursday', { locale: languageCode });
    case 5:
      return I18n.t('communication.friday', { locale: languageCode });
    case 6:
      return I18n.t('communication.saturday', { locale: languageCode });
    default:
      return '';
  }
};

export const getFormatChat = (countryCode, languageCode) => {
  if (countryCode === "vn") {
    return languageCode === "vi"
      ? DATE_TIME_FORMAT_CHAT_VN
      : DATE_TIME_FORMAT_CHAT;
  }
  return APP.DATE_TIME_FORMAT_CHAT;
};

export const formatDateChat = (date, countryCode, languageCode) => {
  let formatHour = 'hh:mm a';
  const formatWeek = getFormatChat(countryCode, languageCode);
  if (countryCode === 'vn' && languageCode === 'vi') {
    formatHour = 'HH:mm';
  }
  return moment(date).calendar(null, {
    sameDay: `[${I18n.t("communication.to_day", {
      locale: languageCode,
    })}] ${formatHour}`,
    lastDay: `[${I18n.t("communication.yesterday", {
      locale: languageCode,
    })}] ${formatHour}`,
    lastWeek: `${formatWeek}`,
    sameElse: `${formatWeek}`,
  });
};
