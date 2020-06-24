const initState = {
  notificationDataList: [],
  notificationDetail: {},
  totalRecord: 0,
  page: 1,
  totalPage: 1,
  limit: 20,
  isLoading: false,
  status: null,
  totalUnread: 0,
};

const mapNotificationResult = (state, resultData) => {
  console.log('PAGE NOTIFICATION: ', resultData.data.totalPage, '--', state.page);
  let notificationList = [...state.notificationDataList];
  if (resultData.data.totalPage === 1) {
    notificationList = [...resultData.data.items];
  } else if (resultData.data.totalPage >= (state.page)) {
    notificationList = [...state.notificationDataList, ...resultData.data.items];
  }
  return {
    notificationDataList: notificationList,
    totalRecord: resultData.data.totalRecord,
    totalPage: resultData.data.totalPage,
  };
};

const notificationState = {
  initState,
  mapNotificationResult,
};

export default notificationState;
