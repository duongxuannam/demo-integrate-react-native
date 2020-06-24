import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import I18n from '../../../config/locales';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';
import AdditionalServiceBid from './addtionalPlaceBid';
import TransitTimeAndPrice from './transitTimeAndPrice';
import { formatMetricsWithCommas } from '../../../helpers/regex';
import { roundDecimalToMatch } from '../../../helpers/shipment.helper';
import { dateClientWithFormat } from '../../../helpers/date.helper';

class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setTargetPrice: false,
      yourBidPrice: '',
      errorBidInput: false
    };
  }

  getAdditionalServiceRef = (ref) => { this.additionalServiceRef = ref; }

  getTransitTimeAndPriceRef = (ref) => { this.transitTimeRef = ref; }

  renderBox = (title, value) => (
    <View style={[
      styles.flex,
      styles.alignItemsCenter,
      styles.mt10,
      {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 1)',
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

  changeYourBidPrice = (text) => {
    const newPrice = text.replace(/,/g, '');
    this.setState({ yourBidPrice: newPrice, errorBidInput: false });
  }

  getDataRender = (shipmentDetail) => {
    const { items, addresses } = shipmentDetail;
    const totalBids = shipmentDetail.shipmentDetail.totalQuotes;
    // TODO: Generate String from Quote data
    const lowestBid = `${shipmentDetail.shipmentDetail.customerCurrency} ${totalBids > 0 ? formatMetricsWithCommas(shipmentDetail.shipmentDetail.lowestPrice) : 0}`;
    const averageBid = `${shipmentDetail.shipmentDetail.customerCurrency} ${totalBids > 0 ? formatMetricsWithCommas(shipmentDetail.shipmentDetail.averagePrice) : 0}`;

    return {
      totalBids,
      lowestBid,
      averageBid,
      listItem: items,
      listAddress: [addresses.pickup, ...addresses.destinations],
      customerCurrency: shipmentDetail.shipmentDetail.customerCurrency,
      customerPrice: shipmentDetail.shipmentDetail.customerPrice
    };
  }

  renderAllAdditionalService = (listItem) => {
    return (
      <AdditionalServiceBid ref={this.getAdditionalServiceRef} listItem={listItem} />
    );
  }

  checkHealthCheckData = (additionalPlaceBidData, transitTimeAndPriceData, bidPrice, targetPrice) => {
    const { shipmentDetail } = this.props;
    const healthCheckData = {
      additionalPlaceBidData: null,
      transitData: null,
      bidPrice,
      targetPrice,
      customerCurrency: shipmentDetail.shipmentDetail.customerCurrency,
      shipmentTitle: shipmentDetail.title,
      totalWeight: shipmentDetail.itemsDetail.totalWeight,
      totalUnits: shipmentDetail.itemsDetail.items.length,
      pickupAddress: shipmentDetail.addresses.pickup,
      lastDestination: shipmentDetail.addresses.destinations[shipmentDetail.addresses.destinations.length - 1],
      listAddress: [{ ...shipmentDetail.addresses.pickup }, ...shipmentDetail.addresses.destinations],
      shipmentId: shipmentDetail.id,
      isShipmentBP: shipmentDetail.isCreateByBP,
    };
    if (Array.isArray(additionalPlaceBidData) && additionalPlaceBidData.length > 0
      && additionalPlaceBidData.filter((a) => a.isAgreed === false).length > 0) {
      // check additional Place bid
      healthCheckData.additionalPlaceBidData = additionalPlaceBidData;
    } else {
      healthCheckData.additionalPlaceBidData = null;
    }


    if (Array.isArray(transitTimeAndPriceData) && transitTimeAndPriceData.length > 0) {
      // check transit time
      const lisDif = [];
      transitTimeAndPriceData.forEach((t, index) => {
        if (index === 0) {
          if ((dateClientWithFormat(t.pickupDate, 'D-MMM') !== dateClientWithFormat(t.proposedDate, 'D-MMM')) || (t.locationServices.filter((l) => l.isAgreed === false).length > 0)) {
            lisDif.push(t);
          } else {
            lisDif.push(null);
          }
        } else {
          const proposedDate = moment(dateClientWithFormat(t.proposedDate, 'D-MMM'), 'D-MMM');
          const earliestDate = moment(dateClientWithFormat(t.earliestByDate, 'D-MMM'), 'D-MMM');
          const latestDate = moment(dateClientWithFormat(t.latestByDate, 'D-MMM'), 'D-MMM');

          if (proposedDate < earliestDate || proposedDate > latestDate || (t.locationServices.filter((l) => l.isAgreed === false).length > 0)) {
            lisDif.push(t);
          }
        }
      });
      healthCheckData.transitData = lisDif;
    } else {
      healthCheckData.transitData = null;
    }
    console.log('DATA: ', healthCheckData);

    return healthCheckData;
  }

  handleBigPrice = () => {
    const additionalPlaceBid = (this.additionalServiceRef && this.additionalServiceRef.getDataResult()) || null;
    console.log('Additional Place Bid Data: ', additionalPlaceBid);

    const transitTimeAndPrice = (this.transitTimeRef && this.transitTimeRef.getDataResult()) || null;
    console.log('Transit time And Price Data: ', transitTimeAndPrice);

    const { yourBidPrice, setTargetPrice } = this.state;
    const { shipmentDetail } = this.props;
    const bidPrice = setTargetPrice ? yourBidPrice : shipmentDetail.shipmentDetail.customerPrice;
    let isValid = true;
    let message = '';
    if (!additionalPlaceBid.status) {
      isValid = false;
      message += '- Please confirm all additional services item.\n';
    }

    if (!transitTimeAndPrice.status) {
      isValid = false;
      message += '- Please confirm all location services item.\n';
    }

    const pickupDate = moment(dateClientWithFormat(transitTimeAndPrice.data[0].proposedDate, 'D-MMM'), 'D-MMM');
    const isValidDate = transitTimeAndPrice.data.filter((d, index) => {
      if (index > 0) {
        const destinationDate = moment(dateClientWithFormat(d.proposedDate, 'D-MMM'), 'D-MMM');
        return pickupDate.diff(destinationDate, 'day') >= 0;
      }

      return false;
    }).length <= 0;

    if (!isValidDate) {
      isValid = false;
      message += '- Pickup date must smaller than destination date';
    }

    if (!bidPrice) {
      isValid = false;
      message += '- Please input your bid price.\n';
    }

    if (isValid) {
      console.log('Valid: ', isValid);
      const { healthCheck, languageCode } = this.props;
      const isHealthCheck = this.checkHealthCheckData(additionalPlaceBid.data, transitTimeAndPrice.data, bidPrice, shipmentDetail.shipmentDetail.customerPrice);
      healthCheck(isHealthCheck, languageCode);
    } else {
      Alert.alert('Error', message);
      this.setState({ errorBidInput: true });
    }
  }

  renderTransitTimeAndPrice = (listAddress) => (<TransitTimeAndPrice ref={this.getTransitTimeAndPriceRef} listAddress={[...listAddress]} />);

  getDiffPercentValue = (target, yourbid) => {
    if (!yourbid || yourbid === 0) {
      return 0;
    }
    return Math.abs(100 - ((yourbid / target) * 100));
  }

  render() {
    const { setTargetPrice, yourBidPrice, errorBidInput } = this.state;
    const { shipmentDetail, languageCode } = this.props;
    const {
      totalBids,
      lowestBid,
      averageBid,
      listItem,
      listAddress,
      customerCurrency,
      customerPrice,
    } = this.getDataRender(shipmentDetail);
    const costDiff = this.getDiffPercentValue(customerPrice, yourBidPrice);
    return (
      <>
        <View style={[styles.yellowBg, styles.pad20]}>
          <Text style={[styles.notificationSize, styles.defaultColor, styles.medium]}>
            {I18n.t('shipment.place.title', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.mt20}>
          <View style={styles.formLineBg}>
            <View style={[styles.marginHorizontal20, styles.mt20, styles.mb30]}>
              {this.renderBox(I18n.t('bid.totalBids', { locale: languageCode }), totalBids)}
              {this.renderBox(I18n.t('bid.lowestBid', { locale: languageCode }), lowestBid)}
              {this.renderBox(I18n.t('bid.averageBid', { locale: languageCode }), averageBid)}
            </View>
          </View>
          {this.renderAllAdditionalService(listItem)}
          {this.renderTransitTimeAndPrice(listAddress)}
          {setTargetPrice
            ? (
              <View style={[styles.whiteBg, styles.formLine, styles.paddingVertical20, styles.mb30]}>
                <View style={[styles.marginHorizontal20, styles.mt10]}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {I18n.t('bid.bidInstruction', { locale: languageCode })}
                  </Text>
                  <View style={[styles.mt30, styles.mb20]}>
                    <View style={[styles.relative, errorBidInput ? { borderWidth: 1, borderColor: 'rgba(244, 67, 54, 1)', overflow: 'hidden', borderRadius: 4 } : { overflow: 'hidden' }]}>
                      <View style={[styles.inputIcon, styles.inputIconLeft, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, styles.buttonActionSilver, { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]}>
                        <Text style={[styles.defaultSize, styles.defaultTextColor]}>{customerCurrency}</Text>
                      </View>
                      <TextInput
                        style={[styles.input, styles.inputIconPadding]}
                        placeholder={I18n.t('bid.enterAmount', { locale: languageCode })}
                        value={formatMetricsWithCommas(yourBidPrice)}
                        onChangeText={this.changeYourBidPrice}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  {
                    costDiff > 10 && (
                      <View style={[styles.formLineBg, styles.flex, styles.alignItemsCenter, { paddingHorizontal: 10, paddingVertical: 7 }]}>
                        <Image source={IMAGE_CONSTANT.errorIcon} />
                        <Text style={[styles.ml5, styles.smallSize, styles.defaultTextColor, styles.bold]}>
                          {String(I18n.t(yourBidPrice > (customerPrice * 1.1) ? 'bid.warningBidHigher' : 'bid.warningBidLower', { locale: languageCode })).replace('[value]', roundDecimalToMatch(costDiff, 0))}
                        </Text>
                      </View>
                    )
                  }
                </View>
                <View style={[styles.formLine, { marginVertical: 30, paddingHorizontal: 20, paddingVertical: 15 }]}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.handleBigPrice}
                  >
                    <Text style={[[styles.formGroupButton]]}>
                      {I18n.t('bid.placeYourBid', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.setState({
                    setTargetPrice: false
                  })}
                >
                  <Text style={[styles.defaultSize, styles.mainColorText, styles.textCenter, styles.bold, styles.mb10]}>
                    {I18n.t('bid.checkTargetPrice', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              </View>
            )
            : (
              <View style={[styles.whiteBg, styles.formLine, styles.paddingVertical20, styles.mb30]}>
                <View style={[styles.marginHorizontal20, styles.mt10, styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.rewardCup} />
                  <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml5]}>
                    {I18n.t('bid.instruction', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30, styles.flex, styles.alignItemsCenter]}>
                  <View style={[styles.flexOne, styles.mr5]}>
                    <Text style={[styles.font27, styles.bold]} adjustsFontSizeToFit={customerPrice * 0.0000001 > 1} numberOfLines={1}>
                      <Text style={[styles.smallSize, styles.defaultTextColor]}>{customerCurrency}</Text>
                      {' '}
                      {formatMetricsWithCommas(customerPrice)}
                    </Text>
                  </View>
                  <View style={[styles.flexOne, styles.ml5, { backgroundColor: 'blue' }]}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={this.handleBigPrice}
                    >
                      <Text style={[styles.formGroupButton, { lineHeight: 60 }]}>
                        {I18n.t('bid.bidTargetPrice', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.setState({
                    setTargetPrice: true
                  })}
                >
                  <Text style={[styles.defaultSize, styles.mainColorText, styles.textCenter, styles.bold, styles.mb10]}>
                    {I18n.t('bid.manualBidLabel', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  shipmentDetail: state.shipment.shipmentDetail,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {},
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Place);
