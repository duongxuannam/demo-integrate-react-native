import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MsgErrorApi from '../common/MsgErrorApi';
// ACTION
import authActions from '../../store/actions/authAction';

import I18n from '../../config/locales';
import MessageError from '../common/MessageError';
import EyeIC from '../common/EyeIC';
// CSS
import styles from './style';

class FormResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      rePassword: '',
      errPassword: '',
      errRePassword: '',
      hidePassword: true,
      hideRePassword: true,
      resetPasswordToken: '',
      error: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (navigation) {
      this.setState({
        resetPasswordToken: navigation.state.params.resetPwdToken,
      });
    }
  }

  componentDidUpdate(preProps) {
    const { navigation } = this.props;
    if (navigation !== preProps.navigation) {
      this.setState({
        resetPasswordToken: navigation.state.params.resetPwdToken,
        // error: null,
        password: '',
        rePassword: ''
      });
    }
  }

  changePassword = (data) => {
    this.setState({ password: data });
  }

  changeRePassword = (data) => {
    this.setState({ rePassword: data });
  }

  changeHidePass = () => {
    const { hidePassword } = this.state;
    this.setState({ hidePassword: !hidePassword });
  }

  changeHideRePass = () => {
    const { hideRePassword } = this.state;
    this.setState({ hideRePassword: !hideRePassword });
  }

  submitForm = () => {
    const {
      password,
      rePassword,
      resetPasswordToken,
    } = this.state;
    const {
      actions, navigation, errorMsg, currentStep
    } = this.props;
    let errPassword = '';
    let errRePassword = '';
    if (password.length < 6) { errPassword = 'newPwdForm.newPwdMinLen6'; }
    if (rePassword.length < 6) { errRePassword = 'newPwdForm.newPwdMinLen6'; }
    if (!password) { errPassword = 'newPwdForm.newPwdReq'; }
    if (!rePassword) { errRePassword = 'newPwdForm.rePwdReq'; }
    if (password !== rePassword) { errRePassword = 'newPwdForm.rePwdNotMatch'; }
    if (!errPassword && !errRePassword) {
      actions.resetPassword({ resetPasswordToken, password, rePassword }, (data, error) => {
        if (data) {
          currentStep();
        }

        if (error) {
          this.setState({
            error: true,
          });
          if (error.status !== 500) {
            errorMsg(error);
          }
        }

        navigation.setParams({
          resetPwdToken: null,
          resetPwdSentAt: null,
        });
      });
    }

    this.setState({
      errPassword,
      errRePassword,
    });
  }

  render() {
    const {
      password,
      rePassword,
      errPassword,
      errRePassword,
      hidePassword,
      hideRePassword,
      error,
    } = this.state;
    const { languageCode } = this.props;
    return (
      <View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          {error && (
            <MsgErrorApi errorMsg={I18n.t('newPwdForm.resetPwdFail', { locale: languageCode })} />
          )}

          {!error && (
            <View>
              <View style={[styles.formGroup, styles.mb30]}>
                <View style={[styles.formGroupLabel, styles.flex,
                  styles.alignItemsCenter, styles.mb10]}
                >
                  <Text style={styles.defaultSize}>{I18n.t('newPwdForm.labelNewPwd', { locale: languageCode })}</Text>
                </View>

                {errPassword.length > 0 && (
                  <MessageError errorMsg={I18n.t(errPassword, { locale: languageCode })} />
                )}
                <View style={styles.formGroupInput}>
                  <TextInput
                    style={[styles.input, styles.showPasswordInput,
                      errPassword.length > 0 && styles.inputError]}
                    onChangeText={this.changePassword}
                    value={password}
                    secureTextEntry={hidePassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.ml5, styles.showPassword]}
                    onPress={this.changeHidePass}
                  >
                    <EyeIC width={30} height={30} show={hidePassword} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.formGroup, styles.mb30]}>
                <View style={[styles.formGroupLabel, styles.flex,
                  styles.alignItemsCenter, styles.mb10]}
                >
                  <Text style={styles.defaultSize}>
                    {I18n.t('newPwdForm.labelRePwd', { locale: languageCode })}
                  </Text>
                </View>
                {errRePassword.length > 0 && (
                <MessageError errorMsg={I18n.t(errRePassword, { locale: languageCode })} />
                )}
                <View style={styles.formGroupInput}>
                  <TextInput
                    style={[styles.input, styles.showPasswordInput,
                      errRePassword.length > 0 && styles.inputError]}
                    onChangeText={this.changeRePassword}
                    value={rePassword}
                    secureTextEntry={hideRePassword}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.ml5, styles.showPassword]}
                    onPress={this.changeHideRePass}
                  >
                    <EyeIC width={30} height={30} show={hideRePassword} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
        {!error && (
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.submitForm}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>
              {I18n.t('newPwdForm.continue', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
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
)(FormResetPassword);
