import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import authActions from '../../store/actions/authAction';
import I18n from '../../config/locales';
import MsgErrorApi from '../common/MsgErrorApi';
// CSS
import styles from './style';

const ENUM_SCREEN = {
  EDIT_PHONE_NUMBER: 2,
  VERIFY_CODE: 3
};

class SendVerifyCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      disabled: false,
    };
  }

  componentDidUpdate(preState) {
    const { registerFormData } = this.props;
    if (registerFormData !== preState.registerFormData) {
      this.setState({
        error: null,
      });
    }
  }

  handleEditPhoneNumber = () => {
    const { currentStep } = this.props;
    currentStep(ENUM_SCREEN.EDIT_PHONE_NUMBER);
  }

  handleSendCode = () => {
    const {
      actions, registerFormData, updatePhoneSuccess, isVerifyCode, isSignUp, registerSuccess,
    } = this.props;
    this.setState({
      disabled: true,
    });
    if (!isVerifyCode && !isSignUp) {
      // Out Verify Code -> Update phone
      actions.updatePhone({
        token: registerFormData.accessToken,
        phone: registerFormData.phone,
        countryCode: registerFormData.country.cca2,
      }, (response, error) => {
        if (response) {
          updatePhoneSuccess(ENUM_SCREEN.VERIFY_CODE, response);
        } else {
          this.setState({
            error: error.error,
            disabled: false
          });
        }
      });
    } else {
    // Sign up
      actions.register(registerFormData, (response) => {
        if (response && response.access_token) {
          this.setState({
            disabled: false,
          });
          registerSuccess(ENUM_SCREEN.VERIFY_CODE, response);
        } else {
          this.setState({
            error: response.error,
            disabled: false
          });
        }
      });
    }
  }

  phoneFormat = (callingCode, phone) => {
    return phone && phone.replace(`+${callingCode}`, '');
  };

  render() {
    const { registerFormData, languageCode } = this.props;
    const { error, disabled } = this.state;
    return (
      <View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          {error && (
            <MsgErrorApi errorMsg={error} />
          )}
          <View style={styles.mb20}>
            <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
              {I18n.t('viewPhoneNumber.viewPhoneNumberDescriptionMessage', { locale: languageCode })}
            </Text>
          </View>
          <Text style={[styles.verifyNumber, styles.textCenter, styles.titleSize, styles.bold]}>
            +
            {registerFormData.country.callingCode
              && registerFormData.country.callingCode[0]}
            {this.phoneFormat(registerFormData.country.callingCode[0], registerFormData.phone)}
          </Text>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
          >
            <Text
              style={[styles.formGroupButton, styles.buttonGreenBorder,
                styles.flexOne, styles.ml20, styles.mr10]}
              onPress={() => this.handleEditPhoneNumber()}
            >
              {I18n.t('viewPhoneNumber.editPhoneNumberButton', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            disabled={disabled}
            onPress={this.handleSendCode}
          >
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr20, styles.ml10]}>
              {I18n.t('viewPhoneNumber.sendCodeButton', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  responseRegister: state.auth.responseRegister,
  isVerifyCode: state.auth.isVerifyCode,
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
)(SendVerifyCode);
