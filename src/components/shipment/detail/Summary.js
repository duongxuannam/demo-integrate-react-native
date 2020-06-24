import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getExpiredString, getDateString, getTransportTypeName, isBookedShipment } from '../../../helpers/shipment.helper';
import {getFormatDate} from '../../../helpers/date.helper';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';
import { SHIPMENT_STATUS } from '../../../helpers/constant.helper';

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? 'hh:mm a, DD-MMM-YYYY' : 'hh:mm a, DD-[Th]MM-YYYY';
    }
    return 'hh:mm a, DD-MMM-YYYY';
  }

  renderSummary() {
    const {
      languageCode,
      shipmentDetail,
      countryCode,
      defaultTransportTypes,
    } = this.props;

    const listingEnd = shipmentDetail.shipmentDetail.changedStatusDate
      && getExpiredString(
        shipmentDetail.shipmentDetail.changedStatusDate,
        countryCode,
        languageCode,
        // this.getDateFormatByCountry(countryCode, languageCode),
        getFormatDate(countryCode, languageCode)
      );
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={styles.pad20}>
          {/* <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.customer', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {shipmentDetail.customerName || 'This is fake customer'}
              </Text>
            </View>
          </View> */}
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.listing_id', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                DL-LTL-{shipmentDetail.code}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.listing_started', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {/* {shipmentDetail.shipmentDetail.changedStatusDate && getDateString(shipmentDetail.shipmentDetail.changedStatusDate, countryCode, languageCode, this.getDateFormatByCountry(countryCode, languageCode))} */}
                {shipmentDetail.shipmentDetail.changedStatusDate && getDateString(shipmentDetail.shipmentDetail.changedStatusDate, countryCode, languageCode, getFormatDate(countryCode, languageCode))}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.listing_ends', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {listingEnd}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.quotes', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.smallSize, styles.bold]}>
                {shipmentDetail.shipmentDetail.totalQuotes || 0}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.items', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.smallSize, styles.bold]}>
                {shipmentDetail.items.length}
              </Text>
            </View>
          </View>
          {(isBookedShipment(shipmentDetail.status) || shipmentDetail.status === SHIPMENT_STATUS.CANCELLED) && (
            <View style={[styles.form, styles.flex, styles.mb20]}>
              <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                <Text style={[styles.grayText, styles.smallSize]}>
                  {I18N.t('shipment.summary.payment_method', { locale: languageCode })}
                  :
                </Text>
              </View>
              <View style={[styles.formRight, styles.flexOne]}>
                <Text style={[styles.smallSize, styles.bold]}>
                  Cash
                </Text>
              </View>
            </View>
          )}
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.requested_mode', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.smallSize, styles.bold]}>
                {getTransportTypeName(defaultTransportTypes, shipmentDetail.transportTypeId)}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={styles.whiteBg}>
        <View style={styles.pad20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Image source={require('../../../assets/images/group/docs.png')} />
              <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('shipment.summary.heading', { locale: languageCode })}
              </Text>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
        </View>
        {expanded ? this.renderSummary() : null}
      </View>
    );
  }
}

export default Summary;
