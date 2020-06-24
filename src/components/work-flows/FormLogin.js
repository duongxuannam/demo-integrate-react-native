import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import { emailRex } from '../../helpers/regex';
import EyeIC from '../common/EyeIC';
import MessageError from '../common/MessageError';
import MsgErrorApi from '../common/MsgErrorApi';
import authActions from '../../store/actions/authAction';
// CSS
import styles from './style';

class FormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      formSubmit: false,
      secureTextEntry: false,
      callAPI: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { responseLogin, navigate } = this.props;
    if (responseLogin !== prevProps.responseLogin) {
      if (responseLogin && responseLogin.access_token) {
        if (responseLogin.object.sms_confirmed_at) {
          navigate('SwitchAccountStack');
        } else {
          navigate('SMSVerificationStack', {
            accountInfo: responseLogin.object,
            accessToken: responseLogin.access_token,
          });
        }
      }
    }
  }

  checkValidateEmail = (email) => {
    const { languageCode } = this.props;
    let valid = false;
    if (!email) {
      valid = false;
      return (
        <MessageError errorMsg={I18n.t('login.emailRequired', { locale: languageCode })} />
      );
    } if (!emailRex(email)) {
      valid = false;
      return (
        <MessageError errorMsg={I18n.t('login.emailInvalid', { locale: languageCode })} />
      );
    }
    valid = true;
    return valid;
  }

  handleLogin = () => {
    const { actions } = this.props;
    const { email, password } = this.state;
    this.setState({
      formSubmit: true,
      callAPI: false,
    });

    const validEmail = this.checkValidateEmail(email);
    if (validEmail === true && password) {
      actions.login(email.toLowerCase(), password);
      this.setState({
        callAPI: true
      });
    }
  }

  handleUpdateFormatEmail = () => {
    const { email } = this.state;
    if (email) this.setState({ email: email.replace(/ /g, '') });
  }

  toggleSecureTextEntry() {
    const { secureTextEntry } = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  }

  render() {
    const {
      email, password, formSubmit, secureTextEntry, callAPI,
    } = this.state;
    const { navigate, responseLogin, languageCode } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <Text style={styles.formHeader}>
            {I18n.t('login.textLogin', { locale: languageCode })}
          </Text>
          <View style={[styles.flexOne, styles.flex, styles.pr20, styles.alignItemsCenter, { justifyContent: 'flex-end' }]}>
            <Text style={[styles.defaultSize]}>
              {`${I18n.t('login.descriptionNotify', { locale: languageCode })} `}
            </Text>
            <Text style={[styles.mainColorText, styles.textRight, styles.defaultSize, styles.bold]} onPress={() => navigate('SignupStack')}>
              {I18n.t('signup.textSignUp', { locale: languageCode })}
            </Text>
          </View>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.paddingVertical30, styles.mb30, styles.formLine, { borderTopWidth: 0 }]}>
          {callAPI && responseLogin && responseLogin.error && (
            <MsgErrorApi errorMsg={responseLogin.error} />
          )}
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>
                {I18n.t('login.email', { locale: languageCode })}
              </Text>
            </View>
            {formSubmit && this.checkValidateEmail(email)}
            <View style={styles.formGroupInput}>
              <TextInput
                style={[styles.input, formSubmit && (!email || !emailRex(email)) && styles.inputError]}
                onChangeText={(email) => this.setState({ email })}
                value={email}
                onEndEditing={this.handleUpdateFormatEmail}
              />
            </View>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('login.password', { locale: languageCode })}</Text>
            </View>
            {!password && formSubmit && (
              <MessageError errorMsg={I18n.t('login.passwordRequired', { locale: languageCode })} />
            )}
            <View style={styles.formGroupInput}>
              <TextInput
                secureTextEntry={secureTextEntry}
                style={[styles.input, styles.showPasswordInput, formSubmit && !password && styles.inputError]}
                onChangeText={(password) => this.setState({ password })}
                value={password}
              />
              <TouchableOpacity onPress={() => this.toggleSecureTextEntry()} activeOpacity={0.9} style={[styles.ml5, styles.showPassword]}>
                <EyeIC width={30} height={30} show={secureTextEntry} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={[styles.flexOne, styles.flex]}>
              <Text style={[styles.smallSize, styles.grayText]}>{I18n.t('login.forgotPassword', { locale: languageCode })}</Text>
              <TouchableOpacity activeOpacity={0.9} style={styles.ml5} onPress={() => navigate('ResetPasswordStack')}>
                <Text style={[styles.mainColorText, styles.defaultSize, styles.bold]}>{I18n.t('login.reset', { locale: languageCode })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.handleLogin}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>{I18n.t('login.textLogin', { locale: languageCode })}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  responseLogin: state.auth.resLogin,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...authActions },
    dispatch,
  ),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FormLogin);
