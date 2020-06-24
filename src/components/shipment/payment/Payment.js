import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PaymentAction from '../../../store/actions/paymentAction';

// COMPONENTS
import YourPay from './box/YourPay';
import Method from './box/Method';
import YourBankInstructions from './box/YourBankInstructions';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import I18n from '../../../config/locales';

// CSS
import styles from '../style';

// Image
import { InstructionsSvg, MethodSvg, YourPaySvg } from '../../common/Svg';

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedPrice: true,
      expandedMethod: true,
      expandedInfo: true,
    };
  }

  render() {
    const { expandedPrice, expandedMethod, expandedInfo } = this.state;
    const {
      actions, languageCode, paymentData, shipmentStatus, dataConfig
    } = this.props;
    console.log('paymentData: ', paymentData);
    console.log('dataConfig: ', dataConfig);
    return (
      <>
        <View style={[styles.whiteBg, styles.mt30]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expandedPrice: !prevState.expandedPrice }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <YourPaySvg />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('shipment.payment.your_pay', { locale: languageCode })}
                </Text>
              </View>
              {expandedPrice
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="contain" />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />}
            </View>
          </TouchableOpacity>
          {expandedPrice ? (
            <YourPay
              expanded={expandedPrice}
              paymentData={paymentData}
              languageCode={languageCode}
              dataConfig={dataConfig}
            />
          ) : null}
        </View>
        <View style={[styles.whiteBg, styles.mt30]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expandedMethod: !prevState.expandedMethod }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <MethodSvg />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('shipment.summary.payment_method', { locale: languageCode })}
                </Text>
              </View>
              {expandedMethod
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="contain" />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />}
            </View>
          </TouchableOpacity>
          {expandedMethod ? (
            <Method
              expanded={expandedMethod}
              paymentData={paymentData}
              actions={actions}
              languageCode={languageCode}
              dataConfig={dataConfig}
            />
          ) : null}
        </View>
        <View style={[styles.whiteBg, styles.mt30, styles.mb30]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expandedInfo: !prevState.expandedInfo }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <InstructionsSvg />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('shipment.payment.your_payment_instructions', { locale: languageCode })}
                </Text>
              </View>
              {expandedInfo
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="contain" />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />}
            </View>
          </TouchableOpacity>
          {expandedInfo ? <YourBankInstructions expanded={expandedInfo} paymentData={paymentData} actions={actions} shipmentStatus={shipmentStatus} languageCode={languageCode} /> : null}
        </View>
      </>
    );
  }
}

// export default Payment;

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  // countryCode: state.config.countryCode,
  dataConfig: state.config.dataConfig,
  paymentData: state.payment.data,
  shipmentStatus: state.shipment.shipmentDetail.status,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateBankInstructions: PaymentAction.updateBankInstructions,
      paymentRequestChange: PaymentAction.paymentRequestChange,
      downloadData: PaymentAction.downloadData,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);
