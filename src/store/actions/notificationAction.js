import { NOTIFICATION_ACTION } from '../actionTypes';


const getNotification = (status, limitInput = null) => ({
  type: NOTIFICATION_ACTION.GET_NOTIFICATION,
  status,
  limitInput,
});

const getNotificationLoadMore = () => ({
  type: NOTIFICATION_ACTION.GET_NOTIFICATION_LOAD_MORE,
});

const getNotificationDetail = (notificationId) => ({
  type: NOTIFICATION_ACTION.GET_NOTIFICATION_DETAIL,
  notificationId,
});

const markAsReadNotification = (notificationId) => ({
  type: NOTIFICATION_ACTION.MARK_AS_READ_NOTIFICATION,
  notificationId,
});

const getTotalUnreadNotification = () => ({
  type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION,
});

const changeTotalUnreadNotification = (data) => ({
  type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION_SUCCESS,
  data
});


const notificationAction = {
  getNotification,
  getNotificationDetail,
  getNotificationLoadMore,
  markAsReadNotification,
  getTotalUnreadNotification,
  changeTotalUnreadNotification
};

export default notificationAction;
