const initState = {
  data: {}
};

const updatePaymentRequestChange = (state, option) => {
  const newData = { ...state.data };
  // option === true ~ accept
  if (option) {
    newData.paymentMethod = state.data.requestChange.paymentMethod;
  }
  newData.requestChange = null;
  return { data: newData };
};

const updatePaymentBankInfo = (state, data) => {
  const newData = { ...state.data };
  // console.log('newData 1: ', newData);
  newData.accountName = data.bankAccount;
  newData.accountNumber = data.bankAccountNumber;
  newData.bankCode = data.bankCode;
  newData.bankName = data.bankName;
  // console.log('newData 2: ', newData);
  return { data: newData };
}

const paymentState = {
  initState,
  updatePaymentRequestChange,
  updatePaymentBankInfo
};

export default paymentState;
