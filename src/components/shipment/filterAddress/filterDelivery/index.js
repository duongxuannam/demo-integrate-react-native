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
import APP_CONSTANT from '../../../../helpers/constant.helper';
import Slider from '../../../../plugins/Slider';
import AnotherDelivery from './anotherDelivery';
import styles from '../../style';
import SYSTEM from '../../../../config/system';
import { height } from '../../../../helpers/scaling.helpers';

class FilterDelivery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRadius: false,
      valueRange: APP_CONSTANT.DEFAULT_RADIUS,
      showRadius: true,
      listViewDisplayed: false,
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

  handleRemoveAddress = () => {
    this.removeDeliveryAddress('root');
    if (this.googleRef) {
      this.googleRef.setAddressText('');
    }
  }

  removeDeliveryAddress = (type, index) => {
    const { actions } = this.props;
    this.setState({
      listViewDisplayed: false,
    });
    switch (type) {
      case 'root':
        actions.removeDeliveryAddress(true);
        break;
      case 'another':
        actions.removeDeliveryAddress(false, index);
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
    const { rootDelivery, dataConfig } = this.props;
    return (
      <View style={[styles.ml15, styles.mr15, styles.mt10]}>
        <Slider
          minimumValue={dataConfig.MinRadius}
          maximumValue={dataConfig.MaxRadius}
          value={(rootDelivery.radius || rootDelivery.radius === 0) ? rootDelivery.radius : valueRange}
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
              {(rootDelivery.radius || rootDelivery.radius === 0) ? rootDelivery.radius : valueRange}
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
      rootDelivery,
      anotherDelivery,
      languageCode,
      dataConfig,
      countryCode,
      scrollRef
    } = this.props;
    const {
      expandedRadius, valueRange, showRadius, listViewDisplayed
    } = this.state;
    return (
      <View>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.medium]}>
          {I18n.t('filter.delivery', { locale: languageCode })}
        </Text>
        <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
          <View style={expandedRadius ? { flex: 3 } : styles.flexOne}>
            <GooglePlacesAutocomplete
              ref={this.getGoogleRef}
              minLength={2}
              autoFocus={false}
              onPress={(data) => this.onSelectAddress(data, { isPickup: false, type: 'root' })}
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
              getDefaultValue={() => rootDelivery.address || ''}
              renderLeftButton={() => (
                <View style={[styles.flex, styles.alignItemsCenter, styles.ml15]}>
                  <Image source={IMAGE_CONSTANT.pickupLocation} />
                </View>
              )}
              renderRightButton={() => {
                if (!expandedRadius && rootDelivery && rootDelivery.address) {
                  return (
                    <View
                      style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, { width: 40, height: '100%' }]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.alignItemsCenter, styles.justifyContentCenter, styles.w100per, styles.h100per]}
                        onPress={this.handleRemoveAddress}
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
                value: rootDelivery.address || this.textInput,
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
          {rootDelivery && rootDelivery.address && showRadius && (
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
                ? this.singleRangeSlider(false, 'root')
                : (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.setState((prevState) => ({ expandedRadius: !prevState.expandedRadius }))}
                    style={[styles.flexColumn, styles.alignItemsCenter, styles.justifyContentCenter]}
                  >
                    <View style={[styles.circleGreen, styles.darkGreenBg]} />
                    <Text style={[styles.smallerSize, styles.defaultTextColor, styles.mt5, styles.bold]}>
                      {(rootDelivery.radius || rootDelivery.radius === 0) ? rootDelivery.radius : valueRange}
                      {' '}
                      km
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </View>
        {rootDelivery && anotherDelivery && anotherDelivery.map((item, index) => (
          item.isShow && (
            <AnotherDelivery
              index={index}
              item={item}
              key={`item-${index + 1}`}
              anotherDelivery={anotherDelivery}
              setRadius={(isPickup, type, i, data) => this.handleSlidingRadius(isPickup, type, i, data)}
              removeAddress={(type, i) => this.removeDeliveryAddress(type, i)}
              dataConfig={dataConfig}
              countryCode={countryCode}
              onGetResultAddress={this.onSelectAddress}
              scrollRef={scrollRef}
            />
          )))}
      </View>
    );
  }
}

export default FilterDelivery;
