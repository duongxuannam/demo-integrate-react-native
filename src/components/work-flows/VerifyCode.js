import React, { createRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  AppState
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import authActions from '../../store/actions/authAction';
import MessageError from '../common/MessageError';
import MsgErrorApi from '../common/MsgErrorApi';

// CSS
import styles from './style';

class VerifyCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      countDown: 0,
      error: false,
      resendCodeFail: false,
      appState: AppState.currentState,
      verifyCode1: '*',
      verifyCode2: '*',
      verifyCode3: '*',
      verifyCode4: '*',
    };
  }

  componentDidMount() {
    const { registerFormData } = this.props;
    this.refs.Input1.focus();
    AppState.addEventListener('change', this._handleAppStateChange);
    this.interval = setInterval(() => this.countDownAction(this.interval), 1000);
    this.setState({
      countDown: registerFormData.smsConfirmedAt
    })
  }

  componentDidUpdate(prevProps, prevStates) {
    const {
      verifyCode1,
      verifyCode2,
      verifyCode3,
      verifyCode4,
    } = this.state;

    if (verifyCode1 !== prevStates.verifyCode1
      || verifyCode2 !== prevStates.verifyCode2
      || verifyCode3 !== prevStates.verifyCode3
      || verifyCode4 !== prevStates.verifyCode4
    ) {
      this.checkDisabledBtn(
        verifyCode1,
        verifyCode2,
        verifyCode3,
        verifyCode4,
      );
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    const {
      infoAccount,
      registerFormData,
      navigation,
      isVerifyCodeSignUp,
      isVerifyCode
    } = this.props;
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (navigation.state.params.isSignUp) {
        isVerifyCodeSignUp(registerFormData);
      } else {
        isVerifyCode(infoAccount);
      }
    }
    this.setState({ appState: nextAppState });
  }

  requestVerifyCode = () => {
    const { registerFormData: { accessToken }, actions, navigation } = this.props;
    const {
      verifyCode1, verifyCode2, verifyCode3, verifyCode4
    } = this.state;
    actions.verifyCode({ token: accessToken, code: `${verifyCode1}${verifyCode2}${verifyCode3}${verifyCode4}` }, (response) => {
      if (response && response.error) {
        this.setState({
          error: true
        });
        this.clearCode();
      } else {
        Alert.alert('Verify Code Success!');
        this.setState({
          error: false,
          verifyCode1: '*',
          verifyCode2: '*',
          verifyCode3: '*',
          verifyCode4: '*',
        });
        navigation.navigate('BookingStack');
      }
    });
    this.setState({
      resendCodeFail: false
    });
  }

  countDownAction = (eventInterval) => {
    const { countDown } = this.state;
    this.setState((state) => ({
      countDown: state.countDown - 1
    }));

    if (countDown === 1) {
      clearInterval(eventInterval);
    }
  }

  resendCode = () => {
    const { registerFormData: { accessToken }, actions } = this.props;
    actions.resendCode(accessToken, (data, error) => {
      if (error) {
        this.setState({
          resendCodeFail: true
        });
      } else {
        Alert.alert('Resend Code Successfully!', '', [
          {
            text: 'OK',
            onPress: () => { this.refs.Input1.focus(); }
          }
        ]);
        this.setState({
          resendCodeFail: false,
          error: false,
          verifyCode1: '*',
          verifyCode2: '*',
          verifyCode3: '*',
          verifyCode4: '*',
        });
      }
    });
  }

  renderView = () => {
    const { countDown } = this.state;
    const { languageCode } = this.props;
    if (countDown === 0) {
      return (
        <Text
          onPress={this.resendCode}
          style={{ fontSize: 18, color: 'rgba(81, 175, 43, 1)', fontFamily: 'Roboto-Regular', }}
        >
          {I18n.t('verifyCode.resendCodeText', { locale: languageCode })}
        </Text>
      );
    }
    return (
      <Text style={[styles.redText, styles.defaultSize, styles.bold]}>
        {countDown}
        {I18n.t('verifyCode.textUnitCountdownTime', { locale: languageCode })}
      </Text>
    );
  }

  handleChangeInput1 = (val) => {
    this.setState({ verifyCode1: val });
    this.refs.Input2.focus();
  }

  handleChangeInput2 = (val) => {
    this.setState({ verifyCode2: val });
    this.refs.Input3.focus();
  }

   handleChangeInput3 = (val) => {
     this.setState({ verifyCode3: val });
     this.refs.Input4.focus();
   }

   handleChangeInput4 = (val) => {
     this.setState({ verifyCode4: val });
   }

  handleField1 = () => {
    const { verifyCode1 } = this.state;
    // if (verifyCode1 === '*') {
    // }
    this.setState({ verifyCode1: '' });
  }

  handleField2 = () => {
    const { verifyCode2, verifyCode1 } = this.state;
    if (verifyCode2 === '*' && verifyCode1 === '*') {
      this.refs.Input1.focus();
    } else {
      this.setState({ verifyCode2: '' });
    }
  }

  handleField3 = () => {
    const { verifyCode3, verifyCode1 } = this.state;
    if (verifyCode3 === '*' && verifyCode1 === '*') {
      this.refs.Input1.focus();
    } else {
      this.setState({ verifyCode3: '' });
    }
  }

  handleField4 = () => {
    const { verifyCode4, verifyCode1 } = this.state;
    if (verifyCode4 === '*' && verifyCode1 === '*') {
      this.refs.Input1.focus();
    } else {
      this.setState({ verifyCode4: '' });
    }
  }

  clearCode = () => {
    this.setState({
      verifyCode1: '',
      verifyCode2: '',
      verifyCode3: '',
      verifyCode4: '',
    });
  }

  checkDisabledBtn = (code1 = '', code2 = '', code3 = '', code4 = '') => {
    if (
      code1 && code1 !== '*'
      && code2 && code2 !== '*'
      && code3 && code3 !== '*'
      && code4 && code4 !== '*'
    ) {
      this.setState({
        disabled: false
      });
      return false;
    }
    this.setState({
      disabled: true
    });
  }

  render() {
    const {
      verifyCode1,
      verifyCode2,
      verifyCode3,
      verifyCode4,
      disabled,
      countDown,
      error,
      resendCodeFail,
    } = this.state;
    const { languageCode } = this.props;
    return (
      <>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.paddingVertical30,
          styles.mb30]}
        >
          {resendCodeFail && (
          <MsgErrorApi errorMsg={I18n.t('verifyCode.resendCodeFail', { locale: languageCode })} />
          )}
          <View style={[styles.mb20, styles.flex, styles.justifyContentCenter]}>
            {error ? (
              <MessageError errorMsg={I18n.t('verifyCode.verifyCodeFail', { locale: languageCode })} />
            ) : (
              <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
                {I18n.t('verifyCode.verifyCodeDescriptionMessage', { locale: languageCode })}
              </Text>
            )}
          </View>
          <View style={[styles.flex, styles.justifySpaceBetween, styles.flexOneSubstract]}>
            <TextInput
              ref="Input1"
              contextMenuHidden
              maxLength={1}
              keyboardType="number-pad"
              style={[styles.input, styles.textCenter, { width: 60 }, error && styles.inputError]}
              onChangeText={this.handleChangeInput1}
              value={verifyCode1}
              onFocus={this.handleField1}
            />
            <TextInput
              ref="Input2"
              contextMenuHidden
              maxLength={1}
              keyboardType="number-pad"
              style={[styles.input, styles.textCenter, { width: 60 }, error && styles.inputError]}
              onChangeText={this.handleChangeInput2}
              value={verifyCode2}
              onFocus={this.handleField2}
            />
            <TextInput
              ref="Input3"
              maxLength={1}
              keyboardType="number-pad"
              contextMenuHidden
              style={[styles.input, styles.textCenter, { width: 60 }, error && styles.inputError]}
              onChangeText={this.handleChangeInput3}
              value={verifyCode3}
              onFocus={this.handleField3}
            />
            <TextInput
              ref="Input4"
              maxLength={1}
              keyboardType="number-pad"
              contextMenuHidden
              onChangeText={this.handleChangeInput4}
              style={[styles.input, styles.textCenter, { width: 60 }, error && styles.inputError]}
              value={verifyCode4}
              onFocus={this.handleField4}
            />
          </View>
        </View>
        <View style={styles.mb20}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            disabled={disabled}
            onPress={this.requestVerifyCode}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20, disabled ? { opacity: 0.5 } : { opacity: 1 }]}>
              {I18n.t('verifyCode.verifyCodeButton', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.mb30, styles.flexOne, styles.flex, styles.textCenter]}>
          <Text style={styles.smallSize}>
            {countDown === 0 ? I18n.t('verifyCode.verifyCodeResendDesciptionText', { locale: languageCode })
              : I18n.t('verifyCode.verifyCodeDescriptionText', { locale: languageCode })}
          </Text>
          {this.renderView()}
        </Text>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
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
)(VerifyCode);
