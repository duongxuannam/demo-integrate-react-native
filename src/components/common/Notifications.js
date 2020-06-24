import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import notificationActions from '../../store/actions/notificationAction';
import listingActions from '../../store/actions/listingAction';
import { NOTIFICATION_TYPE } from '../../constants/app';
import { dateClientWithFormat, getFormatDate } from '../../helpers/date.helper';
import NewNoteSvg from './svg/newNote';
import PaymentMethodAccept from './svg/paymentMethodAccept';
import ShipmentCompleted from './svg/shipmentCompleted';
import PaymentMethodDecline from './svg/paymentMethodDecline';

const { height } = Dimensions.get('window');

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seeAll: false,
      isRefresh: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { isListRefresh } = this.props;
    if (isListRefresh !== prevProps.isListRefresh && isListRefresh === false) {
      this.setState({ isRefresh: false });
    }
  }

  renderIcon = (type) => {
    let iconStatus = '';
    switch (type) {
      case NOTIFICATION_TYPE.NEW_BID: // suit icon
        iconStatus = (
          <Image
            source={IMAGE_CONSTANT.affordable}
            style={{ width: 26, height: 24 }}
            resizeMode="center"
          />
        );
        break;
      case NOTIFICATION_TYPE.NEW_PHOTO: // suit icon
        iconStatus = (
          <Image
            source={IMAGE_CONSTANT.photoNotification}
            style={{ width: 26, height: 20 }}
            resizeMode="center"
          />
        );
        break;
      case NOTIFICATION_TYPE.NEW_NOTE: // suit not icon, 3 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.photoNotification}
          //   style={{ width: 26, height: 20 }}
          //   resizeMode="center"
          // />
          <NewNoteSvg />
        );
        break;
      case NOTIFICATION_TYPE.NEW_PROGRESS: // suit icon
        iconStatus = (
          <Image
            source={IMAGE_CONSTANT.car}
            style={{ width: 22, height: 24 }}
            resizeMode="center"
          />
        );
        break;
      case NOTIFICATION_TYPE.SHIPMENT_COMPLETED: // suit icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.boxNotification}
          //   style={{ width: 26, height: 20 }}
          //   resizeMode="center"
          // />
          <ShipmentCompleted />
        );
        break;
      case NOTIFICATION_TYPE.NEW_STATUS: // suit not icon, 6 Have the icon(car)
        iconStatus = (
          <Image
            source={IMAGE_CONSTANT.car}
            style={{ width: 22, height: 24 }}
            resizeMode="center"
          />
        );
        break;
      case NOTIFICATION_TYPE.PAYMENT_METHOD_ACCEPTED: // suit not icon, 7 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <PaymentMethodAccept />
        );
        break;
      case NOTIFICATION_TYPE.PAYMENT_METHOD_DECLINE: // suit not icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <PaymentMethodDecline />
        );
        break;
      default:
        iconStatus = (
          <Image
            source={IMAGE_CONSTANT.boxNotification}
            style={{ width: 24, height: 24 }}
            resizeMode="center"
          />
        );
        break;
    }
    return iconStatus;
  };

  renderTitle = (type, languageCode) => {
    let titleStatus = '';
    switch (type) {
      case NOTIFICATION_TYPE.NEW_BID:
        titleStatus = I18n.t('notification.new_bid', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_PHOTO:
        titleStatus = I18n.t('notification.new_photo', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_NOTE:
        titleStatus = I18n.t('notification.new_progress', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_PROGRESS:
        titleStatus = I18n.t('notification.new_note', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.SHIPMENT_COMPLETED:
        titleStatus = I18n.t('notification.shipment_completed', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_STATUS:
        titleStatus = I18n.t('notification.new_status', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.PAYMENT_METHOD_ACCEPTED:
        titleStatus = I18n.t('notification.payment_method_accepted', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.PAYMENT_METHOD_DECLINE:
        titleStatus = I18n.t('notification.payment_method_accepted', {
          locale: languageCode,
        });
        break;
      default:
        titleStatus = '';
        break;
    }
    return titleStatus;
  };

  navShipmentAndMarkAsRead = (item, route = 'ShipmentDetailStack') => {
    console.log('item mark as read: ', item);
    const {
      actions, closePopover, navigation, countryCode
    } = this.props;
    actions.markAsRead(item.id);
    actions.getShipmentDetails(item.shipmentId, true, countryCode);
    const queryGetQuotes = {
      ShipmentId: item.shipmentId,
      Page: 0,
      Limit: 20,
      Sort: 'Price',
      SortOrder: 0,
    };
    actions.getQuoteDetail(queryGetQuotes);
    closePopover();
  };

renderMessage = (message, titleShipment) => {
  const messageArr = message.split('[shipmentTitle]');
  const numberMessageArr = messageArr.length;
  if (numberMessageArr === 0) {
    return;
  }
  return (
    <Text
      style={[styles.defaultTextColor, styles.smallSize, styles.mt10]}
    >
      <Text>{messageArr[0]}</Text>
      <Text style={{ fontWeight: 'bold' }}>
        {` "${titleShipment}" `}
      </Text>
      <Text>{messageArr[1]}</Text>
    </Text>
  );
}

  renderItem = (session, seeAll) => {
    const { languageCode, countryCode } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.group,
          styles.flex,
          styles.alignItemsCenter,
          session.item.status === NOTIFICATION_TYPE.STATUS_UNREAD
            ? styles.silverBg
            : styles.whiteBg,
        ]}
        onPress={() => this.navShipmentAndMarkAsRead(session.item)}
      >
        <View style={styles.flexOne}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.navShipmentAndMarkAsRead(session.item)}
          >
            <View style={[styles.flex]}>
              {this.renderIcon(session.item.type)}
              <Text
                style={[
                  styles.flexOne,
                  styles.ml10,
                  styles.statusTitle,
                  // styles.bold,
                  { fontWeight: 'bold' },
                ]}
              >
                {this.renderTitle(session.item.type, languageCode)}
              </Text>
            </View>
          </TouchableOpacity>
          {this.renderMessage(session.item.message, session.item.shipmentTitle)}
          {seeAll && (
            <Text style={styles.groupDate}>
              {dateClientWithFormat(
                session.item.createdAt,
                getFormatDate(countryCode, languageCode)
              )}
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.navShipmentAndMarkAsRead(session.item)}
        >
          <Image
            source={require('../../assets/images/common/arrow-right.png')}
            style={{ width: 7, height: 10 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  toggleSeeAll = () => {
    this.setState({ seeAll: !this.state.seeAll });
  };

  getAllNotification = () => {
    const { actions } = this.props;
    actions.getNotification(NOTIFICATION_TYPE.STATUS_ALL);
    this.toggleSeeAll();
  };

  renderHeader = (numberNew, titleNewNotification, seeAll, languageCode) => {
    if (seeAll) {
      return (
        <View>
          {/* <View style={[styles.defaultBg, {height: 30}]} /> */}
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Image
                source={IMAGE_CONSTANT.bellNewNotification}
                style={{ width: 24, height: 24, marginRight: 10 }}
                resizeMode="center"
              />
              <Text
                style={[
                  styles.defaultSize,
                  // styles.bold,
                  { fontWeight: 'bold' },
                  styles.defaultTextColor,
                ]}
              >
                {I18n.t('notification.all_notifications', {
                  locale: languageCode,
                })}
              </Text>
            </View>
            <View style={styles.line} />
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}
      >
        <Text
          style={[
            styles.defaultSize,
            // styles.bold,
            styles.defaultTextColor,
            { fontFamily: 'Roboto-Bold', fontWeight: 'bold' },
          ]}
        >
          {`${numberNew} ${titleNewNotification}`}
        </Text>
      </View>
    );
  };

  loadMoreData = () => {
    const { actions } = this.props;
    const { seeAll } = this.state;
    if (seeAll) {
      console.log('loadMoreData');
      actions.loadMoreAction();
    }
  };

  render() {
    const {
      languageCode,
      navigateToScreen,
      totalUnread,
      notificationDataList,
    } = this.props;
    const { seeAll, isRefresh } = this.state;
    const titleNewNotification = totalUnread > 1
      ? I18n.t('notification.new_notifications', { locale: languageCode })
      : I18n.t('notification.new_notification', { locale: languageCode });
    return (
      <View>
        {this.renderHeader(
          totalUnread,
          titleNewNotification,
          seeAll,
          languageCode,
        )}
        <FlatList
          style={{ minHeight: 100, height: (seeAll && height - 150) || 'auto' }}
          data={notificationDataList}
          renderItem={(item) => this.renderItem(item, seeAll)}
          keyExtractor={(item) => `${item.id}`}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={80}
          windowSize={21}
          removeClippedSubviews
        />
        {!seeAll && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.getAllNotification}
          >
            <Text
              style={{
                backgroundColor: '#fff',
                color: 'rgba(81, 175, 43, 1)',
                fontWeight: 'bold',
                fontFamily: 'Roboto-Bold',
                fontSize: 12,
                textAlign: 'center',
                padding: 10,
                borderTopWidth: notificationDataList.length < 1 ? 1 : 0,
                borderTopColor: 'rgba(219, 219, 219, 1)',
              }}
            >
              {I18n.t('notification.see_older', {
                locale: languageCode,
              })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  silverBg: {
    backgroundColor: 'rgba(249, 249, 249, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  normal: {
    fontFamily: 'Roboto-Regular',
  },
  mt30: {
    marginTop: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  mt10: {
    marginTop: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  header: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(161, 161, 161, 1)',
  },
  group: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 1)',
  },
  statusTitle: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(81, 175, 43)',
  },
  groupDate: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(161, 161, 161)',
    marginTop: 3,
    fontStyle: 'italic',
  }
});

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  notificationDataList: state.notification.notificationDataList,
  isListRefresh: state.notification.isLoading,
  totalUnread: state.notification.totalUnread,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getNotification: notificationActions.getNotification,
      loadMoreAction: notificationActions.getNotificationLoadMore,
      markAsRead: notificationActions.markAsReadNotification,
      getShipmentDetails: listingActions.getShipmentDetails,
      getQuoteDetail: listingActions.getQuoteDetail,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
