import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import UrlImage from '../../common/Image';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';
import I18n from '../../../config/locales';
import { formatMetricsWithCommas } from '../../../helpers/regex';
import { roundDecimalToMatch, getDateString, getTransportTypeName } from '../../../helpers/shipment.helper';
import { dateClientWithFormat, lessThanHourAgo } from '../../../helpers/date.helper';
import BoxImageDefault from '../../common/BoxImageDefault';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  static renderBox(title, value) {
    return (
      <View style={[
        styles.flex,
        styles.alignItemsCenter,
        styles.mt10,
        {
          borderRadius: 2,
          backgroundColor: 'rgba(245, 245, 245, 1)',
          borderWidth: 1,
          borderColor: 'rgba(233, 236, 239, 1)',
          paddingVertical: 10,
          paddingHorizontal: 20,
        }
      ]}
      >
        <Text style={[styles.smallerSize, styles.defaultTextColor]}>{title}</Text>
        <Text style={[styles.flexOne, styles.textRight, styles.boxSize, styles.bold]}>{value}</Text>
      </View>
    );
  }

  static renderList(title, value) {
    return (
      <View style={[styles.flex, styles.mb10]}>
        <View style={[styles.mr15, { flex: 2 }]}>
          <Text style={[styles.smallSize, styles.grayText]}>
            {title}
          </Text>
        </View>
        <View style={{ flex: 4 }}>
          <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
            {value}
          </Text>
        </View>
      </View>
    );
  }

  static renderExpanded({
    submitted, pickupDated, transit, mode, bidsWon, languageCode, countryCode
  }) {
    const days = `${I18n.t('shipment.detail.days', { locale: languageCode })}`;
    const day = `${I18n.t('shipment.detail.day', { locale: languageCode })}`;
    return (
      <>
        <View style={[styles.marginHorizontal20, {
          height: 1,
          backgroundColor: 'rgba(219, 219, 219, 1)',
        }]}
        />
        <View style={[styles.marginHorizontal20, styles.mt30, styles.mb20]}>
          {List.renderList('Submitted:', `${dateClientWithFormat(submitted, 'hh:mm a')}, ${getDateString(pickupDated, countryCode, languageCode)}`)}
          {List.renderList('Pickup:', getDateString(pickupDated, countryCode, languageCode))}
          {List.renderList('Transit:', `${transit} ${transit > 1 ? days : day}`)}
          {List.renderList('Mode:', `${mode === undefined ? 'Trucking' : mode}`)}
          {List.renderBox('Bids won', `${bidsWon} %`)}
        </View>
      </>
    );
  }

  loadPrice = (price, currency) => {
    const formatPrice = roundDecimalToMatch(price, 2);
    return `${currency} ${formatMetricsWithCommas(formatPrice)}`;
  }

  render() {
    const { expanded } = this.state;
    const {
      source, languageCode, index, currency, countryCode,
      transportMode,
      transportDefault
    } = this.props;
    const statusNew = lessThanHourAgo(source.submittedDate, 1);
    return (
      <View style={[styles.mt30]}>
        <View style={[styles.whiteBg, styles.formLine, styles.mb30]}>
          <View style={[styles.flex, { marginTop: -31 }]}>
            <Text style={[styles.formHeader, styles.defaultTextColor, styles.defaultSize, styles.bold]}>
              {`${I18n.t('shipment.detail.quotes', { locale: languageCode })} ${index + 1} `}
            </Text>
            <View style={styles.flexOne} />
          </View>
          <View style={[styles.flex, styles.mt30, styles.mb30, styles.marginHorizontal20]}>
            {
              source.avatarSquare === null ? (<View style={{ padding: 20, backgroundColor: 'rgba(81, 175, 43, 1)' }}><BoxImageDefault width={60} height={60} /></View>) : (
                <UrlImage
                  sizeWidth={88}
                  sizeHeight={88}
                  sizeBorderRadius={4}
                  source={source.avatarSquare}
                />
              )
            }
            <View style={[styles.flexOne, styles.ml10]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {source.name === null ? `Shipper #${index + 1}` : source.name }
              </Text>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                <Image source={IMAGE_CONSTANT.certificate} />
                <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                  Certificate of Excellence
                </Text>
              </View>
              {/* {render Rating but I need confirm with team} */}
            </View>
          </View>

          <View style={styles.line} />
          <View style={[styles.marginHorizontal20, styles.mt15, styles.mb15]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
            >
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                    <Text style={[styles.boxSize, styles.bold]}>{this.loadPrice(source.price, currency)}</Text>
                  </Text>
                  {source.isLowestPrice ? (
                    <Text style={[styles.ml10, styles.whiteText, styles.greenBg, styles.quoteStatus, styles.bold]}>
                      {I18n.t('shipment.lowest_1', { locale: languageCode })}
                    </Text>
                  ) : null}
                  {statusNew ? (
                    <Text style={[styles.ml10, styles.whiteText, styles.greenBg, styles.quoteStatus, styles.bold]}>
                      {I18n.t('shipment.detail.new', { locale: languageCode })}
                    </Text>
                  ) : null}
                </View>
                {expanded
                  ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="center" />
                  : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="center" />}
              </View>
            </TouchableOpacity>
          </View>
          {expanded ? List.renderExpanded({
            submitted: source.submittedDate,
            pickupDated: source.pickUpProposedDate,
            transit: roundDecimalToMatch(source.totalTransitTime, 0),
            mode: getTransportTypeName(transportDefault, transportMode),
            bidsWon: source.bidWon,
            languageCode,
            countryCode,
          }) : null}
        </View>
      </View>
    );
  }
}

List.defaultProps = {
  languageCode: 'en',
};

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  currentShipmentID: state.driver.shipmentExpandedId,
  transportDefault: state.shipment.defaultTransportTypes
});

export default connect(
  mapStateToProps,
  null,
)(List);
