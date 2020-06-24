import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../../config/locales';

// COMPONENTS
import LoginForm from './LoginForm/LoginForm';


class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation, languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <KeyboardAwareScrollView
          extraScrollHeight={15}
        >
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              {I18n.t('loginDesc', { locale: languageCode })}
            </Text>
            <Image source={require('../../assets/images/cs.png')} />
          </View>
          <LoginForm />
        </KeyboardAwareScrollView>
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
  languageCode: state.config.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(LoginContainer);
