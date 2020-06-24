import communicationState from '../states/communicationState';
import { COMMUNICATION_ACTION } from '../actionTypes';

const communicationReducer = (state = communicationState.initState, action) => {
  switch (action.type) {
    case COMMUNICATION_ACTION.CREATE_CONNECTION_CHAT:
      return {
        ...communicationState.initState
      };
    case COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_1:
      return {
        ...state,
        chatDataType1: [...action.newData],
      };
    case COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_3:
      return {
        ...state,
        chatDataType3: [...action.newData],
      };
    case COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_4:
      return {
        ...state,
        chatDataType4: [...action.newData],
      };
    case COMMUNICATION_ACTION.SET_NEW_MESSAGE_CHAT:
      return {
        ...state,
        ...communicationState.setNewMessageChat(action.typeChat, action.data)
      };
    case COMMUNICATION_ACTION.SET_LIST_ACTIVE:
      return {
        ...state,
        listActive: [...action.listActive]
      };
    default:
      return state;
  }
};

export default communicationReducer;
