import { defaultCountriesData } from '../constants/countries';
/**
 * Get list countriesData with format
 * @param {countriesData} countriesData
 */

export const formatCountriesData = (countriesData) => {
  return countriesData.map((country) => ({
    name: country[0],
    iso2: country[1],
    dialCode: country[2],
    priority: country[3] || 0,
    areaCodes: country[4] || null
  }));
};

/**
 * Get dialCode with countryCode
 * @param {countryCode} countryCode
 */

export const getDialCodeWithCountryCode = (countryCode) => {
  const countryList = formatCountriesData(defaultCountriesData);
  const country = countryList.filter((item) => item.iso2 === countryCode)
  return country;
};
