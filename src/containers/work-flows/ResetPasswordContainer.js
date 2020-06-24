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
import I18n from '../../config/locales/index';
import IMAGE_CONSTANT from '../../constants/images';

// COMPONENTS
import FormResetPassword from '../../components/work-flows/FormResetPassword';
import FormForgotPassword from '../../components/work-flows/FormForgotPassword';
import FormResetPasswordConfirm from '../../components/work-flows/FormResetPasswordConfirm';
import FormResetPasswordConfirmOK from '../../components/work-flows/FormResetPasswordConfirmOK';
import FormResetPasswordAlert from '../../components/work-flows/FormResetPasswordAlert';
import FormResetPasswordExpiredLink from '../../components/work-flows/FormResetPasswordExpiredLink';
import IconCustomerService from '../../components/common/CustomerService';

const ENUM_STEP = {
  INPUT_EMAIL: 1,
  CONFIRM_EMAIL: 2,
  EDIT_EMAIL: 3,
  RESET_FORM: 4,
  RESET_PASSWORD_SEND_EMAIL_SUCCESS: 5,
  RESET_PASSWORD_CONFIRM_SUCCESS: 6,
  RESET_PASSWORD_CONFIRM_FAIL: 7,

};

class ResetPasswordContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: ENUM_STEP.INPUT_EMAIL,
      email: null,
      resetPwdToken: null,
      resetPwdSentAt: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation.state.params) {
      this.handleResetPasswordToken();
    }
  }

  componentDidUpdate(preProps) {
    const { navigation } = this.props;
    if (navigation !== preProps.navigation) {
      if (navigation.state.params) {
        this.handleResetPasswordToken();
      }
    }
  }

  handleResetPasswordToken = () => {
    const { navigation } = this.props;
    const resetPwdTokenFromParam = navigation.state.params.resetPwdToken;
    const resetPwdSentAtFromParam = navigation.state.params.resetPwdSentAt;
    if (resetPwdTokenFromParam && resetPwdSentAtFromParam) {
      this.setState({
        resetPwdToken: resetPwdTokenFromParam,
        resetPwdSentAt: resetPwdSentAtFromParam,
        currentStep: ENUM_STEP.RESET_FORM,
      });
    }
  }

  resetEmail = () => {
    this.setState({
      email: null,
      currentStep: ENUM_STEP.INPUT_EMAIL
    });
  }

  handleCurrentStep = (screen, data) => {
    this.setState({
      currentStep: screen
    });

    if (screen === ENUM_STEP.INPUT_EMAIL) {
      if (data) {
        this.setState({
          email: data
        });
      }
    }

    if (screen === ENUM_STEP.CONFIRM_EMAIL) {
      this.setState({
        email: data
      });
    }

    if (screen === ENUM_STEP.RESET_PASSWORD_SEND_EMAIL_SUCCESS) {
      this.setState({
        email: null
      });
    }
  }

  handleErrorResetApi = (error) => {
    // const { navigation: { navigate } } = this.props;
    switch (error.status) {
      case 400:
        this.setState({
          currentStep: ENUM_STEP.RESET_PASSWORD_CONFIRM_FAIL
        });
        break;
      case 404:
        this.setState({
          currentStep: ENUM_STEP.RESET_PASSWORD_CONFIRM_FAIL
        });
        break;
      default:
        break;
    }
  }

  renderView = () => {
    const {
      currentStep, email, resetPwdToken, resetPwdSentAt
    } = this.state;
    const { navigation } = this.props;
    if (currentStep === ENUM_STEP.INPUT_EMAIL) {
      return (
        <FormForgotPassword
          newEmail={email}
          navigation={navigation}
          currentStep={(data) => this.handleCurrentStep(ENUM_STEP.CONFIRM_EMAIL, data)}
        />
      );
    }

    if (currentStep === ENUM_STEP.CONFIRM_EMAIL) {
      return (
        <FormResetPasswordConfirm
          email={email}
          currentStep={(data) => this.handleCurrentStep(ENUM_STEP.INPUT_EMAIL, data)}
          sendEmailSuccess={
            () => this.handleCurrentStep(ENUM_STEP.RESET_PASSWORD_SEND_EMAIL_SUCCESS)
          }
        />
      );
    }

    if (currentStep === ENUM_STEP.RESET_FORM) {
      return (
        <FormResetPassword
          navigation={navigation}
          resetPwdToken={resetPwdToken}
          resetPwdSentAt={resetPwdSentAt}
          currentStep={() => this.handleCurrentStep(ENUM_STEP.RESET_PASSWORD_CONFIRM_SUCCESS)}
          errorMsg={(error) => this.handleErrorResetApi(error)}
        />
      );
    }

    if (currentStep === ENUM_STEP.RESET_PASSWORD_SEND_EMAIL_SUCCESS) {
      return (
        <FormResetPasswordAlert
          currentStep={() => this.handleCurrentStep(ENUM_STEP.INPUT_EMAIL)}
          navigation={navigation}
        />
      );
    }

    if (currentStep === ENUM_STEP.RESET_PASSWORD_CONFIRM_SUCCESS) {
      return (
        <FormResetPasswordConfirmOK
          clickButton={this.resetEmail}
          navigation={navigation}
        />
      );
    }

    if (currentStep === ENUM_STEP.RESET_PASSWORD_CONFIRM_FAIL) {
      return (
        <FormResetPasswordExpiredLink
          navigation={navigation}
          currentStep={(emailVal) => this.handleCurrentStep(ENUM_STEP.CONFIRM_EMAIL, emailVal)}
          redirectLogin={() => this.resetEmail()}
        />
      );
    }
  }

  render() {
    const { currentStep } = this.state;
    const { languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <ScrollView>
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              { currentStep === ENUM_STEP.RESET_PASSWORD_CONFIRM_SUCCESS
                ? I18n.t('resetPwdForm.formTitleSetNew', { locale: languageCode })
                : I18n.t('newPwdForm.resetPwd', { locale: languageCode })}
            </Text>
            <IconCustomerService />
          </View>
          {this.renderView()}
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
)(ResetPasswordContainer);
