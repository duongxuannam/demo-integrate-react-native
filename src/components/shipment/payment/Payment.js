import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import I18N from '../../../config/locales';
import Price from './box/Price';
import Method from './box/Method';
import Info from './box/Info';
import IMAGE_CONSTANT from '../../../constants/images';
import PriceSvg from '../../common/svg/price';
import MethodSvg from '../../common/svg/method';
import InstructionsSvg from '../../common/svg/instructions';
import styles from '../style';

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
      accountSelect,
      actions,
      languageCode,
      countryCode,
      configs,
      payment,
    } = this.props;
    return (
      <>
        <View style={[styles.whiteBg, styles.mt30]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expandedPrice: !prevState.expandedPrice }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <PriceSvg />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('payment.section.price.title', { locale: languageCode })}
                </Text>
              </View>
              {expandedPrice
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
          {expandedPrice ? (
            <Price
              expanded={expandedPrice}
              configs={configs}
              languageCode={languageCode}
              payment={payment}
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
                  {I18N.t('payment.section.method.title', { locale: languageCode })}
                </Text>
              </View>
              {expandedMethod
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
          {expandedMethod ? (
            <Method
              expanded={expandedMethod}
              accountSelect={accountSelect}
              actions={actions}
              languageCode={languageCode}
              configs={configs}
              countryCode={countryCode}
              payment={payment}
            />
          ) : null}
        </View>
        <View style={[styles.whiteBg, styles.mt30, styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expandedInfo: !prevState.expandedInfo }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <InstructionsSvg />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('payment.section.instructions.title', { locale: languageCode })}
                </Text>
              </View>
              {expandedInfo
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
          {expandedInfo ? (
            <Info
              expanded={expandedInfo}
              configs={configs}
              payment={payment}
              languageCode={languageCode}
              actions={actions}
            />
          ) : null}
        </View>
      </>
    );
  }
}

export default Payment;
