import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Freshchat } from 'react-native-freshchat-sdk';
import I18n from '../../config/locales';
import { getDialCodeWithCountryCode } from '../../helpers/countries.helper';
// COMPONENTS
import VerifyCode from '../../components/work-flows/VerifyCode';
import SendVerifyCode from '../../components/work-flows/SendVerifyCode';
import EditPhoneNumber from '../../components/work-flows/EditPhoneNumber';
import IconCustomerService from '../../components/common/CustomerService';

const ENUM_SCREEN = {
  CONFIRM_PHONE_NUMBER: 1,
  EDIT_PHONE_NUMBER: 2,
  VERIFY_CODE: 3
};

class SMSVerificationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreen: ENUM_SCREEN.CONFIRM_PHONE_NUMBER,
      registerFormData: {
        firstName: null,
        lastName: null,
        email: null,
        country: {
          cca2: '',
          callingCode: []
        },
        phone: null,
        password: null,
        referralCode: null,
        accessToken: null,
        smsConfirmedAt: null,
      },
      infoAccount: {
        access_token: null,
        object: {},
        token_type: null,
        sms_code_period: null,
      },
      isSignUp: false,
    };
  }

  componentDidMount() {
    this.getDataFromParams();
  }

  componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    if (navigation !== prevProps.navigation) {
      this.getDataFromParams();
    }
  }

  handleCurrentStep = (screen, data) => {
    this.setState({
      currentScreen: screen
    });
    switch (screen) {
      case ENUM_SCREEN.CONFIRM_PHONE_NUMBER:
        if (data) {
          this.setState((prevState) => ({
            registerFormData: {
              ...prevState.registerFormData,
              country: data.country,
              phone: data.phone
            }
          }));
        }
        break;
      case ENUM_SCREEN.VERIFY_CODE:
        if (data) {
          this.setState((prevState) => ({
            infoAccount: {
              ...prevState.infoAccount,
              access_token: data.access_token,
              object: data.object,
              token_type: data.token_type,
            }
          }));
        }
        break;
      default:
        break;
    }
  }

  exitFromVetifyCodeScreen = (data) => {
    this.setState((prevState) => ({
      currentScreen: ENUM_SCREEN.CONFIRM_PHONE_NUMBER,
      registerFormData: {
        ...prevState.registerFormData,
        accessToken: data.accessToken
      },
      isSignUp: false
    }));
  }

  exitFromVetifyCodeScreenBySignUp = (data) => {
    this.setState((prevState) => ({
      currentScreen: ENUM_SCREEN.CONFIRM_PHONE_NUMBER,
      registerFormData: {
        ...prevState.registerFormData,
        accessToken: data.accessToken
      },
      isSignUp: false
    }));
  }

  handleRegisterSuccess = (screen, data) => {
    this.setState((prevState) => ({
      currentScreen: screen,
      registerFormData: {
        ...prevState.registerFormData,
        firstName: data.object.first_name,
        lastName: data.object.last_name,
        email: data.object.email,
        country: {
          ...prevState.registerFormData.country,
          cca2: data.object.country_code,
        },
        phone: data.object.phone,
        referralCode: data.object.referralCode,
        accessToken: data.access_token,
        smsConfirmedAt: data.sms_code_period,
      }
    }));
  }

  handleUpdatePhoneSuccess = (screen, data) => {
    const { navigation } = this.props;
    if (navigation.state.params.accessToken) {
      this.setState((prevState) => ({
        registerFormData: {
          ...prevState.registerFormData,
          accessToken: navigation.state.params.accessToken
        }
      }));
    }
    this.setState((prevState) => ({
      currentScreen: screen,
      registerFormData: {
        ...prevState.registerFormData,
        firstName: data.object.first_name,
        lastName: data.object.last_name,
        email: data.object.email,
        country: {
          ...prevState.registerFormData.country,
          cca2: data.object.country_code,
        },
        phone: data.object.phone,
        referralCode: data.object.referralCode,
        smsConfirmedAt: data.sms_code_period,
      }
    }));
  }

  renderScreen = () => {
    const { currentScreen, registerFormData, isSignUp } = this.state;
    const { navigation } = this.props;
    if (currentScreen === ENUM_SCREEN.CONFIRM_PHONE_NUMBER) {
      return (
        <SendVerifyCode
          navigation={navigation}
          registerFormData={registerFormData}
          isSignUp={isSignUp}
          currentStep={(screen, data) => this.handleCurrentStep(screen, data)}
          registerSuccess={(screen, data) => this.handleRegisterSuccess(screen, data)}
          updatePhoneSuccess={(screen, data) => this.handleUpdatePhoneSuccess(screen, data)}
        />
      );
    }

    if (currentScreen === ENUM_SCREEN.EDIT_PHONE_NUMBER) {
      return (
        <EditPhoneNumber
          countryCode={registerFormData.country}
          phoneAccount={registerFormData.phone}
          currentStep={(data) => this.handleCurrentStep(ENUM_SCREEN.CONFIRM_PHONE_NUMBER, data)}
        />
      );
    }

    if (currentScreen === ENUM_SCREEN.VERIFY_CODE) {
      const { infoAccount } = this.state;
      return (
        <VerifyCode
          infoAccount={infoAccount}
          navigation={navigation}
          registerFormData={registerFormData}
          isVerifyCode={(data) => this.exitFromVetifyCodeScreen(data)}
          isVerifyCodeSignUp={(data) => this.exitFromVetifyCodeScreenBySignUp(data)}
        />
      );
    }
  }

  getDataFromParams = () => {
    const { navigation } = this.props;
    this.setState((prevState) => ({
      registerFormData: {
        ...prevState.registerFormData,
        ...navigation.state.params,
      },
      isSignUp: navigation.state.params.isSignUp,
    }));

    if (navigation.state.params.accountInfo) {
      const res = getDialCodeWithCountryCode(navigation.state.params.accountInfo.country_code);
      this.setState((prevState) => ({
        registerFormData: {
          ...prevState.registerFormData,
          ...navigation.state.params.accountInfo,
          country: {
            cca2: navigation.state.params.accountInfo.country_code,
            callingCode: [res[0].dialCode]
          },
          accessToken: navigation.state.params.accessToken,
        },
        infoAccount: {
          ...prevState.infoAccount,
          ...navigation.state.params.accountInfo,
          accessToken: navigation.state.params.accessToken
        }
      }));
    }
  }

  render() {
    const { languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <ScrollView>
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              {I18n.t('viewPhoneNumber.viewPhoneNumberTitle', { locale: languageCode })}
            </Text>
            <IconCustomerService />
          </View>
          {this.renderScreen()}
        </ScrollView>
      </View>
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
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  pad20: {
    padding: 20,
  },
  mr20: {
    marginRight: 20,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
});

const mapStateToProps = (state) => ({
  transportTypes: state.listing.transportTypes,
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(SMSVerificationContainer);
