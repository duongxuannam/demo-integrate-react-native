import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import I18N from '../../../../config/locales';
import Attactments from '../../../booking/attactments/Attactments';
import styles from '../../style';
import { PAYMENT_METHOD_VALUE, PAYMENT_STATUS } from '../../../../constants/app';

class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proofPhotos: [null, null, null],
      canConfirm: false,
      isSubmit: false,
    };
  }

  componentDidMount() {
    const { payment } = this.props;
    this.initData(payment);
  }

  componentDidUpdate(prevProps) {
    const { payment } = this.props;
    if (payment !== prevProps.payment) {
      this.initData(payment);
    }
    if (payment.paymentStatus !== prevProps.payment.paymentStatus) {
      this.initData(payment);
    }
  }

  initData = (payment) => {
    if (payment.paymentProofs && payment.paymentProofs.length === 0) {
      this.setState({
        proofPhotos: [null, null, null]
      });
    } else if (payment.paymentProofs && payment.paymentProofs.length === 1) {
      this.setState({
        proofPhotos: [payment.paymentProofs[0], null, null]
      });
    } else if (payment.paymentProofs && payment.paymentProofs.length === 2) {
      this.setState({
        proofPhotos: [payment.paymentProofs[0], payment.paymentProofs[1], null]
      });
    } else {
      this.setState({
        proofPhotos: payment.paymentProofs
      });
    }
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

  onConfirmCompleted = () => {
    const { proofPhotos } = this.state;
    this.setState({
      isSubmit: true,
      canConfirm: proofPhotos.filter((photo) => photo !== null).length > 0
    }, () => {
      const { canConfirm } = this.state;
      const { actions, payment } = this.props;
      if (canConfirm) {
        actions.confirmCompletedPayment(payment.shipmentId, () => {
        });
      }
    });
    console.log('ahihi');
  }

  render() {
    const {
      payment, languageCode, actions, countryCode
    } = this.props;
    const { proofPhotos, isSubmit, canConfirm } = this.state;
    console.log('proofPhotos', proofPhotos);
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        {payment.paymentMethod === PAYMENT_METHOD_VALUE.BANK_TRANSFER ? (
          <>
            <View style={[styles.mt30, styles.paddingHorizontal20]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, {textAlign: 'justify'}]}>
                {I18N.t('payment.section.instructions.ensure_hint', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.mt10, styles.paddingHorizontal20]}>
              <View style={styles.paddingVertical20}>
                {Info.renderRow(`${I18N.t('payment.section.instructions.bank_name', { locale: languageCode })}:`, payment.bankName || '-', false)}
                {Info.renderRow(`${I18N.t('payment.section.instructions.code', { locale: languageCode })}:`, payment.bankCode || '-', false)}
                {Info.renderRow(`${I18N.t('payment.section.instructions.account_name', { locale: languageCode })}:`, payment.accountName || '-', false)}
                {Info.renderRow(`${I18N.t('payment.section.instructions.account_number', { locale: languageCode })}:`, payment.accountNumber || '-', true)}
              </View>
            </View>
          </>
        ) : null}
        <View style={[styles.mb10, styles.paddingHorizontal20]}>
          <Attactments
            proof
            disabled={payment.paymentStatus === PAYMENT_STATUS.COMPLETED}
            isSubmit={isSubmit}
            canConfirm={canConfirm}
            actions={actions}
            proofPhotos={proofPhotos}
            languageCode={languageCode}
            countryCode={countryCode}
            shipmentID={payment.shipmentId}
          />
        </View>
        <View style={[styles.mt30, styles.mb20, styles.paddingHorizontal20]}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            disabled={payment.paymentStatus === PAYMENT_STATUS.COMPLETED}
            onPress={this.onConfirmCompleted}
          >
            <Text style={[styles.formGroupButton, payment.paymentStatus === PAYMENT_STATUS.COMPLETED ? { backgroundColor: 'gray' } : styles.darkGreenBg, styles.textCapitalize]}>
              {payment.paymentStatus === PAYMENT_STATUS.COMPLETED
                ? I18N.t('payment.section.completed_payment', { locale: languageCode })
                : I18N.t('payment.section.complete_payment', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

export default Info;
