import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// COMPONENTS
import ChatWidget from '../chat/ChatWidget';
// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';

// CSS
import styles from '../style';

import I18n from '../../../config/locales';

class Communication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
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

  renderList = (title, iconType, number, percent) => {
    let icon;
    switch (iconType) {
      case 'email':
        icon = IMAGE_CONSTANT.email;
        break;
      case 'phone':
        icon = IMAGE_CONSTANT.phone;
        break;
      default:
        icon = IMAGE_CONSTANT.address;
        break;
    }
    return (
      <View style={[
        styles.flex,
        styles.alignItemsCenter,
        styles.mt15,
        {
          borderRadius: 4,
          backgroundColor: 'rgba(245, 245, 245, 1)',
          // borderWidth: 1,
          // borderColor: 'rgba(233, 236, 239, 1)',
          paddingVertical: 16,
          paddingHorizontal: 12,
        }
      ]}
      >
        {!number && <Image source={icon} />}
        <Text style={[!number ? styles.defaultSize : styles.smallerSize, styles.defaultTextColor, styles.flexOne, styles.ml10, styles.mr10]}>
          {title}
        </Text>
        {!number && <Image source={IMAGE_CONSTANT.arrowRight} />}
        {number && (
        <Text style={[styles.boxSize, styles.defaultTextColor, styles.bold, styles.mr10]}>
          {`${number}${percent || ''}`}
        </Text>
        )}
      </View>
    );
  }

  renderExpanded(languageCode, customerInfo) {
    const companyName = customerInfo.referenceId ? customerInfo.name : '';
    const employeeName = customerInfo.referenceId ? customerInfo.referenceName : customerInfo.name;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.lineSilver]} />
        <View style={[styles.paddingVertical30, styles.paddingHorizontal20]}>
          <View style={[styles.flex, styles.alignItemsStart, styles.mb15]}>
            {(customerInfo.avatarSquare && <Image source={{ uri: customerInfo.avatarSquare }} style={{ width: 88, height: 88, borderRadius: 4 }} />) || (
              <Image source={IMAGE_CONSTANT.imageDefault} style={{ width: 88, height: 88, borderRadius: 4 }} />
            )}
            <View style={[styles.flexOne, styles.ml10, styles.justifyContentCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {employeeName}
              </Text>
              <Text style={[styles.smallSize, styles.grayText, styles.mt10, styles.bold]}>
                {companyName}
              </Text>
            </View>
          </View>
          {this.renderList(customerInfo.phone, 'phone')}
          {this.renderList(customerInfo.email, 'email')}
          {this.renderList(I18n.t('shipment.communication.shipment_listed', { locale: languageCode }), '', 39)}
          {this.renderList(I18n.t('shipment.communication.shipment_completed', { locale: languageCode }), '', 92, '%')}
        </View>
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const { languageCode, customerInfo } = this.props;
    return (
      <>
        <View style={[styles.whiteBg, styles.mt30, styles.mb30]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <Image source={IMAGE_CONSTANT.carrierTruck} />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('shipment.communication.customer_info', { locale: languageCode })}
                </Text>
              </View>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="contain" />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />}
            </View>
          </TouchableOpacity>
          {expanded ? this.renderExpanded(languageCode, customerInfo) : null}
        </View>
        <ChatWidget />
      </>
    );
  }
}

// export default Communication;
const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  customerInfo: state.chat.customerInfo,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      // updateBankInstructions: PaymentAction.updateBankInstructions,
      // paymentRequestChange: PaymentAction.paymentRequestChange,
      // getTopLowestBid: driverAction.getTopLowestBid
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Communication);
