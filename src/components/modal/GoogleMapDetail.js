import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-navigation';
import moment from 'moment';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// ACTION
import appActions from '../../store/actions/appAction';
import shipmentActions from '../../store/actions/shipmentAction';

import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import GoogleMap from '../shipment/googleMap';
import { getDateString, computeTimeLeft } from '../../helpers/shipment.helper';


import styles from '../../containers/style';
// import { GOOGLE_API_KEY } from '../../../config/system';

class GoogleMapDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  formatSize = (floatNumber) => {
    const getItemMeasurements = (number) => {
      if (parseFloat(number)) {
        return number.toString().split('.');
      }
      return [number];
    };
    return getItemMeasurements(floatNumber)
      .map((item, index) => (index ? item : `${item}`))
      .join(' ');
  }

  formatDataRender = (shipmentDetail, locationType, languageCode) => ({
    listing_start: getDateString(shipmentDetail.changedStatusDate),
    days_left: computeTimeLeft(shipmentDetail.changedStatusDate),
    pickup: locationType.find((locationItem) => locationItem.locationServiceId === shipmentDetail.addresses.pickup.locationTypeId),
    delivery: locationType.find((locationItem) => locationItem.locationServiceId === shipmentDetail.addresses.lastDestination.locationTypeId),
    items: shipmentDetail.itemSummary,
    weight: shipmentDetail.totalWeight,
    size: shipmentDetail.items.length > 1 ? I18n.t('multi_size', { locale: languageCode }) : `L${this.formatSize(shipmentDetail.items[0].length)}, W${this.formatSize(shipmentDetail.items[0].width)}, H${this.formatSize(shipmentDetail.items[0].height)} cm`,
    quotes: shipmentDetail.totalQuotes,
    id: shipmentDetail.id
  })

  renderLine = (label, value, languageCode) => (
    <View style={[styles.flex, styles.mb10]}>
      <View style={[styles.mr15, styles.w110]}>
        <Text style={[styles.smallSize, styles.grayText]}>
          {I18n.t(label, { locale: languageCode })}
          :
        </Text>
      </View>
      <View>
        <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
          {value}
        </Text>
      </View>
    </View>
  )

  renderSize = (label, value, languageCode, id) => (
    <View style={[styles.flex, styles.mb10]}>
      <View style={[styles.mr15, styles.w110]}>
        <Text style={[styles.smallSize, styles.grayText]}>
          {I18n.t(label, { locale: languageCode })}
          :
        </Text>
      </View>
      <View>
        <Text
          style={[styles.smallSize, styles.defaultTextColor, styles.bold, value === I18n.t('multi_size', { locale: languageCode }) ? { color: 'rgba(81, 175, 43, 1)', textDecorationLine: 'underline' } : null]}
          onPress={value === I18n.t('multi_size', { locale: languageCode }) ? () => this.onViewDetail(id) : null}
        >
          {value}
        </Text>
      </View>
    </View>
  )

  onViewDetail = (id) => {
    const { actions } = this.props;
    actions.setShipmentDetail(id);
    actions.setQuoteDetail(id);
  }

  render() {
    const {
      actions, shipmentDataList, modalData, locationType, languageCode
    } = this.props;
    const shipmentDetail = shipmentDataList[modalData];
    if (!shipmentDetail) return null;
    const dataMap = [
      shipmentDetail.addresses.pickup.location,
      ...shipmentDetail.addresses.destinations.map((item) => item.location),
      shipmentDetail.addresses.lastDestination.location,
    ];
    const dataUI = this.formatDataRender(shipmentDetail, locationType, languageCode);

    return (
      <SafeAreaView style={{
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
      }}
      >
        <View style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'black',
          opacity: 0.6
        }}
        />
        <View
          animationType="slide"
          transparent
          onRequestClose={() => actions.closeModal()}
          style={{ height: '100%' }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => actions.closeModal()}
              >
                <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.whiteBg, {
                flex: 4,
              }]}
            >
              <View style={styles.pad20}>
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <Image source={require('../../assets/images/group/docs.png')} />
                  <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {I18n.t('shipment_listing_information', { locale: languageCode })}
                  </Text>
                </View>
              </View>
              <View style={[styles.line, styles.ml20, styles.mr20]} />
              <ScrollView nestedScrollEnabled>
                <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20, { height: 200, backgroundColor: '#ccc' }]}>
                  <GoogleMap directions={dataMap} />
                </View>

                <View style={styles.marginHorizontal20}>

                  {this.renderLine('listing_started', dataUI.listing_start, languageCode)}
                  {this.renderLine('days_left', dataUI.days_left, languageCode)}
                  {this.renderLine('pickup', dataUI.pickup ? dataUI.pickup.name : null, languageCode)}
                  {this.renderLine('delivery', dataUI.delivery ? dataUI.delivery.name : null, languageCode)}
                  {this.renderLine('items', dataUI.items, languageCode)}
                  {this.renderLine('weight', dataUI.weight, languageCode)}
                  {this.renderSize('size', dataUI.size, languageCode, dataUI.id)}
                  {this.renderLine('quotes', dataUI.quotes, languageCode)}

                </View>
                <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20]}>
                  <TouchableOpacity
                    style={[styles.alignItemsCenter, styles.flexOne, styles.flex, styles.marginHorizontal20]}
                    activeOpacity={0.9}
                    onPress={() => this.onViewDetail(dataUI.id)}
                  >
                    <Text style={[styles.formGroupButton, styles.flexOne, styles.mr10]}>
                      {I18n.t('shipment.detail.view_detail', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

GoogleMapDetail.propTypes = {
};

GoogleMapDetail.defaultProps = {
};

const mapStateToProps = (state) => ({
  modalData: state.app.modalData,
  shipmentDataList: state.driver.shipmentDataList,
  locationType: state.shipment.locationTypes,
  languageCode: state.config.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...appActions, ...shipmentActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GoogleMapDetail);
