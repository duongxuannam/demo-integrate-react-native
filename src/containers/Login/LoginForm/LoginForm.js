import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import authAction from '../../../store/actions/authAction';
import configAction from '../../../store/actions/configAction';

import styles from '../style';
import I18n from '../../../config/locales';
import EyeIC from '../../../components/common/EyeIC';

import FormInput from './FormInput';
import PhoneNumberInput from './PhoneNumberInput';

class FormLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true,
    };
  }

  componentDidUpdate(prevProps) {

  }

  getPhoneRef = (ref) => { this.phoneRef = ref; }

  getPasswordRef = (ref) => { this.passwordRef = ref; }

  handleLogin = () => {
    let phone = null;
    let password = null;
    if (this.phoneRef) {
      const valid = this.phoneRef.validateValue();
      if (valid) {
        phone = this.phoneRef.getValueInput();
      }
    }

    if (this.passwordRef) {
      const valid = this.passwordRef.validateValue();
      if (valid) {
        password = this.passwordRef.getValueInput();
      }
    }

    if (phone && password) {
      console.log('Phone: ', phone);
      console.log('Password: ', password);
      const { actions } = this.props;
      actions.login(phone.country.cca2, phone.phone, password);
      actions.setConfigSetting(String(phone.country.cca2).toLowerCase());
    }
  }

  toggleSecureTextEntry = () => {
    const { secureTextEntry } = this.state;
    this.setState({ secureTextEntry: !secureTextEntry });
  }

  renderSecureItem() {
    const { secureTextEntry } = this.state;
    return (
      <TouchableOpacity onPress={() => this.toggleSecureTextEntry()} activeOpacity={0.9} style={[styles.ml5, styles.showPassword]}>
        <EyeIC width={30} height={30} show={secureTextEntry} />
      </TouchableOpacity>
    );
  }

  renderErrorMessage = (message) => (
    <View style={[styles.flexRow, styles.alignItemsCenter, { marginBottom: 10 }]}>
      <Image source={require('../../../assets/images/common/error-icon.png')} style={{ width: 20, height: 20 }} />
      <Text style={[{ marginLeft: 10, fontSize: 17, color: '#f44336', fontFamily: 'Roboto-Bold', }]}>{message}</Text>
    </View>
  );

  renderResLogin = () => {
    const { resLogin } = this.props;
    if (resLogin.access_token || Object.keys(resLogin).length <= 0) {
      return null;
    }

    return (
      <View style={[styles.whiteBg]}>
        <View style={{
          borderWidth: 1,
          borderRadius: 4,
          borderColor: 'rgb(255, 205, 0)',
          backgroundColor: 'rgba(253, 236, 234, 0.8)',
          marginBottom: 30,
        }}
        >
          <Text style={{
            color: 'rgba(68,68,68,1)',
            fontSize: 17,
            fontFamily: 'Roboto-Regular',
            textAlign: 'center',
            padding: 20
          }}
          >
            {resLogin.data && resLogin.data.error}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    const { secureTextEntry } = this.state;
    return (
      <View>
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <Text style={styles.formHeader}>
            {I18n.t('login')}
          </Text>
          <View style={[{ flex: 1 }]} />
        </View>
        <View style={[styles.whiteBg, styles.padHorizontal20, styles.padVertical30, { borderTopWidth: 0, marginBottom: 30 }]}>
          {this.renderResLogin()}
          <PhoneNumberInput
            ref={this.getPhoneRef}
            viewLabelStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            viewStyle={{ marginBottom: 30 }}
            labelStyle={{ fontSize: 17, fontFamily: 'Roboto-Regular', }}
            label={I18n.t('loginForm.phoneForm')}
            viewInputStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              borderWidth: 1,
              borderColor: 'rgba(219, 219, 219, 1)',
              borderRadius: 4,
            }}
            inputStyle={{
              flex: 1,
              fontSize: 17,
              fontFamily: 'Roboto-Regular',
              paddingLeft: 5,
              height: 60,
            }}
            errorPos="MIDDLE"
            customErrorView={this.renderErrorMessage}
            onEndEditing={this.endEditPhone}
          />

          <FormInput
            ref={this.getPasswordRef}
            label={I18n.t('loginForm.passwordForm')}
            type="PASSWORD"
            viewLabelStyle={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            labelStyle={{ fontSize: 17, fontFamily: 'Roboto-Regular', }}
            isSecure={secureTextEntry}
            viewInputStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 60,
              borderWidth: 1,
              borderColor: 'rgba(219, 219, 219, 1)',
              borderRadius: 4,
              paddingHorizontal: 15,
            }}
            inputStyle={{
              flex: 1,
              fontSize: 17,
              fontFamily: 'Roboto-Regular',
              height: 60,
            }}
            customSecureIcon={this.renderSecureItem()}
            errorPos="MIDDLE"
            customErrorView={this.renderErrorMessage}
          />

        </View>

        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flexRow, styles.alignItemsCenter, {
              borderRadius: 4,
              backgroundColor: 'rgba(14, 115, 15, 1)',
              marginHorizontal: 20,
            }]}
            activeOpacity={0.9}
            onPress={this.handleLogin}
          >
            <Text style={{
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              lineHeight: 60,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 1)',
              flex: 1,
            }}
            >
              {I18n.t('login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  resLogin: state.auth.resLogin
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      login: authAction.login,
      setConfigSetting: configAction.setConfigSetting,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormLogin);
