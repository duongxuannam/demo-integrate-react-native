import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import moment from 'moment';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';
import I18N from '../../../../config/locales';
import { getDateString, getLocationServicesName, getLocationService } from '../../../../helpers/shipment.helper';
import TransitItem from './TransitItem';
import { dateClientWithISOString } from '../../../../helpers/date.helper';
import UrlImage from '../../../common/Image';

class Transit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getIconUrl = (item, locationServicesDefault) => {
    const service = getLocationService(locationServicesDefault, item.id);
    if (item.isConfirmation) {
      return service.iconUrlActive;
    }
    return service.iconUrlInactive;
  }

  renderShipperProposedHighLight = (customerDate, proposedDate) => {
    const { countryCode, languageCode } = this.props;
    const dateProposed = moment(proposedDate).format('DD-MMM-YY');
    const dateCustomer = moment(customerDate).format('DD-MMM-YY');
    const dateProposedUtc = moment(dateProposed).utc().toISOString();
    const dateCustomerUtc = moment(dateCustomer).utc().toISOString();
    if (moment(dateProposedUtc).diff(dateCustomerUtc, 'd') !== 0) {
      return (
        <Text style={[styles.smallSize, styles.mainColorText, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.redText, styles.bold]}>
          {getDateString(proposedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
        </Text>
      );
    }
    return (
      <Text style={[styles.smallSize, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.mainColorText, styles.bold]}>
        {getDateString(proposedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
      </Text>
    );
  }

  render() {
    const {
      source,
      countryCode,
      languageCode,
      locationServicesDefault,
    } = this.props;
    return (
      <>
        <View style={[styles.marginHorizontal20, {
          height: 1,
          backgroundColor: 'rgba(219, 219, 219, 1)',
        }]}
        />
        <View>
          <View style={[styles.marginHorizontal20, styles.mt20]}>
            <View style={styles.flex}>
              <View style={styles.relative}>
                <Image source={IMAGE_CONSTANT.pinBlueCircle} />
                <Text style={[styles.whiteText, styles.smallSize, styles.pin, styles.bold]}>
                  FR
                </Text>
              </View>
              <View style={[styles.flexOne, styles.ml10, { marginTop: 6 }]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mb15, styles.bold]}>
                  {source.pickup.address}
                </Text>
                <View style={[styles.mb10, styles.flex, styles.alignItemsCenter]}>
                  <Text style={[styles.smallSize, styles.defaultTextColor, languageCode === 'vi' ? styles.w100 : styles.w140]}>
                    {I18N.t('quote.requested', { locale: languageCode })}
                  </Text>
                  <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>
                    {getDateString(source.pickup.pickupDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                  </Text>
                </View>
                <View style={[styles.mb10, styles.flex, styles.alignItemsCenter]}>
                  <Text style={[styles.smallSize, styles.defaultTextColor, languageCode === 'vi' ? styles.w100 : styles.w140]}>
                    {I18N.t('quote.shipper_proposed', { locale: languageCode })}
                  </Text>
                  {this.renderShipperProposedHighLight(dateClientWithISOString(source.pickup.pickupDate), dateClientWithISOString(source.pickup.proposedDate))}
                </View>
              </View>
            </View>
          </View>
        </View>
        {source.pickup.locationServices.map((item) => (
          <View style={[styles.flex, styles.alignItemsCenter, styles.mb15, { marginLeft: 70 }]} key={item.id}>
            <UrlImage
              sizeWidth={24}
              sizeHeight={24}
              source={this.getIconUrl(item, locationServicesDefault)}
            />
            <View style={styles.ml20}>
              <Text style={[styles.smallSize, item.isConfirmation ? styles.mainColorText : styles.redText, styles.bold]}>
                {getLocationServicesName(locationServicesDefault, item.id) || '-'}
              </Text>
            </View>
          </View>
        ))}
        <View style={[styles.ml20, styles.mr20, styles.mt10, styles.lineSilver]} />
        <FlatList
          data={source.deliveries}
          renderItem={({ item, index }) => <TransitItem source={item} index={index} countryCode={countryCode} languageCode={languageCode} locationServicesDefault={locationServicesDefault} />}
          keyExtractor={(item) => item.shipmentAddressId}
        />
      </>
    );
  }
}

export default Transit;
