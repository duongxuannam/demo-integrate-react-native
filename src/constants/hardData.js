import IMAGE_CONSTANT from './images';

export const LANGUAGES = [
  {
    name: 'menu.indonesia',
    countryCode: 'id',
    callingCode: '+62',
    icon: IMAGE_CONSTANT.flagIndonesia,
    language: [
      { text: 'menu.english', lang: 'en' },
      { text: 'menu.indonesian', lang: 'id' },
    ],
  },
  {
    name: 'menu.philippines',
    countryCode: 'ph',
    callingCode: '+63',
    icon: IMAGE_CONSTANT.flagPhilippines,
    language: [
      { text: 'menu.english', lang: 'en' },
    ],
  },
  {
    name: 'menu.thailand',
    countryCode: 'th',
    callingCode: '+66',
    icon: IMAGE_CONSTANT.flagThailand,
    language: [
      { text: 'menu.english', lang: 'en' },
      { text: 'menu.thai', lang: 'th' },
    ],
  },
  {
    name: 'menu.vietnam',
    countryCode: 'vn',
    callingCode: '+84',
    icon: IMAGE_CONSTANT.flagVietnam,
    language: [
      { text: 'menu.english', lang: 'en' },
      { text: 'menu.vietnamese', lang: 'vi' },
    ],
  },
];

export const DASHBOARD = ['menu.loads_dashboard', 'menu.full_vehicle_dashboard'];

const hardData = {
  LANGUAGES,
};

export default hardData;
