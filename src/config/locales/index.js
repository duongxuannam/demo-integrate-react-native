import I18n from 'react-native-i18n';
import en from './en.json';
import vi from './vi.json';
import th from './th.json';
import id from './id.json';
import { store } from '../../store';

I18n.fallbacks = true;
I18n.locale = 'en';
I18n.translations = {
  en,
  vi,
  th,
  id
};

I18n.langs = [
  'en',
  'vi',
  'th',
  'id',
];

I18n.switchLanguage = (langs) => {
  I18n.locale = langs;
};

export default I18n;
