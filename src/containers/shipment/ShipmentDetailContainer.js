import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

// TAB VIEW
import Details from '../../components/shipment/detail';
import Quotes from '../../components/shipment/quotes/Quotes';
import ProgressTab from '../../components/shipment/progress/Progress';
import CommunicationTab from '../../components/shipment/communication/Communication';
import PaymentTab from '../../components/shipment/payment/Payment';

import TabsMenu from '../../components/common/TabsMenu';
import WarningExpired from '../../components/shipment/detail/WarningExpired';
import driverAction from '../../store/actions/driverAction';
import shipmentAction from '../../store/actions/shipmentAction';
import chatAction from '../../store/actions/chatAction';
import I18N from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';
import {
  EXPRIRED_TIME_LEFT,
  MODE_SHIPMENT_DETAIL,
  getMenuTabNotAccept,
  getMenuTabAccept,
  TYPE_CHAT,
} from '../../constants/app';
import { computeTimeLeft, isBookedShipment } from '../../helpers/shipment.helper';

class ShipmentDetailContainer extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const mode = navigation.getParam('tabMode', MODE_SHIPMENT_DETAIL.DETAIL);
    this.state = {
      mode: mode || MODE_SHIPMENT_DETAIL.DETAIL,
      isExpiredTime: false,
      keyActive: this.getTabMode(mode),
      isRefresh: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { isListRefresh } = this.props;
    if (isListRefresh !== prevProps.isListRefresh && isListRefresh === false) {
      this.setState({ isRefresh: false });
    }
  }

  componentDidMount() {
    const { actions, shipmentCode } = this.props;
    actions.setSourceMessage(shipmentCode, TYPE_CHAT.DRIVER_ADMIN_TYPE2);
    actions.setSourceMessage(shipmentCode, TYPE_CHAT.GROUP_Type3);
    actions.setSourceMessage(shipmentCode, TYPE_CHAT.DRIVER_CUSTOMER_TYPE4);
  }

  componentWillUnmount() {
    clearInterval(this.expireTimeLeft);
    const { customerInfo, shipmentCode, actions } = this.props;
    if (customerInfo) {
      actions.setSourceMessageOff(shipmentCode, TYPE_CHAT.DRIVER_ADMIN_TYPE2);
      actions.setSourceMessageOff(shipmentCode, TYPE_CHAT.GROUP_Type3);
      actions.setSourceMessageOff(shipmentCode, TYPE_CHAT.DRIVER_CUSTOMER_TYPE4);
      actions.setSourceMessageOff(shipmentCode, TYPE_CHAT.DRIVER_CUSTOMER_TYPE4, customerInfo.Id);
    }
  }

  getTabMode = (mode) => {
    switch (mode) {
      case MODE_SHIPMENT_DETAIL.PROGRESS:
        return 1;
      case MODE_SHIPMENT_DETAIL.PAYMENT:
        return 3;
      case MODE_SHIPMENT_DETAIL.COMMUNICATION:
        return 2;
      default:
        return 0;
    }
  }

  checkScrollEnd = (y) => {
    const { navigation } = this.props;
    const isScroll = navigation.getParam('isScroll', false);
    if (isScroll && this.scrollRef) {
      this.scrollRef.props.scrollToPosition(0, y);
    }
  }

  computeExpireTimeLeft = () => {
    const { shipmentDetail } = this.props;
    const timeLeft = computeTimeLeft(shipmentDetail.shipmentDetail.changedStatusDate);
    this.setState({
      timeLeft
    }, () => {
      const { timeLeft: newTimeLeft } = this.state;
      if (newTimeLeft === EXPRIRED_TIME_LEFT
        && !(isBookedShipment(shipmentDetail.status))
      ) {
        this.setState({
          isExpiredTime: true
        });
        clearInterval(this.expireTimeLeft);
      }
    });
  }

  prepareDataTabView = (type, id) => {
    const { languageCode, newMessageType2, newMessageType4, newMessageType3 } = this.props;
    const newMessage = ((Object.keys(newMessageType4).length > 0) || (Object.keys(newMessageType2).length > 0) || (Object.keys(newMessageType3).length > 0)) ? true : false;
    switch (type) {
      case MODE_SHIPMENT_DETAIL.QUOTE:
        return {
          id,
          title: I18N.t('shipment.detail.tab_menu.quotes', { locale: languageCode }),
          isBadge: false,
          icon: IMAGE_CONSTANT.quotesIcon,
          route: type
        };
      case MODE_SHIPMENT_DETAIL.PROGRESS:
        return {
          id,
          title: I18N.t('shipment.detail.tab_menu.progress', { locale: languageCode }),
          isBadge: false,
          icon: IMAGE_CONSTANT.progressIcon,
          route: type
        };
      case MODE_SHIPMENT_DETAIL.COMMUNICATION:
        return {
          id,
          title: I18N.t('shipment.detail.tab_menu.communication', { locale: languageCode }),
          isBadge: newMessage,
          icon: IMAGE_CONSTANT.communicationIcon,
          route: type
        };
      case MODE_SHIPMENT_DETAIL.PAYMENT:
        return {
          id,
          title: I18N.t('shipment.detail.tab_menu.payment', { locale: languageCode }),
          isBadge: false,
          icon: IMAGE_CONSTANT.paymentIcon,
          route: type
        };
      default:
        return {
          id,
          title: I18N.t('shipment.detail.tab_menu.shipment', { locale: languageCode }),
          isBadge: false,
          icon: IMAGE_CONSTANT.deliveryIcon,
          route: type
        };
    }
  }

  renderView = () => {
    const { mode } = this.state;
    const {
      summaryShipment,
      shipmentDetail,
      defaultTransportTypes,
      defaultHandleUnits,
      defaultLocationServices,
      defaultAdditionalServices,
      languageCode,
      navigation,
      countryCode,
      driver,
    } = this.props;
    switch (mode) {
      case MODE_SHIPMENT_DETAIL.QUOTE:
        return <Quotes navigation={navigation} />;
      case MODE_SHIPMENT_DETAIL.PROGRESS:
        return <ProgressTab navigation={navigation} />;
      case MODE_SHIPMENT_DETAIL.COMMUNICATION:
        return <CommunicationTab navigation={navigation} isNewMessage={this.isNewMessage} />;
      case MODE_SHIPMENT_DETAIL.PAYMENT:
        return <PaymentTab navigation={navigation} />;
      default:
        return (
          <Details
            countryCode={countryCode}
            totalDuration={69.69}
            summaryShipment={summaryShipment}
            shipmentDetail={shipmentDetail}
            defaultTransportTypes={defaultTransportTypes}
            defaultHandleUnits={defaultHandleUnits}
            defaultLocationServices={defaultLocationServices}
            defaultAdditionalServices={defaultAdditionalServices}
            languageCode={languageCode}
            navigation={navigation}
            driver={driver}
            onGotoView={this.checkScrollEnd}
          />
        );
    }
  }

  getScrollRef = (ref) => { this.scrollRef = ref; }

  navigateToScreen = (mode, key) => {
    this.setState({
      mode,
      keyActive: key
    });
  }

  onPin = () => {
    const { actions, shipmentDetail } = this.props;
    actions.setPinAction(shipmentDetail.id, shipmentDetail.isPin);
  }

  renderHeaderComponent = () => {
    const { keyActive } = this.state;
    const {
      shipmentDetail,
      totalRecordQuotes
    } = this.props;
    const tab = shipmentDetail.status > 6 && shipmentDetail.status < 10 ? getMenuTabAccept() : getMenuTabNotAccept();
    const headerTab = tab.map((item, idx) => this.prepareDataTabView(item, idx));
    // const headerTab = getMenuTabNotAccept().map((item, idx) => this.prepareDataTabView(item, idx));
    return (
      <View>
        <View style={[styles.flex, styles.alignItemsCenter, styles.pad20, Platform === 'ios' && { zIndex: 2 }]}>
          <Text style={[styles.title, styles.flexOne, styles.mr20]}>
            {shipmentDetail.title}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.onPin}
          >
            <Image source={shipmentDetail.isPin ? IMAGE_CONSTANT.pinActive : IMAGE_CONSTANT.pin} style={{ width: 26, height: 26 }} />
          </TouchableOpacity>
        </View>
        <TabsMenu
          showText={false}
          source={headerTab}
          activeTab={keyActive}
          navigateToScreen={this.navigateToScreen}
          propStyle={{ zIndex: 1 }}
        />
        {this.renderView()}
      </View>
    );
  }

  callRefresh = () => {
    const { actions, shipmentDetail } = this.props;
    this.setState({ isRefresh: true });
    actions.setShipmentDetail(shipmentDetail.id);
  }

  render() {
    const { isExpiredTime, isRefresh } = this.state;
    const {
      navigation,
    } = this.props;
    return (
      <View style={styles.container}>
        {isExpiredTime && (
          <View style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            zIndex: 2,
          }}
          >
            <WarningExpired navigation={navigation} />
          </View>
        )}
        <KeyboardAwareScrollView
          refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={this.callRefresh} />}
          innerRef={this.getScrollRef}
          keyboardShouldPersistTaps="always"
        >
          {this.renderHeaderComponent()}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  summaryShipment: state.shipment.summaryShipment,
  shipmentDetail: state.shipment.shipmentDetail,
  defaultTransportTypes: state.shipment.defaultTransportTypes,
  defaultHandleUnits: state.shipment.defaultHandleUnits,
  defaultLocationServices: state.shipment.defaultLocationServices,
  defaultAdditionalServices: state.shipment.defaultAdditionalServices,
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  shipmentCode: state.shipment.shipmentDetail.code,
  totalRecordQuotes: state.shipment.total,
  driver: state.auth.account,
  // isListRefresh: state.driver.isLoading,
  isListRefresh: state.app.isLoading,
  newMessageType2: state.chat.newMessageType2,
  newMessageType3: state.chat.newMessageType3,
  newMessageType4: state.chat.newMessageType4,
  customerInfo: state.chat.customerInfo,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...driverAction,
      ...shipmentAction,
      ...chatAction,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentDetailContainer);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
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
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  pad20: {
    padding: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mt20: {
    marginTop: 20,
  },
  mr20: {
    marginRight: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
});
