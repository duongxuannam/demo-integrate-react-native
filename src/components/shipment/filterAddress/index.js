import React from 'react';
import {
  View,
} from 'react-native';
import styles from '../style';
import FilterPickup from './filterPickup';
import FilterDelivery from './filterDelivery';

class FilterAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleGetResultAddress = (data, modalData) => {
    const {
      actions,
      anotherPickup,
      anotherDelivery,
    } = this.props;
    if (modalData.isPickup) {
      if (modalData.type === 'root') {
        const rootPickupObj = {
          address: data.description,
          place_id: data.place_id,
        };
        actions.setDataRootPickup(rootPickupObj);
      } else {
        const anotherPickupObj = {
          address: data.description,
          place_id: data.place_id,
        };
        actions.setDataAnotherPickup(anotherPickup, anotherPickupObj, modalData.index);
      }
    }
    if (!modalData.isPickup) {
      if (modalData.type === 'root') {
        const rootDeliveryObj = {
          address: data.description,
          place_id: data.place_id,
        };
        actions.setDataRootDelivery(rootDeliveryObj);
      } else {
        const anotherDeliveryObj = {
          address: data.description,
          place_id: data.place_id,
        };
        actions.setDataAnotherDelivery(anotherDelivery, anotherDeliveryObj, modalData.index);
      }
    }
  }

  render() {
    const {
      rootPickup,
      anotherPickup,
      rootDelivery,
      anotherDelivery,
      actions,
      languageCode,
      countryCode,
      dataConfig,
      scrollRef
    } = this.props;
    return (
      <View style={[styles.mb30, styles.ml20, styles.mr20]}>
        <FilterPickup
          rootPickup={rootPickup}
          anotherPickup={anotherPickup}
          actions={actions}
          languageCode={languageCode}
          dataConfig={dataConfig}
          scrollRef={scrollRef}
          onGetResultAddress={this.handleGetResultAddress}
          countryCode={countryCode}
        />
        <View style={styles.mt30} />
        <FilterDelivery
          actions={actions}
          rootDelivery={rootDelivery}
          anotherDelivery={anotherDelivery}
          languageCode={languageCode}
          dataConfig={dataConfig}
          onGetResultAddress={this.handleGetResultAddress}
          countryCode={countryCode}
          scrollRef={scrollRef}
        />
        <View style={[styles.lineSilver, styles.mt30]} />
      </View>
    );
  }
}

export default FilterAddress;
