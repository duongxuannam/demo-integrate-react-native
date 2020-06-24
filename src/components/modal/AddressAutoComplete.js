import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import listingActions from '../../store/actions/listingAction';
import appActions from '../../store/actions/appAction';

import addressAutoComplete from '../../model/modalData';
import IMAGE_CONSTANT from '../../constants/images';
import { GOOGLE_API_KEY } from '../../config/system';
import styles from '../booking/style';

class AddressAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onSelectAddress = this.onSelectAddress.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onSelectAddress(data, details = null) {
    const { actions, modalData, listing, updatingAddress } = this.props;
    const { destinationAddress, pickupAddress } = listing;
    const mData = addressAutoComplete(modalData);
    if (!updatingAddress) {
      if (details) {
        if (mData.isPickup) {
          const newPickupAddress = { ...pickupAddress };
          newPickupAddress.address = details.formatted_address;
          newPickupAddress.longitude = details.geometry.location.lng;
          newPickupAddress.latitude = details.geometry.location.lat;
          newPickupAddress.shortAddress = details.name;
          // actions.updatePickupAddress(pickupAddress);
          // get duration from google api
          if (Object.entries(destinationAddress).length > 0) {
            const validAddress = Object.keys(destinationAddress).find((entry) => destinationAddress[entry].latitude === newPickupAddress.latitude && destinationAddress[entry].longitude === newPickupAddress.longitude);
            if (typeof validAddress !== 'undefined') {
              actions.closeModal();
              Alert.alert('Notice', 'We can not choose this place, please choose another place!');
              return;
            }
            actions.getDistanceMatrix({
              pickup: newPickupAddress,
              destinations: destinationAddress,
            });
            actions.closeModal();
          } else {
            actions.updatePickupAddress(newPickupAddress);
          }
        } else {
          const newDestinationAddress = { ...destinationAddress };
          const destination = { ...newDestinationAddress[mData.destinationKey] };
          destination.address = details.formatted_address;
          destination.longitude = details.geometry.location.lng;
          destination.latitude = details.geometry.location.lat;
          destination.shortAddress = details.name;
          if (pickupAddress) {
            if (pickupAddress.latitude === destination.latitude && pickupAddress.longitude === destination.longitude) {
              Alert.alert('Notice', 'We can not choose this place, please choose another place!');
              actions.closeModal()
              return;
            }
          }
          newDestinationAddress[mData.destinationKey] = destination;
          // update time (get duration from google api)
          if (Object.entries(pickupAddress).length > 0 && pickupAddress.address) {
            actions.getDistanceMatrix({
              pickup: pickupAddress,
              destinations: newDestinationAddress,
              addressKey: mData.destinationKey,
            });
            actions.closeModal();
          } else {
            actions.updateDestinationAddress(newDestinationAddress);
          }
        }
      }
    } else {
      const { shipmentDetail } = this.props;
      const { lat, lng } = details.geometry.location;
      if (mData.isPickup) {
        const validAddress = shipmentDetail.addresses.destinations.find((item) => item.location.latitude === lat && item.location.longitude === lng);
        if (typeof validAddress !== 'undefined') {
          actions.closeModal();
          Alert.alert('Notice', 'We can not choose this place, please choose another place!');
          return;
        }
      }

      if (shipmentDetail.addresses.pickup.location.latitude === lat && shipmentDetail.addresses.pickup.location.longitude === lng) {
        this.onCloseModal();
        Alert.alert('Notice', 'Cannot choose the same address with pickup');
        return;
      }

      actions.setAddressDataUpdating({
        address: details.formatted_address,
        location: {
          latitude: lat,
          longitude: lng,
        },
        shortAddress: details.name,
      }, null, () => {
        this.onCloseModal();
      });
    }
  }

  onCloseModal() {
    const { actions } = this.props;
    actions.closeModal();
  }

  render() {
    const { modalData, languageCode, countryCode } = this.props;
    // format data to handle error from variable
    const data = addressAutoComplete(modalData);
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
                key: GOOGLE_API_KEY,
                language: languageCode,
                types: null,
                components: `country:${countryCode || 'us'}`
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
              getDefaultValue={() => data.address}
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
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  updatingAddress: state.listing.updatingAddress,
  shipmentDetail: state.listing.shipmentDetail,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingActions, ...appActions },
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
