import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { getUnitName, getAdditionalServices } from '../../../helpers/shipment.helper';
import I18N from '../../../config/locales';
import styles from '../style';

class LTLItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      i,
      quantity,
      unit,
      length,
      width,
      height,
      weight,
      additionalServices,
      additionalServicesDefault,
      handleUnit,
      languageCode,
    } = this.props;
    console.log('handleUnit', handleUnit, unit);
    return (
      <View style={[styles.shipment, styles.mb30, styles.relative]}>
        <View style={styles.flex}>
          <View style={styles.shipmentTitle}>
            <Text style={[styles.defaultSize, styles.smallSize, styles.bold]}>
              {I18N.t('shipment.ltl_shipment.item', { locale: languageCode })}
              {' '}
              {i + 1}
            </Text>
          </View>
          <View style={styles.flexOne} />
        </View>
        {/* Form */}
        <View style={styles.shipmentForm}>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.ltl_shipment.unit', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {quantity}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.ltl_shipment.type', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {getUnitName(handleUnit, unit) || '-'}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.ltl_shipment.total_weight', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {String(weight * quantity).split('.')[0]}
                {' '}
                kg
                {' '}
                {String(weight * quantity).split('.')[1]}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.ltl_shipment.measure', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {I18N.t('shipment.ltl_shipment.units.length', { locale: languageCode })}
                {' '}
                {String(length).split('.')[0]}
                {' '}
                cm
                {' '}
                {String(length).split('.')[1]}
              </Text>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {I18N.t('shipment.ltl_shipment.units.width', { locale: languageCode })}
                {' '}
                {String(width).split('.')[0]}
                {' '}
                cm
                {' '}
                {String(width).split('.')[1]}
              </Text>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {I18N.t('shipment.ltl_shipment.units.height', { locale: languageCode })}
                {' '}
                {String(height).split('.')[0]}
                {' '}
                cm
                {' '}
                {String(height).split('.')[1]}
              </Text>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {I18N.t('shipment.ltl_shipment.units.weight', { locale: languageCode })}
                {' '}
                {String(weight).split('.')[0]}
                {' '}
                Kg
                {' '}
                {String(weight).split('.')[1]}
              </Text>
            </View>
          </View>
          {additionalServices.length > 0 && (
            <View style={[styles.form, styles.flex, styles.mb20]}>
              <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                <Text style={[styles.grayText, styles.smallSize]}>
                  {I18N.t('shipment.ltl_shipment.addService', { locale: languageCode })}
                </Text>
              </View>
              <View style={[styles.formRight, styles.flexOne]}>
                <SafeAreaView style={{ flex: 1 }}>
                  <FlatList
                    data={additionalServices}
                    renderItem={({ item }) => (
                      <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                        {getAdditionalServices(additionalServicesDefault, item)}
                      </Text>
                    )}
                    keyExtractor={(item) => item}
                  />
                </SafeAreaView>
              </View>
            </View>
          )}
          {/* <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>Extra Services:</Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  data={extraServices}
                  renderItem={({ item, index }) => (
                    <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                      {getLocationServicesName(locationServicesDefault, item)}
                      {extraServices.length - index > 1 && ','}
                    </Text>
                  )}
                  listKey={i.toString()}
                />
              </SafeAreaView>
            </View>
          </View> */}
        </View>
      </View>
    );
  }
}
const mapStatetoProps = (state) => ({
  transportType: state.listing.transportTypesDefault,
  handleUnit: state.listing.defaultHandleUnits,
  additionalServicesDefault: state.listing.defaultAdditionalServices,
  locationServicesDefault: state.listing.defaultLocationServices,
  languageCode: state.app.languageCode,
});

export default connect(mapStatetoProps, null)(LTLItem);
