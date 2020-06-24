import { CHAT_ACTION, AUTH_ACTION } from '../actionTypes';
import chatState from '../states/chatState';

const chatReducer = (state = chatState.initState, action) => {
  switch (action.type) {
    case CHAT_ACTION.SEND_ATTACHMENT:
      return {
        ...state,
        dataAttachment: null,
      };
    case CHAT_ACTION.SEND_ATTACHMENT_SUCCESS:
      return {
        ...state,
        dataAttachment: action.data,
      };
    case AUTH_ACTION.LOG_OUT:
    case CHAT_ACTION.SET_SOURCE_CHAT:
    case CHAT_ACTION.SET_SOURCE_CHAT_OFF:
      return {
        ...state,
        sourceType2: [],
        sourceType3: [],
        sourceType4: [],
        newMessageType2: {},
        newMessageType3: {},
        newMessageType4: {},
      };
    case CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION:
      return {
        ...state,
        customerInfo: {},
      };
    case CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION_SUCCESS:
      return {
        ...state,
        customerInfo: action.data,
      };
    case CHAT_ACTION.SET_SOURCE_CHAT_SUCCESS:
      return {
        ...state,
        ...chatState.setSourceChat(action.typeChat, action.data)
      };
    case CHAT_ACTION.SET_NEW_MESSAGE_CHAT_SUCCESS:
      return {
        ...state,
        ...chatState.setNewMessageChat(action.typeChat, action.data)
      };
    case CHAT_ACTION.SET_LIST_ACTIVE:
      return {
        ...state,
        listActive: [...action.listActive]
      };
    default:
      return state;
  }
};

export default chatReducer;
