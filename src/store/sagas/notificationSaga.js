import {
  put, all, call, race, select
} from 'redux-saga/effects';
import { NOTIFICATION_ACTION, SYSTEM_POPUP } from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import {
  getNotification,
  getNotificationDetail,
  markAsRead,
  getTotalUnreadNotification
} from '../../api/notification';

function* handleGetNotification(payload) {
  try {
    const { status, limitInput } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const { countryCode, languageCode } = yield select((state) => state.config);
    let culture = null;
    if (countryCode && languageCode) {
      // console.log('countryCode: ', countryCode);
      // console.log('languageCode: ', languageCode);
      culture = `${languageCode}-${countryCode.toUpperCase()}`;
    }
    console.log('culture: ', culture);
    const { page, limit } = yield select((state) => state.notification);
    const limitRequest = limitInput === null ? limit : limitInput;
    const response = yield getNotification(page, status, limitRequest, culture || 'en-US');
    yield put({
      type: NOTIFICATION_ACTION.GET_NOTIFICATION_SUCCESS,
      data: response.data,
    });
  } catch (error) {
    console.log('GET_NOTIFICATION_FAILED: ', error);
    yield put({ type: NOTIFICATION_ACTION.GET_NOTIFICATION_FAILED, message: error });
    return error;
  }
}

function* handleGetNotificationLoadMore() {
  try {
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const {
      limit, totalPage, status, page
    } = yield select((state) => state.notification);
    console.log('page: ', page)
    if (page >= totalPage) {
      console.log('Page is reach total page');
      return;
    }
    const pageParam = (page < totalPage) ? (page + 1) : page;
    // console.log('pageParam: ', pageParam);
    const response = yield getNotification(pageParam, '', limit);
    // console.log('response loadMore: ', response.data)
    if (response.isSuccess) {
      yield put({
        type: NOTIFICATION_ACTION.GET_NOTIFICATION_SUCCESS,
        data: response.data,
      });

      yield put({
        type: NOTIFICATION_ACTION.GET_NOTIFICATION_LOAD_MORE_SUCCESS,
        // page: (page < totalPage) ? (page + 1) : page,
        page: pageParam
      });
    }
  } catch (error) {
    console.log('GET_NOTIFICATION_LOAD_MORE_FAILED: ', error);
    yield put({
      type: NOTIFICATION_ACTION.GET_NOTIFICATION_LOAD_MORE_FAILED,
      error: {
        type: SYSTEM_POPUP.GENERAL,
        error: error.message,
      },
    });
  }
}

function* handleGetNotificationDetail(payload) {
  try {
    const { notificationId } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const response = yield getNotificationDetail(notificationId);
    if (response.isSuccess) {
      yield put({
        type: NOTIFICATION_ACTION.GET_NOTIFICATION_DETAIL_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('GET_NOTIFICATION_DETAIL_FAILED: ', error);
    yield put({
      type: NOTIFICATION_ACTION.GET_NOTIFICATION_DETAIL_FAILED,
      message: error,
    });
    return error;
  }
}

function* handleMarkAsReadNotification(payload) {
  try {
    const { notificationId } = payload;
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const response = yield markAsRead(notificationId);
    if (response.isSuccess) {
      yield put({
        type: NOTIFICATION_ACTION.MARK_AS_READ_NOTIFICATION_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('MARK_AS_READ_NOTIFICATION_FAILED: ', error);
    yield put({
      type: NOTIFICATION_ACTION.MARK_AS_READ_NOTIFICATION_FAILED,
      message: error,
    });
    return error;
  }
}

function* handleGetTotalUnreadNotification() {
  try {
    // CHECK AUTHENTICATION
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }

    const response = yield getTotalUnreadNotification();
    if (response.isSuccess) {
      yield put({
        type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION_SUCCESS,
        data: response.data,
      });
    }
  } catch (error) {
    console.log('GET_TOTAL_UNREAD_NOTIFICATION_FAILED: ', error);
    yield put({
      type: NOTIFICATION_ACTION.GET_TOTAL_UNREAD_NOTIFICATION_FAILED,
      message: error,
    });
    return error;
  }
}

const notificationSaga = {
  handleGetNotification,
  handleGetNotificationLoadMore,
  handleGetNotificationDetail,
  handleMarkAsReadNotification,
  handleGetTotalUnreadNotification,
};

export default notificationSaga;
