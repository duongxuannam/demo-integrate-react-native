import { COMMUNICATION_ACTION } from '../actionTypes';

const setCommunicationDataType1 = (newData) => ({
  type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_1,
  newData,
});
const setCommunicationDataType2 = (newData) => ({
  type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_2,
  newData,
});
const setCommunicationDataType3 = (newData) => ({
  type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_3,
  newData,
});

const setCommunicationDataType4 = (newData) => ({
  type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_4,
  newData,
});

const sendChatAttachment = (data, groupType, shipmentId, dataSize, newMessage) => ({
  type: COMMUNICATION_ACTION.SEND_ATTACHMENT,
  data,
  groupType,
  shipmentId,
  dataSize,
  newMessage,
});

const downloadData = (itemDownload, message) => ({
  type: COMMUNICATION_ACTION.DOWNLOAD_DATA,
  itemDownload,
  message,
});

const updateShipmentChat = (shipmentId, typeChat) => ({
  type: COMMUNICATION_ACTION.UPDATE_SHIPMENT_CHAT,
  shipmentId,
  typeChat,
});

const loginFirebase = () => ({
  type: COMMUNICATION_ACTION.LOGIN_FIREBASE,
});

const logoutFirebase = (userId = null) => ({
  type: COMMUNICATION_ACTION.LOGOUT_FIREBASE,
  userId,
});

const setSourceMessageOff = (groupType, driverId = null) => ({
  type: COMMUNICATION_ACTION.SET_SOURCE_CHAT_OFF,
  groupType,
  driverId,
});

const communicationAction = {
  setCommunicationDataType1,
  setCommunicationDataType2,
  setCommunicationDataType3,
  setCommunicationDataType4,
  sendChatAttachment,
  downloadData,
  updateShipmentChat,
  loginFirebase,
  logoutFirebase,
  setSourceMessageOff,
};

export default communicationAction;
