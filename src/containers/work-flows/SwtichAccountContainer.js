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
import FormSwitchAccount from '../../components/work-flows/FormSwitchAccount';
import IconCustomerService from '../../components/common/CustomerService';
import I18n from '../../config/locales/index';
import IMAGE_CONSTANT from '../../constants/images';

class SwtichAccountContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation, languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <ScrollView>
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              { I18n.t('selectAccount.title', { locale: languageCode }) }
            </Text>
            <IconCustomerService />
          </View>
          <FormSwitchAccount navigation={navigation} />
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
  languageCode: state.app.languageCode,
});

export default connect(
  mapStateToProps,
  {},
)(SwtichAccountContainer);
