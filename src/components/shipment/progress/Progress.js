import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import I18n from '../../../config/locales';
import { getDateString } from '../../../helpers/shipment.helper';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';
import Booked from './section/Booked';
import Dispatched from './section/Dispatched';
import PickedUp from './section/PickedUp';
import Delivery from './section/Delivery';
import { DATE_TIME_FORMAT_VN, DATE_TIME_FORMAT } from '../../../constants/app';

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseSection: props.collapseSection || null,
      indexCollapse: props.indexCollapse || null,
      isOnMore: false,
    };
  }

  componentDidMount() {
    const { collapseSection, indexCollapse, isOnMore } = this.props;
    this.setState({
      collapseSection,
      indexCollapse,
      isOnMore
    });
  }

  renderDeliveryDestination = () => {
    const {
      progress,
      countryCode,
      languageCode,
      shipmentDetail,
      actions,
    } = this.props;
    const { collapseSection, indexCollapse } = this.state;
    return progress.deliverySections.map((item, index) => (
      <Delivery
        key={item.addressId}
        source={item}
        index={index}
        actions={actions}
        languageCode={languageCode}
        numberDestination={index + 1}
        countryCode={countryCode}
        collapse={this.onCollapse}
        shipmentID={shipmentDetail.id}
        collapseSection={collapseSection}
        indexCollapse={indexCollapse}
        currentPosition={this.onGetCurrentPostion}
      />
    ));
  }

  getProgress = () => {
    const { actions, shipmentDetail } = this.props;
    actions.getProgress(shipmentDetail.id);
  }

  onCollapse = (section, expanded, index = null) => {
    this.setState({
      isOnMore: false,
    })
    if (expanded) {
      this.setState({
        collapseSection: section,
        indexCollapse: index,
      });
    }
  }

  onGetCurrentPostion = (data) => {
    const { shipmentRef } = this.props;
    const { isOnMore } = this.state;
    if (isOnMore) {
      shipmentRef.props.scrollToPosition(0, data.layout.y);
    }
  }

  render() {
    const {
      progress,
      countryCode,
      languageCode,
      actions,
      shipmentDetail,
      transportTypesDefault,
    } = this.props;
    const { collapseSection, isOnMore } = this.state;
    return (
      <>
        <View style={[styles.mt30, styles.mb30]}>
          <View style={[styles.flex, styles.alignItemsCenter, styles.paddingHorizontal20]}>
            <View style={styles.flexOne}>
              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                {I18n.t('progress.last_updated', { locale: languageCode })}
                :
              </Text>
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
                {getDateString(progress.updatedAt, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT)}
              </Text>
            </View>
            <View style={[styles.flexOne, styles.alignItemsEnd]}>
              <TouchableOpacity
                style={[styles.flex, styles.alignItemsCenter]}
                onPress={this.getProgress}
                activeOpacity={0.9}
              >
                <Text style={[styles.smallSize, styles.mainColorText, styles.bold]}>
                  {I18n.t('progress.update_now', { locale: languageCode })}
                </Text>
                <View style={styles.ml5}>
                  <Image source={IMAGE_CONSTANT.reload} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Booked
          source={progress.bookedSection}
          languageCode={languageCode}
          countryCode={countryCode}
          actions={actions}
          shipmentID={shipmentDetail.id}
          collapse={this.onCollapse}
          collapseSection={collapseSection}
        />
        <Dispatched
          source={progress.dispatchSection}
          bookedDate={progress.bookedSection.bookedDate}
          languageCode={languageCode}
          countryCode={countryCode}
          actions={actions}
          shipmentID={shipmentDetail.id}
          collapse={this.onCollapse}
          collapseSection={collapseSection}
          transportTypesDefault={transportTypesDefault}
        />
        <PickedUp
          source={progress.pickupSection}
          languageCode={languageCode}
          countryCode={countryCode}
          actions={actions}
          shipmentID={shipmentDetail.id}
          collapse={this.onCollapse}
          collapseSection={collapseSection}
          currentPosition={this.onGetCurrentPostion}
          isOnMore={isOnMore}
        />
        {this.renderDeliveryDestination()}
      </>
    );
  }
}

export default Progress;
