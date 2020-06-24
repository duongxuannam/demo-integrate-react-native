import React from 'react';
import { View, TouchableWithoutFeedback, ScrollView, TouchableOpacity, Text, Keyboard, Platform } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Qs from 'qs';
import { width, height } from '../../helpers/scaling.helpers';
import SYSTEM from '../../config/system';
import APP from '../../constants/app';
import APP_CONSTANT from '../../helpers/constant.helper';
import driverAction from '../../store/actions/driverAction';

class AddressDropDown extends React.Component {

  selectAddressItem = (address, dropdown) => () => {
    // fetch details
    console.log('SELECT ADDRESS');
    Keyboard.dismiss();
    const { languageCode, actions } = this.props;
    actions.closeDropDownAddress([], null);
    const request = new XMLHttpRequest();
    request.timeout = 20000;
    request.ontimeout = () => { console.log('GET ADDRESS PLACE ID TIMEOUT'); };
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return;

      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);
        if (responseJSON.status === 'OK') {
          const details = responseJSON.result;
          switch (dropdown.type) {
            case APP.ADDRESS_TYPE.PICKUP_ROOT: {
              const rootPickupObj = {
                address: details.formatted_address,
                longitude: details.geometry.location.lng,
                latitude: details.geometry.location.lat,
                radius: dropdown.radius || APP_CONSTANT.DEFAULT_RADIUS,
              };
              actions.setRootPickup(rootPickupObj);
              break;
            }
            case APP.ADDRESS_TYPE.PICKUP_OTHER: {
              const anotherPickupObj = {
                address: details.formatted_address,
                longitude: details.geometry.location.lng,
                latitude: details.geometry.location.lat,
                radius: dropdown.radius || APP_CONSTANT.DEFAULT_RADIUS,
              };
              actions.setDataAnotherPickup(dropdown.anotherPickup, anotherPickupObj, dropdown.index);
              break;
            }
            case APP.ADDRESS_TYPE.DELIVERY_ROOT: {
              const rootDeliveryObj = {
                address: details.formatted_address,
                longitude: details.geometry.location.lng,
                latitude: details.geometry.location.lat,
                radius: dropdown.radius || APP_CONSTANT.DEFAULT_RADIUS,
              };
              actions.setDataRootDelivery(rootDeliveryObj);
              break;
            }
            case APP.ADDRESS_TYPE.DELIVERY_OTHER: {
              const anotherDeliveryObj = {
                address: details.formatted_address,
                longitude: details.geometry.location.lng,
                latitude: details.geometry.location.lat,
                radius: dropdown.radius || APP_CONSTANT.DEFAULT_RADIUS,
              };
              actions.setDataAnotherDelivery(dropdown.anotherPickup, anotherDeliveryObj, dropdown.index);
              break;
            }
            default:
              break;
          }
          // delete rowData.isLoading;
          // this.props.onPress(rowData, details);
        } else {
          console.warn('google places autocomplete: ', responseJSON.status);
        }
      } else {
        console.warn(
          'google places autocomplete: request could not be completed or has been aborted'
        );
      }
    };

    request.open('GET', `https://maps.googleapis.com/maps/api/place/details/json?${Qs.stringify({
      key: SYSTEM.GOOGLE_API_KEY,
      placeid: address.place_id,
      language: languageCode,
    })}`);

    request.send();
  }

  closeDropDownAddress = () => {
    console.log('CLOSE DROPDOWN ADDRESS');
    const { actions } = this.props;
    actions.closeDropDownAddress([], null);
  }

  renderDropDownAddress = (addressData, dropDownPos) => {
    const left = dropDownPos.x;
    return (
      <View style={{
        position: 'absolute',
        left,
        top: (dropDownPos.y + 60),
        width: dropDownPos.w,
        backgroundColor: '#fff',
        borderRadius: 4,
      }}
      >
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderBottomWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'rgba(81, 175, 43, 1)',
          marginTop: -8,
          position: 'absolute',
          right: 15,
          top: 1,
          zIndex: 3,
        }}
        />
        <View style={{
          paddingVertical: 15,
          paddingLeft: 15,
          paddingRight: 30,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          borderColor: 'rgba(81, 175, 43, 1)',
          borderRadius: 4,
          height: (height * 0.25),
          maxHeight: 250
        }}
        >
          <ScrollView
            style={{ flex: 1 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
          >
            {addressData.map((a, key) => (
              <TouchableOpacity
                key={`address-click-${a.id}`}
                style={[{ flexDirection: 'row', alignItems: 'center' }, addressData.length - 1 === key ? null : { marginBottom: 15 }]}
                activeOpacity={0.9}
                onPress={this.selectAddressItem(a, dropDownPos)}
              >
                <Text style={[{ fontSize: 13, marginLeft: 10, fontFamily: 'Roboto-Regular', }]}>
                  {a.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  render() {
    const { addressData, addressPos } = this.props;

    if (addressData && addressData.length > 0 && addressPos) {
      return (
        <View style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        >
          <TouchableWithoutFeedback onPress={this.closeDropDownAddress}>
            <View style={{
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              flex: 1,
              width,
            }}
            >
              {this.renderDropDownAddress(addressData, addressPos)}
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  anotherPickup: state.driver.anotherPickup,
  anotherDelivery: state.driver.anotherDelivery,
  addressData: state.app.addressData,
  addressPos: state.app.addressPos
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      closeDropDownAddress: driverAction.getDataAddressDropdown,
      setRootPickup: driverAction.setDataRootPickup,
      setDataAnotherPickup: driverAction.setDataAnotherPickup,
      setDataRootDelivery: driverAction.setDataRootDelivery,
      setDataAnotherDelivery: driverAction.setDataAnotherDelivery,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null, {
    forwardRef: true
  }
)(AddressDropDown);
