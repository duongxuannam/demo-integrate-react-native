export const configModel = (data = []) => ({
  Pagination: getDataFromKey('Pagination', data, 20, true),
  UserAgreementURL: getDataFromKey('UserAgreementURL', data, 'https://www.deliveree.com/'),
  TermConditionsURL: getDataFromKey('TermConditionsURL', data, 'https://www.deliveree.com/'),
  ServiceURL: getDataFromKey('ServiceURL', data, 'https://www.deliveree.com/'),
  CancellationPolicyURL: getDataFromKey('CancellationPolicyURL', data, 'https://www.deliveree.com/'),
  BidingCreditNeed: getDataFromKey('BidingCreditNeed', data, 1, true),
  MaxRadius: getDataFromKey('MaxRadius', data, 300, true),
  MinRadius: getDataFromKey('MinRadius', data, 1, true),
  BufferTime: getDataFromKey('BufferTime', data, 5184000, true),
  PopupAutoHideCountDown: getDataFromKey('PopupAutoHideCountDown', data, 5000, true),
  LTLCustomerLink: getDataFromKey('LTLCustomerLink', data, ''),
  PrivatePolicyURL: getDataFromKey('PrivatePolicyURL', data, 'https://www.deliveree.com/'),
  DefaultAvatarURL: getDataFromKey('DefaultAvatarURL', data, 'https://www.deliveree.com/'),
  RandomAvatarURL: getDataFromKey('RandomAvatarURL', data, 'https://www.deliveree.com/'),
});

const getDataFromKey = (keyFind, arrData = [], defaultValue, isNumber = false) => {
  const dataFind = arrData.find((item) => item.key === keyFind);
  if (dataFind) {
    if (isNumber) {
      return parseInt(dataFind.value, 10);
    }
    return dataFind.value;
  }
  return defaultValue;
};

const configData = null;

export default configData;