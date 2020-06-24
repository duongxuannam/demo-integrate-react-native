import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from '../../../common/Select';
import IMAGE_CONSTANT from '../../../../constants/images';
import I18n from '../../../../config/locales';
import styles from '../../style';
import { formatMetricsWithCommas, formatPrice } from '../../../../helpers/regex';
import { dateClientWithISOString } from '../../../../helpers/date.helper';
import { getDateString, computeTimeLeft } from '../../../../helpers/shipment.helper';
import ModalAcceptConfirm from '../modal/ModalAcceptConfirm';
import ModalAccept from '../modal/ModalAccept';
import ModalDeleteReason from '../modal/ModalDeleteReason';
import { EXPRIRED_TIME_LEFT, PAYMENT_METHOD, QUOTE_STATUS } from '../../../../constants/app';
import listingAction from '../../../../store/actions/listingAction';
import NavigationService from '../../../../helpers/NavigationService';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalActive: '',
      selected: null
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
          <Text style={[styles.smallSize, styles.grayText, styles.textCapitalize]}>
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

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  renderQuoteHighLight = (bidPrice, customerPrice, quoteDetail, languageCode) => {
    if (bidPrice === customerPrice) {
      return (
        <Text style={[styles.smallerSize, styles.defaultTextColor, styles.ml5]}>
          {I18n.t('quote.high_light.matched', { locale: languageCode })}
        </Text>
      );
    }
    if (bidPrice > customerPrice) {
      return (
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Image source={IMAGE_CONSTANT.arrowUpGray} style={{ width: 12, height: 12 }} resizeMode="contain" />
          <Text style={[styles.smallerSize, styles.defaultTextColor, styles.ml5]}>
            {quoteDetail.advanceItem.currency}
            {' '}
            {I18n.t('quote.high_light.more_than', {
              n: formatPrice(Math.abs(bidPrice - customerPrice)),
              locale: languageCode,
            })}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.flex, styles.alignItemsCenter]}>
        <Image source={IMAGE_CONSTANT.arrowDownGray} style={{ width: 12, height: 12 }} resizeMode="contain" />
        <Text style={[styles.smallerSize, styles.defaultTextColor, styles.ml5]}>
          {quoteDetail.advanceItem.currency}
          {' '}
          {I18n.t('quote.high_light.less_than', {
            n: formatPrice(Math.abs(bidPrice - customerPrice)),
            locale: languageCode,
          })}
        </Text>
      </View>
    );
  }

  renderPickupHighLight = (pickupProposed, customerPickup) => {
    const { countryCode, languageCode } = this.props;
    const datePickupProposed = moment(pickupProposed).format('DD-MMM-YY');
    const dateCustomerPickup = moment(customerPickup).format('DD-MMM-YY');
    const datePickupProposedUtc = moment(datePickupProposed).utc().toISOString();
    const dateCustomerPickupUtc = moment(dateCustomerPickup).utc().toISOString();
    if (moment(datePickupProposedUtc).diff(dateCustomerPickupUtc, 'd') !== 0) {
      return (
        <Text style={styles.redText}>
          {getDateString(pickupProposed, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM-YY' : 'DD-MMM-YY')}
        </Text>
      );
    }
    return (
      <Text style={styles.darkGreenText}>
        {getDateString(pickupProposed, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM-YY' : 'DD-MMM-YY')}
      </Text>
    );
  }

  getFinalCustomerDelivery = (destinations) => {
    const destinationsDate = destinations.map((destination) => moment(`${destination.latestByDate.endsWith('Z') ? destination.latestByDate : `${destination.latestByDate}Z`}`));
    const maxDate = moment.max(destinationsDate);
    return moment(maxDate).utc().toISOString();
  }

  getFinalDriverDeliveries = (deliveries) => {
    const deliveiesDate = deliveries.map((delivery) => moment(`${delivery.proposedDate.endsWith('Z') ? delivery.proposedDate : `${delivery.proposedDate}Z`}`));
    const maxDate = moment.max(deliveiesDate);
    return moment(maxDate).utc().toISOString();
  }

  renderFinalDeliveryHighLight = (destinations, deliveries) => {
    const { countryCode, languageCode } = this.props;
    const finalCustomerDelivery = this.getFinalCustomerDelivery(destinations);
    const finalDriverDelivery = this.getFinalDriverDeliveries(deliveries);
    const dateFinalCustomerDelivery = moment(finalCustomerDelivery).format('DD-MMM-YY');
    const dateFinalDeliveryDate = moment(finalDriverDelivery).format('DD-MMM-YY');
    const dateFinalCustomerDeliverydUtc = moment(dateFinalCustomerDelivery).utc().toISOString();
    const dateFinalDeliveryDateUtc = moment(dateFinalDeliveryDate).utc().toISOString();
    if (moment(dateFinalDeliveryDateUtc).diff(dateFinalCustomerDeliverydUtc, 'd') !== 0) {
      return (
        <Text style={styles.redText}>
          {getDateString(finalDriverDelivery, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM-YY' : 'DD-MMM-YY')}
        </Text>
      );
    }
    return (
      <Text style={styles.darkGreenText}>
        {getDateString(finalDriverDelivery, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM-YY' : 'DD-MMM-YY')}
      </Text>
    );
  }

  onSeeTransitTimes = () => {
    const { onClickSeeTransitTimes } = this.props;
    onClickSeeTransitTimes();
  }

  renderPaymentMethod = () => {
    const { accountSelect, languageCode } = this.props;
    const res = [];
    if (accountSelect.type === 'PERSONAL') {
      res.push(
        { value: PAYMENT_METHOD.CASH, name: I18n.t('quote.cash', { locale: languageCode }) },
        { value: PAYMENT_METHOD.BANK_TRANSFER, name: I18n.t('quote.bank_transfer', { locale: languageCode }) },
      );
    } else {
      res.push(
        { value: PAYMENT_METHOD.BUSINESS_PROGRAM_INVOICE, name: I18n.t('quote.bp', { locale: languageCode }) },
        { value: PAYMENT_METHOD.BANK_TRANSFER, name: I18n.t('quote.bank_transfer', { locale: languageCode }) },
        { value: PAYMENT_METHOD.CASH, name: I18n.t('quote.cash', { locale: languageCode }) },
      );
    }
    return res;
  }

  onAcceptedQuote = () => {
    const { actions, source, shipmentDetail } = this.props;
    const { selected } = this.state;
    const valid = this.validateAcceptBid();
    if (valid === true) {
      actions.acceptQuote(source.id, shipmentDetail.id, selected.value, (res, error) => {
        if (res) {
          this.setState({
            modalActive: 'confirm'
          });
        } else {
          Alert.alert(
            'Notice',
            error,
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
    } else {
      const msg = valid.map((item) => item.message).join(',');
      Alert.alert(
        'Notice',
        msg,
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
  }

  onCloseModal = (accepted) => {
    const { actions } = this.props;
    this.setState({
      modalActive: false,
    });
    if (accepted) {
      NavigationService.navigate('ManagementShipmentStack');
      const {
        tabFilter,
        fromDate,
        toDate,
        textFilter,
      } = this.props;
      const query = {
        Query: {
          TabFilter: tabFilter,
          FromDate: fromDate,
          ToDate: toDate,
          TextFilter: textFilter
        },
        Limit: 10,
        Page: 1
      };
      setTimeout(() => {
        actions.getListShipments(query);
      }, 100)
    }
  }

  renderModal = () => {
    const { modalActive, selected } = this.state;
    const {
      source,
      index,
      quoteDetail,
      reasonsRejectQuote,
      actions,
      navigation,
      countDown,
      configs,
      shipmentDetail,
      languageCode,
    } = this.props;
    switch (modalActive) {
      case 'confirm':
        return (
          <ModalAcceptConfirm
            onCloseModal={this.onCloseModal}
            source={source}
            index={index}
            quoteDetail={quoteDetail}
            selected={selected}
            languageCode={languageCode}
            countDown={countDown}
          />
        );
      case 'accept':
        return (
          <ModalAccept
            onCloseModal={this.onCloseModal}
            source={source}
            index={index}
            quoteDetail={quoteDetail}
            selected={selected}
            languageCode={languageCode}
            acceptedQuote={this.onAcceptedQuote}
            configs={configs}
          />
        );
      default:
        return (
          <ModalDeleteReason
            onCloseModal={this.onCloseModal}
            actions={actions}
            shipmentId={shipmentDetail.id}
            source={source}
            languageCode={languageCode}
            reasonsRejectQuote={reasonsRejectQuote}
            navigation={navigation}
          />
        );
    }
  }

  validateAcceptBid = () => {
    const { selected } = this.state;
    const { shipmentDetail, configs } = this.props;
    const timeLeft = computeTimeLeft(shipmentDetail.shipmentDetail.changedStatusDate, configs.ExprireTime);
    const errors = [];
    if (selected && timeLeft !== EXPRIRED_TIME_LEFT) {
      return true;
    }

    if (!selected) {
      errors.push({
        type: 'payment',
        message: 'Please choose payment'
      });
    }
    if (timeLeft === EXPRIRED_TIME_LEFT) {
      errors.push({
        type: 'expired',
        message: 'The bid is expired. Please contact admin to be support!'
      });
    }
    return errors;
  }

  onAccept = () => {
    const valid = this.validateAcceptBid();
    if (valid === true) {
      this.setState({
        modalActive: 'accept'
      });
    } else {
      const msg = valid.map((item) => item.message).join(',');
      Alert.alert(
        'Notice',
        msg,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    }
  }

  onDecline = () => {
    const { shipmentDetail, configs } = this.props;
    const timeLeft = computeTimeLeft(shipmentDetail.shipmentDetail.changedStatusDate, configs.ExprireTime);
    if (timeLeft !== EXPRIRED_TIME_LEFT) {
      this.setState({
        modalActive: 'decline'
      });
    } else {
      Alert.alert(
        'Notice',
        'Listing Expired',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { source, shipmentDetail, quoteDetail, languageCode, configs } = this.props;
    const { modalActive, selected } = this.state;
    return (
      <>
        <View style={[styles.marginHorizontal20, styles.line]} />
        <View style={[styles.marginHorizontal20, styles.mt30, styles.mb20]}>
          {Price.renderList(`${I18n.t('quote.quote', { locale: languageCode })}:`, `${quoteDetail.advanceItem.currency} ${formatMetricsWithCommas(source.price)}`)}
          {Price.renderList(`${I18n.t('quote.commission', { locale: languageCode })}:`, source.commission || I18n.t('quote.free', { locale: languageCode }))}
          <View style={[styles.lineSilver, styles.mt15, styles.mb15]} />
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.mr15, { flex: 2 }]}>
              <Text style={[styles.smallSize, styles.grayText, styles.textCapitalize]}>
                {I18n.t('quote.total', { locale: languageCode })}
                :
              </Text>
            </View>
            <View style={{ flex: 4 }}>
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
                {quoteDetail.advanceItem.currency}
                {' '}
                <Text style={styles.fs23}>{formatMetricsWithCommas(source.price + (source.comissionPrice || 0))}</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.flex, styles.mt10]}>
            <View style={styles.flexOne} />
            <View style={[styles.flex, styles.alignItemsCenter, {
              borderRadius: 4,
              backgroundColor: 'rgba(81, 175, 43, 0.1)',
              paddingVertical: 4,
              paddingHorizontal: 10,
            }]}
            >
              {this.renderQuoteHighLight(source.price, shipmentDetail.shipmentDetail.customerPrice, quoteDetail, languageCode)}
            </View>
            <View style={styles.flexOne} />
          </View>
          <View style={[styles.lineSilver, styles.mt15, styles.mb15]} />
          {Price.renderList(`${I18n.t('quote.pickup', { locale: languageCode })}:`, this.renderPickupHighLight(dateClientWithISOString(source.pickUpProposedDate),
            dateClientWithISOString(shipmentDetail.addresses.pickup.pickupDate)))}
          {Price.renderList(`${I18n.t('quote.final_delivery', { locale: languageCode })}:`, this.renderFinalDeliveryHighLight(shipmentDetail.addresses.destinations,
            source.deliveries))}
          <View style={[styles.flex, styles.mb10]}>
            <View style={[styles.mr15, { flex: 2 }]} />
            <View style={{ flex: 4 }}>
              <Text style={[styles.defaultSize, styles.mainColorText, styles.bold, styles.textCapitalize]} onPress={this.onSeeTransitTimes}>
                {I18n.t('quote.see_transit_time', { locale: languageCode })}
              </Text>
            </View>
          </View>
          <View style={styles.mt20}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
              {I18n.t('quote.payment_method', { locale: languageCode })}
            </Text>
            <View style={{ flex: 2 }}>
              <Select
                placeholder={I18n.t('quote.placeholder_payment', { locale: languageCode })}
                source={this.renderPaymentMethod()}
                selectedValue={selected}
                disabled={source.status === QUOTE_STATUS.REJECTED}
                onValueChange={(e) => this.setState({ selected: e })}
                whiteBg
              />
            </View>
          </View>
          <View style={[styles.mt30, styles.mb20, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter]}
              activeOpacity={0.9}
              disabled={source.status === QUOTE_STATUS.REJECTED}
              onPress={this.onAccept}
            >
              <Text style={[styles.formGroupButton, source.status === QUOTE_STATUS.REJECTED ? { backgroundColor: 'gray' } : styles.darkGreenBg, styles.textCapitalize]}>
                {I18n.t('quote.accept', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[Platform.OS === 'ios' && { zIndex: -1 }]}>
            <TouchableOpacity
              activeOpacity={1}
              disabled={source.status === QUOTE_STATUS.REJECTED}
              onPress={this.onDecline}
            >
              <View style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <Text style={[styles.defaultSize, source.status === QUOTE_STATUS.REJECTED ? styles.grayText : styles.mainColorText, styles.bold, styles.mr5, styles.textCapitalize]}>
                  {I18n.t('quote.decline', { locale: languageCode })}
                </Text>
                {source.status === QUOTE_STATUS.REJECTED ? (
                  <Image source={IMAGE_CONSTANT.arrowDownGray} />
                ) : <Image source={IMAGE_CONSTANT.arrowDownGreen} />}
              </View>
            </TouchableOpacity>
          </View>
          <View style={[styles.mt30, styles.mb20]}>
            <Text style={[styles.defaultSize, styles.grayText, styles.textCenter]}>
              {I18n.t('quote.terms_booking_quote_1', { locale: languageCode })}
              <Text style={[styles.mainColorText, styles.bold]} onPress={() => this.openWebBrowser(configs.TermConditionsURL)}>
                {` ${I18n.t('quote.terms_booking_quote_2', { locale: languageCode })} `}
              </Text>
              {I18n.t('quote.and', { locale: languageCode })}
              <Text style={[styles.mainColorText, styles.bold]} onPress={() => this.openWebBrowser(configs.UserAgreementURL)}>
                {` ${I18n.t('quote.terms_booking_quote_3', { locale: languageCode })} `}
              </Text>
            </Text>
          </View>
        </View>
        {modalActive ? this.renderModal() : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  tabFilter: state.listing.tabFilter,
  fromDate: state.listing.fromDate,
  toDate: state.listing.toDate,
  textFilter: state.listing.textFilter,
  page: state.listing.page,
  limit: state.listing.limit,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction },
    dispatch,
  ),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Price);
