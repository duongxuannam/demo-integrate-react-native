import IMAGE_CONSTANT from './images';

export const LANGUAGES = [
  {
    name: 'menu.indonesia',
    countryCode: 'id',
    callingCode: '+62',
    icon: IMAGE_CONSTANT.flagIndonesia,
    language: [
      {
        text: 'menu.english', lang: 'en', label: 'English', icon: IMAGE_CONSTANT.flagEng
      },
      {
        text: 'menu.indonesian', lang: 'in', label: 'Indonesia', icon: IMAGE_CONSTANT.flagIndonesia
      },
      {
        text: 'menu.indonesian', lang: 'id', label: 'Indonesia', icon: IMAGE_CONSTANT.flagIndonesia
      },
    ],
  },
  {
    name: 'menu.philippines',
    countryCode: 'ph',
    callingCode: '+63',
    icon: IMAGE_CONSTANT.flagPhilippines,
    language: [
      {
        text: 'menu.english', lang: 'en', label: 'English', icon: IMAGE_CONSTANT.flagEng
      },
    ],
  },
  {
    name: 'menu.thailand',
    countryCode: 'th',
    callingCode: '+66',
    icon: IMAGE_CONSTANT.flagThailand,
    language: [
      {
        text: 'menu.english', lang: 'en', label: 'English', icon: IMAGE_CONSTANT.flagEng
      },
      {
        text: 'menu.thai', lang: 'th', label: 'Thailand', icon: IMAGE_CONSTANT.flagThailand
      },
    ],
  },
  {
    name: 'menu.vietnam',
    countryCode: 'vn',
    callingCode: '+84',
    icon: IMAGE_CONSTANT.flagVietnam,
    language: [
      {
        text: 'menu.english', lang: 'en', label: 'English', icon: IMAGE_CONSTANT.flagEng
      },
      {
        text: 'menu.vietnamese', lang: 'vi', label: 'Vietnam', icon: IMAGE_CONSTANT.flagVietnam,
      },
    ],
  },
];

export const DASHBOARD = ['menu.loads_dashboard', 'menu.full_vehicle_dashboard'];

const hardData = {
  LANGUAGES,
};

export default hardData;
