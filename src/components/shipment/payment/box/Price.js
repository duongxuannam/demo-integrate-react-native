import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
} from 'react-native';
import I18N from '../../../../config/locales';
import styles from '../../style';
import { formatPrice } from '../../../../helpers/regex';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  static renderBox(title, value) {
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.mt15, styles.mb15]}>
        <Text style={[styles.smallSize, styles.defaultTextColor]}>{title}</Text>
        <Text style={[styles.flexOne, styles.textRight, styles.boxSize, styles.defaultTextColor, styles.bold]}>{value}</Text>
      </View>
    );
  }

  static renderRow(leftText, rightText, isLastLine = false) {
    return (
      <View style={[styles.form, styles.flex, isLastLine ? null : styles.mb10]}>
        <View style={[styles.formLeft, styles.w120, styles.mr20]}>
          <Text style={[styles.grayText, styles.smallSize]}>
            {leftText}
          </Text>
        </View>
        <View style={[styles.formRight, styles.flexOne]}>
          <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
            {rightText}
          </Text>
        </View>
      </View>
    );
  }

  static renderRowTotal = (leftText, rightText, isLastLine = false, payment) => (
    <View style={[styles.form, styles.flex, isLastLine ? null : styles.mb10]}>
      <View style={[styles.formLeft, styles.w120, styles.mr20]}>
        <Text style={[styles.grayText, styles.smallSize]}>
          {leftText}
        </Text>
      </View>
      <View style={[styles.formRight, styles.flexOne]}>
        <Text>
          <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
            {payment.currency}
            {' '}
          </Text>
          <Text style={[styles.defaultTextColor, styles.titleSize, styles.bold]}>
            {rightText}
          </Text>
        </Text>
      </View>
    </View>
  );

  render() {
    const { languageCode, configs, payment } = this.props;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        <View style={[styles.mt10, styles.paddingHorizontal20]}>
          <View style={styles.paddingVertical20}>
            {Price.renderRow(`${I18N.t('payment.section.price.quote', { locale: languageCode })}:`, `${payment.currency} ${formatPrice(payment.amount)}`, false)}
            {Price.renderRow(`${I18N.t('payment.section.price.commission', { locale: languageCode })}:`, I18N.t('commission_value.paid_by_carrier', { locale: languageCode }), true)}
          </View>
          <View style={[styles.lineSilver]} />
          <View style={styles.paddingVertical15}>
            {Price.renderRowTotal(`${I18N.t('payment.section.price.total', { locale: languageCode })}:`, formatPrice(payment.totalAmount), true, payment)}
          </View>
          <View style={[styles.lineSilver]} />
          <View style={styles.paddingVertical20}>
            <Text style={[styles.grayText, styles.smallSize]}>
              <Text>
                {I18N.t('payment.section.price.agreed', { locale: languageCode })}
                {' '}
              </Text>
              <Text style={[styles.mainColorText, styles.bold]} onPress={() => this.openWebBrowser(configs.TermConditionsURL)}>
                {I18N.t('quote.modal.accept.term_link', { locale: languageCode })}
              </Text>
            </Text>
          </View>
        </View>
      </>
    );
  }
}

export default Price;
