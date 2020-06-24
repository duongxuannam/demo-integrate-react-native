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
import { roundDecimalToMatch } from '../../../helpers/regex';
import styles from '../style';
import { SHIPMENT_DETAIL_SECTION } from '../../../constants/app';

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

  componentDidUpdate(prevProps) {
    const { sectionExpaned } = this.props;
    if (sectionExpaned !== prevProps.sectionExpaned) {
      this.setState({
        expanded: sectionExpaned === SHIPMENT_DETAIL_SECTION.LTL_SHIPMENT,
      });
    }
  }
 
  renderUnitCount = () => {
    const { shipmentDetail, languageCode } = this.props;
    let totalUnit = 0;
    let totalWeight = 0;
    shipmentDetail.items.forEach(item => {
      totalUnit += item.unitQuantity;
      totalWeight += item.weight * item.unitQuantity;
    });

    return (
      <Text style={[styles.grayText, styles.smallSize, styles.mt10]}>
        {`${totalUnit} ${I18N.t('shipment.ltl_shipment.units_text', { locale: languageCode })} • ${roundDecimalToMatch(totalWeight, 1)} Kgs`}
      </Text>
    )
  }

  setTotalExtraServices = () => {
    const { shipmentDetail: { addresses } } = this.props;
    let totalLocationsService = addresses.pickup.locationServices;
    addresses.destinations.forEach((service) => {
      totalLocationsService = [...totalLocationsService, ...service.locationServices];
    });
    this.setState({
      totalLocationsService: [...new Set(totalLocationsService)]
    })
  }

  renderPhoto() {
    const { shipmentDetail } = this.props;
    const { totalLocationsService } = this.state;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={styles.pad20}>
          <View style={[styles.note, styles.mb20, styles.pad15, styles.lightSilver, styles.Radius4]}>
            <Text style={[styles.defaultTextColor, styles.smallSize]}>
              {shipmentDetail.title}
            </Text>
            {this.renderUnitCount()}
          </View>
          <SafeAreaView style={{ flex: 1}}>
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
    const { languageCode, onExpandedSection } = this.props;
    return (
      <View style={styles.whiteBg}>
        <View style={styles.pad20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState((prevState) => ({
                expanded: !prevState.expanded,
              }), () => {
                const { expanded: currentExpanded } = this.state;
                if (currentExpanded) {
                  onExpandedSection(SHIPMENT_DETAIL_SECTION.LTL_SHIPMENT);
                }
              });
            }}
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
        {expanded ? this.renderPhoto() : null}
      </View>
    );
  }
}
