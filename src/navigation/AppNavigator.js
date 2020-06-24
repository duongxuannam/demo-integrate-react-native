import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  NativeModules,
  Keyboard,
  AppState,
  Modal,
  Text,
} from 'react-native';
import {
  Freshchat, FreshchatConfig, FreshchatUser, FreshchatNotificationConfig
} from 'react-native-freshchat-sdk';
import {
  SafeAreaView,
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import * as signalR from '@aspnet/signalr';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FirebaseHelper from '../helpers/firebaseHelper';


// ROUTE
import MainTabNavigator from './MainTabNavigator';
import AuthTabNavigator from './AuthTabNavigator';

// MODAL
import AddressAutoComplete from '../components/modal/AddressAutoComplete';
import EditAddress from '../components/modal/EditAddress';

import IMAGE_CONSTANT from '../constants/images';
import { MODAL_STATUS } from '../constants/app';
import API_URL from '../constants/apiUrl';
import Header from '../components/common/Header';
import NavigationService from '../helpers/NavigationService';
import SideMenu from './SideMenu';
import LoadingIC from '../components/common/LoadingIC';
import { LANGUAGES } from '../constants/hardData';
import I18n from '../config/locales/index';
import appActions from '../store/actions/appAction';
import notificationActions from '../store/actions/notificationAction';
import chatAction from '../store/actions/communicationAction';
import { store } from '../store';
import { APP_ACTION } from '../store/actionTypes';
import SYSTEM_POPUP from '../constants/systemErrorTypes';

const LIVECHAT_APP_ID = 'fd6d45cb-8c71-47db-b71b-a27df146b53f';
const LVIECHAT_APP_KEY = 'c3b31fa8-e84d-4fac-acfe-f3e735682987';

const SwitchRoute = createSwitchNavigator(
  {
    AuthTabNavigator,
    MainTabNavigator,
  },
  {
    initialRouteName: 'AuthTabNavigator',
  }
);

const AppRoute = createStackNavigator(
  {
    SwitchRoute,
  },
  {
    initialRouteName: 'SwitchRoute',
    defaultNavigationOptions: ({ navigation }) => {
      const { index, routes } = navigation.state;
      const { index: indexRoute, routes: childRoute } = routes[index];
      return ({
        header: <Header
          // showBackButton={childRoute[indexRoute].routeName === 'HomeStack' || childRoute[indexRoute].routeName === 'BookingStack'}
          // onBackAction={NavigationService.back}
          onPressButton={NavigationService.toggleNavigate}
          hideRightButton={
            childRoute[indexRoute].routeName === 'SwitchAccountStack'
            || childRoute[indexRoute].routeName === 'SelectCountryStack'
          }
        />
      });
    },
  }
);

const drawerRoute = createDrawerNavigator(
  { AppRoute },
  {
    drawerPosition: 'right',
    contentComponent: SideMenu,
    contentOptions: {},
    initialRouteName: 'AppRoute',
    edgeWidth: 0,
  }
);

const AppContainer = createAppContainer(drawerRoute);

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.headerRight = this.headerRight.bind(this);
    this.connectionHub = null;
  }

  componentDidMount() {
    const {
      countryCode, languageCode, token
    } = this.props;

    // initialize Firebase
    FirebaseHelper().getInstance();

    if (countryCode) {
      store.dispatch({
        type: APP_ACTION.SET_APP_DATA,
      });
    }
    if (!countryCode || !languageCode) {
      this.getDefaultCountryAndLanguageCode();
    }
    this.currentAppState = AppState.currentState;
    AppState.addEventListener('change', this.handleAppStateChange);
    if (token) {
      this.prepareRealTime();
    }
  }

  componentDidUpdate(prevProps) {
    const { token } = this.props;
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
    console.log('getDefaultCountryAndLanguageCodegetDefaultCountryAndLanguageCode');
    let locale = '';
    if (Platform.OS === 'ios') {
      locale = NativeModules.SettingsManager.settings.AppleLocale;
    }
    if (Platform.OS === 'android') {
      locale = NativeModules.I18nManager.localeIdentifier;
    }
    if (locale) {
      locale = locale.split('_');
      const index = LANGUAGES.findIndex((e) => e.countryCode.toUpperCase() === locale[1].toUpperCase());
      if (index > -1) {
        const { actions } = this.props;
        I18n.switchLanguage(locale[0]);
        actions.updateLanguage(LANGUAGES[index].countryCode, locale[0].toLowerCase(), index, LANGUAGES[index].callingCode);
      }
    }
  }

  languageLocalize = (msgLabel) => {
    const { languageCode } = this.props;
    if (String(msgLabel).match(/PaymentChangeRequestNotFound/g)) {
      return I18n.t(msgLabel, { locale: languageCode });
    }
    return I18n.t('errorGeneral', { locale: languageCode });
  }

  prepareRealTime = () => {
    const {
      token, actions, accountSelect, callingCode,
    } = this.props;
    actions.loginFirebase();
    this.connectionHub = new signalR.HubConnectionBuilder()
      .withUrl(API_URL.REALTIME_NOTIFICATION, {
        accessTokenFactory() {
          return token;
        }
      })
      .build();

    this.connectionHub.start()
      .then(() => {
        console.log('connectionHub: ', this.connectionHub);
      })
      .catch((err) => console.log(err));

    this.connectionHub.on('ReceiveMessage', (messageReceived) => {
      console.log('This is message: ', messageReceived);
      actions.changeTotalUnreadNotification(messageReceived.totalUnRead);
    });

    const freshchatConfig = new FreshchatConfig(LIVECHAT_APP_ID, LVIECHAT_APP_KEY);
    freshchatConfig.teamMemberInfoVisible = true;
    freshchatConfig.cameraCaptureEnabled = true;
    freshchatConfig.gallerySelectionEnabled = true;
    freshchatConfig.responseExpectationEnabled = true;
    freshchatConfig.showNotificationBanner = true; // iOS only
    freshchatConfig.notificationSoundEnabled = true; // iOS only
    freshchatConfig.themeName = 'CustomTheme.plist'; // iOS only
    freshchatConfig.stringsBundle = 'FCCustomLocalizable'; // iOS only
    Freshchat.init(freshchatConfig);

    const freshchatUser = new FreshchatUser();
    freshchatUser.firstName = accountSelect.name;
    freshchatUser.lastName = ` - ${accountSelect.id}`;
    freshchatUser.email = accountSelect.email;
    freshchatUser.phoneCountryCode = callingCode;
    freshchatUser.phone = accountSelect.phone;
    console.log('freshchatUser: ', freshchatUser);

    Freshchat.setUser(freshchatUser, (error) => {
      console.log('Freshchat setUser error: ', error);
    });

    Freshchat.addEventListener(
      Freshchat.EVENT_USER_RESTORE_ID_GENERATED,
      () => {
        console.log('onRestoreIdUpdated triggered');
        Freshchat.getUser((user) => {
          const { restoreId } = user;
          const { externalId } = user;
          console.log(`externalId: ${externalId}`);
          console.log(`restoreId: ${restoreId}`);
        });
      }
    );

    Freshchat.getUser((user) => {
      console.log('getUser: ', user);
    });
  }

  handleAppStateChange = (nextAppState) => {
    if (this.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
      this.prepareRealTime();
    }

    if (this.currentAppState === 'active' && String(nextAppState).match(/inactive|background/) && this.connectionHub) {
      console.log('Close signalR');
      this.connectionHub.stop().then(() => { this.connectionHub = null; console.log('Closed signalR: ', this.connectionHub); });
    }
    this.currentAppState = AppState.currentState;
  }

  headerLeft = () => (
    <View style={{ paddingLeft: 17 }}>
      <Image source={IMAGE_CONSTANT.logo} />
    </View>
  )

  headerRight = () => (
    <View style={[styles.flex, styles.alignItemsCenter]}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss(); NavigationService.toggleNavigate(); }}>
        <View style={{ paddingRight: 30 }}>
          <Image source={IMAGE_CONSTANT.menu} style={{ width: 24, height: 24 }} />
        </View>
      </TouchableOpacity>
    </View>
  )

  // eslint-disable-next-line class-methods-use-this
  renderModal = (modalStatus) => {
    switch (modalStatus) {
      case MODAL_STATUS.ADDRESS_AUTO_COMPLETE:
        return (<AddressAutoComplete />);
      default: return null;
    }
  }

  closeError = () => {
    const { actions } = this.props;
    actions.clearError();
  }

  showErrorMessage = (error, languageCode) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: '80%', paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'rgba(81, 175, 43, 1)', borderRadius: 5
      }}
      >
        <View style={[styles.flex, styles.alignItemsCenter, { padding: 10 }]}>
          <Text style={[{
            flex: 1,
            fontSize: 21,
            color: '#fff',
            fontWeight: 'bold'
          }]}
          >
            Error
            {/* {I18n.t('bid.error', { locale: languageCode })} */}
          </Text>
        </View>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={{
            paddingVertical: 20,
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            marginBottom: 10
          }}
          >
            <Text style={[
              styles.textCenter,
              {
                backgroundColor: 'rgba(255, 205, 0, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 205, 0, 1)',
                paddingHorizontal: 10,
                fontSize: 16,
                borderRadius: 5,
                color: 'red',
                paddingVertical: 10,
              },
            ]}
            >
              {this.languageLocalize(error && error.error)}
            </Text>
          </View>
          <View style={[styles.flex, { marginBottom: 20 }]}>
            <TouchableOpacity
              style={[styles.alignItemsCenter, { flex: 1 }, styles.flex]}
              activeOpacity={0.9}
              onPress={this.closeError}
            >
              <Text style={{
                flex: 1,
                marginHorizontal: 20,
                borderRadius: 4,
                backgroundColor: 'rgba(14, 115, 15, 1)',
                fontSize: 20,
                fontWeight: 'bold',
                lineHeight: 60,
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 1)',
              }}
              >
                {I18n.t('resultForgotPwd.labelBtnOkay', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

  renderAddressModall = () => (
    <EditAddress />
  )

  render() {
    const {
      isLoading, modalStatus, openAddressModal, error, languageCode
    } = this.props;
    console.log('error', error);
    const isShowError = error && error.type === SYSTEM_POPUP.GENERAL;
    return (
      <SafeAreaView
        forceInset={{ top: 'always', horizontal: 'never' }}
        style={[styles.container]}
      >
        <AppContainer ref={(ref) => NavigationService.setContainer(ref)} />
        {openAddressModal && (
          <View style={[styles.overlayScreen]}>
            {this.renderAddressModall()}
          </View>
        )}

        {
          isLoading && (
            <View style={[styles.overlayScreen]}>
              <View style={[styles.overlayScreen, styles.opacityScreen]} />
              <LoadingIC />
            </View>
          )
        }

        {modalStatus && (
          <View style={[styles.overlayScreen]}>
            {this.renderModal(modalStatus)}
          </View>
        )}
        <Modal
          animationType="slide"
          transparent
          visible={isShowError}
          onRequestClose={this.closeError}
        >
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
    // flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  opacityScreen: {
    backgroundColor: 'black',
    opacity: 0.6
  }
});

const mapStateToProps = (state) => ({
  isLoading: state.app.isLoading,
  modalStatus: state.app.modalStatus,
  openAddressModal: state.app.openAddressModal,
  countryCode: state.app.countryCode,
  languageCode: state.app.languageCode,
  token: state.auth.token,
  error: state.app.errorMessage,
  accountSelect: state.auth.accountSelect || null,
  callingCode: state.app.callingCode || '+84',
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateLanguage: appActions.updateLanguage,
      changeTotalUnreadNotification: notificationActions.changeTotalUnreadNotification,
      clearError: appActions.clearError,
      loginFirebase: chatAction.loginFirebase,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppNavigator);
