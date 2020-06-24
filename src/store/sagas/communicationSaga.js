import {
  put, take, takeLatest, select
} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import { TYPE_CHAT } from '../../constants/app';
import FirebaseHelper from '../../helpers/firebaseHelper';
import { COMMUNICATION_ACTION } from '../actionTypes';
import { sendAttachment, downloadData } from '../../api/payment';
import { updateShipmentChat } from '../../api/listing';

const firebaseHelper = FirebaseHelper();
const createChannel = channel();

function* createFirebaseConnection(action) {
  try {
    const { shipmentCode, shipmentStatus } = action;
    const { accountSelect } = yield select((state) => state.auth);
    const dataChatChannel = channel();
    if (shipmentStatus >= 7) {
      // CREATE CONNECTION TYPE 3
      firebaseHelper.getDataChat(`/${shipmentCode}-Type3`, (messageKeys) => {
        console.log('DATA TYPE 3: ', messageKeys);
        dataChatChannel.put({
          type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_3,
          newData: messageKeys
        });
        const countNewMessage = messageKeys.filter((item, index) => {
          item.index = index;
          return item.isRead.indexOf(accountSelect.id) === -1;
        });
        const newMessage = countNewMessage.length !== 0
          ? {
            index: countNewMessage[0].index,
            count: countNewMessage.length,
            itemsUnRead: countNewMessage,
          }
          : {};
        dataChatChannel.put({
          type: COMMUNICATION_ACTION.SET_NEW_MESSAGE_CHAT,
          data: newMessage,
          typeChat: TYPE_CHAT.GROUP_TYPE3,
        });
      });

      // CREATE CONNECTION TYPE 4
      firebaseHelper.getDataChat(`/${shipmentCode}-Type4`, (messageKeys) => {
        console.log('DATA TYPE 4: ', messageKeys);
        dataChatChannel.put({
          type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_4,
          newData: messageKeys
        });
        const countNewMessage = messageKeys.filter((item, index) => {
          item.index = index;
          return item.isRead.indexOf(accountSelect.id) === -1;
        });
        const newMessage = countNewMessage.length !== 0
          ? {
            index: countNewMessage[0].index,
            count: countNewMessage.length,
            itemsUnRead: countNewMessage,
          }
          : {};
        dataChatChannel.put({
          type: COMMUNICATION_ACTION.SET_NEW_MESSAGE_CHAT,
          data: newMessage,
          typeChat: TYPE_CHAT.CUSTOMER_DRIVER_TYPE4,
        });
      });
    }

    // CREATE CONNECTION TYPE 1
    firebaseHelper.getDataChat(`/${shipmentCode}-Type1`, (messageKeys) => {
      console.log('DATA TYPE 1: ', messageKeys);
      dataChatChannel.put({
        type: COMMUNICATION_ACTION.SET_COMMUNICATION_DATA_TYPE_1,
        newData: messageKeys
      });
      const countNewMessage = messageKeys.filter((item, index) => {
        item.index = index;
        return item.isRead.indexOf(accountSelect.id) === -1;
      });
      const newMessage = countNewMessage.length !== 0
        ? {
          index: countNewMessage[0].index,
          count: countNewMessage.length,
          itemsUnRead: countNewMessage,
        }
        : {};
      dataChatChannel.put({
        type: COMMUNICATION_ACTION.SET_NEW_MESSAGE_CHAT,
        data: newMessage,
        typeChat: TYPE_CHAT.CUSTOMER_ADMIN_TYPE1,
      });
    });

    while (true) {
      const actionType = yield take(dataChatChannel);
      yield put(actionType);
    }
  } catch (error) {
    console.log('COMMUNICATION_ACTION.SET_NEW_MESSAGE_CHAT Failed: ', error);
    yield null;
  }
}

