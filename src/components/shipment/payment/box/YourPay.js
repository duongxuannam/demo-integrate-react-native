import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';

// COMPONENTS
import UrlImage from '../../../common/Image';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';

// CSS
import styles from '../../style';
import I18n from '../../../../config/locales';

import { formatMetricsWithCommas } from '../../../../helpers/regex';

class YourPay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static renderRow(leftText, rightText, isLastLine = false, currency) {
    return (
      <View style={[styles.form, styles.flex, isLastLine ? null : styles.mb10]}>
        <View style={[styles.formLeft, styles.w120, styles.mr20]}>
          <Text style={[styles.grayText, styles.smallSize]}>
            {leftText}
          </Text>
        </View>
        <View style={[styles.formRight, styles.flexOne]}>
          <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
            {currency && <Text style={styles.smallerSize}>{`${currency} `}</Text>}
            {currency ? formatMetricsWithCommas(rightText) : rightText}
          </Text>
        </View>
      </View>
    );
  }

  static renderRowTotal(leftText, rightText, isLastLine = false, currency) {
    return (
      <View style={[styles.flex, isLastLine ? null : styles.mb10]}>
        <View style={[styles.w120, styles.mr20, styles.justifyContentCenter]}>
          <Text style={[styles.grayText, styles.smallSize]}>
            {leftText}
          </Text>
        </View>
        <View style={[styles.formRight, styles.flexOne]}>
          <Text style={[styles.defaultTextColor, styles.boxSize, styles.bold]}>
            {currency && <Text style={styles.smallSize}>{`${currency} `}</Text>}
            {currency ? formatMetricsWithCommas(rightText) : rightText}
          </Text>
        </View>
      </View>
    );
  }

  commission = (percent, currency, number, languageCode) => (
    <Text style={styles.defaultTextColor}>
      <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
        { percent }
        %
      </Text>
      <Text style={[styles.smallerSize, { fontWeight: 'normal' }]}>
        {`\n${currency} ${formatMetricsWithCommas(number)} ${I18n.t('shipment.payment.deducted_from_your_wallet', { locale: languageCode })}`}
      </Text>
    </Text>
  );

  render() {
    const {
      dataConfig, languageCode, paymentData
    } = this.props;
    const deducted = ((paymentData.amount * paymentData.commission) / 100);
    const earning = paymentData.amount - deducted;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        <View style={[styles.mt10, styles.paddingHorizontal20,]}>
          <View style={styles.paddingVertical20}>
            {YourPay.renderRow(`${I18n.t('shipment.payment.invoice_to_customer', { locale: languageCode })}:`, paymentData.amount, false, paymentData.currency)}
            {YourPay.renderRow(`${I18n.t('shipment.payment.commission_to_deliveree', { locale: languageCode })}:`,
              this.commission(paymentData.commission, paymentData.currency, deducted, languageCode),
              true)}
          </View>
          <View style={[styles.lineSilver]} />
          <View style={[styles.paddingVertical15]}>
            {YourPay.renderRowTotal(`${I18n.t('shipment.payment.your_net_earnings', { locale: languageCode })}:`, paymentData.totalAmount, true, paymentData.currency)}
          </View>
          <View style={[styles.lineSilver]} />
          <View style={styles.paddingVertical20}>
            <Text style={[styles.grayText, styles.smallSize]}>
              <Text>{I18n.t('shipment.payment.you_have_agreed_to_the', { locale: languageCode })}</Text>
              <Text
                style={[styles.mainColorText, styles.bold]}
                onPress={() => Linking.openURL(dataConfig.TermConditionsURL)}
              >
                {` ${I18n.t('bid.termsAndConditions', { locale: languageCode })}`}
              </Text>
              <Text>.</Text>
            </Text>
          </View>
        </View>
      </>
    );
  }
}

export default YourPay;
