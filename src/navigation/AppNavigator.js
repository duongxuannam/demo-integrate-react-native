import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Text,
  NativeModules,
  Platform,
  Modal,
  AppState,
} from 'react-native';
import {
  SafeAreaView,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import * as signalR from '@aspnet/signalr';

// REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import API_URL from '../constants/apiUrl';

// ACTION
import appActions from '../store/actions/appAction';
import driverAction from '../store/actions/driverAction';
import notificationAction from '../store/actions/notificationAction';

// ROUTE
import MainTabNavigator from './MainTabNavigator';
import AuthTabNavigator from './AuthTabNavigator';

import IMAGE_CONSTANT from '../constants/images';
import Header from '../components/common/Header';
import NavigationService from '../helpers/NavigationService';
import SideMenu from './SideMenu';
import LoadingIC from '../components/common/LoadingIC';
import APP, {MODAL_STATUS} from '../constants/app';
import {LANGUAGES} from '../constants/hardData';
import {width} from '../helpers/scaling.helpers';
import FirebaseHelper from '../helpers/firebaseHelper';

// MODAL
import AddressAutoComplete from '../components/modal/AddressAutoComplete';
import GoogleMapDetail from '../components/modal/GoogleMapDetail';
import SYSTEM_POPUP from '../constants/systemErrorType';
import APP_CONSTANT, {
  STATUS_FILTER,
  SORT_FILTER,
} from '../helpers/constant.helper';
import I18n from '../config/locales';
import Left from '../constants/theme/components/Left';
import configActions from '../store/actions/configAction';
import AddressDropdown from '../components/modal/AddressDropdown';
import chatAction from '../store/actions/chatAction';

const SwitchRoute = createSwitchNavigator(
  {
    MainTabNavigator,
    AuthTabNavigator,
  },
  {
    initialRouteName: 'MainTabNavigator',
  },
);

const AppRoute = createStackNavigator(
  {
    SwitchRoute,
  },
  {
    initialRouteName: 'SwitchRoute',
    defaultNavigationOptions: ({navigation}) => {
      const {index, routes} = navigation.state;
      const {index: indexRoute, routes: childRoute} = routes[index];
      return {
        header: (
          <Header
            showBackButton={
              childRoute[indexRoute].routeName === 'ShipmentDetailStack' ||
              childRoute[indexRoute].routeName === 'ShipmentPlaceStack'
            }
            onBackAction={NavigationService.back}
            onPressButton={NavigationService.toggleNavigate}
            hideRightButton={
              childRoute[indexRoute].routeName === 'SwitchAccountStack'
            }
          />
        ),
      };
    },
  },
);
const drawerRoute = createDrawerNavigator(
  {AppRoute},
  {
    drawerPosition: 'right',
    contentComponent: SideMenu,
    contentOptions: {},
    initialRouteName: 'AppRoute',
    edgeWidth: 0,
  },
);

const AppContainer = createAppContainer(drawerRoute);

const sortDataItemDefault = [
  {
    id: 1,
    icon: null,
    title: 'all',
    value: '',
    isActive: true,
  },
  {
    id: 2,
    icon: null,
    title: 'recents',
    value: 'ChangedStatusDate',
    isActive: true,
  },
  {
    id: 3,
    icon: null,
    title: 'ending_soon',
    value: 'Expired',
    isActive: true,
  },
  {
    id: 4,
    icon: null,
    title: 'price',
    value: 'Price',
    isActive: true,
  },
  {
    id: 5,
    icon: null,
    title: 'number_of_quotes',
    value: 'NumberOfQuotes',
    isActive: true,
  },
];

const sortDataItemTabMyShipment = [
  {
    id: 4,
    titleShow: 'price_low_to_high',
    title: SORT_FILTER.LOW_TO_HIGH,
    value: SORT_FILTER.PRICE,
    isActive: true,
  },
  {
    id: 5,
    titleShow: 'price_high_to_low',
    title: SORT_FILTER.HIGH_TO_LOW,
    value: SORT_FILTER.PRICE,
    isActive: true,
  },
  {
    id: 2,
    titleShow: 'most_recent',
    title: SORT_FILTER.MOST_RECENT,
    value: 'ChangedStatusDate',
    isActive: true,
  },
];

const filterDataItemDefault = [
  {
    id: 1,
    status: 'upcoming',
    title: 'upcoming',
    name: STATUS_FILTER.Upcoming,
    value: 10,
  },
  {
    id: 2,
    status: 'completed',
    title: 'completed',
    name: STATUS_FILTER.Completed,
    value: 98,
  },
  {
    id: 3,
    status: 'cancelled',
    title: 'cancelled',
    name: STATUS_FILTER.Cancelled,
    value: 99,
  },
];

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // this.headerRight = this.headerRight.bind(this);
    this.connectionHub = null;

    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentDidMount() {
    const {countryCode, languageCode, token, actions} = this.props;
    if (!countryCode || !languageCode) {
      this.getDefaultCountryAndLanguageCode();
    }
    this.currentAppState = AppState.currentState;
    AppState.addEventListener('change', this.handleAppStateChange);
    if (token) {
      this.prepareRealTime(token);
    }
    FirebaseHelper().getInstance();
  }

  componentDidUpdate(prevProps) {
    const {token} = this.props;
    if (prevProps.token !== token) {
      if (this.connectionHub) {
        this.connectionHub.stop().then(() => {
          this.connectionHub = null;
          if (token) {
            this.prepareRealTime();
          }
        });
      } else if (token) {
        this.prepareRealTime();
      }
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  getDefaultCountryAndLanguageCode() {
    const {actions} = this.props;
    let locale1 = 'vi_VN';
    if (Platform.OS === 'ios') {
      locale1 = NativeModules.SettingsManager.settings.AppleLocale;
    }
    if (Platform.OS === 'android') {
      locale1 = NativeModules.I18nManager.localeIdentifier;
    }
    if (locale1) {
      const localeSplit = locale1.split('_');
      const index = LANGUAGES.findIndex(
        e => e.countryCode.toUpperCase() === localeSplit[1].toUpperCase(),
      );
      if (index > -1) {
        // I18n.switchLanguage(locale[0]);
        actions.updateConfig(
          LANGUAGES[index].countryCode,
          localeSplit[0].toLowerCase(),
          index,
          LANGUAGES[index].callingCode,
        );
        actions.getConfigSettings(LANGUAGES[index].countryCode);
      } else {
        actions.updateConfig(
          LANGUAGES[3].countryCode,
          LANGUAGES[3].language[1].lang,
          3,
          LANGUAGES[3].callingCode,
        );
        actions.getConfigSettings(LANGUAGES[3].countryCode); // vn
      }
      // if (LANGUAGES[index] && LANGUAGES[index].countryCode) {
      //   actions.getConfigSettings(LANGUAGES[index].countryCode);
      // } else {
      //   actions.getConfigSettings('vn');
      // }
    }
  }

  prepareRealTime = () => {
    const {token, actions} = this.props;
    try {
      actions.loginFirebase();
      this.connectionHub = new signalR.HubConnectionBuilder()
        .withUrl(API_URL.REALTIME_NOTIFICATION, {
          accessTokenFactory() {
            return token;
          },
        })
        .build();

      this.connectionHub
        .start()
        .then(() => {})
        .catch(err => {});

      this.connectionHub.on('ReceiveMessage', messageReceived => {
        actions.changeNumberUnRead(messageReceived.totalUnRead);
        // actions.getNotification(NOTIFICATION_TYPE.STATUS_ALL, 4);
      });
    } catch (error) {}
  };

  handleAppStateChange = nextAppState => {
    if (
      this.currentAppState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.prepareRealTime();
    }

    if (
      this.currentAppState === 'active' &&
      String(nextAppState).match(/inactive|background/) &&
      this.connectionHub
    ) {
      this.connectionHub.stop().then(() => {
        this.connectionHub = null;
      });
    }
    this.currentAppState = AppState.currentState;
  };

  renderModal = modalStatus => {
    switch (modalStatus) {
      case MODAL_STATUS.ADDRESS_AUTO_COMPLETE:
        return <AddressAutoComplete />;
      default:
        return null;
    }
  };

  closeDropdown = () => {
    const {actions} = this.props;
    actions.toggleDropDown();
  };

  closeDropdownFilter = () => {
    const {actions} = this.props;
    actions.toggleDropDownFilter();
  };

  handleChangeSortField = sortFieldSelected => () => {
    const {actions} = this.props;
    actions.toggleDropDown();
    actions.selectSortItem(sortFieldSelected);

    if (
      sortFieldSelected.value === SORT_FILTER.PRICE &&
      sortFieldSelected.title === SORT_FILTER.LOW_TO_HIGH
    ) {
      actions.setFieldQuery({
        sortFilter: sortFieldSelected.value,
        sortFilterOrder: 0,
      });
    } else if (
      sortFieldSelected.value === SORT_FILTER.PRICE &&
      sortFieldSelected.title === SORT_FILTER.HIGH_TO_LOW
    ) {
      actions.setFieldQuery({
        sortFilter: sortFieldSelected.value,
        sortFilterOrder: 1,
      });
    } else if (sortFieldSelected.value === SORT_FILTER.MOST_RECENT) {
      actions.setFieldQuery({
        sortFilter: sortFieldSelected.value,
        sortFilterOrder: 1,
      });
    } else {
      actions.setFieldQuery({
        sortFilter: sortFieldSelected.value,
      });
    }
  };

  handleChangeFilter = filterSelected => () => {
    const {actions} = this.props;
    actions.toggleDropDownFilter();
    actions.selectFilterItem(filterSelected);
    actions.setFieldQuery({
      StatusFilter: filterSelected.name,
    });
  };

  closeError = () => {
    const {actions} = this.props;
    actions.clearError();
  };

  showErrorMessage = (error, languageCode) => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          width: '80%',
          paddingHorizontal: 10,
          paddingBottom: 10,
          backgroundColor: 'rgba(81, 175, 43, 1)',
          borderRadius: 5,
        }}>
        <View style={[styles.flex, styles.alignItemsCenter, {padding: 10}]}>
          <Text
            style={[
              {
                flex: 1,
                fontSize: 21,
                color: '#fff',
                fontFamily: 'Roboto-Bold',
              },
            ]}>
            {I18n.t('bid.error', {locale: languageCode})}
          </Text>
        </View>
        <View style={{backgroundColor: '#fff'}}>
          <View
            style={{
              paddingVertical: 20,
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              marginBottom: 10,
            }}>
            <Text
              style={[
                styles.textCenter,
                {
                  backgroundColor: 'rgba(255, 205, 0, 0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 205, 0, 1)',
                  paddingHorizontal: 10,
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                  borderRadius: 5,
                  color: 'red',
                  paddingVertical: 10,
                },
              ]}>
              {error && error.error}
            </Text>
          </View>
          <View style={[styles.flex, {marginBottom: 20}]}>
            <TouchableOpacity
              style={[styles.alignItemsCenter, {flex: 1}, styles.flex]}
              activeOpacity={0.9}
              onPress={this.closeError}>
              <Text
                style={{
                  flex: 1,
                  marginHorizontal: 20,
                  borderRadius: 4,
                  backgroundColor: 'rgba(14, 115, 15, 1)',
                  fontSize: 20,
                  fontFamily: 'Roboto-Bold',
                  lineHeight: 60,
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 1)',
                }}>
                {I18n.t('shipment.detail.warning.okay', {locale: languageCode})}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  renderDropDown = dropDownPos => {
    const {TabFilter, languageCode} = this.props;
    const isMyShipmentTab = TabFilter === APP_CONSTANT.MY_SHIPMENT;
    const sortDataItem = isMyShipmentTab
      ? sortDataItemTabMyShipment
      : sortDataItemDefault;
    const targetOfSet = isMyShipmentTab ? 0.2 : 0.5;
    const left = dropDownPos.x - dropDownPos.w * targetOfSet;
    return (
      <View
        style={{
          position: 'absolute',
          left,
          top: dropDownPos.y + 30,
          backgroundColor: '#fff',
          borderRadius: 4,
        }}>
        <View style={styles.dropdownArrow} />
        <View style={styles.dropdownGroup}>
          {sortDataItem.map((session, key) => {
            if (session.isActive === false) {
              return (
                <View
                  key={`action-click-${session.id}`}
                  style={
                    sortDataItem.length - 1 === key ? null : {marginBottom: 15}
                  }>
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    {session.icon && <Image source={session.icon} />}
                    <Text
                      style={[
                        {
                          fontSize: 17,
                          fontFamily: 'Roboto-Regular',
                          marginLeft: 10,
                          color: session.color || 'rgba(68, 68, 68, 1)',
                        },
                      ]}>
                      {session.title}
                    </Text>
                  </View>
                  <Text
                    style={[
                      {
                        fontSize: 13,
                        fontFamily: 'Roboto-Regular',
                        color: session.color || 'rgba(68, 68, 68, 1)',
                        width: 110,
                      },
                    ]}>
                    Not available with active bids.
                  </Text>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={`action-click-${session.id}`}
                style={[
                  styles.flex,
                  styles.alignItemsCenter,
                  sortDataItem.length - 1 === key ? null : {marginBottom: 15},
                ]}
                activeOpacity={0.9}
                onPress={this.handleChangeSortField(session)}>
                <Image source={session.icon} />
                <Text
                  style={[
                    {
                      fontSize: 17,
                      fontFamily: 'Roboto-Regular',
                      marginLeft: 10,
                      color: session.color || 'rgba(68, 68, 68, 1)',
                    },
                  ]}>
                  {isMyShipmentTab
                    ? I18n.t(`shipment.${session.titleShow}`, {
                        locale: languageCode,
                      })
                    : I18n.t(`shipment.${session.title}`, {
                        locale: languageCode,
                      })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  renderDropDownFilter = (dropDownPos, languageCode, totalStatusFilter) => {
    const left = dropDownPos.x - dropDownPos.w * 1.34;
    return (
      <View
        style={{
          position: 'absolute',
          left: Left >= 0 ? left : 1,
          top: dropDownPos.y + 100,
          backgroundColor: '#fff',
          borderRadius: 4,
          width: '46%',
        }}>
        <View
          style={[
            styles.dropdownArrow,
            {borderBottomColor: 'rgba(81, 175, 43, 1)'},
          ]}
        />
        <View
          style={[
            styles.dropdownGroup,
            {borderColor: 'rgba(81, 175, 43, 1)', borderWidth: 1},
          ]}>
          {filterDataItemDefault.map((session, key) => (
            <TouchableOpacity
              key={`action-click-${session.id}`}
              style={[
                styles.flex,
                styles.alignItemsCenter,
                filterDataItemDefault.length - 1 === key
                  ? null
                  : {marginBottom: 15},
              ]}
              activeOpacity={0.9}
              onPress={this.handleChangeFilter(session)}>
              <Text
                style={[
                  {
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    marginLeft: 10,
                    color: session.color || 'rgba(68, 68, 68, 1)',
                  },
                ]}>
                {/* {session.title} */}
                {`${I18n.t(`shipment.${session.title}`, {
                  locale: languageCode,
                })} (${totalStatusFilter[`${session.title}`]})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  render() {
    const {
      isLoading,
      modalStatus,
      dropDownStatus,
      dropDownPos,
      languageCode,
      error,
      dropDownFilterPos,
      dropDownFilterStatus,
      totalStatusFilter,
    } = this.props;

    const isShowError = error && error.type === SYSTEM_POPUP.GENERAL;
    return (
      <SafeAreaView
        forceInset={{top: 'always', horizontal: 'never'}}
        style={styles.container}>
        <AppContainer ref={ref => NavigationService.setContainer(ref)} />
        {/* {isLoading && (
          <View style={styles.loadingScreen}>
            <View style={[styles.loadingScreen, styles.opacityScreen]} />
            <LoadingIC />
          </View>
        )} */}

        {dropDownStatus && dropDownPos && (
          <View style={[styles.overlayScreen]}>
            <TouchableWithoutFeedback onPress={this.closeDropdown}>
              <View
                style={{
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  flex: 1,
                  width,
                }}>
                {this.renderDropDown(dropDownPos)}
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}

        {dropDownFilterStatus && dropDownFilterPos && (
          <View style={[styles.overlayScreen]}>
            <TouchableWithoutFeedback onPress={this.closeDropdownFilter}>
              <View
                style={{
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  flex: 1,
                  width,
                }}>
                {this.renderDropDownFilter(
                  dropDownFilterPos,
                  languageCode,
                  totalStatusFilter,
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        <AddressDropdown />

        {modalStatus && (
          <View style={[styles.overlayScreen]}>
            {this.renderModal(modalStatus)}
          </View>
        )}
        {modalStatus === MODAL_STATUS.GOOGLEMAP_SHIPMENT_DETAIL && (
          <GoogleMapDetail />
        )}

        <Modal
          animationType="slide"
          transparent
          visible={isShowError}
          onRequestClose={this.closeError}>
          {this.showErrorMessage(error, languageCode)}
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  overlayScreen: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loadingScreen: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  opacityScreen: {
    backgroundColor: 'black',
    opacity: 0.6,
  },
  dropdownArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    marginTop: -8,
    position: 'absolute',
    right: 15,
    top: 1,
    zIndex: 3,
  },
  dropdownGroup: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
  },
});

const mapStateToProps = state => ({
  isLoading: state.app.isLoading,
  modalStatus: state.app.modalStatus,
  dropDownStatus: state.app.dropDownStatus,
  dropDownPos: state.app.dropDownPos,
  languageCode: state.config.languageCode,
  error: state.app.errorMessage,
  dropDownFilterStatus: state.app.dropDownFilterStatus,
  dropDownFilterPos: state.app.dropDownFilterPos,
  TabFilter: state.driver.TabFilter,
  totalStatusFilter: state.driver.totalStatusFilter,
  token: state.auth.token,
  countryCode: state.config.countryCode,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      toggleDropDown: appActions.toggleDropDown,
      clearError: appActions.clearError,
      setFieldQuery: driverAction.setFieldQuery,
      selectSortItem: driverAction.selectSortItem,
      updateConfig: appActions.updateConfig,
      toggleDropDownFilter: appActions.toggleDropDownFilter,
      selectFilterItem: driverAction.selectFilterItem,
      getConfigSettings: configActions.setConfigSetting,
      changeNumberUnRead: notificationAction.changeTotalUnreadNotification,
      getNotification: notificationAction.getNotification,
      loginFirebase: chatAction.loginFirebase,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppNavigator);
