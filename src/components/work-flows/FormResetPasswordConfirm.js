import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import authActions from '../../store/actions/authAction';
import MsgErrorApi from '../common/MsgErrorApi';
import DEEP_LINK from '../../constants/deeplink';
// CSS
import styles from './style';

class FormResetPasswordConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  handleEditEmail = () => {
    const { email, currentStep } = this.props;
    currentStep(email);
  }

  handleSendLink = () => {
    const { actions, email, sendEmailSuccess } = this.props;
    actions.requestLinkReset({ email: email.toLowerCase(), redirectURL: DEEP_LINK }, (data, err) => {
      if (err) {
        this.setState({
          error: err.error
        });
      } else {
        this.setState({
          error: null
        });
        sendEmailSuccess();
      }
    });
  }

  render() {
    const { error } = this.state;
    const { email, languageCode } = this.props;
    return (
      <>
        <View style={[styles.whiteBg,
          styles.paddingHorizontal20,
          styles.paddingVertical30,
          styles.mb30]}
        >
          {error && (
            <MsgErrorApi errorMsg={error} />
          )}
          <View style={styles.mb20}>
            <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
              {I18n.t('viewEmailScreen.notify', { locale: languageCode })}
            </Text>
          </View>
          <Text style={[styles.verifyNumber, styles.textCenter, styles.titleSize, styles.bold]}>
            {email}
          </Text>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={this.handleEditEmail}
          >
            <Text style={[styles.formGroupButton,
              styles.buttonGreenBorder,
              styles.flexOne,
              styles.ml20,
              styles.mr10]}
            >
              {I18n.t('viewEmailScreen.editEmail', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={this.handleSendLink}
          >
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr20, styles.ml10]}>
              {I18n.t('viewEmailScreen.sendLink', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </>
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
)(FormResetPasswordConfirm);
