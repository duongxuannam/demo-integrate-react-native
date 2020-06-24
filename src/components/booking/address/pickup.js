/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Radio, DatePicker } from 'native-base';
import moment from 'moment';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import authActions from '../../../store/actions/authAction';

// COMPONENTS
import Select from '../../common/Select';
import Services from '../services_types/Services';
import CargopediaMap from '../map/CargopediaMap';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import { DATE_FORMAT } from '../../../constants/app';

//
import I18n from '../../../config/locales';

// CSS
import styles from '../style';

class Pickup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      booking: props.booking,
      expanded: false,
      dropdown: false,
      showMap: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.setState({ selected });
  }

  showDropdown() {
    const { dropdown } = this.state;
    this.setState({ dropdown: !dropdown });
  }

  handleDelete() {
    const { booking } = this.state;
    const { onDelete } = this.props;
    onDelete(booking);
  }

  renderPickupDate() {
    const { countryCode, languageCode } = this.props;
    return (
      <View style={styles.mb20}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
          {I18n.t('listing.pickup_date', { locale: languageCode })}
        </Text>
        <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Image source={IMAGE_CONSTANT.calendarIcon} />
          </View>
          <DatePicker
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2018, 12, 31)}
            locale={countryCode}
            formatChosenDate={(date) => (moment(date).format(DATE_FORMAT))}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType="fade"
            androidMode="default"
          />
        </View>
      </View>
    );
  }

  renderDestinationDate() {
    const { booking } = this.state;
    const { languageCode } = this.props;
    return (
      <>
        <View style={styles.mb20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('listing.destination_date_range', { locale: languageCode })}
          </Text>
          <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Radio
                selected
                color="#3fae29"
                selectedColor="#3fae29"
              />
              <Text style={[styles.defaultSize, styles.ml10]}>
                {I18n.t('listing.days', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.flex, styles.alignItemsCenter, styles.ml20]}>
              <Radio
                selected={false}
                color="#3fae29"
                selectedColor="#3fae29"
              />
              <Text style={[styles.defaultSize, styles.ml10]}>
                {I18n.t('listing.date_range', { locale: languageCode })}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.mb20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('listing.earliest_by', { locale: languageCode })}
          </Text>
          <View style={styles.mt10}>
            <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
              <TextInput
                style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                value={booking.time}
                placeholder="Today"
              />
              <TouchableOpacity
                style={[styles.buttonAction, styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionSize, styles.defaultTextColor]}>
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionSize, styles.whiteText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mb20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('listing.latest_by', { locale: languageCode })}
          </Text>
          <View style={styles.mt10}>
            <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
              <TextInput
                style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                value={booking.time}
                placeholder="Today"
              />
              <TouchableOpacity
                style={[styles.buttonAction, styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionSize, styles.defaultTextColor]}>
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
              >
                <Text style={[styles.actionSize, styles.whiteText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    );
  }

  render() {
    const {
      booking, dropdown, expanded, selected, showMap, languageCode,
    } = this.state;
    const { isFirstLocation } = this.props;
    return (
      <>
        <View style={styles.flex}>
          <Text style={styles.formHeader}>
            {booking.name}
          </Text>
          {!isFirstLocation && (
            <>
              <TouchableOpacity
                style={[styles.flexOne, styles.flex, styles.justifyContentEnd, styles.alignItemsCenter, styles.pr20, styles.mb5]}
                activeOpacity={0.9}
                ref={ref => this.touchable = ref}
                onPress={() => this.showDropdown()}
              >
                <Image source={IMAGE_CONSTANT.groupMenu} style={{ width: 31, height: 8 }} />
              </TouchableOpacity>
              {dropdown && (
                <View style={styles.dropdown}>
                  <View style={styles.dropdownArrow} />
                  <View style={styles.dropdownGroup}>
                    <TouchableOpacity
                      style={[styles.flex, styles.alignItemsCenter, styles.mb20]}
                      activeOpacity={0.9}
                      onPress={() => alert('1')}
                    >
                      <Image source={IMAGE_CONSTANT.duplicateIcon} />
                      <Text style={[styles.defaultSize, styles.ml10]}>
                        {I18n.t('listing.duplicate', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.flex, styles.alignItemsCenter]}
                      activeOpacity={0.9}
                      onPress={() => this.handleDelete(booking)}
                    >
                      <Image source={IMAGE_CONSTANT.deleteIconRed} style={{ width: 17, height: 21 }} />
                      <Text style={[styles.defaultSize, styles.ml10]}>
                        {I18n.t('listing.remove', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.pt30, styles.mb30, styles.formLine]}>
          {isFirstLocation ? this.renderPickupDate() : this.renderDestinationDate()}
          <View style={styles.mb30}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {isFirstLocation ? I18n.t('listing.pickup_location_type', { locale: languageCode }) : I18n.t('listing.destination_location_type', { locale: languageCode })}
            </Text>
            <View style={styles.mt10}>
              <Select
                placeholder={I18n.t('listing.select_location_type', { locale: languageCode })}
                source={booking.locations_type}
                selectedValue={selected}
                onValueChange={this.handleChange}
              />
            </View>
          </View>
          <View style={styles.mb30}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.flexOne]}>
                {isFirstLocation ? I18n.t('listing.pickup_address', { locale: languageCode }) : I18n.t('listing.des_address', { locale: languageCode })}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState((prevState) => ({
                  showMap: !prevState.showMap,
                }), () => {
                  // const { onSelectFromMap } = this.props
                  // onSelectFromMap(booking, isFirstLocation)
                })
                }
              >
                <Text style={[styles.defaultSize, showMap ? styles.redText : styles.mainColorText]}>
                  {showMap ? I18n.t('listing.close_map', { locale: languageCode }) : I18n.t('listing.select_on_map', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Render Map & Pin Location - Deliveree will provide icon marker */}
            {showMap && <CargopediaMap />}
            {/* End Render Map & Pin Location - Deliveree will provide icon marker */}
            <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.mr10}>
                <Image source={IMAGE_CONSTANT.pickupLocation} />
                {/*<Image source={IMAGE_CONSTANT.destinationLocation} />*/}
              </View>
              <Text style={styles.defaultSize}>
                {booking.location.address}
              </Text>
            </View>
          </View>
          {expanded && (
            <>
              <View style={[styles.lineSilver, styles.mb30]} />
              <View style={styles.mb10}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.location_services', { locale: languageCode })}
                </Text>
                <View style={styles.mt20}>
                  <Services source={booking.locations_services} />
                </View>
              </View>
            </>
          )}
          <View style={styles.lineAction} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
              {expanded
                ? <Image source={IMAGE_CONSTANT.hideExpand} />
                : <Image source={IMAGE_CONSTANT.showExpand} />
              }
              <Text style={[styles.ml10, styles.defaultSize, styles.mainColorText, styles.bold]}>
                {expanded ? 'Hide Options' : 'Options'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  countryCode: state.app.countryCode,
  pickupState: state.listing.pickup,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...authActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Pickup);
