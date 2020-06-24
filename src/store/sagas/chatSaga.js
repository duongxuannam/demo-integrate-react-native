import {
  put, all, call, race, select, take
} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import { CHAT_ACTION, SHIPMENT_ACTION } from '../actionTypes';
import NavigationService from '../../helpers/NavigationService';
import FirebaseHelper from '../../helpers/firebaseHelper';
import { MODE_SHIPMENT_DETAIL, TYPE_CHAT } from '../../constants/app';
import { sendAttachment, getCustomerInfo } from '../../api/communication';
import { updateShipmentChat } from '../../api/shipment';


const firebaseHelper = FirebaseHelper();
const createChannel = channel();

function* handleSendAttachment(payload) {
  try {
    const {
      data, activeTab, shipmentId, newMessage
    } = payload;
    const { token, account } = yield select((state) => state.auth);
    const { code } = yield select((state) => state.shipment.shipmentDetail);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield sendAttachment(data);
    if (response.isSuccess) {
      const dataSend = {
        userID: account.id,
        userName: account.name,
        userRole: 'Carrier',
        messageType: 'File',
        messageContent: response.data[0].imageUrl,
        isRead: [account.id],
        sendAt: moment()
          .utc()
          .toISOString(),
        contentType: response.data[0].contentType,
        fullFileName: response.data[0].fullFileName,
        fileSize: data.size || data.fileSize,
        shipmentId
      };

      firebaseHelper.sendDataChat(
        code,
        activeTab,
        dataSend,
        (success) => {
          console.log('Send success: ', success);
        },
        (err) => {
          console.log('Send err: ', err);
        },
      );

      if (Object.keys(newMessage).length > 0) {
        firebaseHelper.markMessageRead(
          code,
          activeTab,
          newMessage.itemsUnRead,
          account.id,
        );
      }

      yield put({
        type: CHAT_ACTION.SEND_ATTACHMENT_SUCCESS,
        data: response.data
      });

      yield put({
        type: CHAT_ACTION.UPDATE_SHIPMENT_CHAT,
        shipmentId,
        typeChat: activeTab,
      });
    }
  } catch (error) {
    console.log('SEND_ATTACHMENT_FAILED: ', error);
    yield put({ type: CHAT_ACTION.SEND_ATTACHMENT_FAILED, message: error });
    return error;
  }
}

function* handleGetCustomerInfoCommunication(payload) {
  try {
    const {
      shipmentId, customerId, isIgnoreNavigation, isIgnoreGetDetail
    } = payload;
    const { token } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    const response = yield getCustomerInfo(customerId);
    if (response.isSuccess) {
      yield put({
        type: CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION_SUCCESS,
        data: response.data,
      });
    }
    if (!isIgnoreGetDetail) {
      yield put({
        type: SHIPMENT_ACTION.SET_SHIPMENT_DETAILS,
        shipmentId,
        isIgnoreGetCustomerInfo: true
      });
      if (!isIgnoreNavigation) {
        NavigationService.navigate('ShipmentDetailStack', { tabMode: MODE_SHIPMENT_DETAIL.COMMUNICATION });
      }
    }
  } catch (error) {
    console.log('GET_CUSTOMER_INFO_COMMUNICATION_FAILED: ', error);
    yield put({ type: CHAT_ACTION.GET_CUSTOMER_INFO_COMMUNICATION_FAILED, message: error });
    return error;
  }
}

function* handleGetSourceChat(payload) {
  try {
    const { shipmentCode, typeChat } = payload;
    const { token, account } = yield select((state) => state.auth);
    if (!token) {
      NavigationService.navigate('Login');
      return;
    }
    firebaseHelper.getDataChat(shipmentCode,
      typeChat,
      (messageKeys) => {
        console.log('messageKeys: ', messageKeys)
        if (messageKeys.length > 0) {
          createChannel.put({
            type: CHAT_ACTION.SET_SOURCE_CHAT_SUCCESS,
            data: messageKeys,
            typeChat,
          });

          const countNewMessage = messageKeys.filter((item, index) => {
            item.index = index;
            return item.isRead.indexOf(account.id) === -1;
          });
          // console.log('countNewMessage: ', countNewMessage);

          const newMessage = countNewMessage.length !== 0
            ? {
              index: countNewMessage[0].index,
              count: countNewMessage.length,
              itemsUnRead: countNewMessage,
            }
            : {};

          createChannel.put({
            type: CHAT_ACTION.SET_NEW_MESSAGE_CHAT_SUCCESS,
            data: newMessage,
            typeChat,
          });
        } else {
          createChannel.put({
            type: CHAT_ACTION.SET_SOURCE_CHAT_SUCCESS,
            data: [],
            typeChat,
          });
          createChannel.put({
            type: CHAT_ACTION.SET_NEW_MESSAGE_CHAT_SUCCESS,
            data: {},
            typeChat,
          });
        }
      });

    while (true) {
      const actionChannel = yield take(createChannel);
      yield put(actionChannel);
    }
  } catch (error) {
    console.log('SET_SOURCE_CHAT_FAILED: ', error);
    yield put({ type: CHAT_ACTION.SET_SOURCE_CHAT_FAILED, message: error });
    return error;
  }
}

