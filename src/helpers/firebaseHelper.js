import auth from '@react-native-firebase/auth';
import app from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
// import * as Sentry from '@sentry/react-native';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';

const FirebaseHelper = () => {
  let instance;
  const databaseInstance = database();
  const authInstance = auth();
  let roomActiveList = [];
  let refStatus = null;
  let currentUser = null;

  function createInstance() {
    const firebaseInstance = app;
    console.log('firebase apps already running...');
    authInstance.onAuthStateChanged(onAuthStateChanged);
    return firebaseInstance;
  }

  function loginWithAnonymous(name = null) {
    return authInstance
      .signInAnonymously()
      .then(user => {
        if (name) {
          user.user.updateProfile({displayName: name});
        }
        return user;
      })
      .catch(err => {});
  }

  function logout(listActive, deviceId) {
    if (refStatus) {
      const list = listActive.filter(i => i !== deviceId) || [];
      refStatus.update({
        listActive: [...list],
      });
      refStatus.off('value');
    }
    if (currentUser) {
      authInstance.signOut();
    }
    clearAllRef();
  }

  function getDataChat(groupID, callbacks) {
    if (roomActiveList.length <= 0 || !roomActiveList.includes(groupID)) {
      databaseInstance
        .ref(groupID)
        .limitToLast(200)
        .on('value', snapshot => {
          const val = [];
          snapshot.forEach(item => val.push({...item.val(), id: item.key}));
          roomActiveList = _.union([...roomActiveList], [groupID]);
          if (val) {
            callbacks(val);
          }
        });
    } else {
      console.log('Has existed group: ', groupID);
    }
  }

  const sendDataChat = (groupID, payload, callback, failed) => {
    databaseInstance
      .ref(groupID)
      .push({
        ...payload,
      })
      .then(success => callback(success))
      .catch(err => failed(err));
  };

  const markMessageRead = (groupID, itemsUnRead, accountId) => {
    itemsUnRead.forEach(item => {
      databaseInstance.ref(`${groupID}/${item.id}`).update({
        isRead: item.isRead.concat(accountId),
      });
    });
  };

  function getCurrentUser() {
    return authInstance.currentUser;
  }

  function getListActive(userID = 'all') {
    const roomName = `/infoStatus/${userID}`;
    return new Promise((resolve, reject) => {
      databaseInstance.ref(roomName).once('value', snapshot => {
        const values = snapshot.val();
        resolve(
          (values && values.listActive.length > 0 && values.listActive) || [],
        );
      });
    });
  }

  function firebaseGetStatusInfo(userID = 'all', callback) {
    const roomName = `/infoStatus/${userID}`;
    return databaseInstance.ref(roomName).on('value', snapshot => {
      const values = snapshot.val();
      if (refStatus && currentUser) {
        console.log('Connect or Reconnect');
        const listActive =
          (values && values.listActive.length > 0 && values.listActive) || [];
        const listUpdate = _.union([...listActive], [DeviceInfo.getUniqueId()]);
        refStatus.update({
          listActive: [...listUpdate],
        });
      }
      callback(
        (values && values.listActive.length > 0 && values.listActive) || [],
      );
    });
  }

  function firebaseSetOffStatusInfo(userID = 'all', callback) {
    const roomName = `/infoStatus/${userID}`;
    return databaseInstance.ref(roomName).off('value', snapshot => {
      const values = snapshot.val();
      callback(
        (values && values.listActive.length > 0 && values.listActive) || [],
      );
    });
  }

  function firebaseUpdateStatusInfo(
    userID = 'all',
    listActive,
    deviceId,
    callback,
    failed,
  ) {
    const roomName = `/infoStatus/${userID}`;
    const ref = databaseInstance.ref(roomName);
    setRefStatus(ref);
    const list = listActive.filter(i => i !== deviceId) || [];
    ref.onDisconnect().update({
      listActive: [...list],
    });
    const listUpdate = _.union([...listActive], [deviceId]);
    ref
      .update({
        listActive: [...listUpdate],
      })
      .then(success => callback(success))
      .catch(error => failed(error));
  }

  function setRefStatus(newRef) {
    if (!refStatus) {
      refStatus = newRef;
    }
  }

  function clearAllRef() {
    roomActiveList.forEach(roomName => {
      databaseInstance.ref(roomName).off('value');
    });
    roomActiveList = [];
    refStatus = null;
  }

  function onAuthStateChanged(user) {
    currentUser = user;
  }

  function firebaseSetOffListRoom(groupID, clearAll) {
    if (roomActiveList.includes(groupID)) {
      databaseInstance.ref(groupID).off('value');
      const indexRoomName = roomActiveList.findIndex(room => room === groupID);
      roomActiveList.splice(indexRoomName, 1);
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      console.log('getInstance instance ', instance);
      return instance;
    },
    getDataChat,
    sendDataChat,
    loginWithAnonymous,
    logout,
    getCurrentUser,
    markMessageRead,
    firebaseGetStatusInfo,
    firebaseUpdateStatusInfo,
    setRefStatus,
    getListActive,
    firebaseSetOffStatusInfo,
    firebaseSetOffListRoom,
  };
};

export default FirebaseHelper;
