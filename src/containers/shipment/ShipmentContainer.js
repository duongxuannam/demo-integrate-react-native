import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  RefreshControl,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SHIPMENT_STATUS, IsShipmentBooked, IsCanCommunication } from '../../helpers/shipment.helper';
import NavigationService from '../../helpers/NavigationService';
// COMPONENTS
import TabsMenu from '../../components/common/TabsMenu';
import DropdownList from '../../components/common/DropdownList';
import ProgressTab from '../../components/shipment/progress/Progress';
import CommunicationTab from '../../components/shipment/communication/Communication';
import PaymentTab from '../../components/shipment/payment/Payment';

import Details from '../../components/shipment/Details';
import FormUnList from '../../components/shipment/detail/FormUnList';
import FormDelete from '../../components/shipment/detail/FormDelete';
import ConfirmShipment from './ConfirmShipment';
import Quotes from '../../components/shipment/quotes/Quotes';
import I18N from '../../config/locales';

// CONSTANTS
import { SHIPMENT_TAB, TYPE_CHAT } from '../../constants/app';
import IMAGE_CONSTANT from '../../constants/images';
import listingAction from '../../store/actions/listingAction';
import progressAction from '../../store/actions/progressAction';
import paymentAction from '../../store/actions/paymentAction';
import communicationAction from '../../store/actions/communicationAction';

class ShipmentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switchMode: 'Confirm',
      currentTab: 'shipment',
      activeTab: 0,
      isModalTargetPrice: false,
      indexCollapse: 0,
      isOnMore: false,
      isRefresh: false
    };

    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  componentDidMount() {
    const {
      actions,
      shipmentId,
      navigation,
      shipmentDetail,
      countryCode,
    } = this.props;
    const currentShipmentId = shipmentId || shipmentDetail.id;
    actions.getDeleteReasons();
    if (IsShipmentBooked(shipmentDetail.status)) {
      actions.getProgress(shipmentDetail.id);
    }
    if (navigation.state && navigation.state.params && navigation.state.params.noConfirm) {
      this.setState({
        switchMode: 'detail',
        activeTab: 0,
        currentTab: SHIPMENT_TAB.SHIPMENT,
      });
      return;
    }
    const queryGetQuotes = {
      ShipmentId: currentShipmentId,
      Page: 0,
      Limit: 20,
      Sort: 'LowtoHigh',
      SortOrder: 0,
    };
    actions.getQuoteDetail(queryGetQuotes);
    actions.getShipmentDetails(currentShipmentId, false, countryCode);
  }

  componentDidUpdate(prevProps) {
    const { navigation, isLoading } = this.props;
    if (isLoading !== prevProps.isLoading && !isLoading) {
      this.setState({ isRefresh: isLoading });
    }

    if (navigation !== prevProps.navigation) {
      if (navigation.state && navigation.state.params && navigation.state.params.noConfirm) {
        this.setState({
          switchMode: 'detail',
          activeTab: 0,
          currentTab: SHIPMENT_TAB.SHIPMENT,
        });
      }
    }
  }

  componentWillUnmount() {
    const { actions, driverInfo, shipmentCode, shipmentStatus } = this.props;
    actions.setCurrentStep(1);
    if (driverInfo && shipmentStatus >= 7) {
      actions.setSourceMessageOff(`/${shipmentCode}-${TYPE_CHAT.CUSTOMER_DRIVER_TYPE4}`);
      actions.setSourceMessageOff(`/${shipmentCode}-${TYPE_CHAT.GROUP_TYPE3}`);
      actions.setSourceMessageOff(`/${shipmentCode}-${TYPE_CHAT.GROUP_TYPE3}`, driverInfo.Id);
    }
    actions.setSourceMessageOff(`/${shipmentCode}-${TYPE_CHAT.CUSTOMER_ADMIN_TYPE1}`);
  }

  onRefresh = () => {
    console.log('ON REFRESH');
    this.setState({ isRefresh: true });
    const {
      actions, shipmentDetail, shipmentId, countryCode
    } = this.props;
    const currentShipmentId = shipmentId || shipmentDetail.id;
    actions.getShipmentDetails(currentShipmentId, false, countryCode, false, false);
    actions.getQuoteDetail({
      ShipmentId: currentShipmentId,
      Page: 0,
      Limit: 20,
      Sort: 'LowtoHigh',
      SortOrder: 0,
    }, () => {});
    if (shipmentDetail.status >= SHIPMENT_STATUS.BOOKED) {
      actions.getPaymentMethod(currentShipmentId, () => {});
      actions.getProgress(currentShipmentId, () => {});
    }
    // TODO: Check to Reconnect Communication chat
  }

  handleUnlist = () => {
    const { actions } = this.props;
    actions.unListShipment((res) => {
      if (res) {
        this.navigateToScreen('BookingStack');
      }
    });
  }

  onMoreBooked = (collapseSection, indexCollapse) => {
    const { actions, shipmentDetail } = this.props;
    actions.getProgress(shipmentDetail.id);
    this.setState({
      currentTab: SHIPMENT_TAB.PROGRESS,
      activeTab: 2,
      collapseSection,
      indexCollapse,
      isOnMore: true,
    });
  }

  onContactCarrier = () => {
    this.setState({
      currentTab: SHIPMENT_TAB.COMMUNICATION,
      activeTab: 3,
    });
    this.refKeyboard.props.scrollToPosition(0, 0);
  }

  renderTab = () => {
    const {
      currentTab,
      collapseSection,
      indexCollapse,
      isOnMore
    } = this.state;
    const {
      shipmentDetail,
      languageCode,
      actions,
      quoteDetail,
      countryCode,
      accountSelect,
      transportTypesDefault,
      configs,
      locationServicesDefault,
      navigation,
      reasonsRejectQuote,
      progress,
      payment,
    } = this.props;
    switch (currentTab) {
      case SHIPMENT_TAB.QUOTES:
        return (
          <Quotes
            shipmentDetail={shipmentDetail}
            languageCode={languageCode}
            quoteDetail={quoteDetail}
            actions={actions}
            navigation={navigation}
            countryCode={countryCode}
            reasonsRejectQuote={reasonsRejectQuote}
            accountSelect={accountSelect}
            transportTypesDefault={transportTypesDefault}
            minTargetPrice={configs.MinTargetPrice}
            countDown={configs.PopupAutoHideCountDown}
            configs={configs}
            locationServicesDefault={locationServicesDefault}
            showModalTargetPrice={this.openEditTargetPriceModal}
          />
        );
      case SHIPMENT_TAB.PROGRESS:
        return (
          <ProgressTab
            isOnMore={isOnMore}
            progress={progress}
            shipmentDetail={shipmentDetail}
            actions={actions}
            countryCode={countryCode}
            languageCode={languageCode}
            collapseSection={collapseSection}
            indexCollapse={indexCollapse}
            shipmentRef={this.refKeyboard}
            transportTypesDefault={transportTypesDefault}
          />
        );
      case SHIPMENT_TAB.COMMUNICATION:
        return <CommunicationTab />;
      case SHIPMENT_TAB.PAYMENT:
        return (
          <PaymentTab
            payment={payment}
            actions={actions}
            countryCode={countryCode}
            languageCode={languageCode}
            accountSelect={accountSelect}
            configs={configs}
          />
        );
      default:
        return (
          <Details
            configs={configs}
            navigation={navigation}
            onMoreBooked={this.onMoreBooked}
            onContactCarrier={this.onContactCarrier}
          />
        );
    }
  }

  handleDelete = (isBooked, isSave, data) => {
    const { actions, shipmentDetail, tabFilter, fromDate, toDate, textFilter } = this.props;
    const query = {
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter,
      },
      Limit: 10,
      Page: 1
    };
    if (!isBooked) {
      actions.deleteAll(shipmentDetail.id, [], (res, err) => {
        if (res) {
          setTimeout(() => actions.getListShipments(query), 500);
          setTimeout(() => NavigationService.navigate('ManagementShipmentStack'), 500);
        }
      });
    } else if (isSave) {
      actions.updateBasicShipment(shipmentDetail.id, {
        status: SHIPMENT_STATUS.UNLISTED,
      }, (res, error) => {
        actions.deleteRelated(shipmentDetail.id, data, (res, err) => {
          if (res) {
            setTimeout(() => actions.getListShipments(query), 500);
            setTimeout(() => NavigationService.navigate('ManagementShipmentStack'), 500);
          }
        });
      });
    } else {
      actions.deleteAll(shipmentDetail.id, data, (res, err) => {
        if (res) {
          setTimeout(() => actions.getListShipments(query), 500);
          setTimeout(() => NavigationService.navigate('ManagementShipmentStack'), 500);
        }
      });
    }
  }

  switchTab = (tab, id) => {
    const { currentTab } = this.state;
    const {
      actions,
      shipmentId,
      shipmentDetail,
      countryCode,
    } = this.props;
    const currentShipmentId = shipmentId || shipmentDetail.id;
    if (currentTab !== tab) {
      const queryGetQuotes = {
        ShipmentId: currentShipmentId,
        Page: 0,
        Limit: 20,
        Sort: 'LowtoHigh',
        SortOrder: 0,
      };
      switch (tab) {
        case SHIPMENT_TAB.SHIPMENT:
          actions.getShipmentDetails(currentShipmentId, false, countryCode);
          this.setActiveTab(tab, id);
          break;
        case SHIPMENT_TAB.QUOTES:
          actions.getQuoteDetail(queryGetQuotes, () => {
            this.setActiveTab(tab, id);
          });
          break;
        case SHIPMENT_TAB.PROGRESS:
          actions.getProgress(shipmentDetail.id, () => {
            this.setActiveTab(tab, id);
          });
          break;
        case SHIPMENT_TAB.PAYMENT:
          actions.getPaymentMethod(shipmentDetail.id, () => {
            this.setActiveTab(tab, id);
          });
          break;
        default:
          this.setActiveTab(tab, id);
          break;
      }
    }
  }

  setActiveTab = (tab, id) => {
    this.setState({
      currentTab: tab,
      activeTab: id,
      isOnMore: false,
    });
  }

  openEditTargetPriceModal = (isShow) => {
    this.setState({ isModalTargetPrice: isShow });
  }

  navigateToScreen = (route) => {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    navigation.dispatch(navigateAction);
  }

  handleChange = (type) => {
    this.setState({
      switchMode: type,
    });
  }

  switchMode = () => {
    const {
      switchMode,
      activeTab,
      isModalTargetPrice,
      isRefresh
    } = this.state;
    const {
      shipmentDetail,
      languageCode,
      actions,
      deleteReasons,
      quoteDetail,
      configs,
      newMessageType1,
      newMessageType4,
      newMessageType3,
    } = this.props;
    const newMessage = !!(((Object.keys(newMessageType4).length > 0) || (Object.keys(newMessageType1).length > 0) || (Object.keys(newMessageType3).length > 0)));
    const isBooked = (shipmentDetail && shipmentDetail.quotes && shipmentDetail.quotes.length > 0) || false;
    switch (switchMode) {
      case 'Confirm':
        return <ConfirmShipment endCountdown={() => this.setState({ switchMode: 'Detail' })} />;
      case 'Edit':
        actions.editShipmentStatus();
        return;
      case 'Un-list':
        return (
          <FormUnList
            shipmentDetail={shipmentDetail}
            back={() => this.handleChange('Detail')}
            unlist={this.handleUnlist}
            languageCode={languageCode}
          />
        );
      case 'Delete':
        return (
          <FormDelete
            languageCode={languageCode}
            shipmentDetail={shipmentDetail}
            back={() => this.handleChange('Detail')}
            deleteShipment={this.handleDelete}
            isBooked={isBooked}
            configs={configs}
            deleteReasons={deleteReasons}
          />
        );
      default:
        return (
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl refreshing={isRefresh} onRefresh={this.onRefresh} />
            }
            enableAutomaticScroll={!isModalTargetPrice}
            nestedScrollEnabled
            innerRef={(ref) => {
              this.refKeyboard = ref;
            }}
            keyboardShouldPersistTaps="always"
          >
            <>
              <View style={[styles.flex, styles.alignItemsCenter, styles.pad20, Platform === 'ios' && { zIndex: 2 }]}>
                <Text style={[styles.title, styles.flexOne, styles.mr20]}>
                  {shipmentDetail && shipmentDetail.title}
                </Text>
                <DropdownList
                  icon={IMAGE_CONSTANT.groupMenu}
                  source={[
                    {
                      id: 1,
                      title: I18N.t('shipment.more_action.edit', { locale: languageCode }),
                      icon: shipmentDetail && shipmentDetail.quotes && shipmentDetail.quotes.length <= 0 ? IMAGE_CONSTANT.editIcon : IMAGE_CONSTANT.editIconGray,
                      color: shipmentDetail && shipmentDetail.quotes && shipmentDetail.quotes.length <= 0 ? 'rgba(14, 115, 15, 1)' : 'rgba(161, 161, 161, 1)',
                      isActive: shipmentDetail && shipmentDetail.quotes && shipmentDetail.quotes.length <= 0,
                      type: 'Edit',
                    },
                    {
                      id: 2,
                      icon: IMAGE_CONSTANT.duplicateIcon,
                      title: I18N.t('shipment.more_action.un_list', { locale: languageCode }),
                      color: 'rgba(14, 115, 15, 1)',
                      isActive: true,
                      type: 'Un-list',
                    },
                    {
                      id: 3,
                      icon: IMAGE_CONSTANT.deleteIconRed,
                      title: I18N.t('shipment.more_action.delete', { locale: languageCode }),
                      color: 'rgba(244, 67, 54, 1)',
                      isActive: true,
                      type: 'Delete'
                    },
                  ]}
                  onChange={this.handleChange}
                  positionTop={80}
                />
              </View>
              <TabsMenu
                // showText={!IsShipmentBooked(shipmentDetail.status)}
                showText={false}
                source={[
                  {
                    id: 0,
                    title: I18N.t('shipment.tab_menu.shipment', { locale: languageCode }),
                    isBadge: false,
                    icon: IMAGE_CONSTANT.deliveryIcon,
                    tab: SHIPMENT_TAB.SHIPMENT,
                    isShow: true,
                  },
                  {
                    id: 1,
                    title: I18N.t('shipment.tab_menu.quotes', { locale: languageCode }),
                    isBadge: false,
                    icon: IMAGE_CONSTANT.quotesIcon,
                    tab: SHIPMENT_TAB.QUOTES,
                    isShow: !IsShipmentBooked(shipmentDetail.status),
                  },
                  {
                    id: 2,
                    title: I18N.t('shipment.tab_menu.progress', { locale: languageCode }),
                    isBadge: false,
                    icon: IMAGE_CONSTANT.progressIcon,
                    tab: SHIPMENT_TAB.PROGRESS,
                    isShow: IsShipmentBooked(shipmentDetail.status),
                  },
                  {
                    id: 3,
                    title: 'Communication',
                    isBadge: newMessage,
                    icon: IMAGE_CONSTANT.communicationIcon,
                    tab: SHIPMENT_TAB.COMMUNICATION,
                    isShow: IsCanCommunication(shipmentDetail.status),
                  },
                  {
                    id: 4,
                    title: 'Payment',
                    isBadge: false,
                    icon: IMAGE_CONSTANT.paymentIcon,
                    tab: SHIPMENT_TAB.PAYMENT,
                    isShow: IsShipmentBooked(shipmentDetail.status),
                  },
                ]}
                activeTab={activeTab}
                notification={{
                  tab: 1,
                  value: (quoteDetail && quoteDetail.items && quoteDetail.items.length) || shipmentDetail.quotes.length,
                }}
                switchTab={this.switchTab}
                propStyle={{ zIndex: Platform.OS === 'android' ? 1 : -1 }}
              />
              {this.renderTab()}
            </>
          </KeyboardAwareScrollView>
        );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.switchMode()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  driverInfo: state.listing.shipmentDetail.driver || null,
  shipmentDetail: state.listing.shipmentDetail,
  languageCode: state.app.languageCode,
  deleteReasons: state.listing.deleteReasons,
  shipmentId: state.listing.shipmentId,
  quoteDetail: state.listing.quoteDetail,
  countryCode: state.app.countryCode,
  accountSelect: state.auth.accountSelect,
  transportTypesDefault: state.listing.transportTypesDefault,
  configs: state.app.configs,
  locationServicesDefault: state.listing.defaultLocationServices,
  reasonsRejectQuote: state.listing.reasonsRejectQuote,
  isEditing: state.listing.isEditing,
  progress: state.progress.progress,
  currenStep: state.listing.currenStep,
  payment: state.payment.data,
  newMessageType1: state.communication.newMessageType1 || {},
  newMessageType3: state.communication.newMessageType3 || {},
  newMessageType4: state.communication.newMessageType4 || {},
  isLoading: state.app.isLoading,
  shipmentStatus: state.listing.shipmentDetail.status || null,
  shipmentCode: state.listing.shipmentDetail.code || null,
  tabFilter: state.listing.tabFilter,
  fromDate: state.listing.fromDate,
  toDate: state.listing.toDate,
  textFilter: state.listing.textFilter,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction, ...progressAction, ...paymentAction, ...communicationAction },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentContainer);

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
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  normal: {
    fontFamily: 'Roboto-Regular',
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
