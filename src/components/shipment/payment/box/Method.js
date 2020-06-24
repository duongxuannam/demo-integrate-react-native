import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Modal,
  Linking,
} from 'react-native';

// COMPONENTS
import { CombinedShapeSvg, YourPaySvg } from '../../../common/Svg';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import { PAYMENT_METHOD } from '../../../../constants/app';

// CSS
import styles from '../../style';
import I18n from '../../../../config/locales';

class Method extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderRow = (leftText, rightText, isLastLine = false, languageCode, type) => (
    <View style={[styles.flex, isLastLine ? null : styles.mb30]}>
      <View style={[type === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE ? styles.w70 : styles.w120, styles.mr20]}>
        <Text style={[styles.grayText, styles.smallSize]}>
          {leftText}
        </Text>
      </View>
      <View style={styles.flex}>
        {this.renderIconPaymentMethod(rightText)}
        <Text style={[styles.defaultTextColor, styles.defaultSize, styles.bold]}>
          {`  ${this.renderTextPaymentMethod(rightText, languageCode)}`}
        </Text>
      </View>
    </View>
  )

  renderTextPaymentMethod = (type, languageCode) => {
    if (type === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE) {
      return I18n.t('shipment.payment.business_program_invoice', { locale: languageCode });
    }
    if (type === PAYMENT_METHOD.CASH) {
      return I18n.t('shipment.payment.cash', { locale: languageCode });
    }
    return I18n.t('shipment.payment.bank_transfer', { locale: languageCode });
  }

  renderIconPaymentMethod = (type) => {
    if (type === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE) {
      return <Image source={IMAGE_CONSTANT.bpAccount} style={{ width: 22, height: 15, marginTop: 5 }} />;
    }
    if (type === PAYMENT_METHOD.CASH) {
      return <YourPaySvg />;
    }
    return <CombinedShapeSvg />;
  }

  renderTextNotePaymentMethod = (type, languageCode, dataConfig) => {
    if (type === PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE) {
      return (
        <Text>
          <Text style={[styles.grayText, styles.smallSize]}>
            {I18n.t('shipment.payment.some_customers_belong', { locale: languageCode })}
          </Text>
          <Text
            style={[styles.mainColorText, styles.smallSize, styles.bold]}
            onPress={() => Linking.openURL(dataConfig.TermConditionsURL)}
          >
            {`\n${I18n.t('bid.termsAndConditions', { locale: languageCode })}`}
          </Text>
        </Text>
      );
    }
    if (type === PAYMENT_METHOD.CASH) {
      return;
    }
    return (
      <Text>
        <Text style={[styles.grayText, styles.smallSize]}>
          {I18n.t('shipment.payment.paymentViaBank', { locale: languageCode })}
        </Text>
        <Text
          style={[styles.mainColorText, styles.smallSize, styles.bold]}
          onPress={() => Linking.openURL(dataConfig.TermConditionsURL)}
        >
          {`\n${I18n.t('bid.termsAndConditions', { locale: languageCode })}`}
        </Text>
      </Text>
    );
  }

  declineRequest = () => {
    const { actions, paymentData } = this.props;
    actions.paymentRequestChange(paymentData.shipmentId, false);
  }

  acceptRequest = () => {
    const { actions, paymentData } = this.props;
    actions.paymentRequestChange(paymentData.shipmentId, true);
  }

  render() {
    const { tapChange, isVisible } = this.state;
    const { languageCode, dataConfig, paymentData } = this.props;
    // console.log('dataPayment: ', this.dataPayment())
    // const paymentMethod = 'BankTransfer';
    // const paymentMethod = 'BusinessProgramInvoice';
    // const requestChange = 'BusinessProgramInvoice';
    const cash = paymentData.paymentMethod === PAYMENT_METHOD.CASH;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        {!paymentData.requestChange ? (
          <View style={[styles.mt10, styles.paddingHorizontal20, cash ? null : styles.mb30]}>
            <View style={[styles.paddingVertical10]}>
              {this.renderRow(`${I18n.t('shipment.summary.payment_method', { locale: languageCode })}:`,
                paymentData.paymentMethod,
                true,
                languageCode,
                paymentData.paymentMethod)}
            </View>
            {this.renderTextNotePaymentMethod(paymentData.paymentMethod, languageCode, dataConfig)}
          </View>
        ) : (
          <View style={[styles.mt10, styles.paddingHorizontal20, styles.mb30]}>
            <Text style={[styles.defaultTextColor, styles.defaultSize, styles.bold, styles.mb15, styles.mt15]}>
              {I18n.t('shipment.payment.customer_has_requested_a_change', { locale: languageCode })}
            </Text>
            <View style={styles.paddingVertical10}>
              {this.renderRow(`${I18n.t('shipment.payment.current_method', { locale: languageCode })}:`,
                paymentData.paymentMethod,
                false,
                languageCode,
                paymentData.paymentMethod)}
              {this.renderRow(`${I18n.t('shipment.payment.new_method', { locale: languageCode })}:`,
                paymentData.requestChange.paymentMethod,
                true,
                languageCode,
                paymentData.requestChange.paymentMethod)}
            </View>
            <View style={[styles.flex, styles.mt15]}>
              <TouchableOpacity
                style={[
                  styles.flexOne,
                  styles.mr10,
                  {
                    height: 50,
                    borderRadius: 4,
                    backgroundColor: 'rgba(225, 59, 48, 1)',
                  },
                  styles.justifyContentCenter,
                  styles.alignItemsCenter
                ]}
                activeOpacity={0.9}
                onPress={this.declineRequest}
              >
                <Text style={[styles.whiteText, styles.defaultSize, styles.bold]}>
                  {I18n.t('shipment.payment.decline_request', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.alignItemsCenter,
                  styles.justifyContentCenter,
                  styles.flexOne,
                  styles.greenBg,
                  styles.ml10,
                  {
                    height: 50,
                    borderRadius: 4,
                  }
                ]}
                activeOpacity={0.9}
                onPress={this.acceptRequest}
              >
                <Text style={[styles.whiteText, styles.defaultSize, styles.bold]}>
                  {I18n.t('shipment.payment.accept_request', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  }
}

export default Method;
