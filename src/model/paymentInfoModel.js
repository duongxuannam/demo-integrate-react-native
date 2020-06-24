export const paymentInfoFormat = (data) => ({
  shipmentId: '' || data.shipmentId,
  paymentMethod: 0 || data.paymentMethod,
  amount: 0 || data.amount,
  commission: 0 || data.commission,
  totalAmount: 0 || data.totalAmount,
  accountNumber: '' || data.accountNumber,
  accountName: '' || data.accountName,
  // bankName: '' || data.bankName,
  bankName: null || data.bankName,
  listBankName: selectData(data.bankName), // mock
  bankCode: null || data.bankCode,
  // paymentProofs: (data.paymentProofs
  //   && data.paymentProofs.length > 0 && [
  //   ...getDataFile(data.paymentProofs),
  // ]) || [fileData(), fileData(), fileData()],
  paymentProofs: data.paymentProofs || [],
  requestChange: null || data.requestChange,
  // requestChange: null,
  currency: null || data.currency,
});

const fileData = (data = {}) => ({
  fileName: data.fileName || null,
  imageUrl: data.imageUrl || null,
  contentType: data.contentType || null,
});

const getDataFile = (files) => {
  const limited = 3 - files.length;
  const result = [...files];
  if (limited > 0) {
    for (let index = 0; index < limited; index += 1) {
      const element = fileData();
      result.push(element);
    }
  }
  return result;
};

const selectData = data => ([
  { value: 3, name: data || 'ACB Bank' },
  { value: 4, name: 'VP Bank' }
]);

const paymentInfoModel = null;

export default paymentInfoModel;
