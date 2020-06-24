import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { connect } from 'react-redux';
import { emailRex, pwdRex, validatePhoneNumberWithCountry } from '../../helpers/regex';
import EyeIC from '../common/EyeIC';
import MessageError from '../common/MessageError';
import I18n from '../../config/locales';
import BROWSER_LINK from '../../constants/browserLink';
// CSS
import styles from './style';

class FormRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      password: null,
      referralCode: null,
      formSubmit: false,
      secureTextEntry: true,
      visible: false,
      country: {
        cca2: 'VN',
        callingCode: ['84']
      }
    };
  }

  handleSignUp = () => {
    const { navigate } = this.props;
    const {
      email, firstName, lastName, phone, password, country, referralCode,
    } = this.state;
    this.setState({
      formSubmit: true
    });

    const validEmail = this.checkValidateEmail(email);
    const validPasword = this.checkValidatePassword(password);
    const validPhone = this.checkValidatePhone(phone);
    if (validEmail === true
      && validPasword === true
      && validPhone === true
      && firstName && lastName
    ) {
      const dataForm = {
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        password,
        country,
        referralCode,
        isSignUp: true
      };
      navigate('SMSVerificationStack', dataForm);
    }
  }

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
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

  checkValidatePhone = (phone) => {
    let valid = false;
    const { languageCode } = this.props;
    const { country } = this.state;
    if (!phone) {
      return (
        <MessageError errorMsg={I18n.t('signup.phoneRequired', { locale: languageCode })} />
      );
    } if (!validatePhoneNumberWithCountry(phone, country.cca2)) {
      return (
        <MessageError errorMsg={I18n.t('signup.phoneInvalid', { locale: languageCode })} />
      );
    }
    valid = true;

    return valid;
  }

  reformatPhone = (phone) => {
    const { text } = phone.nativeEvent;
    const removedText = text.replace(/\D+/g, '');
    this.setState({ phone: removedText });
  }

  checkValidatePassword = (password) => {
    const { languageCode } = this.props;
    let valid = false;
    if (!password) {
      return (
        <MessageError errorMsg={I18n.t('signup.passwordRequired', { locale: languageCode })} />
      );
    } if (!pwdRex(password)) {
      return (
        <MessageError errorMsg={I18n.t('signup.passwordInvalid', { locale: languageCode })} />
      );
    }
    valid = true;
    return valid;
  }

  handleUpdateFormatEmail = () => {
    const { email } = this.state;
    if (email) this.setState({ email: email.replace(/ /g, '') });
  }

  toggleSecureTextEntry() {
    const { secureTextEntry } = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry
    });
  }

  render() {
    const {
      firstName,
      lastName,
      phone,
      email,
      password,
      referralCode,
      country,
      visible,
      formSubmit,
      secureTextEntry,
    } = this.state;
    const { navigate, languageCode, configs } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.formHeader]}>
            {I18n.t('signup.textCreate', { locale: languageCode })}
          </Text>
          <View style={[styles.flexOne, styles.flex, styles.pr20, { justifyContent: 'flex-end', alignItems: 'center'}]}>
            <Text style={styles.defaultSize}>{I18n.t('signup.signupSecondTitleText', { locale: languageCode })}</Text>
            <Text style={[styles.mainColorText, styles.defaultSize, { fontFamily: 'Roboto-Bold' }]} onPress={() => navigate('LoginStack')}>
              {I18n.t('signup.textSignIn', { locale: languageCode })}
            </Text>
          </View>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.paddingVertical30, styles.mb30, styles.formLine, { borderTopWidth: 0 }]}>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.firstNameLabel', { locale: languageCode })}</Text>
            </View>
            {!firstName && formSubmit && (
              <MessageError errorMsg={I18n.t('signup.firstNameRequired', { locale: languageCode })} />
            )}
            <View style={styles.formGroupInput}>
              <TextInput
                style={[styles.input, !firstName && formSubmit && styles.inputError]}
                onChangeText={(firstName) => this.setState({ firstName })}
                value={firstName}
              />
            </View>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.lastNameLabel', { locale: languageCode })}</Text>
            </View>
            {!lastName && formSubmit && (
              <MessageError errorMsg={I18n.t('signup.lastNameRequired', { locale: languageCode })} />
            )}
            <View style={styles.formGroupInput}>
              <TextInput
                style={[styles.input, !lastName && formSubmit && styles.inputError]}
                onChangeText={(lastName) => this.setState({ lastName })}
                value={lastName}
              />
            </View>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.phoneLabel', { locale: languageCode })}</Text>
            </View>
            {formSubmit && this.checkValidatePhone(phone)}
            <View style={[styles.formGroupInput, styles.flex]}>
              <View style={styles.formGroupInputFormatPhone}>
                <CountryPicker
                  countryCode={country ? country.cca2 : 'ID'}
                  withCallingCode
                  withCallingCodeButton
                  withFlagButton={false}
                  withAlphaFilter
                  withFilter
                  withFlag={false}
                  withModal
                  visible={visible}
                  onSelect={(country) => {
                    this.setState({ country, visible: false });
                  }}
                  containerButtonStyle={{
                    textAlign: 'center',
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                  }}
                  onOpen={() => this.setState({ visible: true })}
                  onClose={() => this.setState({ visible: false })}
                />
              </View>
              <TextInput
                style={[styles.input, styles.noneBorderRadius, styles.flexOne, (!phone || !validatePhoneNumberWithCountry(phone, country.cca2)) && formSubmit && styles.inputError]}
                keyboardType="numeric"
                onChangeText={(phone) => this.setState({ phone })}
                value={phone}
                onEndEditing={this.reformatPhone}
              />
            </View>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.emailLabel', { locale: languageCode })}</Text>
            </View>
            {formSubmit && this.checkValidateEmail(email)}
            <View style={[styles.formGroupInput, styles.mb20]}>
              <TextInput
                style={[styles.input, formSubmit && (!email || !emailRex(email)) && styles.inputError]}
                onChangeText={(email) => this.setState({ email })}
                value={email}
                onEndEditing={this.handleUpdateFormatEmail}
              />
            </View>
            <Text style={styles.formGroupNote}>{I18n.t('signup.emailDescription', { locale: languageCode })}</Text>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.passwordLabel', { locale: languageCode })}</Text>
            </View>
            {formSubmit && this.checkValidatePassword(password)}
            <View style={[styles.formGroupInput, styles.mb20]}>
              <TextInput
                secureTextEntry={secureTextEntry}
                style={[styles.input, formSubmit && (!password || !pwdRex(password)) && styles.inputError]}
                onChangeText={(password) => this.setState({ password })}
                value={password}
              />
              <TouchableOpacity onPress={() => this.toggleSecureTextEntry()} activeOpacity={0.9} style={[styles.ml5, styles.showPassword]}>
                <EyeIC width={30} height={30} show={secureTextEntry} />
              </TouchableOpacity>
            </View>
            <Text style={styles.formGroupNote}>{I18n.t('signup.passwordDescription', { locale: languageCode })}</Text>
          </View>
          <View style={[styles.formGroup, styles.mb30]}>
            <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text style={styles.defaultSize}>{I18n.t('signup.referralCodeLabel', { locale: languageCode })}</Text>
            </View>
            <View style={styles.formGroupInput}>
              <TextInput
                style={styles.input}
                onChangeText={(referralCode) => this.setState({ referralCode })}
                value={referralCode}
              />
            </View>
          </View>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.handleSignUp}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>{I18n.t('signup.singupButton', { locale: languageCode })}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.mb30, styles.flexOne, styles.flex, styles.textCenter, styles.policy, styles.flexWrapper]}>
          <Text style={[styles.smallSize, styles.policyText]}>{I18n.t('signup.singupAgreementDescriptionTextLeft', { locale: languageCode })}</Text>
          <Text
            style={[styles.mainColorText, styles.smallSize, styles.bold]}
            onPress={() => this.openWebBrowser(configs.UserAgreementURL)}
          >
            {I18n.t('signup.userAgreementLink', { locale: languageCode })}
          </Text>
          <Text style={[styles.smallSize, styles.policyText]}>{I18n.t('signup.singupAgreementDescriptionTextAnd', { locale: languageCode })}</Text>
          <Text
            style={[styles.mainColorText, styles.smallSize, styles.bold]}
            onPress={() => this.openWebBrowser(configs.PrivatePolicyURL)}
          >
            {I18n.t('signup.privacyPolicyLink', { locale: languageCode })}
          </Text>
          <Text style={[styles.smallSize, styles.policyText]}>{I18n.t('signup.singupAgreementDescriptionTextRight', { locale: languageCode })}</Text>
        </Text>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  configs: state.app.configs,
});

export default connect(
  mapStateToProps,
  {},
)(FormRegister);
