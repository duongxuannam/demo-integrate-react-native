import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../../config/locales';
import { emailRex } from '../../helpers/regex';
import MessageError from '../common/MessageError';
// CSS
import styles from './style';

class FormResetPasswordExpiredLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      formSubmit: false
    };
  }

  checkValidateEmail = (email) => {
    const { languageCode } = this.props;
    let valid = false;
    if (!email) {
      return (
        <MessageError errorMsg={I18n.t('signup.emailRequired', { locale: languageCode })} />
      );
    } if (!emailRex(email)) {
      return (
        <MessageError errorMsg={I18n.t('signup.emailInvalid', { locale: languageCode })} />
      );
    }
    valid = true;

    return valid;
  }

  handleReset = () => {
    const { email } = this.state;
    const { currentStep } = this.props;
    this.setState({
      formSubmit: true
    });
    const validEmail = this.checkValidateEmail(email);
    if (validEmail === true) {
      currentStep(email);
    }
  }

  handleRedirectLogin = () => {
    const { navigation: { navigate }, redirectLogin } = this.props;
    redirectLogin();
    navigate('LoginStack');
  }

  handleUpdateFormatEmail = () => {
    const { email } = this.state;
    if (email) this.setState({ email: email.replace(/ /g, '') });
  }

  render() {
    const { email, formSubmit } = this.state;
    const { languageCode } = this.props;
    return (
      <View>
        <View style={styles.flex}>
          <Text style={styles.formHeader}>
            {I18n.t('resetExpireForm.reset', { locale: languageCode })}
          </Text>
          <Text style={[styles.flexOne, styles.flex, styles.pr20, styles.textRight, styles.mb5]}>
            <Text style={styles.defaultSize}>{I18n.t('resetExpireForm.haveAccount', { locale: languageCode })}</Text>
            <Text
              style={[styles.mainColorText, styles.defaultSize]}
              onPress={this.handleRedirectLogin}
            >
              {I18n.t('resetExpireForm.login', { locale: languageCode })}
            </Text>
          </Text>
        </View>

        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          <View style={[styles.resetPasswordAlert, styles.resetPasswordExpired, styles.mb30]}>
            <Text style={[styles.resetPasswordAlertTop, styles.resetPasswordExpiredTop,
              styles.defaultSize, styles.textCenter, styles.pad20]}
            >
              {I18n.t('resetExpireForm.msgExpireEmail', { locale: languageCode })}
            </Text>
            <Text style={[styles.resetPasswordAlertBottom, styles.resetPasswordExpiredBottom,
              styles.defaultSize, styles.textCenter, styles.paddingHorizontal20]}
            >
              {I18n.t('resetExpireForm.msgTimeExpire', { locale: languageCode })}
            </Text>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex,
              styles.alignItemsCenter, styles.mb10]}
            >
              <Text style={styles.defaultSize}>{I18n.t('resetExpireForm.labelEmail', { locale: languageCode })}</Text>
            </View>
            {formSubmit && this.checkValidateEmail(email)}
            <View style={styles.formGroupInput}>
              <TextInput
                style={[styles.input,
                  formSubmit && (!email || !emailRex(email)) && styles.inputError]}
                onChangeText={(emailVal) => this.setState({ email: emailVal })}
                value={email}
                onEndEditing={this.handleUpdateFormatEmail}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.smallSize, styles.grayText]}>{I18n.t('resetExpireForm.forgotEmail', { locale: languageCode })}</Text>
              <TouchableOpacity activeOpacity={0.9} style={styles.ml5}>
                <Text style={[styles.mainColorText, styles.defaultSize, styles.bold]}>
                  {I18n.t('resetExpireForm.talkToCustomer', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.handleReset}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>
              {I18n.t('resetExpireForm.resetPassword', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(FormResetPasswordExpiredLink);
