import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';
import moment from 'moment';
import I18N from '../../../../config/locales';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';
import { getDateString, getLocationServicesName, getLocationService } from '../../../../helpers/shipment.helper';
import { dateClientWithISOString } from '../../../../helpers/date.helper';
import UrlImage from '../../../common/Image';

class TransitItem extends Component {
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

  renderShipperProposedHighLight = (earliestByDate, latestByDate, proposedDate) => {
    const { countryCode, languageCode } = this.props;
    const formatEarliestByDate = moment(earliestByDate).format('DD-MMM-YY');
    const formatLatestByDate = moment(latestByDate).format('DD-MMM-YY');
    const formatProposedDate = moment(proposedDate).format('DD-MMM-YY');
    if (moment(formatProposedDate).isBetween(formatEarliestByDate, formatLatestByDate, 'd', '[]')) {
      return (
        <Text style={[styles.smallSize, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.mainColorText, styles.bold]}>
          {getDateString(proposedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
        </Text>
      );
    }
    return (
      <Text style={[styles.smallSize, styles.mainColorText, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.redText, styles.bold]}>
        {getDateString(proposedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
      </Text>
    );
  }

  render() {
    const {
      source,
      index,
      countryCode,
      languageCode,
      locationServicesDefault,
    } = this.props;
    return (
      <View>
        <View style={[styles.marginHorizontal20, styles.mt20]}>
          <View style={styles.flex}>
            <View style={styles.relative}>
              <Image source={IMAGE_CONSTANT.pinYellowCircle} />
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.pin, styles.bold]}>
                {index + 1}
              </Text>
            </View>
            <View style={[styles.flexOne, styles.ml10, { marginTop: 6 }]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mb15, styles.bold]}>
                {source.address}
              </Text>
              <View style={[styles.mb10, styles.flex, styles.alignItemsCenter]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, languageCode === 'vi' ? styles.w100 : styles.w140]}>
                  {I18N.t('quote.requested', { locale: languageCode })}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>
                  {getDateString(source.earliestByDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                  {' '}
                  {I18N.t('quote.to', { locale: languageCode })}
                  {' '}
                  {getDateString(source.latestByDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                </Text>
              </View>
              <View style={[styles.mb10, styles.flex, styles.alignItemsCenter]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, languageCode === 'vi' ? styles.w100 : styles.w140]}>
                  {I18N.t('quote.shipper_proposed', { locale: languageCode })}
                </Text>
                <Text style={[styles.smallSize, styles.redText, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>
                  {this.renderShipperProposedHighLight(dateClientWithISOString(source.earliestByDate),
                    dateClientWithISOString(source.latestByDate),
                    dateClientWithISOString(source.proposedDate))}
                </Text>
              </View>
              <FlatList
                data={source.locationServices}
                renderItem={({ item, index }) => (
                  <View style={[styles.flex, styles.alignItemsCenter, styles.mb15]}>
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
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default TransitItem;
