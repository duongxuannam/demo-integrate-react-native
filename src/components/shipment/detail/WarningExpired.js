import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import I18n from '../../../config/locales';
import styles from '../style';

class WarningExpired extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { languageCode, navigation } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={stylesInFile.container}>
        <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
          <Text style={[styles.title, styles.flexOne, styles.mr20]}>
            {I18n.t('shipment.detail.warning.title', { locale: languageCode })}
          </Text>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30]}
        >
          <Text style={[
            styles.textCenter, styles.shipmentTime,
            {
              borderRadius: 5,
              color: 'red',
              paddingVertical: 20,
            },
            styles.defaultSize
          ]}
          >
            {I18n.t('shipment.detail.warning.text', { locale: languageCode })}
          </Text>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr20, styles.ml10]}>
              {I18n.t('shipment.detail.warning.okay', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default WarningExpired;

const stylesInFile = StyleSheet.create({
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
