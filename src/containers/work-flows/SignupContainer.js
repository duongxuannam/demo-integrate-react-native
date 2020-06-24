import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import I18n from '../../config/locales';
// COMPONENTS
import FormRegister from '../../components/work-flows/FormRegister';
import IconCustomerService from '../../components/common/CustomerService';

class SignupContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderBanner = (languageCode) => (
    <View style={[styles.banner, styles.mb30, styles.mt10, styles.pad20]}>
      <Text style={styles.bannerTitle}>
        {I18n.t('signup.bannerTitle', { locale: languageCode })}
      </Text>
      <View style={[styles.flex, styles.alignItemsCenter, styles.mt20]}>
        <Image source={require('../../assets/images/gift.png')} />
        <Text style={[styles.bannerDescription, styles.ml20, styles.flexOne]}>
          {I18n.t('signup.bannerContent', { locale: languageCode })}
        </Text>
      </View>
    </View>
  );

  render() {
    const { navigation: { navigate }, languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <KeyboardAwareScrollView
          extraScrollHeight={15}
        >
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              {I18n.t('signup.signupFirstTitle', { locale: languageCode })}
            </Text>
            <IconCustomerService />
          </View>
          {this.renderBanner(languageCode)}
          <FormRegister navigate={navigate} />
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
  mt20: {
    marginTop: 20,
  },
  mt10: {
    marginTop: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  ml20: {
    marginLeft: 20,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
  banner: {
    marginHorizontal: 20,
    borderRadius: 4,
    backgroundColor: 'rgba(76, 173, 50, 1)',
  },
  bannerTitle: {
    fontSize: 21,
    fontFamily: 'Roboto-Bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  bannerDescription: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255, 255, 255, 1)',
  },
});

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(SignupContainer);
