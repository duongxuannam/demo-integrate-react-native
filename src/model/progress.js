import {PROGRESS_TYPE} from '../constants/app';
import {SHIPMENT_STATUS} from '../helpers/constant.helper';

export const bookedUI = (data = {}, status) => ({
  customerNotes: data.customerNotes || '',
  customerFiles: data.customerAttachments || [],
  driverNotes: data.driverNotes || '',
  driverFiles: (data.driverAttachments &&
    data.driverAttachments.length > 0 && [
      ...getDataFile(data.driverAttachments),
    ]) || [fileData(), fileData(), fileData()],
  bookedDate: data.bookedDate,
  active: data.active || status >= SHIPMENT_STATUS.BOOKED,
  type: PROGRESS_TYPE.BOOKED,
  // noEdit: data.noEdit || false,
});

const getDataFile = files => {
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

const fileData = (data = {}) => ({
  fileName: data.fileName || null,
  imageUrl: data.imageUrl || null,
  contentType: data.contentType || null,
});

export const dispatchUI = (data = {}) => ({
  customerNotes: data.customerNotes || '',
  customerFiles: data.customerAttachments || [],
  vehicles: selectData(data.savedVehicle),
  // vehicles: data.savedVehicle,
  truckMake: data.truckMake,
  model: data.mode,
  transportMode: data.transportMode,
  license: data.licencePlate,
  colour: data.color,
  driverName: data.driverName || '',
  driverMobile: data.driverPhone || '',
  type: PROGRESS_TYPE.DISPATCH,
  active: data.isConfirmed,
  pickupDate: data.pickupDate,
});

const selectData = data => ({
  value: 3,
  name: data || 'New',
});

export const pickupUI = (data = {}) => ({
  ...bookedUI(data),
  addressId: data.addressId,
  pickupDate: data.pickupDate,
  status: data.status,
  address: data.address,
});

export const destinationUI = (data = {}) => ({
  ...bookedUI(data),
  addressId: data.addressId,
  deliveryDate: data.deliveryDate,
  status: data.status,
  address: data.address,
});

const progress = null;

export default progress;
