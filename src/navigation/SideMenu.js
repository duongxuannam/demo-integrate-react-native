/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Radio, CheckBox } from 'native-base';
import { Freshchat } from 'react-native-freshchat-sdk';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import appActions from '../store/actions/appAction';
import authActions from '../store/actions/authAction';
import listingAction from '../store/actions/listingAction';
import notificationActions from '../store/actions/notificationAction';
import communicationActions from '../store/actions/communicationAction';

// COMPONENTS
import UrlImage from '../components/common/Image';
import ConfirmAlert from '../components/common/ConfirmAlert';
// CONSTANT
import IMAGE_CONSTANT from '../constants/images';
import { DASHBOARD, LANGUAGES } from '../constants/hardData';
import { ACCOUNT_TYPE } from '../constants/app';
import I18n from '../config/locales';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedUser: false,
      expandedRoute: false,
      expandedShipments: false,
      expandedInfo: false,
      toggleLanguage: null,
      dashboardSelected: 0,
      findSelected: 0,
      isSwitchAccount: false,
      isShowConfirmLogout: false,
    };
  }

  changeLanguage = (countryCode, languageCode, index, callingCode) => {
    const { actions, app, navigation } = this.props;
    if (app.countryCode !== countryCode) {
      const getMainTabNavigator = navigation.state.routes[0].routes[0].routes[1];
      const indexMain = getMainTabNavigator.index;
      if (indexMain === 0) {
        Alert.alert(
          'Notice',
          'Your booking may lost data and you have to re-input again',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            },
            {
              text: 'OK',
              onPress: () => {
                actions.updateLanguage(countryCode, languageCode, index, callingCode);
                this.getConfigsApp();
                navigation.closeDrawer();
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        actions.updateLanguage(countryCode, languageCode, index, callingCode)
        this.getConfigsApp();
        navigation.closeDrawer();
      }
    }

    if (app.countryCode === countryCode && app.languageCode !== languageCode) {
      actions.updateLanguage(countryCode, languageCode, index, callingCode);
      this.getConfigsApp();
    }
  };

  getConfigsApp = () => {
    const { actions } = this.props;
    actions.getAddressData();
    actions.getHandleUnit();
    actions.getHandleUnitDefault();
    actions.getTransportTypes();
    actions.getTransportTypesDefault();
    actions.getAdditionalServices();
    actions.getAdditionalServicesDefault();
    actions.getLocationServicesDefault();
    actions.getLocationTypesDefault();
  }

  handleSend = () => {
    const { actions, navigation } = this.props;
    // Get Current params of screen
    const currentIndex = navigation.state.routes[0].routes[0].index;
    const currentPage = navigation.state.routes[0].routes[0].routes[currentIndex].index;
    const currentBookingParams = navigation.state.routes[0].routes[0].routes[currentIndex].routes[currentPage].params;
    actions.handleSend(currentBookingParams);
    // Set new param
    const navigateAction = NavigationActions.navigate({
      routeName: 'BookingStack',
      params: {
        isRefresh:
        (currentBookingParams && !currentBookingParams.isRefresh) || false
      }
    });
    navigation.dispatch(navigateAction);
    // navigation.navigate('BookingStack', {
    //   isRefresh:
    //     (currentBookingParams && !currentBookingParams.isRefresh) || false
    // });
    this.setState({
      findSelected: 0
    });
    navigation.closeDrawer();
  };

  toggleLanguage = (value) => {
    let { toggleLanguage } = this.state;
    toggleLanguage = toggleLanguage === value ? null : value;
    this.setState({ toggleLanguage });
  };

  toggleUser = () => {
    const { expandedUser } = this.state;
    this.setState({ expandedUser: !expandedUser });
  };

  onFind = () => {
    const { findSelected } = this.state;
    if (findSelected !== 1) {
      this.setState({
        findSelected: 1
      });
    }
  };

  onManagementShipment = () => {
    const {
      auth: { token },
      navigation,
      actions,
    } = this.props;
    if (!token) {
      navigation.navigate('LoginStack');
    } else {
      navigation.closeDrawer();
      actions.redirectManagementShipments();
    }
  }

  navigateToScreen = (routeName) => () => {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName
    });
    navigation.toggleDrawer();
    navigation.dispatch(navigateAction);
  };

  navigateToNewShipment = () => {
    const { actions, navigation } = this.props;
    actions.clearShipment();
    // Get Current params of screen
    const currentBookingParams = navigation.state.routes[0].routes[0].routes[0].routes[0].params;
    // Set new param
    navigation.navigate('BookingStack', {
      isRefresh:
        (currentBookingParams && !currentBookingParams.isRefresh) || false
    });
    navigation.toggleDrawer();
  };

  selectAccount = (account) => () => {
    const { actions, navigation, currentStep } = this.props;
    const { expandedUser } = this.state;
    const isCurrentIndex = navigation.state.routes[0].routes[0].routes[1].index;
    // if (
    //   (currentStep === 1 || currentStep === 2 || currentStep === 3)
    //   && (isCurrentIndex === 0)
    // ) {
    //   this.toggleConfirmSwitchAccount();
    //   this.setState({ account });
    // } else {
    //   actions.selectAccount(account);
    //   this.setState({ expandedUser: !expandedUser });
    //   navigation.toggleDrawer();
    // }
    this.toggleConfirmSwitchAccount();
    this.setState({ account });
  };

  callSignOut = () => {
    const { actions, navigation } = this.props;
    actions.signOut();
    actions.changeTotalUnreadNotification(0);
    navigation.toggleDrawer();
    navigation.navigate('BookingStack');
  };

  renderListUser = (accounts, accountSelect, languageCode) => (
    <View style={[styles.listUser, styles.list]}>
      <View
        style={[
          styles.flex,
          styles.flexOne,
          styles.groupCustom,
          styles.lineBorder
        ]}
      >
        <TouchableOpacity
          style={styles.flexOne}
          activeOpacity={0.9}
          onPress={
            accountSelect.type === ACCOUNT_TYPE.PERSONAL
              ? this.navigateToScreen('EditProfileStack')
              : null
          }
        >
          <Text style={[styles.btn, styles.mr10]}>
            {I18n.t('menu.edit_profile', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexOne}
          activeOpacity={0.9}
          // onPress={this.callSignOut}
          onPress={this.toggleConfirmLogout}
        >
          <Text style={[styles.btn, styles.ml10]}>
            {I18n.t('menu.logout', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listUsers}>
        {accounts.map((item, index) => (
          <View
            style={[
              styles.user,
              styles.groupCustom,
              accountSelect.id === item.id && styles.userActive,
              accountSelect.id === item.id && styles.lineBorder
            ]}
            key={index}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.selectAccount(item)}
              disabled={accountSelect.id === item.id}
            >
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <UrlImage
                  sizeWidth={24}
                  sizeHeight={24}
                  sizeBorderRadius={0}
                  defaultImage={Boolean(!item.avatar)}
                  source={item.avatar || IMAGE_CONSTANT.imageDefault}
                />
                <View style={[styles.ml10, styles.flexOne]}>
                  <Text style={[styles.smallSize, styles.whiteText]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.smallerSize, styles.whiteText]}>
                    {item.email}
                  </Text>
                </View>
                {accountSelect.id === item.id && (
                  <Image
                    source={IMAGE_CONSTANT.checkMarkGreen}
                    style={{ width: 18, height: 15 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  renderInfo = () => {
    const { toggleLanguage } = this.state;
    const { app, languageCode, auth } = this.props;
    return (
      <View>
        <View style={[styles.listInfo, styles.list]}>
          {LANGUAGES.map((item, key) => (
            <View style={[styles.lineBorder]} key={key}>
              <View
                style={[styles.route, styles.lineBorder, styles.groupCustom]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.toggleLanguage(key)}
                >
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Image
                      source={item.icon}
                      style={{ width: 24, height: 24 }}
                    />
                    <View style={[styles.ml10, styles.flexOne]}>
                      <Text style={[styles.smallSize, styles.whiteText]}>
                        {I18n.t(item.name, { locale: languageCode })}
                      </Text>
                    </View>
                    {app.countryCode === item.countryCode && (
                      <Image
                        source={IMAGE_CONSTANT.checkMarkGreen}
                        style={{ width: 18, height: 15 }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              {toggleLanguage === key && (
                <View style={styles.ml40}>
                  {item.language.map((value, index) => (
                    <TouchableOpacity
                      style={[
                        styles.subLanguage,
                        index > 0 ? styles.lineTop : null,
                        styles.flex,
                        styles.alignItemsCenter
                      ]}
                      onPress={() => this.changeLanguage(
                        item.countryCode,
                        value.lang,
                        key,
                        item.callingCode
                      )}
                      key={index}
                    >
                      <Radio
                        standardStyle
                        color="#3fae29"
                        selectedColor="#3fae29"
                        selected={
                          app.countryCode === item.countryCode
                          && app.languageCode === value.lang
                        }
                        onPress={() => this.changeLanguage(
                          item.countryCode,
                          value.lang,
                          key,
                          item.callingCode
                        )}
                      />
                      <Text
                        style={[
                          styles.smallSize,
                          styles.whiteText,
                          styles.ml10
                        ]}
                      >
                        {I18n.t(value.text)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {auth.token && (
          <View>
            <View
              style={[
                styles.list,
                styles.flex,
                styles.alignItemsCenter,
                styles.lineBorder,
                styles.groupCustom
              ]}
            >
              <Text
                style={[styles.flexOne, styles.smallSize, styles.whiteText]}
              >
                {I18n.t('menu.phone_label', { locale: languageCode })}
              </Text>
              <View style={styles.mr10}>
                <CheckBox checked={false} color="white" />
              </View>
            </View>
            <View
              style={[
                styles.list,
                styles.flex,
                styles.alignItemsCenter,
                styles.lineBorder,
                styles.groupCustom
              ]}
            >
              <View style={[styles.flexOne, styles.mr10]}>
                <Text style={[styles.smallSize, styles.whiteText]}>
                  {I18n.t('menu.unique_code', { locale: languageCode })}
                </Text>
                <Text style={[styles.smallSize, styles.whiteText, styles.bold]}>
                  u089876
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => console.log('log')}
              >
                <Text style={[styles.btn, styles.btnCopy]}>
                  {I18n.t('menu.copy', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  renderRoute = () => {
    const { dashboardSelected } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={[styles.listRoute, styles.list]}>
        {DASHBOARD.map((item, index) => (
          <View
            style={[styles.route, styles.lineBorder, styles.groupCustom]}
            key={index}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ dashboardSelected: index })}
            >
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <View style={styles.flexOne}>
                  <Text style={[styles.smallSize, styles.whiteText]}>
                    {I18n.t(item, { locale: languageCode })}
                  </Text>
                </View>
                {index === dashboardSelected && (
                  <Image
                    source={IMAGE_CONSTANT.checkMarkGreen}
                    style={{ width: 18, height: 15 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  renderSectionAfterLogin() {
    const { expandedUser } = this.state;
    const { navigation, auth, languageCode } = this.props;
    const { accountSelect, accountsRender } = auth;
    return (
      <View>
        <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
          <View style={styles.flexOne}>
            <Text
              style={[
                styles.name,
                styles.defaultSize,
                styles.whiteText,
                styles.bold,
              ]}
            >
              {accountSelect.name || ''}
            </Text>
            <Text style={[styles.email, styles.smallerSize, styles.whiteText]}>
              {accountSelect.email || ''}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.toggleDrawer()}
          >
            <Image
              source={IMAGE_CONSTANT.closeWhite}
              style={{ width: 18, height: 18 }}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.userList, styles.mb20]}>
          <View style={[styles.groupCustom, styles.groupCustomBg]}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.toggleUser}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                {accountSelect.avatar && (
                  <UrlImage
                    sizeWidth={24}
                    sizeHeight={24}
                    sizeBorderRadius={0}
                    source={accountSelect.avatar}
                  />
                )}
                <Text
                  style={[
                    styles.flexOne,
                    styles.ml10,
                    styles.smallSize,
                    styles.whiteText,
                    styles.bold,
                  ]}
                >
                  {I18n.t('profile.your_account', { locale: languageCode })}
                </Text>
                {expandedUser ? (
                  <Image
                    source={IMAGE_CONSTANT.arrowUpWhite}
                    style={{ width: 15, height: 9 }}
                  />
                ) : (
                  <Image
                    source={IMAGE_CONSTANT.arrowDownGreen}
                    style={{ width: 15, height: 9 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          {expandedUser
            && accountSelect
            && this.renderListUser(accountsRender, accountSelect, languageCode)}
        </View>
      </View>
    );
  }

  renderSectionBeforeLogin() {
    const { navigation, languageCode } = this.props;
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
        <View style={[styles.flex, styles.flexOne]}>
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            onPress={this.navigateToScreen('LoginStack')}
          >
            <Text style={[styles.btn, styles.btnLogin]}>
              {I18n.t('menu.login', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            onPress={this.navigateToScreen('SignupStack')}
          >
            <Text style={[styles.btn, styles.btnSignup]}>
              {I18n.t('menu.sign_up', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.toggleDrawer()}
        >
          <Image
            source={IMAGE_CONSTANT.closeWhite}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderLinkSection = () => {
    const { findSelected } = this.state;
    const { languageCode, navigation } = this.props;
    return (
      <View style={[styles.flex, styles.mb20]}>
        <TouchableOpacity
          style={styles.flexOne}
          activeOpacity={0.9}
          onPress={this.handleSend}
        >
          <Text
            style={[
              styles.linkGroup,
              findSelected === 0 ? styles.linkGroupActive : null
            ]}
          >
            {I18n.t('menu.send', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.flexOne}
          activeOpacity={0.9}
          onPress={() => this.setState({ findSelected: 1 })}
        >
          <Text
            style={[
              styles.linkGroup,
              findSelected === 1 ? styles.linkGroupActive : null
            ]}
            onPress={this.onFind}
          >
            {I18n.t('menu.find', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderRouteSection() {
    const { expandedRoute, dashboardSelected } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={[styles.routeGroup, styles.mb20]}>
        <View style={[styles.groupCustom, styles.groupCustomBg]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState((prevState) => ({
              expandedRoute: !prevState.expandedRoute
            }))}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text
                style={[
                  styles.flexOne,
                  styles.smallSize,
                  styles.whiteText,
                  styles.bold,
                ]}
              >
                {I18n.t(DASHBOARD[dashboardSelected], { locale: languageCode })}
              </Text>
              {expandedRoute ? (
                <Image
                  source={IMAGE_CONSTANT.arrowUpWhite}
                  style={{ width: 15, height: 9 }}
                />
              ) : (
                <Image
                  source={IMAGE_CONSTANT.arrowDownGreen}
                  style={{ width: 15, height: 9 }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        {expandedRoute ? this.renderRoute() : null}
      </View>
    );
  }

  renderShipment = (accounts) => {
    const { languageCode, totalShipment } = this.props;
    if (!accounts) {
      return (
        <View
          style={[
            styles.listShipment,
            styles.linkGroup,
            styles.list,
            styles.flex,
            styles.pad20
          ]}
        >
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            onPress={this.navigateToNewShipment}
          >
            <Text style={[styles.btn, styles.mr10]}>
              {I18n.t('menu.new_shipment', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            onPress={this.onManagementShipment}
          >
            <Text style={[styles.btn, styles.ml10]}>
              {I18n.t('menu.manage_shipments', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        <Text
          style={{
            textAlign: 'center',
            paddingTop: 10,
            color: 'white',
            fontSize: 20,
            fontFamily: 'Roboto-Regular',
          }}
        >
          {totalShipment}
          {' '}
          {totalShipment >= 2
            ? I18n.t('menu.shipments_text', { locale: languageCode })
            : I18n.t('menu.shipment', { locale: languageCode })}
        </Text>
        <View
          style={[
            styles.listShipment,
            styles.linkGroup,
            styles.list,
            styles.flex,
            styles.pad20
          ]}
        >
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            onPress={this.onManagementShipment}
          >
            <Text style={[styles.btn, styles.mr10]}>
              {I18n.t('menu.shipments', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flexOne}
            activeOpacity={0.9}
            // onPress={this.navigateToScreen('HomeStack')}
          >
            <Text style={[styles.btn, styles.ml10]}>
              {I18n.t('menu.wallet', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderShipmentSection() {
    const { expandedShipments } = this.state;
    const { auth, languageCode } = this.props;
    const { accountsRender } = auth;
    return (
      <View style={[styles.shipmentGroup, styles.mb20]}>
        <View style={[styles.groupCustom, styles.groupCustomBg]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState({ expandedShipments: !expandedShipments })}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text
                style={[
                  styles.flexOne,
                  styles.smallSize,
                  styles.whiteText,
                  styles.bold,
                ]}
              >
                {I18n.t('menu.shipments', { locale: languageCode })}
              </Text>
              {expandedShipments ? (
                <Image
                  source={IMAGE_CONSTANT.arrowUpWhite}
                  style={{ width: 15, height: 9 }}
                />
              ) : (
                <Image
                  source={IMAGE_CONSTANT.arrowDownGreen}
                  style={{ width: 15, height: 9 }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        {expandedShipments ? this.renderShipment(accountsRender) : null}
      </View>
    );
  }

  renderInfoSection() {
    const { expandedInfo } = this.state;
    const { app, languageCode } = this.props;
    const flag = app.countryIndex
      ? LANGUAGES[app.countryIndex].icon
      : IMAGE_CONSTANT.flagEng;
    return (
      <View style={[styles.infoGroup, styles.mb20]}>
        <View style={[styles.groupCustom, styles.groupCustomBg]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState(() => ({ expandedInfo: !expandedInfo }))}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Image source={flag} style={{ width: 24, height: 24 }} />
              <Text
                style={[
                  styles.flexOne,
                  styles.ml10,
                  styles.smallSize,
                  styles.whiteText,
                  styles.bold,
                ]}
              >
                {I18n.t('menu.preferences', { locale: languageCode })}
              </Text>
              {expandedInfo ? (
                <Image
                  source={IMAGE_CONSTANT.arrowUpWhite}
                  style={{ width: 15, height: 9 }}
                />
              ) : (
                <Image
                  source={IMAGE_CONSTANT.arrowDownGreen}
                  style={{ width: 15, height: 9 }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        {expandedInfo ? this.renderInfo() : null}
      </View>
    );
  }

  onCancelConfirmSwitchAccount = () => {
    const { navigation } = this.props;
    this.toggleConfirmSwitchAccount();
    this.setState({ expandedUser: !this.state.expandedUser });
    navigation.toggleDrawer();
  };

  onCancelConfirmLogout = () => {
    const { navigation } = this.props;
    this.toggleConfirmLogout();
    this.setState({ expandedUser: !this.state.expandedUser });
    navigation.toggleDrawer();
  };

  onOkConfirmSwitchAccount = () => {
    const { actions, navigation, currentStep, accountSelect } = this.props;
    const { expandedUser, account } = this.state;
    const isCurrentIndex = navigation.state.routes[0].routes[0].routes[1].index;
    actions.logoutFirebase(accountSelect.id);
    // if (
    //   (currentStep === 1 || currentStep === 2 || currentStep === 3)
    //   && (isCurrentIndex === 0)
    // ) {
    //   this.toggleConfirmSwitchAccount();
    // }
    this.toggleConfirmSwitchAccount();
    actions.selectAccount(account);
    this.setState({ expandedUser: !expandedUser });
    navigation.toggleDrawer();
    this.handleSend();
    Freshchat.resetUser();
  };

  onOkConfirmLogout = () => {
    const { actions, navigation } = this.props;
    const { expandedUser } = this.state;
    const isCurrentIndex = navigation.state.routes[0].routes[0].routes[1].index;
    this.setState({ expandedUser: !expandedUser });
    navigation.toggleDrawer();
    this.handleSend();
    this.toggleConfirmLogout();
    actions.signOut();
    actions.changeTotalUnreadNotification(0);
    Freshchat.resetUser();
  }

  toggleConfirmSwitchAccount = () => {
    this.setState({ isSwitchAccount: !this.state.isSwitchAccount });
  }

  toggleConfirmLogout = () => {
    this.setState({ isShowConfirmLogout: !this.state.isShowConfirmLogout });
  }

  render() {
    const { auth, languageCode } = this.props;
    const { isSwitchAccount, isShowConfirmLogout } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={styles.group}>
              <View style={styles.userGroup}>
                {auth.accountsRender
                  ? this.renderSectionAfterLogin()
                  : this.renderSectionBeforeLogin()}
              </View>
              {this.renderLinkSection()}
              {this.renderRouteSection()}
              {this.renderShipmentSection()}
              {this.renderInfoSection()}
            </View>
          </View>
        </ScrollView>
        <ConfirmAlert 
          showWarning={isSwitchAccount}
          titleConfirm={I18n.t('menu.warning_switch_account', {locale: languageCode})}
          onRequestClose={this.onCancelConfirmSwitchAccount}
          languageCode={languageCode}
          onConfirmOk={this.onOkConfirmSwitchAccount}
        />
        <ConfirmAlert 
          showWarning={isShowConfirmLogout}
          titleConfirm={I18n.t('menu.are_you_sure_you_want_to_logout', {locale: languageCode})}
          onRequestClose={this.onCancelConfirmLogout}
          languageCode={languageCode}
          onConfirmOk={this.onOkConfirmLogout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(88, 175, 43, 1)'
  },
  smallerSize: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  whiteText: {
    color: 'rgba(255, 255, 255, 1)'
  },
  flex: {
    flexDirection: 'row'
  },
  flexOne: {
    flex: 1
  },
  alignItemsCenter: {
    alignItems: 'center'
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
    padding: 20
  },
  mb20: {
    marginBottom: 20
  },
  mr10: {
    marginRight: 10
  },
  ml10: {
    marginLeft: 10
  },
  ml40: {
    marginLeft: 40
  },
  list: {
    backgroundColor: 'rgba(86, 86, 86, 1)'
  },
  btn: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    lineHeight: 38,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  btnLogin: {
    marginRight: 10
  },
  btnSignup: {
    marginRight: 20,
    backgroundColor: 'rgba(14, 115, 15, 1)'
  },
  btnCopy: {
    width: 77
  },
  linkGroup: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    lineHeight: 52,
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    backgroundColor: 'rgba(0, 117, 0, 1)'
  },
  linkGroupActive: {
    backgroundColor: 'rgba(255, 219, 0, 1)',
    color: 'rgba(0, 117, 0, 1)'
  },
  groupCustom: {
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 12
  },
  groupCustomBg: {
    backgroundColor: 'rgba(0, 117, 0, 1)'
  },
  lineBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(158, 158, 159, 1)'
  },
  lineTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(158, 158, 159, 1)'
  },
  userActive: {
    backgroundColor: 'rgba(68, 68, 68, 1)'
  },
  subLanguage: {
    paddingVertical: 10
  },
  formGroupButton: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    lineHeight: 60,
    textAlign: 'center',
    color: 'rgba(14, 115, 15, 1)',
    flex: 1
  },
  formGroupButtonModal: {
    borderRadius: 4,
    backgroundColor: 'rgba(14, 115, 15, 1)',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    lineHeight: 60,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    flex: 1
  }
});

const mapStateToProps = (state) => ({
  app: state.app,
  auth: state.auth,
  languageCode: state.app.languageCode,
  totalShipment: state.auth.totalShipment,
  currentStep: state.listing.currentStep,
  accountSelect: state.auth.accountSelect,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      ...appActions,
      ...listingAction,
      clearShipment: listingAction.clearShipmentData,
      changeTotalUnreadNotification: notificationActions.changeTotalUnreadNotification,
      logoutFirebase: communicationActions.logoutFirebase,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideMenu);
