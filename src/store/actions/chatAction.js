import { CHAT_ACTION } from '../actionTypes';

const loginFirebase = () => ({
  type: CHAT_ACTION.LOGIN_FIREBASE
});

const sendChatAttachment = (data, activeTab, shipmentId, newMessage) => ({
  type: CHAT_ACTION.SEND_ATTACHMENT,
  data,
  activeTab,
  shipmentId,
  newMessage
});

const getCustomerInfoChat = (shipmentId,
  customerId,
  isIgnoreNavigation = false,
  isIgnoreGetDetail = false,) => ({
  type: CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION,
  shipmentId,
  customerId,
  isIgnoreNavigation,
  isIgnoreGetDetail,
});

const setSourceMessage = (shipmentCode, typeChat) => ({
  type: CHAT_ACTION.SET_SOURCE_CHAT,
  shipmentCode,
  typeChat,
});

const updateShipmentChat = (shipmentId, typeChat) => ({
  type: CHAT_ACTION.UPDATE_SHIPMENT_CHAT,
  shipmentId,
  typeChat,
});

const setSourceMessageOff = (shipmentCode, typeChat, customerId = null) => ({
  type: CHAT_ACTION.SET_SOURCE_CHAT_OFF,
  shipmentCode,
  typeChat,
  customerId
});

const chatAction = {
  sendChatAttachment,
  getCustomerInfoChat,
  setSourceMessage,
  updateShipmentChat,
  loginFirebase,
  setSourceMessageOff,
};

export default chatAction;
