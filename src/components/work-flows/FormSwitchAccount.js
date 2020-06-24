import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import authActions from '../../store/actions/authAction';

// COMPONENTS
import UrlImage from '../common/Image';

// CSS
import styles from './style';

import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import appActions from '../../store/actions/appAction';

class FormSwitchAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { auth } = this.props;
    const { accounts } = auth;
    if (!accounts || !accounts.accounts) {
      this.navigateToScreen('LoginStack');
      return;
    }
    if (accounts && accounts.accounts.length === 0) {
      this.changeAccount(accounts);
    }
  }

  componentDidUpdate(prevProps) {
    const { app, auth, actions } = this.props;
    if (prevProps.auth.token !== auth.token) {
      if (app.pageRequired === 'BookingStack') {
        this.navigateToScreen('BookingStack');
        actions.clearPageRequire();
        return;
      }
      this.navigateToScreen('BookingStack');
    }
  }

  changeAccount = (account) => {
    const { actions } = this.props;
    actions.selectAccount(account);
  }

  navigateToScreen(routeName) {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName
    });
    navigation.dispatch(navigateAction);
  }

  render() {
    const { auth, languageCode } = this.props;
    const { accounts } = auth;
    const arrayAcc = accounts.accounts;
    return (
      <View>
        <View style={[styles.switchAccount, styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.flexOne, styles.smallSize, styles.whiteText, styles.switchAccountTitle]}>
            {I18n.t('selectAccount.personal', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.listUsers}>
          <View style={[styles.user, styles.lineBorder, styles.lineBorderLast]}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.changeAccount(accounts)}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <UrlImage
                  sizeWidth={24}
                  sizeHeight={24}
                  sizeBorderRadius={0}
                  source={accounts.avatar_square}
                />
                <View style={[styles.ml10, styles.flexOne]}>
                  <Text style={[styles.smallSize, styles.whiteText]}>
                    {accounts.name}
                  </Text>
                  <Text style={[styles.smallerSize, styles.whiteText]}>
                    {accounts.email}
                  </Text>
                </View>
                <Image source={IMAGE_CONSTANT.arrowRight} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.switchAccount, styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.flexOne, styles.smallSize, styles.whiteText, styles.switchAccountTitle]}>
            {I18n.t('selectAccount.business', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.listUsers}>
          {arrayAcc.map((item) => (
            <View style={[styles.user, styles.lineBorder]} key={`${item.company_id}`}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => this.changeAccount(item)}>
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <UrlImage
                    sizeWidth={24}
                    sizeHeight={24}
                    sizeBorderRadius={0}
                    source={item.logo_url || 'https://deliveree-img-stg.s3.amazonaws.com/customers/avatars/000/002/231/square/209-200x300.jpg?1576550304'}
                  />
                  <View style={[styles.ml10, styles.flexOne]}>
                    <Text style={[styles.smallSize, styles.whiteText]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.smallerSize, styles.whiteText]}>
                      {item.email}
                    </Text>
                  </View>
                  <Image source={IMAGE_CONSTANT.arrowRightGreen} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  app: state.app,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      selectAccount: authActions.selectAccount,
      clearPageRequire: appActions.clearPageRequire,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormSwitchAccount);
