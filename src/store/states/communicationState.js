import {TYPE_CHAT} from '../../constants/app';

const initState = {
  chatDataType1: [],
  chatDataType2: [],
  chatDataType3: [],
  chatDataType4: [],

  newMessageType1: {},
  newMessageType3: {},
  newMessageType4: {},

  listActive: [],
};

const setNewMessageChat = (typeChat, sourceNewMessageChat) => {
  if (typeChat === TYPE_CHAT.CUSTOMER_ADMIN_TYPE1) {
    return { newMessageType1: sourceNewMessageChat };
  }
  if (typeChat === TYPE_CHAT.GROUP_TYPE3) {
    return { newMessageType3: sourceNewMessageChat };
  }
  if (typeChat === TYPE_CHAT.CUSTOMER_DRIVER_TYPE4) {
    return { newMessageType4: sourceNewMessageChat };
  }
};

const communicationState = {
  initState,
  setNewMessageChat,
};

export default communicationState;
