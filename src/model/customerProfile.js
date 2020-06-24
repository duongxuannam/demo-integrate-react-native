import { ACCOUNT_TYPE } from '../constants/app';

const setUserProfile = (data) => ({
  token: data.access_token,
  token_type: data.token_type,
  userId: data.object.id,
  userName: data.object.name,
  userEmail: data.object.email,
  userFirstName: data.object.first_name,
  userLastName: data.object.last_name,
  userCountryCode: data.object.country_code,
  userCode: data.object.referral_code,
  userAvatar: data.object.avatar_square,
  userBusiness: data.object.business_name,
});

export const accountFormat = (data) => ({
  id: data.id || data.company_id || null,
  name: data.name || null,
  firstName: data.first_name || data.firstName || null,
  lastName: data.last_name || data.lastName || null,
  phone: data.phone || null,
  email: data.email || null,
  referralCode: data.referral_code || null,
  avatar: data.avatar || data.avatar_square || data.logo_url || null,
  type: data.type || (data.company_id && ACCOUNT_TYPE.COMPANY) || ACCOUNT_TYPE.PERSONAL,
});

export default setUserProfile;
