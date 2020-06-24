import { TYPE_CHAT } from '../../constants/app';

const initState = {
  dataAttachment: null,
  customerInfo: {},

  sourceType2: [],
  sourceType3: [],
  sourceType4: [],

  newMessageType2: {},
  newMessageType3: {},
  newMessageType4: {},
  listActive: []
};

const setSourceChat = (typeChat, sourceChat) => {
  if (typeChat === TYPE_CHAT.DRIVER_ADMIN_TYPE2) {
    return { sourceType2: sourceChat };
  }
  if (typeChat === TYPE_CHAT.GROUP_Type3) {
    return { sourceType3: sourceChat };
  }
  if (typeChat === TYPE_CHAT.DRIVER_CUSTOMER_TYPE4) {
    return { sourceType4: sourceChat };
  }
};

const setNewMessageChat = (typeChat, sourceNewMessageChat) => {
  if (typeChat === TYPE_CHAT.DRIVER_ADMIN_TYPE2) {
    return { newMessageType2: sourceNewMessageChat };
  }
  if (typeChat === TYPE_CHAT.GROUP_Type3) {
    return { newMessageType3: sourceNewMessageChat };
  }
  if (typeChat === TYPE_CHAT.DRIVER_CUSTOMER_TYPE4) {
    return { newMessageType4: sourceNewMessageChat };
  }
};

const chatState = {
  initState,
  setSourceChat,
  setNewMessageChat,
};

export default chatState;
