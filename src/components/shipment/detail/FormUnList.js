import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconCustomerService from '../../common/CustomerService';
import I18N from '../../../config/locales';
import styles from '../style';

export default class FormUnList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      shipmentDetail, back, unlist, languageCode
    } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
          <Text style={[styles.title, styles.flexOne, styles.mr20]}>
            {I18N.t('shipment.un_list.heading', { locale: languageCode })}
          </Text>
          <IconCustomerService />
        </View>
        <View style={[styles.whiteBg,
          styles.paddingHorizontal20,
          styles.paddingVertical30,
          styles.mb30]}
        >
          <View style={styles.mb20}>
            <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
              {I18N.t('shipment.un_list.confirm', { locale: languageCode })}
            </Text>
          </View>
          <Text style={[styles.verifyNumber, styles.textCenter, styles.titleSize, styles.bold]}>
            {shipmentDetail.title}
          </Text>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => back()}
          >
            <Text style={[styles.formGroupButton,
              styles.buttonGreenBorder,
              styles.flexOne,
              styles.ml20,
              styles.mr10]}
            >
              {I18N.t('shipment.un_list.back', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => unlist()}
          >
            <Text style={[styles.formGroupButton, styles.redBg, styles.flexOne, styles.mr20, styles.ml10]}>
              {I18N.t('shipment.un_list.un_list', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.mb20, styles.pl20, styles.pr20]}>
          <Text style={[styles.grayText, styles.textCenter, styles.flexWrapper]}>
            {I18N.t('shipment.un_list.hint', { locale: languageCode })}
          </Text>
        </View>
      </>
    );
  }
}
