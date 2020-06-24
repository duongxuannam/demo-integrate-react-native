import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../../config/locales';
// CSS
import styles from './style';

class FormResetPasswordAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickButton = () => {
    const { navigation: { navigate }, currentStep } = this.props;
    currentStep();
    navigate('HomeStack')
  }

  render() {
    const { languageCode } = this.props;
    return (
      <View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          <View style={styles.resetPasswordAlert}>
            <Text style={[styles.resetPasswordAlertTop, styles.defaultSize,
              styles.textCenter, styles.pad20]}
            >
              {I18n.t('resultForgotPwd.notify', { locale: languageCode })}
            </Text>
            <Text style={[styles.resetPasswordAlertBottom, styles.defaultSize,
              styles.textCenter, styles.paddingHorizontal20]}
            >
              {I18n.t('resultForgotPwd.notifyExpired', { locale: languageCode })}
            </Text>
          </View>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.handleClickButton}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>
              {I18n.t('resultForgotPwd.labelBtnOkay', { locale: languageCode })}
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
)(FormResetPasswordAlert);
