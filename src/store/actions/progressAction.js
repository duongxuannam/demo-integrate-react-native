import { PROGRESS_ACTION } from '../actionTypes';

const getProgress = (shipmentId, callback = () => {}) => ({
  type: PROGRESS_ACTION.GET_PROGRESS,
  shipmentId,
  callback,
});

const updateProgress = (shipmentId, body) => ({
  type: PROGRESS_ACTION.UPDATE_PROGRESS,
  shipmentId,
  body,
});

const uploadProgressAttachment = (id, section, file, shipmentId) => ({
  type: PROGRESS_ACTION.UPLOAD_PROGRESS_ATTACHMENT,
  id,
  section,
  file,
  shipmentId,
});

const uploadDispatchedAttachment = (shipmentId, file) => ({
  type: PROGRESS_ACTION.UPLOAD_DISPATCHED_ATTACHMENT,
  shipmentId,
  file,
});

const deleteProgressAttachment = (shipmentId, fileName) => ({
  type: PROGRESS_ACTION.DELETE_PROGRESS_ATTACHMENT,
  fileName,
  shipmentId,
});

const progressActions = {
  getProgress,
  updateProgress,
  uploadProgressAttachment,
  uploadDispatchedAttachment,
  deleteProgressAttachment,
};

export default progressActions;
