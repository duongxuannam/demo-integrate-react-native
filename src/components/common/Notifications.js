import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import notificationActions from '../../store/actions/notificationAction';
import shipmentAction from '../../store/actions/shipmentAction';
import { NOTIFICATION_TYPE } from '../../constants/app';
import IMAGE_CONSTANT from '../../constants/images';
import { dateClientWithFormat, getFormatDate } from '../../helpers/date.helper';
import {
  NewNoteSvg,
  NewPhotoSvg,
  ChangeRequestCancelByCustomer,
  ShipmentCancel,
  ShipmentUpdate,
  RequestChangePaymentMethod,
  AcceptBidSvg,
  DeclineBidSvg,
} from './Svg';

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
      case NOTIFICATION_TYPE.SHIPMENT_UPDATED: // not suit, 8 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 26, height: 24 }}
          //   resizeMode="center"
          // />
          <ShipmentUpdate />
        );
        break;
      case NOTIFICATION_TYPE.SHIPMENT_CANCELLED: // not suit, 9 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <ShipmentCancel />
        );
        break;
      case NOTIFICATION_TYPE.NEW_PHOTO_DRIVER: // 10 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.photoNotification}
          //   style={{ width: 26, height: 20 }}
          //   resizeMode="center"
          // />
          <NewPhotoSvg />
        );
        break;
      case NOTIFICATION_TYPE.NEW_NOTE_DRIVER: // not suit, 11 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.photoNotification}
          //   style={{ width: 26, height: 20 }}
          //   resizeMode="center"
          // />
          <NewNoteSvg />
        );
        break;
      case NOTIFICATION_TYPE.REQUEST_CHANGE_PAYMENT_METHOD: // not suit, 12 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <RequestChangePaymentMethod />
        );
        break;
      case NOTIFICATION_TYPE.PAYMENT_CHANGE_REQUEST_CANCEL_BY_CUSTOMER: // not suit, 14 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.car}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <ChangeRequestCancelByCustomer />
        );
        break;
      case NOTIFICATION_TYPE.ACCEPT_BID: // not suit ???, 15 Have the icon
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.affordable}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <AcceptBidSvg />
        );
        break;
      case NOTIFICATION_TYPE.REJECT_BID: // not suit ???
        iconStatus = (
          // <Image
          //   source={IMAGE_CONSTANT.affordable}
          //   style={{ width: 22, height: 24 }}
          //   resizeMode="center"
          // />
          <DeclineBidSvg />
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
      case NOTIFICATION_TYPE.SHIPMENT_UPDATED:
        titleStatus = I18n.t('notification.shipment_updated', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.SHIPMENT_CANCELLED:
        titleStatus = I18n.t('notification.shipment_cancelled', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_PHOTO_DRIVER:
        titleStatus = I18n.t('notification.new_photo', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.NEW_NOTE_DRIVER:
        titleStatus = I18n.t('notification.new_note', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.REQUEST_CHANGE_PAYMENT_METHOD:
        titleStatus = I18n.t('notification.request_change_payment_method', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.PAYMENT_CHANGE_REQUEST_CANCEL_BY_CUSTOMER:
        titleStatus = I18n.t('notification.payment_change_request_cancel_by_customer', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.ACCEPT_BID:
        titleStatus = I18n.t('notification.accept_bid', {
          locale: languageCode,
        });
        break;
      case NOTIFICATION_TYPE.REJECT_BID:
        titleStatus = I18n.t('notification.reject_bid', {
          locale: languageCode,
        });
        break;
      default:
        titleStatus = '';
        break;
    }
    return titleStatus;
  };

  navShipmentAndMarkAsRead = (item) => {
    console.log('item mark as read: ', item);
    const { actions, closePopover } = this.props;
    actions.markAsRead(item.id);
    actions.viewDetail(item.shipmentId, false);
    actions.setQuoteDetail(item.shipmentId);
    closePopover();
  }

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
                  styles.bold,
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
                getFormatDate(countryCode, languageCode),
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
  }

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
              height: 60,
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
                source={IMAGE_CONSTANT.bellNotification}
                style={{ width: 24, height: 24, marginRight: 10 }}
                resizeMode="center"
              />
              <Text
                style={[
                  styles.defaultSize,
                  styles.bold,
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
            styles.bold,
            styles.defaultTextColor,
            { fontFamily: 'Roboto-Bold' },
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
  }

  render() {
    const {
      languageCode,
      notificationDataList,
      totalUnread,
    } = this.props;
    const { seeAll } = this.state;
    const titleNewNotification = totalUnread > 1
      ? I18n.t('notification.new_notifications', { locale: languageCode })
      : I18n.t('notification.new_notification', { locale: languageCode });
    // console.log('notificationDataList: ', notificationDataList)
    return (
      <SafeAreaView>
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
          // refreshing={isRefresh}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          updateCellsBatchingPeriod={80}
          windowSize={41}
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
                // fontWeight: 'bold',
                fontFamily: 'Roboto-Bold',
                fontSize: 12,
                textAlign: 'center',
                padding: 10,
                borderTopWidth: totalUnread < 1 ? 1 : 0,
                borderTopColor: 'rgba(219, 219, 219, 1)',
              }}
            >
              {I18n.t('notification.see_older', {
                locale: languageCode,
              })}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
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
  defaultBg: {
    backgroundColor: 'rgba(232, 232, 232, 1)',
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
  },
  notificationSize: {
    fontSize: 16,
  },
  smallSize: {
    fontSize: 15,
  },
  smallerSize: {
    fontSize: 13,
  },
});

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
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
      viewDetail: shipmentAction.setShipmentDetail,
      setQuoteDetail: shipmentAction.setQuoteDetail,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notifications);
