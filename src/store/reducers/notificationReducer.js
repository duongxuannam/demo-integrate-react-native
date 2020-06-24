import { NOTIFICATION_ACTION } from '../actionTypes';
import notificationState from '../states/notificationState';

const notificationReducer = (state = notificationState.initState, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTION.GET_NOTIFICATION:
      return {
        ...state,
        notificationDataList: [],
        notificationDetail: {},
        totalRecord: 0,
        page: 1,
        totalPage: 1,
        limit: 20,
        isLoading: true,
        status: action.status,
      };
    case NOTIFICATION_ACTION.GET_NOTIFICATION_SUCCESS:
      return {
        ...state,
        ...notificationState.mapNotificationResult(state, { data: action.data }),
        isLoading: false,
      };
    case NOTIFICATION_ACTION.GET_NOTIFICATION_LOAD_MORE_SUCCESS:
      return {
        ...state,
        page: action.page,
      };
    case NOTIFICATION_ACTION.GET_NOTIFICATION_DETAIL_SUCCESS:
      return {
        ...state,
        notificationDetail: action.data,
      };
    case NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION_SUCCESS:
      return {
        ...state,
        totalUnread: action.data,
      };
    default:
      return state;
  }
};

export default notificationReducer;
