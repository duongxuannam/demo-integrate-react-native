import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

// CONSTANT
import I18n from '../../config/locales';

// CSS
import styles from './style';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callLogin = () => {
    const { requestLogin } = this.props;
    if (requestLogin) {
      requestLogin();
    }
  }

  render() {
    const { token, languageCode } = this.props;
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
        <Text style={[styles.title, styles.flexOne, styles.mr20]}>
          <Text style={styles.mainColorText} onPress={this.callLogin}>{`${(!token) ? I18n.t('login', { locale: languageCode }) : I18n.t('logout', { locale: languageCode })} `}</Text>
          {!token && I18n.t('header.desc')}
        </Text>
        {/* <Image source={require('../../assets/images/cs.png')} /> */}
      </View>
    );
  }
}

Header.propTypes = {
  requestLogin: PropTypes.func,
  token: PropTypes.string,
  languageCode: PropTypes.string
};

Header.defaultProps = {
  requestLogin: () => {},
  token: null,
  languageCode: 'en'
};

export default Header;
