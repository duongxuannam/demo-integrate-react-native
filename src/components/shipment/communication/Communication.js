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
import UrlImage from '../../common/Image';
import ChatWidget from '../chat/ChatWidget';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import { getDateString, HideDriverInfoCommunication } from '../../../helpers/shipment.helper';
import { getFormatDate } from '../../../helpers/date.helper';

// CSS
import styles from '../style';
import I18n from '../../../config/locales';
import { DATE_TIME_FORMAT } from '../../../constants/app';

const COMMUNICATION_ICON_FLAG = {
  ADDRESS: 'address',
  PHONE: 'phone',
  EMAIL: 'email'
};

class Communication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      expandedContact: false,
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

  static renderList(title, iconType) {
    let icon;
    switch (iconType) {
      case COMMUNICATION_ICON_FLAG.ADDRESS:
        icon = IMAGE_CONSTANT.address;
        break;
      case COMMUNICATION_ICON_FLAG.PHONE:
        icon = IMAGE_CONSTANT.phone;
        break;
      default:
        icon = IMAGE_CONSTANT.email;
        break;
    }
    return (
      <View style={[
        styles.flex,
        styles.alignItemsCenter,
        styles.mt15,
        {
          borderRadius: 2,
          backgroundColor: 'rgba(245, 245, 245, 1)',
          borderWidth: 1,
          borderColor: 'rgba(233, 236, 239, 1)',
          paddingVertical: 15,
          paddingHorizontal: 12,
        }
      ]}
      >
        <Image source={icon} />
        <Text style={[styles.smallSize, styles.defaultTextColor, styles.flexOne, styles.ml10, styles.mr10]}>
          {title}
        </Text>
        <Image source={IMAGE_CONSTANT.arrowRight} />
      </View>
    );
  }

  renderExpanded() {
    const { expandedContact } = this.state;
    const {
      driverInfo, bookedDate, countryCode, languageCode,
    } = this.props;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.lineSilver]} />
        <View style={[styles.paddingVertical30, styles.paddingHorizontal20]}>
          <View style={[styles.flex, styles.alignItemsStart]}>
            {(driverInfo.avatarSquare && <Image source={{ uri: driverInfo.avatarSquare }} style={{ width: 88, height: 88, borderRadius: 4 }} />) || (
              <Image source={IMAGE_CONSTANT.imageDefault} style={{ width: 88, height: 88, borderRadius: 4 }} />
            )}
            <View style={[styles.flexOne, styles.ml10]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {driverInfo.name}
              </Text>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                <Image source={IMAGE_CONSTANT.certificate} />
                <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                  Certificate of Excellence
                </Text>
              </View>
              {/* {render Rating but I need confirm with team} */}
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <View style={[styles.rating, styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.star} />
                  <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, styles.ml5]}>
                    {driverInfo.rating}
                  </Text>
                </View>
                <Text style={[styles.flexOne, styles.smallSize, styles.grayText, styles.bold, styles.ml10]}>
                  {driverInfo.ratingCount}
                  {' '}
                  {driverInfo.ratingCount > 1 ? I18n.t('quote.ratings', { locale: languageCode })
                    : I18n.t('quote.rating', { locale: languageCode })}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.paddingVertical20}>
            {bookedDate && Communication.renderRow(`${I18n.t('communication.selected', { locale: languageCode })}:`, getDateString(bookedDate, countryCode, languageCode, getFormatDate(countryCode, languageCode)), false)}
            {Communication.renderRow(`${I18n.t('communication.contact', { locale: languageCode })}:`, driverInfo.name || '', true)}
          </View>
          <View style={[
            // styles.mt30,
            {
              borderRadius: 2,
              backgroundColor: 'rgba(245, 245, 245, 1)',
              borderWidth: 1,
              borderColor: 'rgba(233, 236, 239, 1)',
              paddingHorizontal: 20,
            }
          ]}
          >
            {Communication.renderBox(`${I18n.t('communication.bid_won', { locale: languageCode })}:`, `${driverInfo.bidWon}%`)}
          </View>
          {Communication.renderList(driverInfo.address || I18n.t('communication.none', { locale: languageCode }), COMMUNICATION_ICON_FLAG.ADDRESS)}
          {Communication.renderList(driverInfo.phone, COMMUNICATION_ICON_FLAG.PHONE)}
          {Communication.renderList(driverInfo.email, COMMUNICATION_ICON_FLAG.EMAIL)}
          {expandedContact && (
            <View style={styles.mt30}>
              {Communication.renderRow(`${I18n.t('communication.established', { locale: languageCode })}:`, '2009', false)}
              {Communication.renderRow(`${I18n.t('communication.summary', { locale: languageCode })}:`, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', false)}
              {Communication.renderRow(`${I18n.t('communication.fleet_size', { locale: languageCode })}:`, '32', false)}
              {Communication.renderRow(`${I18n.t('communication.vehicle_types', { locale: languageCode })}:`, 'Flatbed (3), Long Haul Trucks (8), Express Trucks (21)', false)}
              {Communication.renderRow(`${I18n.t('communication.headquarters', { locale: languageCode })}:`, 'Manila, Philippines', true)}
              <View style={[
                styles.mt30,
                {
                  borderRadius: 2,
                  backgroundColor: 'rgba(245, 245, 245, 1)',
                  borderWidth: 1,
                  borderColor: 'rgba(233, 236, 239, 1)',
                  paddingHorizontal: 20,
                }
              ]}
              >
                {/* {Communication.renderBox(I18n.t('communication.bid_won', { locale: languageCode }), `${driverInfo.bidWon}%`)} */}
                <View style={styles.lineSilver} />
                {Communication.renderBox(I18n.t('communication.on_deliveree', { locale: languageCode }), '3+ years')}
              </View>
            </View>
          )}
        </View>
        <View style={styles.lineSilver} />
        <TouchableOpacity
          activeOpacity={0.9}
          disabled
          onPress={() => this.setState((prevState) => ({ expandedContact: !prevState.expandedContact }))}
        >
          <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
            <Image source={IMAGE_CONSTANT.contactCard} />
            <Text style={[styles.ml10, styles.defaultSize, styles.mainColorText, styles.bold]}>
              {expandedContact ? I18n.t('communication.hide_profile', { locale: languageCode }) : I18n.t('communication.view_profile', { locale: languageCode })}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const { languageCode, shipmentStatus, driverInfo } = this.props;
    return (
      <>
        <View style={[styles.whiteBg, styles.mt30, styles.mb30]}>
          {!HideDriverInfoCommunication(shipmentStatus) && driverInfo && (
          <TouchableOpacity
            activeOpacity={1}
            // disabled={}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter]}>
                <Image source={IMAGE_CONSTANT.carrierTruck} />
                <Text style={[styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('communication.carrier', { locale: languageCode })}
                </Text>
              </View>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
          )}
          {expanded ? this.renderExpanded() : null}
        </View>
        <ChatWidget />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  driverInfo: state.listing.shipmentDetail.driver || null,
  bookedDate: state.listing.shipmentDetail.shipmentDetail.bookedDate || null,
  countryCode: state.app.countryCode || 'vn',
  languageCode: state.app.languageCode || 'en',
  shipmentStatus: state.listing.shipmentDetail.status || null,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {},
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Communication);