function* handleUpdateShipmentChat(payload) {
  try {
    const { shipmentId, typeChat } = payload;
    let mapTypeChat = '';
    switch (typeChat) {
      case TYPE_CHAT.DRIVER_CUSTOMER_TYPE4:
        mapTypeChat = TYPE_CHAT.DRIVER_CUSTOMER;
        break;
      case TYPE_CHAT.DRIVER_ADMIN_TYPE2:
        mapTypeChat = TYPE_CHAT.DRIVER_ADMIN;
        break;
      case TYPE_CHAT.GROUP_Type3:
        mapTypeChat = TYPE_CHAT.GROUP;
        break;
      default:
        mapTypeChat = '';
        break;
    }
    const dataUpdate = {
      ChatType: mapTypeChat,
      ChatStatus: 'UnRead',
    };
    const response = yield updateShipmentChat(shipmentId, dataUpdate);
    if (response.isSuccess) {
      yield put({ type: CHAT_ACTION.UPDATE_SHIPMENT_CHAT_SUCCESS, data: response.data });
    }
  } catch (error) {
    console.log('UPDATE_SHIPMENT_CHAT_FAILED: ', error);
    yield put({ type: CHAT_ACTION.UPDATE_SHIPMENT_CHAT_FAILED, message: error });
    return error;
  }
}

function* handleLoginFirebase() {
  try {
    console.log('FIREBASE LOGIN');
    const { userID } = yield select((state) => ({ userID: state.auth.account.id }));
    const user = yield firebaseHelper.firebaseLoginWithAnonymous();
    console.log('USER: ', user);
    const deviceId = DeviceInfo.getUniqueId();
    console.log('DeviceID: ', deviceId);
    const listActive = yield firebaseHelper.getListActive(userID);
    console.log('Current List Active: ', listActive);
    firebaseHelper.firebaseUpdateStatusInfo(userID, listActive, deviceId, (success) => { console.log('SUCCESS: ', success), (err) => { console.log('ERROR: ', err) } });
    firebaseHelper.firebaseGetStatusInfo(userID, (value) => {
      console.log('VALUE STATUS: ', value);
      createChannel.put({
        type: CHAT_ACTION.SET_LIST_ACTIVE,
        listActive: value || []
      });
    });
    while (true) {
      const actionChannel = yield take(createChannel);
      yield put(actionChannel);
    }
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

function* handleLogOutFireBase() {
  try {
    console.log('FIREBASE LOGOUT');
    const { listActive } = yield select((state) => state.chat);
    const deviceId = DeviceInfo.getUniqueId();
    yield firebaseHelper.logout(listActive, deviceId);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

function* handleSetSourceChatOff(payload) {
  try {
    const { shipmentCode, typeChat, customerId } = payload;
    if (customerId) {
      firebaseHelper.firebaseSetOffStatusInfo(customerId, (value) => {});
    } else {
      firebaseHelper.firebaseSetOffListRoom(shipmentCode, typeChat);
    }
  } catch (error) {
    console.log('SET_SOURCE_CHAT_FAILED: ', error);
    yield put({ type: CHAT_ACTION.SET_SOURCE_CHAT_FAILED, message: error });
    return error;
  }
}

const paymentSaga = {
  handleSendAttachment,
  handleGetCustomerInfoCommunication,
  handleGetSourceChat,
  handleUpdateShipmentChat,
  handleLoginFirebase,
  handleLogOutFireBase,
  handleSetSourceChatOff
};

export default paymentSaga;