function* handleSendAttachment(payload) {
  try {
    const {
      data, groupType, shipmentId, dataSize, newMessage,
    } = payload;
    const { accountSelect } = yield select((state) => state.auth);
    const { countryCode } = yield select((state) => state.app);
    const response = yield sendAttachment(data, countryCode);
    if (response.isSuccess) {
      const dataSend = {
        userID: accountSelect.id,
        userName: accountSelect.name,
        userRole: 'Customer',
        messageType: 'File',
        messageContent: response.data[0].imageUrl,
        isRead: [accountSelect.id],
        sendAt: moment()
          .utc()
          .toISOString(),
        contentType: response.data[0].contentType,
        fullFileName: response.data[0].fullFileName,
        fileSize: dataSize,
        shipmentId,
      };
      firebaseHelper.sendDataChat(
        groupType,
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
          groupType,
          newMessage.itemsUnRead,
          accountSelect.id,
        );
      }

      yield put({
        type: COMMUNICATION_ACTION.SEND_ATTACHMENT_SUCCESS,
        data: response.data,
      });

      yield put({
        type: COMMUNICATION_ACTION.UPDATE_SHIPMENT_CHAT,
        shipmentId,
        typeChat: groupType,
      });
    }
  } catch (error) {
    console.log('SEND_ATTACHMENT_FAILED: ', error);
    yield put({ type: COMMUNICATION_ACTION.SEND_ATTACHMENT_FAILED, message: error });
    return error;
  }
}

function* handleDownloadData(payload) {
  try {
    const { itemDownload, message } = payload;
    const response = yield downloadData(itemDownload);
    if (response.isSuccess) {
      yield put({
        type: COMMUNICATION_ACTION.DOWNLOAD_DATA_SUCCESS,
        itemDownload: response.data,
      });

      Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  } catch (error) {
    console.log('DOWNLOAD_DATA_FAILED: ', error);
    yield put({ type: COMMUNICATION_ACTION.DOWNLOAD_DATA_FAILED, message: error });
    return error;
  }
}

function* handleUpdateShipmentChat(payload) {
  try {
    const { shipmentId, typeChat } = payload;
    const { countryCode } = yield select((state) => state.app);
    let mapTypeChat = '';
    switch (typeChat) {
      case TYPE_CHAT.CUSTOMER_DRIVER_TYPE4:
        mapTypeChat = TYPE_CHAT.CUSTOMER_DRIVER;
        break;
      case TYPE_CHAT.CUSTOMER_ADMIN_TYPE1:
        mapTypeChat = TYPE_CHAT.CUSTOMER_ADMIN;
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
    const response = yield updateShipmentChat(shipmentId, dataUpdate, countryCode);
    if (response.isSuccess) {
      yield put({ type: COMMUNICATION_ACTION.UPDATE_SHIPMENT_CHAT_SUCCESS, data: response.data });
    }
  } catch (error) {
    console.log('UPDATE_SHIPMENT_CHAT_FAILED: ', error);
    yield put({ type: COMMUNICATION_ACTION.UPDATE_SHIPMENT_CHAT_FAILED, message: error });
    return error;
  }
}

function* handleLoginFirebase() {
  try {
    console.log('FIREBASE LOGIN');
    const { accountSelect } = yield select((state) => state.auth);
    const deviceId = DeviceInfo.getUniqueId();
    const listActive = yield firebaseHelper.getListActive(accountSelect.id);
    firebaseHelper.firebaseUpdateStatusInfo(accountSelect.id, listActive, deviceId, (success) => { console.log('SUCCESS: ', success), (err) => { console.log('ERROR: ', err); }; });
    firebaseHelper.firebaseGetStatusInfo(accountSelect.id, (value) => {
      createChannel.put({
        type: COMMUNICATION_ACTION.SET_LIST_ACTIVE,
        listActive: value || []
      });
    });
    while (true) {
      const actionChannel = yield take(createChannel);
      yield put(actionChannel);
    }
  } catch (error) {
    console.log('ERROR handleLoginFirebase: ', error);
  }
}

function* handleLogOutFireBase(payload) {
  try {
    const { userId } = payload;
    console.log('FIREBASE LOGOUT', userId);
    const { listActive } = yield select((state) => state.communication);
    const deviceId = DeviceInfo.getUniqueId();
    yield firebaseHelper.logout(listActive, deviceId);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

function* handleSetSourceChatOff(action) {
  try {
    const { groupType, driverId } = action;
    console.log('handleSetSourceChatOff groupType: ', groupType, ' driverId: ', driverId)
    if (driverId) {
      firebaseHelper.firebaseSetOffStatusInfo(driverId, (value) => {});
    } else {
      firebaseHelper.firebaseSetOffListRoom(groupType);
    }
  } catch (error) {
    console.log('handleSetSourceChatOff Failed: ', error);
    yield null;
  }
}

const communicationSaga = {
  createFirebaseConnection,
  handleSendAttachment,
  handleDownloadData,
  handleUpdateShipmentChat,
  handleLogOutFireBase,
  handleLoginFirebase,
  handleSetSourceChatOff,
};

export default communicationSaga;
