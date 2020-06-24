import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import shipmentAction from '../../store/actions/shipmentAction';
import appActions from '../../store/actions/appAction';
import driverActions from '../../store/actions/driverAction';

import IMAGE_CONSTANT from '../../constants/images';
import SYSTEM from '../../config/system';
import styles from '../../containers/style';
import APP_CONSTANT from '../../helpers/constant.helper';

class AddressAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSelectAddress = (data, details = null) => {
    const {
      modalData,
      actions,
      anotherPickup,
      anotherDelivery
    } = this.props;
    if (modalData.isPickup) {
      if (modalData.type === 'root') {
        const rootPickupObj = {
          address: details.formatted_address,
          longitude: details.geometry.location.lng,
          latitude: details.geometry.location.lat,
          radius: modalData.radius || APP_CONSTANT.DEFAULT_RADIUS,
        };
        actions.setDataRootPickup(rootPickupObj);
      } else {
        const anotherPickupObj = {
          address: details.formatted_address,
          longitude: details.geometry.location.lng,
          latitude: details.geometry.location.lat,
          radius: modalData.radius || APP_CONSTANT.DEFAULT_RADIUS,
        };
        actions.setDataAnotherPickup(anotherPickup, anotherPickupObj, modalData.index);
      }
    }
    if (!modalData.isPickup) {
      if (modalData.type === 'root') {
        const rootDeliveryObj = {
          address: details.formatted_address,
          longitude: details.geometry.location.lng,
          latitude: details.geometry.location.lat,
          radius: modalData.radius || APP_CONSTANT.DEFAULT_RADIUS,
        };
        actions.setDataRootDelivery(rootDeliveryObj);
      } else {
        const anotherDeliveryObj = {
          address: details.formatted_address,
          longitude: details.geometry.location.lng,
          latitude: details.geometry.location.lat,
          radius: modalData.radius || APP_CONSTANT.DEFAULT_RADIUS,
        };
        actions.setDataAnotherDelivery(anotherDelivery, anotherDeliveryObj, modalData.index);
      }
    }
    this.onCloseModal();
  }

  onCloseModal = () => {
    const { actions } = this.props;
    actions.closeModal();
  }

  render() {
    const { modalData, languageCode, countryCode } = this.props;
    // format data to handle error from variable
    return (
      <SafeAreaView style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}
      >
        <View style={[styles.paddingHorizontal20, styles.mt10]}>
          <View style={[styles.input, styles.flex, { height: 'auto', minHeight: 60 }]}>
            <TouchableOpacity onPress={this.onCloseModal} style={styles.mt20}>
              <Image source={IMAGE_CONSTANT.destinationLocation} />
            </TouchableOpacity>

            <GooglePlacesAutocomplete
              minLength={2}
              autoFocus
              returnKeyType="search"
              listViewDisplayed="auto"
              fetchDetails
              onPress={this.onSelectAddress}
              query={{
                key: SYSTEM.GOOGLE_API_KEY,
                language: languageCode,
                types: null,
                components: `country:${countryCode || 'vn'}`
              }}
              placeholder=""
              currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={200}
              styles={{
                textInputContainer: {
                  backgroundColor: 'white',
                  borderWidth: 0,
                  boxShadow: 0,
                  marginBottom: 0,
                  marginTop: 10,
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                },
              }}
              getDefaultValue={() => modalData.address || ''}
              renderRightButton={() => (
                <TouchableOpacity style={{ justifyContent: 'center', padding: 10 }} onPress={() => { this.textInput.clear(); }}>
                  <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
              )}
              textInputProps={{
                clearButtonMode: 'never',
                ref: (input) => {
                  this.textInput = input;
                }
              }}
            />

          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  modalData: state.app.modalData,
  listing: state.listing,
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  anotherPickup: state.driver.anotherPickup,
  anotherDelivery: state.driver.anotherDelivery,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...shipmentAction, ...appActions, ...driverActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null, {
  forwardRef: true
}
)(AddressAutoComplete);
