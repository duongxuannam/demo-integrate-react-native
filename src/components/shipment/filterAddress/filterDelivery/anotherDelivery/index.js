import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  findNodeHandle,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import IMAGE_CONSTANT from '../../../../../constants/images';
import I18n from '../../../../../config/locales';
import Slider from '../../../../../plugins/Slider';
import styles from '../../../style';
import APP_CONSTANT from '../../../../../helpers/constant.helper';
import SYSTEM from '../../../../../config/system';
import { height } from '../../../../../helpers/scaling.helpers';

class AnotherDelivery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueRange: APP_CONSTANT.DEFAULT_RADIUS,
      expandedRadius: false,
      showRadius: true,
      listViewDisplayed: false,
    };
    this.requestList = [];
    this.timeout = 20000;
    this.resultsList = [];
    this.query = {
      key: SYSTEM.GOOGLE_API_KEY,
      language: 'en',
      types: null,
      components: 'country:vn'
    };
  }

  getGoogleRef = (ref) => { this.googleRef = ref; }

  handleRemoveAddress = (index) => () => {
    this.removeDeliveryAddress('another', index);
    if (this.googleRef) {
      this.googleRef.setAddressText('');
    }
  }

  removeDeliveryAddress = (type, index) => {
    const { removeAddress, anotherDelivery } = this.props;
    this.setState({
      listViewDisplayed: false,
    });
    if (index === 0) {
      if (anotherDelivery[index + 1] && anotherDelivery[index + 1]) {
        this.setState({
          valueRange: anotherDelivery[index + 1].radius,
        });
      }
    }
    this.setState({
      expandedRadius: false,
      valueRange: APP_CONSTANT.DEFAULT_RADIUS
    });
    removeAddress(type, index);
  }

  handleSlidingRadius = (isPickup, type, index) => {
    const { setRadius } = this.props;
    const { valueRange } = this.state;
    setRadius(isPickup, type, index, valueRange);
    this.setState({ expandedRadius: false });
  }

  onSelectAddress = (data, modalData) => {
    const { onGetResultAddress } = this.props;
    this.setState({
      listViewDisplayed: false,
      showRadius: true,
    });
    onGetResultAddress(data, modalData);
  }

  singleRangeSlider = (isPickup, type, index) => {
    const { item, dataConfig } = this.props;
    const { valueRange } = this.state;
    return (
      <View style={[styles.ml15, styles.mr15, styles.mt10]}>
        <Slider
          minimumValue={dataConfig.MinRadius}
          maximumValue={dataConfig.MaxRadius}
          value={(item.radius || item.radius === 0) ? item.radius : valueRange}
          onSlidingComplete={() => this.handleSlidingRadius(isPickup, type, index)}
          onValueChange={(value) => this.setState({ valueRange: parseInt(value, 10) })}
          minimumTrackTintColor="rgba(51, 115, 25, 1)"
          maximumTrackTintColor="rgba(219, 219, 219, 1)"
          customThumbLabel={() => (
            <Text style={[
              styles.notificationSize,
              styles.whiteText,
              styles.bold,
              { lineHeight: 26, textAlign: 'center' }
            ]}
            >
              {(item.radius || item.radius === 0) ? item.radius : valueRange}
            </Text>
          )}
          customThumbLabelStyle={{
            backgroundColor: 'rgba(51, 115, 25, 1)',
            borderRadius: 6,
            paddingHorizontal: 8,
            position: 'absolute',
            height: 26,
          }}
        />
      </View>
    );
  }

  render() {
    const {
      languageCode, item, index, countryCode,
      scrollRef
    } = this.props;
    const {
      expandedRadius, valueRange, listViewDisplayed, showRadius
    } = this.state;
    return (
      <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]} key={`address-${index + 1}`}>
        <View style={expandedRadius ? { flex: 3 } : styles.flexOne}>
          <GooglePlacesAutocomplete
            ref={this.getGoogleRef}
            minLength={2}
            autoFocus={false}
            onPress={(data) => this.onSelectAddress(data, { isPickup: false, type: 'another', index })}
            query={{
              key: SYSTEM.GOOGLE_API_KEY,
              language: languageCode,
              types: null,
              components: `country:${countryCode || 'vn'}`
            }}
            listViewDisplayed={listViewDisplayed}
            placeholder={I18n.t('filter.enter_location', { locale: languageCode })}
            currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={200}
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                marginTop: 10,
                width: '100%',
                minHeight: 60,
                height: listViewDisplayed || expandedRadius ? 60 : 'auto',
                borderColor: 'rgba(219, 219, 219, 1)',
                borderTopColor: 'rgba(219, 219, 219, 1)',
                borderBottomColor: 'rgba(219, 219, 219, 1)',
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderRadius: 4,
                alignItems: 'center'
              },
              textInput: {
                fontSize: 17,
                fontFamily: 'Roboto-Regular',
                color: '#000',
                height: listViewDisplayed ? '100%' : 'auto',
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
            getDefaultValue={() => item.address || ''}
            renderLeftButton={() => (
              <View style={[styles.flex, styles.alignItemsCenter, styles.ml15]}>
                <Image source={item.address ? IMAGE_CONSTANT.pickupLocation : IMAGE_CONSTANT.plusGreen} />
              </View>
            )}
            renderRightButton={() => {
              if (!expandedRadius && item.address) {
                return (
                  <View
                    style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, { width: 40, height: '100%' }]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.w100per, styles.h100per]}
                      onPress={this.handleRemoveAddress(index)}
                    >
                      <Image source={IMAGE_CONSTANT.closeSilver} style={{ width: 18, height: 18 }} />
                    </TouchableOpacity>
                  </View>
                );
              }
              return null;
            }}
            textInputProps={{
              multiline: true,
              autoCorrect: false,
              ref: (input) => {
                this.textInput = input;
              },
              value: item.address || this.textInput,
              onFocus: () => {
                this.setState({ showRadius: false, listViewDisplayed: true });
                scrollRef.props.scrollToFocusedInput(findNodeHandle(this.textInput), height * 0.3);
              },
              onBlur: () => {
                this.setState({
                  showRadius: true,
                  listViewDisplayed: false
                });
              }
            }}
          />
        </View>
        {item.address && showRadius && (
          <View style={[
            styles.input,
            styles.inputResetPadding,
            expandedRadius ? { flex: 4 } : styles.w60,
            expandedRadius ? styles.ml20 : styles.ml10,
            !expandedRadius && styles.flexColumn,
            !expandedRadius && styles.alignItemsCenter,
            !expandedRadius && styles.justifyContentCenter,
            styles.mt10
          ]}
          >
            {expandedRadius
              ? this.singleRangeSlider(false, 'another', index)
              : (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.setState((prevState) => ({ expandedRadius: !prevState.expandedRadius }))}
                  style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter]}
                >
                  <View style={[styles.circleGreen, styles.darkGreenBg]} />
                  <Text style={[styles.smallerSize, styles.defaultTextColor, styles.bold, styles.mt5]}>
                    {(item.radius || item.radius === 0) ? item.radius : valueRange}
                    {' '}
                  km
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        )}
      </View>
    );
  }
}

export default AnotherDelivery;
