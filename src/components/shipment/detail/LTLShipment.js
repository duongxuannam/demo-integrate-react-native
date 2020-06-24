import React from 'react';
import {
  Image,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import LTLItem from './LTLItem';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';
import { roundDecimalToMatch } from '../../../helpers/shipment.helper';

export default class LTLShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      totalLocationsService: []
    };
  }

  componentDidMount() {
    this.setTotalExtraServices();
  }

  renderUnitCount = () => {
    const { shipmentDetail, languageCode } = this.props;
    let totalUnit = 0;
    let totalWeight = 0;
    shipmentDetail.items.forEach((item) => {
      totalUnit += item.unitQuantity;
      totalWeight += item.weight * item.unitQuantity;
    });

    return (
      <Text style={[styles.grayText, styles.smallSize, styles.mt10]}>
        {I18N.t('shipment.ltl_shipment.total', { locale: languageCode })}
        {' '}
        {
          totalUnit > 1
            ? `${totalUnit} ${I18N.t('shipment.ltl_shipment.units_text', { locale: languageCode })}`
            : `${totalUnit} ${I18N.t('shipment.ltl_shipment.unit_text', { locale: languageCode })}`
        }
        {' '}
        •
        {' '}
        {
          totalWeight > 1
            ? `${roundDecimalToMatch(totalWeight, 1)} ${I18N.t('shipment.Kgs', { locale: languageCode })}`
            : `${roundDecimalToMatch(totalWeight, 1)} ${I18N.t('shipment.Kg', { locale: languageCode })}`
        }
      </Text>
    );
  }

  setTotalExtraServices = () => {
    const { shipmentDetail: { addresses } } = this.props;
    let totalLocationsService = addresses.pickup.locationServices;
    addresses.destinations.forEach((service) => {
      totalLocationsService = [...totalLocationsService, ...service.locationServices];
    });
    this.setState({
      totalLocationsService: [...new Set(totalLocationsService)]
    });
  }

  renderLTLShipment() {
    const {
      shipmentDetail,
      defaultTransportTypes,
      defaultHandleUnits,
      defaultLocationServices,
      defaultAdditionalServices,
      languageCode
    } = this.props;
    const { totalLocationsService } = this.state;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={styles.pad20}>
          <View style={[styles.note, styles.mb20, styles.pad15, styles.lightSilver, styles.Radius4]}>
            {this.renderUnitCount()}
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={shipmentDetail.items}
              renderItem={({ item, index }) => (
                <LTLItem
                  i={index}
                  quantity={item.unitQuantity}
                  unit={item.handlingUnitId}
                  length={item.length}
                  width={item.width}
                  height={item.height}
                  weight={item.weight}
                  additionalServices={item.additionalServices}
                  extraServices={totalLocationsService}
                  defaultTransportTypes={defaultTransportTypes}
                  defaultHandleUnits={defaultHandleUnits}
                  locationServicesDefault={defaultLocationServices}
                  additionalServicesDefault={defaultAdditionalServices}
                  languageCode={languageCode}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
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
              <Image source={require('../../../assets/images/group/docs-edit.png')} />
              <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('shipment.ltl_shipment.heading', { locale: languageCode })}
              </Text>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
        </View>
        {expanded ? this.renderLTLShipment() : null}
      </View>
    );
  }
}
