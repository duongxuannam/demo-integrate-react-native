import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

// REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavigationService from '../helpers/NavigationService';
import ConfirmAlert from '../components/common/ConfirmAlert';
import IMAGE_CONSTANT from '../constants/images';
import configActions from '../store/actions/configAction';
import notificationActions from '../store/actions/notificationAction';
import I18n from '../config/locales';
import authAction from '../store/actions/authAction';
import {LANGUAGES} from '../constants/hardData';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionLanguage: false,
      isShowConfirmLogout: false,
    };
  }

  closeDrawer = () => {
    const {navigation} = this.props;
    navigation.closeDrawer();
    this.setState({optionLanguage: false});
  };

  toggleOptionLanguage = () => {
    const {optionLanguage} = this.state;
    this.setState({optionLanguage: !optionLanguage});
  };

  drawerItem = () => {
    const {optionLanguage} = this.state;
    const {languageCode, countryCode} = this.props;
    let languageLocalByCountry = {};
    languageLocalByCountry = LANGUAGES.find(
      item => item.countryCode === countryCode,
    );
    if (languageLocalByCountry === undefined) {
      // eslint-disable-next-line prefer-destructuring
      languageLocalByCountry = LANGUAGES[3]; // vietnam
    }
    const languageLocal = languageLocalByCountry.language.find(
      item => item.lang === languageCode,
    );
    return (
      <TouchableOpacity onPress={this.toggleOptionLanguage} activeOpacity={0.9}>
        <View>
          <View
            style={[
              styles.height60,
              styles.bgItem,
              styles.flexOne,
              styles.flex,
              styles.alignItemsCenter,
            ]}>
            <View
              style={[
                styles.width75Percent,
                styles.justifyContentStart,
                styles.flex,
              ]}>
              <Image
                source={languageLocal.icon}
                style={[{width: 26, height: 26}, styles.ml20, styles.mr10]}
              />
              <Text style={styles.titleDrawerItem}>
                {I18n.t('languages', {locale: languageCode})}
              </Text>
            </View>
            <Image
              source={
                optionLanguage
                  ? IMAGE_CONSTANT.arrowUpWhite
                  : IMAGE_CONSTANT.arrowDownGreen
              }
              style={styles.ml30}
            />
          </View>
          {optionLanguage && this.listLanguages()}
        </View>
      </TouchableOpacity>
    );
  };

  changeLanguage = item => {
    const {actions, languageCode} = this.props;
    if (languageCode !== item.lang) {
      actions.updateLanguage(item.lang);
      I18n.switchLanguage(item.lang);
    }
  };

  listLanguages = () => {
    const {languageCode, countryCode} = this.props;
    const languageLocalByCountry = LANGUAGES.find(
      item => item.countryCode === countryCode,
    );
    console.log('languageLocalByCountry: ', languageLocalByCountry);
    return languageLocalByCountry.language.map(item => (
      <TouchableOpacity
        key={item.text}
        onPress={() => this.changeLanguage(item)}
        activeOpacity={0.9}>
        <View
          style={[
            styles.height60,
            styles.list,
            styles.flexOne,
            styles.flex,
            styles.alignItemsCenter,
            {
              borderTopColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1,
              borderColor: 'rgba(86, 86, 86, 1)',
            },
          ]}>
          <View
            style={[
              styles.width75Percent,
              styles.justifyContentStart,
              styles.flex,
            ]}>
            <Image
              source={item.icon}
              style={[{width: 26, height: 26}, styles.ml20, styles.mr10]}
            />
            <Text style={styles.titleDrawerItem}>{item.label}</Text>
          </View>
          <Image
            source={
              languageCode === item.lang ? IMAGE_CONSTANT.checkMarkGreen : null
            }
            style={styles.ml30}
          />
        </View>
      </TouchableOpacity>
    ));
  };

  logoutAction = () => {
    const {navigation, actions} = this.props;
    actions.callLogout();
    actions.changeTotalUnreadNotification(0);
    navigation.closeDrawer();
    this.setState({optionLanguage: false});
  };

  showLogout = () => {
    const {languageCode, token} = this.props;
    if (!token) {
      return;
    }
    return (
      <TouchableOpacity
        // onPress={this.logoutAction}
        onPress={this.toggleConfirmLogout}
        activeOpacity={0.9}>
        <View
          style={[
            styles.bgItem,
            styles.bdr5,
            styles.height50,
            styles.width50Percent,
            styles.justifyContentCenter,
            styles.alignItemsCenter,
            styles.mt20,
            styles.alignSelfCenter,
          ]}>
          <Text style={styles.titleDrawerItem}>
            {I18n.t('logout', {locale: languageCode})}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  creditDriver = () => {
    const {token} = this.props;
    if (!token) {
      return;
    }

    return (
      <View
        style={[
          styles.height60,
          styles.mb20,
          styles.justifyContentCenter,
          styles.alignItemsCenter,
          styles.mt20,
        ]}>
        <View
          style={[
            {
              borderColor: 'rgba(0, 117, 0, 1)',
              borderWidth: 2,
              backgroundColor: 'rgba(14, 115, 15, 0.4)',
            },
            styles.alignItemsCenter,
            styles.flex,
            styles.justifyContentCenter,
            styles.bdr5,
            styles.height50,
            styles.width50Percent,
          ]}>
          <Image source={IMAGE_CONSTANT.boxActive} style={styles.mr5} />
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              textAlign: 'center',
              color: '#F4BC65',
            }}>
            {1995}
          </Text>
        </View>
      </View>
    );
  };

  showInfoDriver = () => {
    const {token, account} = this.props;
    if (!token) {
      return;
    }
    return (
      <View style={[styles.width75Percent, styles.flexOne]}>
        <View style={[styles.alignItemsCenter, styles.flex, {margin: 10}]}>
          <Image
            source={{uri: account.avatar}}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
            }}
          />
          <View style={styles.ml10}>
            <Text style={styles.titleDrawerItem}>{account.name}</Text>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 1)',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
              }}>
              ID:
              {account.id}
            </Text>
          </View>
        </View>
        <View style={styles.ml10}>
          <Text style={styles.titleDrawerItem}>{account.phone}</Text>
          <Text
            style={[styles.titleDrawerItem, {fontFamily: 'Roboto-Regular'}]}>
            {account.email}
          </Text>
        </View>
      </View>
    );
  };

  toggleConfirmLogout = () => {
    this.setState({isShowConfirmLogout: !this.state.isShowConfirmLogout});
  };

  onOkConfirmLogout = () => {
    const {actions, navigation} = this.props;
    this.toggleConfirmLogout();
    navigation.closeDrawer();
    NavigationService.navigate('ShipmentStack');
    actions.changeTotalUnreadNotification(0);
    this.setState({optionLanguage: false});
    actions.callLogout();
  };

  onCancelConfirmLogout = () => {
    const {navigation} = this.props;
    this.toggleConfirmLogout();
    // this.setState({expandedUser: !this.state.expandedUser});
    navigation.toggleDrawer();
  };

  render() {
    const {languageCode} = this.props;
    const {isShowConfirmLogout} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View forceInset={{top: 'always', horizontal: 'never'}}>
            <View
              style={[styles.flex, {height: 140, justifyContent: 'flex-end'}]}>
              {this.showInfoDriver()}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  {
                    width: 25,
                    height: 25,
                    marginTop: 20,
                    marginRight: 18,
                  },
                  styles.flex,
                  styles.alignItemsCenter,
                  styles.justifyContentCenter,
                ]}
                onPress={this.closeDrawer}>
                <Image
                  source={IMAGE_CONSTANT.closeWhite}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity>
            </View>
            {this.creditDriver()}
            {this.drawerItem()}
            {this.showLogout()}
          </View>
        </ScrollView>
        <ConfirmAlert
          showWarning={isShowConfirmLogout}
          titleConfirm={I18n.t('are_you_sure_you_want_to_logout', {
            locale: languageCode,
          })}
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
    backgroundColor: 'rgba(88, 175, 43, 1)',
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
  alignSelfCenter: {
    alignSelf: 'center',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  pad20: {
    padding: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  mr5: {
    marginRight: 5,
  },
  mr10: {
    marginRight: 10,
  },
  mt20: {
    marginTop: 20,
  },
  ml10: {
    marginLeft: 10,
  },
  ml20: {
    marginLeft: 20,
  },
  ml40: {
    marginLeft: 40,
  },
  ml30: {
    marginLeft: 30,
  },
  list: {
    backgroundColor: 'rgba(86, 86, 86, 1)',
  },
  height50: {
    height: 50,
  },
  height60: {
    height: 60,
  },
  bgItem: {
    backgroundColor: 'rgba(14, 115, 15, 1)',
  },
  bdr5: {
    borderRadius: 5,
  },
  userActive: {
    backgroundColor: 'rgba(68, 68, 68, 1)',
  },
  width50Percent: {
    width: '50%',
  },
  width75Percent: {
    width: '75%',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  titleDrawerItem: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'rgba(255, 255, 255, 1)',
  },
});

const mapStateToProps = state => ({
  // app: state.app,
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  token: state.auth.token,
  account: state.auth.account,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...configActions,
      callLogout: authAction.signOut,
      changeTotalUnreadNotification:
        notificationActions.changeTotalUnreadNotification,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideMenu);
