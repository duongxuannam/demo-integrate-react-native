import auth from '@react-native-firebase/auth';
import app from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';

const FirebaseHelper = (() => {
  let instance;
  const databaseInstance = database();
  const authInstance = auth();
  //   let roomName;
  let listRoomActive = [];
  let refStatus = null;
  let currentUser = null;

  function createInstance() {
    const firebaseInstance = app;
    authInstance.onAuthStateChanged(onAuthStateChanged);
    return firebaseInstance;
  }

  function onAuthStateChanged(user) {
    currentUser = user;
  }

  function firebaseLoginWithAnonymous(name) {
    return authInstance
      .signInAnonymously()
      .then((user) => {
        if (name) {
          user.user.updateProfile({ displayName: name });
        }
        return user;
      })
      .catch((err) => console.error(`got error:${typeof (err)} string:${err.message}`));
  }

  function firebaseGetStatusInfo(userID = 'all', callback) {
    const roomName = `/infoStatus/${userID}`;
    return databaseInstance.ref(roomName).on('value', (snapshot) => {
      const values = snapshot.val();
      if (refStatus && currentUser) {
        const listActive = (values && values.listActive.length > 0 && values.listActive) || [];
        const listUpdate = _.union([...listActive], [DeviceInfo.getUniqueId()]);
        refStatus.update({
          listActive: [...listUpdate]
        });
      }
      callback((values && values.listActive.length > 0 && values.listActive) || []);
    });
  }

  function getListActive(userID = 'all') {
    const roomName = `/infoStatus/${userID}`;
    return new Promise((resolve, reject) => {
      databaseInstance.ref(roomName).once('value', (snapshot) => {
        const values = snapshot.val();
        resolve((values && values.listActive.length > 0 && values.listActive) || []);
      });
    });
  }

  function firebaseUpdateStatusInfo(userID = 'all', listActive, deviceId, callback, failed) {
    const roomName = `/infoStatus/${userID}`;
    const ref = databaseInstance.ref(roomName);
    setRefStatus(ref);
    const list = listActive.filter((i) => i !== deviceId) || [];
    ref.onDisconnect().update({
      listActive: [...list]
    });
    const listUpdate = _.union([...listActive], [deviceId]);
    ref.update({
      listActive: [...listUpdate]
    })
      .then((success) => callback(success))
      .catch((error) => failed(error));
  }

  function getDataChat(shipmentCode, type, callbacks) {
    const roomName = `/${shipmentCode}-${type}`;
    if ((listRoomActive.length <= 0) || (!listRoomActive.includes(roomName))) {
      databaseInstance
        .ref(roomName)
        .on('value', (snapshot) => {
          let val = [];
          snapshot.forEach(item => val.push({ ...item.val(), id: item.key }));
          callbacks(val);
          listRoomActive = _.union([...listRoomActive], [roomName]);
        });
    }
  }

  const sendDataChat = (shipmentCode, type, payload, callback, failed) => {
    databaseInstance
      .ref(`/${shipmentCode}-${type}`)
      .push({
        ...payload,
      })
      .then((success) => callback(success))
      .catch((err) => failed(err));
  };

  const markMessageRead = (shipmentCode, type, itemsUnRead, accountId) => {
    itemsUnRead.forEach((item) => {
      databaseInstance
        .ref(`/${shipmentCode}-${type}/${item.id}`)
        .update({
          isRead: item.isRead.concat(accountId)
        });
    });
  };

  //   function setRoomName(value) {
  //     roomName = value;
  //   }

  function logout(listActive, deviceId) {
    if (refStatus) {
      const list = listActive.filter((i) => i !== deviceId) || [];
      refStatus.update({
        listActive: [...list]
      });
    }
    if (currentUser) {
      authInstance.signOut();
    }
    clearAllRef();
  }

  function clearAllRef() {
    listRoomActive.forEach((roomName) => {
      databaseInstance.ref(roomName).off('value');
    });
    listRoomActive = [];
    refStatus = null;
    currentUser = null;
  }

  function setRefStatus(newRef) {
    if (!refStatus) {
      refStatus = newRef;
    }
  }

  function getCurrentUser() {
    return authInstance.currentUser;
  }

  function firebaseSetOffStatusInfo(userID = 'all', callback) {
    const roomName = `/infoStatus/${userID}`;
    return databaseInstance.ref(roomName).off('value', (snapshot) => {
      const values = snapshot.val();
      callback((values && values.listActive.length > 0 && values.listActive) || []);
    });
  }

  function firebaseSetOffListRoom(shipmentCode, type) {
    const roomName = `/${shipmentCode}-${type}`;
    if (listRoomActive.includes(roomName)) {
      databaseInstance
        .ref(roomName)
        .off('value');
      const indexRoomName = listRoomActive.findIndex((room) => room === roomName);
      listRoomActive.splice(indexRoomName, 1);
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    getDataChat,
    sendDataChat,
    firebaseLoginWithAnonymous,
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
});

export default FirebaseHelper;
