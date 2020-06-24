import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  findNodeHandle,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import IMAGE_CONSTANT from '../../../../constants/images';
import { GOOGLE_MAPS_APIKEY } from '../../../../constants/app';
import I18n from '../../../../config/locales';
import Slider from '../../../../plugins/Slider';
import AnotherPickup from './anotherPickup';
import APP_CONSTANT from '../../../../helpers/constant.helper';
import styles from '../../style';
import SYSTEM from '../../../../config/system';
import { height } from '../../../../helpers/scaling.helpers';

class FillterPickup extends React.Component {
  // isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      valueRange: APP_CONSTANT.DEFAULT_RADIUS,
      showRadius: true,
      pickupSelect: '',
      listViewDisplayed: false,
      expandedRadius: false,
    };
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

  handleRemovePickup = () => {
    this.removePickupAddress('root');
    if (this.googleRef) {
      this.googleRef.setAddressText('');
    }
  }

  removePickupAddress = (type, index) => {
    const { actions } = this.props;
    this.setState({
      listViewDisplayed: false,
    });
    switch (type) {
      case 'root':
        actions.removePickupAddress(true);
        break;
      case 'another':
        actions.removePickupAddress(false, index);
        break;
      default:
        break;
    }
    this.setState({
      valueRange: APP_CONSTANT.DEFAULT_RADIUS,
    });
  }

  onSelectAddress = (data, modalData) => {
    const { onGetResultAddress } = this.props;
    this.setState({
      listViewDisplayed: false,
      showRadius: true,
      pickupSelect: data.description
    });
    onGetResultAddress(data, modalData);
  }

  handleSlidingRadius = (isPickup, type, index, data) => {
    const { actions } = this.props;
    actions.setRadius(data, isPickup, type, index);
    this.setState({ expandedRadius: false });
  }

  singleRangeSlider = (isPickup, type, index) => {
    const { valueRange } = this.state;
    const { rootPickup, dataConfig } = this.props;
    return (
      <View style={[styles.ml15, styles.mr15, styles.mt10]}>
        <Slider
          minimumValue={dataConfig.MinRadius}
          maximumValue={dataConfig.MaxRadius}
          value={(rootPickup.radius || rootPickup.radius === 0) ? rootPickup.radius : valueRange}
          onSlidingComplete={() => this.handleSlidingRadius(isPickup, type, index, valueRange)}
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
              {(rootPickup.radius || rootPickup.radius === 0) ? rootPickup.radius : valueRange}
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
      rootPickup, anotherPickup, languageCode, dataConfig, countryCode, scrollRef
    } = this.props;
    const {
      expandedRadius, valueRange, listViewDisplayed, showRadius, pickupSelect
    } = this.state;
    return (
      <View>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.medium]}>
          {I18n.t('filter.pickup', { locale: languageCode })}
        </Text>
        <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
          <View style={expandedRadius ? { flex: 3 } : styles.flexOne}>
            <GooglePlacesAutocomplete
              ref={this.getGoogleRef}
              minLength={2}
              autoFocus={false}
              onPress={(data) => this.onSelectAddress(data, { isPickup: true, type: 'root' })}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: languageCode,
                types: null,
                components: `country:${countryCode || 'vn'}`
              }}
              listViewDisplayed={listViewDisplayed}
              placeholder={I18n.t('filter.enter_location', { locale: languageCode })}
              currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={0}
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
                  color: 'rgba(74, 74, 74, 1)',
                  height: listViewDisplayed ? '100%' : 'auto',
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                },
              }}
              getDefaultValue={() => rootPickup.address || ''}
              renderLeftButton={() => (
                <View style={[styles.flex, styles.alignItemsCenter, styles.ml15]}>
                  <Image source={IMAGE_CONSTANT.pickupLocation} />
                </View>
              )}
              renderRightButton={() => {
                if (!expandedRadius && rootPickup.address) {
                  return (
                    <View style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, { width: 40, height: '100%' }]}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.w100per, styles.h100per]}
                        onPress={this.handleRemovePickup}
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
                value: rootPickup.address || this.textInput,
                onFocus: () => {
                  this.setState({ showRadius: false, listViewDisplayed: true });
                  console.log('SCROLL INPUT: ', this.textInput);
                  console.log('SCROLL REF: ', scrollRef);
                  // this.textInput.measureInWindow((x, y, w, h) => {
                  //   console.log('x, h, w, h', x, y, w, h);
                  //   scrollRef.props.scrollToPosition(0, y - h, true);
                  // });
                  // this.textInput.measure((x, y, w, h) => {
                  //   console.log('111 x, h, w, h', x, y, w, h);
                  // });
                  scrollRef.props.scrollToFocusedInput(findNodeHandle(this.textInput), height * 0.3);
                  // this.textInput.measureLayout(findNodeHandle(this.textInput), (x, y, w, h) => {
                  //   console.log('x, h, w, h', x, y, w, h);
                  //   scrollRef.props.scrollToPosition(0, y, true);
                  // });
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
          {rootPickup.address && showRadius && (
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
                ? this.singleRangeSlider(true, 'root')
                : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setState((prevState) => ({ expandedRadius: !prevState.expandedRadius }))}
                    style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter]}
                  >
                    <View style={[styles.circleGreen, styles.darkGreenBg]} />
                    <Text style={[styles.smallerSize, styles.defaultTextColor, styles.bold, styles.mt5]}>
                      {(rootPickup.radius || rootPickup.radius === 0) ? rootPickup.radius : valueRange}
                      {' '}
                      km
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>
        {rootPickup && anotherPickup && anotherPickup.map((item, index) => (
          item.isShow && (
            <AnotherPickup
              scrollRef={scrollRef}
              index={index}
              item={item}
              key={`item-${index + 1}`}
              anotherPickup={anotherPickup}
              setRadius={this.handleSlidingRadius}
              removeAddress={this.removePickupAddress}
              dataConfig={dataConfig}
              countryCode={countryCode}
              onGetResultAddress={this.onSelectAddress}
            />
          )))}
      </View>
    );
  }
}

export default FillterPickup;
