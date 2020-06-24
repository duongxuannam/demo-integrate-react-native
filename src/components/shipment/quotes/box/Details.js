import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import I18N from '../../../../config/locales';
import styles from '../../style';
import { getTransportTypeName } from '../../../../helpers/shipment.helper';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    )
  }

  render() {
    const { source, transportTypesDefault, languageCode } = this.props;
    return (
      <>
        <View style={[styles.marginHorizontal20, {
          height: 1,
          backgroundColor: 'rgba(219, 219, 219, 1)',
        }]}
        />
        <View style={[styles.marginHorizontal20, styles.mt30, styles.mb20]}>
          {Details.renderList(`${I18N.t('quote.mode', { locale: languageCode })}:`, getTransportTypeName(transportTypesDefault, source.transportTypeId) || '-')}
          {/* {Details.renderList('Labor:', '1 driver, 1 helper')}
          {Details.renderList('Co-Load:', 'yes')}
          {Details.renderList('Equipment:', 'Pallet jack, tarp covers')} */}
        </View>
      </>
    );
  }
}

export default Details;
