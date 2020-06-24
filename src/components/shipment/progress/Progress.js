import React, { Component } from 'react';
import {
  Text, View, Image, TouchableOpacity
} from 'react-native';
import moment from 'moment';
// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import progressActions from '../../../store/actions/progressAction';

// COMPONENTS
import BookedProgressItem from './ProgressItem/BookedProgressItem';
import DispatchProgressItem from './ProgressItem/DispatchProgressItem';
import PickupProgressItem from './ProgressItem/PickupProgressItem';
import DeliveryDestinationProgressItem from './ProgressItem/DeliveryDestinationProgressItem';


// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import { LISTING_STATUS } from '../../../constants/app';

import I18n from '../../../config/locales';
import { dateClientWithFormat, getFormatDate } from '../../../helpers/date.helper';
// CSS
import styles from '../style';

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callUpdatedProgress = () => {
    const { actions, shipmentID } = this.props;
    actions.getProgress(shipmentID);
  }

  renderDeliveryDestination = (count) => {
    const mapElement = [];
    for (let index = 0; index < count; index += 1) {
      mapElement.push(
        <View key={`list-${index + 1}}`} style={{ width: '100%' }}>
          <DeliveryDestinationProgressItem itemIndex={index} />
        </View>,
      );
    }

    return mapElement;
  }

  render() {
    const {
      languageCode,
      deliveryDestinationLength,
      countryCode,
      updatedAt,
    } = this.props;
    return (
      <>
        <View style={[styles.mt30, styles.mb30]}>
          <View
            style={[
              styles.flex,
              styles.alignItemsCenter,
              styles.paddingHorizontal20,
            ]}
          >
            <View style={styles.flexOne}>
              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                {I18n.t('last_updated', { locale: languageCode })}
                :
              </Text>
              <Text
                style={[
                  styles.bold,
                  styles.smallSize,
                  styles.defaultTextColor,
                ]}
              >
                {dateClientWithFormat(
                  updatedAt,
                  getFormatDate(countryCode, languageCode),
                )}
              </Text>
            </View>
            <View style={[styles.flexOne, styles.alignItemsEnd]}>
              <TouchableOpacity
                style={[styles.flex, styles.alignItemsCenter]}
                onPress={this.callUpdatedProgress}
              >
                <Text
                  style={[
                    styles.bold,
                    styles.smallSize,
                    styles.mainColorText,
                  ]}
                >
                  {I18n.t('update_now', { locale: languageCode })}
                </Text>
                <View style={styles.ml5}>
                  <Image source={IMAGE_CONSTANT.reload} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'column', width: '100%' }}>
          <View style={{ width: '100%' }}>
            <BookedProgressItem />
          </View>
          <View style={{ width: '100%' }}>
            <DispatchProgressItem />
          </View>
          <View style={{ width: '100%' }}>
            <PickupProgressItem />
          </View>
          {this.renderDeliveryDestination(deliveryDestinationLength)}
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  deliveryDestinationLength: state.progress.deliveryDestination.length,
  shipmentID: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  countryCode: state.config.countryCode,
  updatedAt: state.progress.updatedAt,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...progressActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Progress);
