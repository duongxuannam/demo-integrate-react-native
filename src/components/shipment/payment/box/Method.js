import React, { Component } from 'react';
import {
  Text,
  Platform,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import {
  PAYMENT_METHOD, PAYMENT_METHOD_VALUE, DATE_TIME_FORMAT_VN, DATE_TIME_FORMAT, PAYMENT_STATUS
} from '../../../../constants/app';
import I18N from '../../../../config/locales';
import Select from '../../../common/Select';
import CashSvg from '../../../common/svg/cash';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';
import { getDateString } from '../../../../helpers/shipment.helper';

const { width } = Dimensions.get('window');

class Method extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapChange: false,
      isVisible: false,
      isSubmitRequest: false,
      isDisabled: false,
      selected: null,
      activePayment: false,
      isPressBtn: false,
    };
  }

  componentDidUpdate(prevProps, prevStates) {
    const { selected } = this.state;
    const { payment } = this.props;
    if (selected !== prevStates.selected) {
      if (selected) {
        this.setCanSubmitRequest();
      }
    }

    if (payment.paymentStatus !== prevProps.payment.paymentStatus) {
      if (payment.paymentStatus === PAYMENT_STATUS.COMPLETED) {
        this.setState({
          selected: null
        });
      }
    }
  }

  setCanSubmitRequest = () => {
    const { payment } = this.props;
    const { selected } = this.state;
    console.log('setCanSubmitRequest', payment, selected);
    const keyPayment = Object.keys(PAYMENT_METHOD_VALUE).find((key) => PAYMENT_METHOD_VALUE[key] === payment.paymentMethod);
    this.setState({
      isDisabled: selected.value === PAYMENT_METHOD[keyPayment],
    });
  }

  renderPaymentMethodText = (paymentMethod, languageCode) => {
    switch (paymentMethod) {
      case PAYMENT_METHOD_VALUE.BANK_TRANSFER:
        return (
          <View style={[styles.flex, styles.alignItemsCenter, { width: 180 }]}>
            <Image
              source={IMAGE_CONSTANT.bankTransfer}
              style={{
                width: 22,
                height: 15,
              }}
              resizeMode="contain"
            />
            <Text style={[styles.defaultTextColor, styles.defaultSize, styles.bold, styles.ml10]}>{I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode })}</Text>
          </View>
        );
      case PAYMENT_METHOD_VALUE.CASH:
        return (
          <View style={[styles.flex, styles.alignItemsCenter, { width: 180 }]}>
            <CashSvg />
            <Text style={[styles.defaultTextColor, styles.defaultSize, styles.bold, styles.ml10]}>{I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode })}</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.flex, styles.alignItemsCenter, { width: 180 }]}>
            <Image
              source={IMAGE_CONSTANT.bpAccount}
              style={{
                width: 22,
                height: 15,
              }}
              resizeMode="contain"
            />
            <Text style={[styles.defaultTextColor, styles.defaultSize, styles.bold, styles.ml10]}>{I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode })}</Text>
          </View>
        );
    }
  };

  setInforPaymentMethod = (value, name, languageCode) => {
    this.setState((prevState) => ({
      ...prevState,
      selected: {
        ...prevState.selected,
        value,
        name: I18N.t(`payment_value.${name}`, { locale: languageCode })
      }
    }));
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
        <View style={[styles.formLeft, styles.w120, styles.mr10]}>
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

  onSubmitRequestChange = () => {
    const { actions, payment } = this.props;
    const { selected } = this.state;
    console.log('selected', selected);
    this.setState({
      activePayment: selected !== null,
    }, () => {
      const { activePayment } = this.state;
      if (activePayment) {
        actions.requestChangePaymentMethod(payment.shipmentId, selected.value, (res, err) => {
          if (res) {
            this.setState((prevState) => ({ isSubmitRequest: !prevState.isSubmitRequest }));
          }
        });
      } else {
        Alert.alert(
          'Notice',
          'Please choose payment',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Accept Bid Failed');
              }
            },
          ],
          { cancelable: false }
        );
      }
    });
  }

  onConfirmAmend = () => {
    this.setState({
      isVisible: true
    });
  }

  renderOptionMethod = () => {
    const { accountSelect, languageCode } = this.props;
    const { payment } = this.props;
    if (accountSelect.type === 'PERSONAL') {
      return [
        {
          value: PAYMENT_METHOD.BANK_TRANSFER,
          name: I18N.t('quote.bank_transfer', { locale: languageCode }),
          disabled: payment.paymentMethod === PAYMENT_METHOD_VALUE.BANK_TRANSFER,
          icon: IMAGE_CONSTANT.bankTransfer,
        },
        {
          value: PAYMENT_METHOD.CASH,
          name: I18N.t('quote.cash', { locale: languageCode }),
          disabled: payment.paymentMethod === PAYMENT_METHOD_VALUE.CASH,
          icon: true,
          isCash: true
        },
      ];
    }
    return [
      {
        value: PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE,
        name: I18N.t('quote.bp', { locale: languageCode }),
        disabled: payment.paymentMethod === PAYMENT_METHOD_VALUE.BUSINESS_PROGRAM_INVOICE,
        icon: IMAGE_CONSTANT.bpAccount,
      },
      {
        value: PAYMENT_METHOD.BANK_TRANSFER,
        name: I18N.t('quote.bank_transfer', { locale: languageCode }),
        disabled: payment.paymentMethod === PAYMENT_METHOD_VALUE.BANK_TRANSFER,
        icon: IMAGE_CONSTANT.bankTransfer,
      },
      {
        value: PAYMENT_METHOD.CASH,
        name: I18N.t('quote.cash', { locale: languageCode }),
        disabled: payment.paymentMethod === PAYMENT_METHOD_VALUE.CASH,
        icon: true,
        isCash: true
      },
    ];
  }

  renderPaymentChangedRequest = () => {
    const { payment, languageCode } = this.props;
    let res = {};
    switch (payment.requestChange.paymentMethod) {
      case PAYMENT_METHOD_VALUE.BANK_TRANSFER:
        res = {
          value: PAYMENT_METHOD.BANK_TRANSFER,
          name: I18N.t(`payment_value.${payment.requestChange.paymentMethod.toLowerCase()}`,
            { locale: languageCode }),
          disabled: false
        };
        break;
      case PAYMENT_METHOD_VALUE.CASH:
        res = {
          value: PAYMENT_METHOD.CASH,
          name: I18N.t(`payment_value.${payment.requestChange.paymentMethod.toLowerCase()}`,
            { locale: languageCode }),
          disabled: false
        };
        break;
      case PAYMENT_METHOD_VALUE.BUSINESS_PROGRAM_INVOICE:
        res = {
          value: PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE,
          name: I18N.t(`payment_value.${payment.requestChange.paymentMethod.toLowerCase()}`,
            { locale: languageCode }),
          disabled: false
        };
        break;
      default:
        res = {
          value: PAYMENT_METHOD.CASH,
          name: I18N.t(`payment_value.${payment.requestChange.paymentMethod.toLowerCase()}`,
            { locale: languageCode }),
          disabled: false
        };
        break;
    }
    return res;
  }

  renderSubmitRequest = () => {
    const { selected, isDisabled } = this.state;
    const { languageCode, payment } = this.props;
    console.log('isDisabled', isDisabled);
    return (
      <>
        <View style={{ flex: 2 }}>
          <Select
            placeholder={I18N.t('quote.placeholder_payment', { locale: languageCode })}
            source={this.renderOptionMethod()}
            selectedValue={selected}
            onValueChange={(e) => this.setState({ selected: e })}
            whiteBg
            disabled={payment.paymentStatus === PAYMENT_STATUS.COMPLETED}
            grayArrow
          />
        </View>
        {selected ? (
          <View style={[styles.mt30, styles.paddingHorizontal20, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter]}
              activeOpacity={0.9}
              disabled={isDisabled}
              onPress={this.onSubmitRequestChange}
            >
              <Text style={[styles.formGroupButton, isDisabled ? { backgroundColor: 'gray' } : styles.mainBg]}>
                {I18N.t('payment.section.method.submit_request', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={[styles.mt30, styles.mb10, Platform.OS === 'ios' && { zIndex: -1 }]}>
          <Text style={[styles.grayText, styles.smallSize, {textAlign: 'justify'}]}>
            {I18N.t('payment.section.method.hint_text_2', { locale: languageCode })}
          </Text>
        </View>
      </>
    );
  }

  renderInforSubmit() {
    const { languageCode, payment, countryCode } = this.props;
    return (
      <>
        <View style={styles.mt20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
            {I18N.t('payment.section.method.request_change_submitted', { locale: languageCode })}
          </Text>
          <View style={{ flex: 2 }}>
            <Select
              source={this.renderOptionMethod()}
              selectedValue={this.renderPaymentChangedRequest()}
              onValueChange={(e) => this.setState({ selected: e })}
              whiteBg
              grayArrow
              disabled
            />
          </View>
        </View>
        <View style={[styles.mt30, Platform.OS === 'ios' && { zIndex: -1 }]}>
          {Method.renderRow(`${I18N.t('payment.section.method.request_submitted', { locale: languageCode })}:`,
            getDateString(payment.requestChange.createdAt, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT), false)}
        </View>
        <View style={[styles.mb10, Platform.OS === 'ios' && { zIndex: -1 }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.onConfirmAmend}
          >
            <View style={[styles.alignItemsCenter, styles.justifyContentCenter]}>
              <Text style={[styles.defaultSize, styles.redText, styles.bold]}>
                {I18N.t('payment.section.method.tap_here', { locale: languageCode })}
              </Text>
              <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                {I18N.t('payment.section.method.amend', { locale: languageCode })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  renderPaymentRevert = () => {
    const { payment: { paymentMethod }, languageCode } = this.props;
    let iconPayment = '';
    let textPayment = '';
    switch (paymentMethod) {
      case PAYMENT_METHOD_VALUE.BANK_TRANSFER:
        iconPayment = IMAGE_CONSTANT.bankTransfer;
        textPayment = I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode });
        break;
      case PAYMENT_METHOD_VALUE.CASH:
        iconPayment = IMAGE_CONSTANT.bankTransfer;
        textPayment = I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode });
        break;
      case PAYMENT_METHOD_VALUE.BUSINESS_PROGRAM_INVOICE:
        iconPayment = IMAGE_CONSTANT.bpAccount;
        textPayment = I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode });
        break;
      default:
        iconPayment = IMAGE_CONSTANT.bankTransfer;
        textPayment = I18N.t(`payment_value.${paymentMethod.toLowerCase()}`, { locale: languageCode });
        break;
    }
    return (
      <View style={[styles.mt20, styles.mb30]}>
        <View style={[styles.textCenter, styles.flex]}>
          <Text style={[styles.titleSize, styles.textCenter, styles.bold, { width: width / 1.2 }]}>
            {I18N.t('payment.section.method.amend_content', { locale: languageCode })}
            {' '}
            {paymentMethod === PAYMENT_METHOD_VALUE.CASH ? (
              <CashSvg />
            ) : (
              <Image
                source={iconPayment}
                style={{
                  width: 22,
                  height: 22,
                  marginRight: 10,
                }}
                resizeMode="contain"
              />
            )}
            {textPayment}
          </Text>
        </View>
      </View>
    );
  }

  onAmend = () => {
    const { payment, actions } = this.props;
    this.setState({
      isSubmitRequest: false,
      isVisible: false
    });
    actions.amendPaymentMethod(payment.shipmentId, () => {
      console.log('ahihi')
      this.setState({
        selected: null,
      });
    });
  }

  render() {
    const { isVisible, isSubmitRequest } = this.state;
    const { languageCode, configs, payment } = this.props;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.line]} />
        <View style={[styles.mt10, styles.paddingHorizontal20]}>
          <View style={[styles.form, styles.flex, styles.mb10, styles.alignItemsCenter]}>
            <View style={[styles.formLeft, styles.w100]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('payment.section.method.payment_method', { locale: languageCode })}
:
              </Text>
            </View>
            {this.renderPaymentMethodText(payment.paymentMethod, languageCode)}
          </View>
          <Text style={[styles.grayText, styles.smallSize, {textAlign: 'justify'}]}>
            {I18N.t('payment.section.method.hint_text_1', { locale: languageCode })}
          </Text>
          <Text style={[styles.mainColorText, styles.smallSize, styles.bold]} onPress={() => this.openWebBrowser(configs.TermConditionsURL)}>
            {I18N.t('quote.modal.accept.term_link', { locale: languageCode })}
          </Text>
          <View style={styles.paddingVertical20}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {I18N.t('payment.section.method.request_change', { locale: languageCode })}
            </Text>
            <View style={[styles.mt20, styles.mb20, styles.line]} />
            {payment.requestChange && payment.requestChange.id
              ? this.renderInforSubmit()
              : this.renderSubmitRequest()}
          </View>
        </View>

        {/* Modal Delete Booking */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
              }}
              onPress={() => this.setState({ isVisible: false })}
            />
            <View
              style={[styles.whiteBg, styles.pad20, {
                height: 400,
              }]}
            >
              <Text style={[styles.defaultSize, styles.bold]}>
                {I18N.t('payment.section.method.amend_request', { locale: languageCode })}
              </Text>
              <View style={[styles.mt20, styles.lineSilver]} />
              <View style={[styles.mt20, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <Text style={[styles.defaultSize, styles.textCenter, { width: width / 1.2 }]}>
                  {I18N.t('payment.section.method.confirm_amend', { locale: languageCode })}
                </Text>
              </View>
              {this.renderPaymentRevert()}
              <View style={styles.flex}>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                  onPress={() => this.setState({ isVisible: false })}
                >
                  <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.mr10]}>
                    {I18N.t('payment.section.method.back', { locale: languageCode })}

                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                  onPress={this.onAmend}
                >
                  <Text style={[styles.formGroupButton, styles.formGroupButtonRed, styles.flexOne, styles.ml10]}>
                    {I18N.t('payment.section.method.amend_text', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default Method;
