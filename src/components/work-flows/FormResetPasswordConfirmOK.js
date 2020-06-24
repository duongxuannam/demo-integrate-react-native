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

class FormResetPasswordConfirmOK extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRedirect = () => {
    const { navigation: { navigate }, clickButton } = this.props;
    clickButton();
    navigate('LoginStack');
  }

  render() {
    const { languageCode } = this.props;
    return (
      <View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
            {I18n.t('resultNewPwdForm.notify', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.handleRedirect}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>
              {I18n.t('resultNewPwdForm.login', { locale: languageCode })}
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
)(FormResetPasswordConfirmOK);