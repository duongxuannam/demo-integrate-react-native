import moment from 'moment';
import {
  bookedUI, dispatchUI, pickupUI, destinationUI
} from '../../model/progress';
import { PROGRESS_TYPE } from '../../constants/app';

const initState = {
  booked: bookedUI({ active: true }),
  dispatch: dispatchUI({ active: true }),
  pickup: pickupUI({ type: PROGRESS_TYPE.PICKUP, active: true }),
  deliveryDestination: [],
  currentProgress: {
    type: PROGRESS_TYPE.BOOKED,
    idDestination: null,
  },
  updatedAt: '',
};

const updatePhotoDataBySection = (state, section, index, data, shipmentID) => {
  const mode = String(section).toLowerCase();
  if (mode === PROGRESS_TYPE.BOOKED.toLowerCase()) {
    const booked = { ...state.booked };
    const newArray = [...booked.driverFiles];
    newArray[index] = {
      fileName: data.fileName || null,
      imageUrl: data.imageUrl || null,
      contentType: data.contentType || null,
    };

    booked.driverFiles = [...newArray];
    return { booked };
  }

  if (mode === PROGRESS_TYPE.PICKUP.toLowerCase()) {
    const pickup = { ...state.pickup };
    const newArray = [...pickup.driverFiles];
    newArray[index] = {
      fileName: data.fileName || null,
      imageUrl: data.imageUrl || null,
      contentType: data.contentType || null,
    };

    pickup.driverFiles = [...newArray];
    return { pickup };
  }

  if (mode === PROGRESS_TYPE.DESTINATION.toLowerCase()) {
    const deliveryDestination = [...state.deliveryDestination];
    // let deliveryDestinationItem = deliveryDestination.find((d) => d.addressId === shipmentID);
    const itemIndex = deliveryDestination.findIndex((d) => d.addressId === shipmentID);

    if (itemIndex < 0) {
      return {};
    }
    const cloneItem = { ...deliveryDestination[itemIndex] };
    const newArray = [...cloneItem.driverFiles];
    newArray[index] = {
      fileName: data.fileName || null,
      imageUrl: data.imageUrl || null,
      contentType: data.contentType || null,
    };
    cloneItem.driverFiles = newArray;
    deliveryDestination[itemIndex] = { ...cloneItem };
    console.log('RESULT: ', deliveryDestination);

    return { deliveryDestination };
  }
};

const updateProgressShipment = (state, param) => {
  const mode = String(param.Section).toLowerCase();
  console.log('param updateProgressShipment: ', param);
  switch (mode) {
    case PROGRESS_TYPE.DISPATCH.toLowerCase(): {
      console.log('DISPATCH UPDATE');
      const newData = {
        truckMake: param.Data.TruckMake || state.dispatch.truckMake,
        model: param.Data.Mode || state.dispatch.model,
        license: param.Data.LicencePlate || state.dispatch.license,
        colour: param.Data.Color || state.dispatch.colour,
        driverName: param.Data.DriverName || state.dispatch.driverName,
        driverMobile: param.Data.DriverPhone || state.dispatch.driverMobile,
        customerNotes: param.Data.CustomerNotes || state.dispatch.customerNotes,
        customerFiles: param.Data.CustomerFiles || state.dispatch.customerFiles,
      };
      const dispatch = { ...newData };
      return { dispatch };
    }
    case PROGRESS_TYPE.PICKUP.toLowerCase(): {
      console.log('PICKUP CONFIRM');
      const pickup = { ...state.pickup };
      if (param.Data.DriverNotes !== '') {
        pickup.driverNotes = param.Data.DriverNotes;
      }
      return { pickup };
    }
    case PROGRESS_TYPE.DESTINATION.toLowerCase(): {
      console.log('DELIVERY CONFIRM');
      const deliveryDestination = [...state.deliveryDestination];
      if (param.Data.DriverNotes !== '') {
        deliveryDestination.map((item) => {
          if (item.addressId === param.Data.addressId) {
            item.driverNotes = param.Data.DriverNotes;
          }
        });
      }
      return { deliveryDestination };
    }
    default:
      break;
  }
};

const updateProgressConfirm = (state, param) => {
  const mode = String(param.section).toLowerCase();
  console.log('MODE: ', mode);

  switch (mode) {
    case PROGRESS_TYPE.DISPATCH.toLowerCase(): {
      console.log('DISPATCH CONFIRM');
      const dispatch = { ...state.dispatch };
      dispatch.active = param.active;
      return { dispatch };
    }
    case PROGRESS_TYPE.PICKUP.toLowerCase(): {
      console.log('PICKUP CONFIRM');
      const pickup = { ...state.pickup };
      pickup.active = param.active;
      pickup.status = 'Completed';
      pickup.pickupDate = moment().utc().toISOString();
      console.log('updateProgressConfirm pickup: ', pickup);
      return { pickup };
    }
    case PROGRESS_TYPE.DESTINATION.toLowerCase(): {
      console.log('DELIVERY CONFIRM');
      const deliveryDestination = [...state.deliveryDestination];
      const itemIndex = deliveryDestination.findIndex((d) => d.addressId === param.addressId);
      const cloneItem = { ...deliveryDestination[itemIndex] };
      cloneItem.active = param.active;
      if (param.active) {
        cloneItem.deliveryDate = moment().utc().toISOString();
        cloneItem.status = 'Completed';
      }

      deliveryDestination[itemIndex] = { ...cloneItem };
      return { deliveryDestination };
    }
    default:
      break;
  }
};

const updateSelectSection = (state, sectionProgress) => {
  if (
    state.currentProgress.type === sectionProgress.type
    && state.currentProgress.idDestination === sectionProgress.idDestination
  ) {
    return {
      currentProgress: {
        type: null,
        idDestination: null,
      },
    };
  }
  return { currentProgress: sectionProgress };
};

const progressState = {
  initState,
  updatePhotoDataBySection,
  updateProgressShipment,
  updateProgressConfirm,
  updateSelectSection,
};

export default progressState;
