import I18n from 'react-native-i18n';
import en from './en.json';
import vi from './vi.json';
import th from './th.json';
import id from './id.json';

I18n.fallbacks = true;
I18n.locale = 'en';
I18n.translations = {
  en,
  vi,
  th,
  id,
  in: id,
};

I18n.langs = [
  'en',
  'vi',
  'th',
  'id',
  'in',
];

I18n.switchLanguage = (langs) => {
  I18n.locale = langs;
};

export default I18n;
