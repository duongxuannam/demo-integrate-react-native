import React from 'react'
import {
  TextInput,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal';
import { connect } from 'react-redux';
import MessageError from '../common/MessageError';
import I18n from '../../config/locales/';
import { validatePhoneNumberWithCountry } from '../../helpers/regex';
// CSS
import styles from './style'

class EditPhoneNumber extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      save: false,
      country: {},
      phone: null
    }
  }

  componentDidMount() {
    const { countryCode, phoneAccount } = this.props;
    if (countryCode) {
      countryCode.cca2 = countryCode.cca2.toUpperCase();
    }
    const newPhone = this.formatPhone(countryCode.callingCode[0], phoneAccount);
    this.setState((prevState) => ({
      phone: newPhone,
      country: {
        ...prevState.country,
        ...countryCode
      }
    }));
  }

  componentDidUpdate(prevProps) {
    const { countryCode, phoneAccount } = this.props;
    const newPhone = this.formatPhone(countryCode.callingCode[0], phoneAccount);
    if (countryCode) {
      countryCode.cca2 = countryCode.cca2.toUpperCase();
    }
    if (countryCode !== prevProps.countryCode || phoneAccount !== prevProps.phoneAccount) {
      this.setState({
        country: newPhone,
        phone: phoneAccount
      });
    }
  }

  handleChangePhone = () => {
    const { country, phone } = this.state;
    this.setState({
      save: true
    });

    const validPhone = this.checkValidatePhone(phone);
    if (validPhone === true) {
      this.props.currentStep({ country, phone});
    }
  }

  checkValidatePhone = (phone) => {
    const { languageCode } = this.props;
    let valid = false;
    const { country } = this.state;
    if (!phone) {
      return (
        <MessageError errorMsg={I18n.t('signup.phoneRequired', { locale: languageCode })} />
      );
    }

    if (!validatePhoneNumberWithCountry(phone, country.cca2)) {
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

  formatPhone = (countryCodeNumber, phone) => {
    return phone && phone.replace(`+${countryCodeNumber}`, 0);
  }

  render() {
    const { visible, country, phone, save } = this.state;
    const { languageCode } = this.props;
    return (
      <View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.paddingVertical30, styles.mb30]}>
          <View style={styles.mb20}>
            <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
              {I18n.t('viewPhoneNumber.viewPhoneNumberDescriptionMessage', { locale: languageCode })}
            </Text>
          </View>
            {save && this.checkValidatePhone(phone)}
          <View style={[styles.formGroupInput, styles.flex]}>
              <View style={styles.formGroupInputFormatPhone}>
                <CountryPicker
                  countryCode={country && country.cca2 && country.cca2.toUpperCase()}
                  withCallingCode
                  withCallingCodeButton
                  withFlagButton={false}
                  withAlphaFilter
                  withFilter
                  withFlag={false}
                  withModal
                  visible={visible}
                  onSelect={(country) => {
                    this.setState({ country, visible: false })
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
              style={[styles.input, styles.noneBorderRadius, styles.flexOne, (save && (!phone || !validatePhoneNumberWithCountry(phone, country.cca2))) && styles.inputError]}
              keyboardType='numeric'
              onChangeText={(phone) => this.setState({ phone })}
              value={phone}
              onEndEditing={this.reformatPhone}
            />
          </View>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => this.handleChangePhone()}
          >
            <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.ml20, styles.mr20]}>
              {I18n.t('viewPhoneNumber.save', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(EditPhoneNumber);
