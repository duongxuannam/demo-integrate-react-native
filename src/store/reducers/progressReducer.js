import {
  PROGRESS_ACTION,
} from '../actionTypes';
import progressState from '../states/progressState';

const configReducer = (state = progressState.initState, action) => {
  switch (action.type) {
    case PROGRESS_ACTION.GET_PROGRESS_SUCCESS:
      return {
        ...state,
        booked: action.booked,
        dispatch: action.dispatch,
        pickup: action.pickup,
        deliveryDestination: action.deliveryDestination,
        updatedAt: action.updatedAt,
      };
    case PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO_SUCCESS: {
      const { section, index, data, shipmentID } = action;
      return {
        ...state,
        ...progressState.updatePhotoDataBySection(
          state,
          section,
          index,
          data,
          shipmentID,
        ),
      };
    }
    case PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO_SUCCESS: {
      const { section, index, data, shipmentID } = action;
      return {
        ...state,
        ...progressState.updatePhotoDataBySection(
          state,
          section,
          index,
          data,
          shipmentID,
        ),
      };
    }
    case PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS: {
      return {
        ...state,
        ...progressState.updateSelectSection(state, action.currentProgress),
      };
    }
    case PROGRESS_ACTION.UPDATE_PROGRESS_SUCCESS:
      return {
        ...state,
        ...progressState.updateProgressShipment(state, action.param)
      };
    case PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION_SUCCESS: {
      const { param } = action;
      return {
        ...state,
        ...progressState.updateProgressConfirm(state, param)
      };
    }
    default:
      return state;
  }
};

export default configReducer;
