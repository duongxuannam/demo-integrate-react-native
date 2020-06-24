import { PROGRESS_ACTION } from '../actionTypes';

const getProgress = (
  shipmentID,
  isIgnoreNavigation = false,
  isIgnoreGetDetail = false,
) => ({
  type: PROGRESS_ACTION.GET_PROGRESS,
  shipmentID,
  isIgnoreNavigation,
  isIgnoreGetDetail,
});

const updateProgress = (shipmentID, param = {}) => ({
  type: PROGRESS_ACTION.UPDATE_PROGRESS,
  shipmentID,
  param
});

const updateAddressDestination = (shipmentID, param = {}) => ({
  type: PROGRESS_ACTION.UPDATE_ADDRESS_DESTINATION,
  shipmentID,
  param
});

const creteProgress = (param = {}) => ({
  type: PROGRESS_ACTION.CREATE_PROGRESS,
  param
});

const uploadPhotoProgress = (shipmentID, param = {}) => ({
  type: PROGRESS_ACTION.UPLOAD_PROGRESS_PHOTO,
  shipmentID,
  param
});

const removePhotoProgress = (shipmentID, param = {}) => ({
  type: PROGRESS_ACTION.REMOVE_PROGRESS_PHOTO,
  shipmentID,
  param
});

const changeCurrentProgress = (type, idDestination = null) => ({
  type: PROGRESS_ACTION.CHANGE_CURRENT_PROGRESS,
  currentProgress: { type, idDestination },
});

const progressActions = {
  creteProgress,
  getProgress,
  updateProgress,
  uploadPhotoProgress,
  removePhotoProgress,
  updateAddressDestination,
  changeCurrentProgress,
};

export default progressActions;
