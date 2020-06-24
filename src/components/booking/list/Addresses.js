/* eslint-disable class-methods-use-this */
import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import { Radio } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import listingActions from '../../../store/actions/listingAction';
import appActions from '../../../store/actions/appAction';
import Attactments from '../attactments/Attactments';
import { Select, Option } from '../../common/chooseDropdown';
import Services from '../services_types/Services';
import CargopediaMap from '../map/CargopediaMap';
import DuplicateIcon from '../../common/DuplicateIcon';
import { getDistanceMatrix } from '../../../api/listing';
import IMAGE_CONSTANT from '../../../constants/images';
import {
  DATE_RANGE_TYPE,
  LATEST_DAY_PLUS,
  VALIDATE_TYPE,
  EARLY_DAY_PLUS,
  MODAL_STATUS,
  COMMON,
  DATE_FORMAT,
  DATE_FORMAT_VN,
} from '../../../constants/app';
import I18n from '../../../config/locales';
import { getDayFromTimeAddress, newLastDate } from '../../../helpers/number';
import { dateClientWithISOString } from '../../../helpers/date.helper';
import styles from '../style';
import {
  getNameLocationType,
  parseLocationServicesToObject,
  computeDifferenceAddress,
  secondsToDay,
} from '../../../helpers/shipment.helper';
import { GOOGLE_API_KEY } from '../../../config/system';

class Addresses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // ...pickupFormat,
      expanded: !!props.isUpdate,
      dropdown: false,
      showMap: !!props.isUpdate,
      submit: false,
      listViewDisplayed: false,
      note: '',
      currentAddress: '',
      isEditingState: false,
      focusInput: false,
      ...props.initData,
    };
    this.addressRef = null;
    this.handleChangeLocationType = this.handleChangeLocationType.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeServices = this.changeServices.bind(this);
    this.returnAddressData = this.returnAddressData.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.changeDateEarly = this.changeDateEarly.bind(this);
    this.changeDateLatest = this.changeDateLatest.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.validatePickup = this.validatePickup.bind(this);
    this.validateDestination = this.validateDestination.bind(this);

    this.homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
    this.workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };
  }

  componentDidMount() {
    const {
      listing, actions, isPickup, isUpdate, session, isEditing,
      initData
    } = this.props;

    if (isEditing) {
      this.setState({
        locationTypeId: initData.locationTypeId,
      });
    }

    if (isPickup && !listing.pickupDate) {
      actions.updatePickupAddress({ ...listing.pickupAddress, minPickupDate: newLastDate() });
      actions.updatePickupDate(newLastDate());
    }

    if (isUpdate) {
      this.setState({
        note: session.note,
      });
    }

    if (isUpdate && !isPickup) {
      this.setState({
        dateRangeType: session.dateRangeType,
        earliestBy: session.earliestBy,
        earliestByDate: session.earliestByDate,
        latestBy: session.latestBy,
        latestByDate: session.latestByDate,
      });
      this.setMinday();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      addressKey, listing, isPickup, isUpdate
    } = this.props;
    const { duration } = this.state;
    if (!isUpdate) {
      if (listing.destinationAddress[addressKey]) {
        const newDuration = listing.destinationAddress[addressKey].duration;
        // update location pickup
        if (!isPickup) {
          if (newDuration !== duration) {
            const earliestBy = getDayFromTimeAddress(newDuration);
            if (earliestBy) {
              const latestBy = earliestBy ? earliestBy + LATEST_DAY_PLUS : earliestBy;
              const earliestByDate = moment(listing.pickupDate).add(earliestBy, 'd').format(DATE_FORMAT);
              const latestByDate = moment(listing.pickupDate).add(earliestBy + LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
              this.setState({
                duration: newDuration,
                minDay: earliestBy,
                earliestBy,
                latestBy,
                earliestByDate,
                latestByDate,
              });
            }
            // check change pickup date and has duration
          } else if (duration && prevProps.listing.pickupDate !== listing.pickupDate) {
            // check new pickup date biger early
            const durationDate = getDayFromTimeAddress(duration);
            let { earliestByDate, latestByDate } = this.state;
            let { earliestBy, latestBy } = this.state;
            const pickupDate = newLastDate(listing.pickupDate);
            let newDate = moment();
            newDate = moment(pickupDate).add(durationDate - 1, 'd').format(DATE_FORMAT);
            // set early and latest
            earliestBy = moment(earliestByDate).diff(pickupDate, 'd');
            latestBy = moment(latestByDate).diff(pickupDate, 'd');
            // reset earliestBy, earlyBy
            if (new Date(newDate) >= new Date(earliestByDate)) {
              // earliestByDate.setDate(newDate.getDate());
              earliestByDate = moment(newDate).add(1, 'd');
              earliestBy = durationDate;
            }
            // reset latestByDate, latestBy
            newDate = moment(pickupDate).add(durationDate + LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
            if (new Date(newDate) >= new Date(latestByDate)) {
              latestByDate = newDate;
              latestBy = durationDate + LATEST_DAY_PLUS;
            }
            this.setState({
              earliestBy,
              minDay: earliestBy,
              latestBy,
              earliestByDate,
              latestByDate,
            });
          } else {
            const minDay = getDayFromTimeAddress(newDuration);
            this.setState({
              minDay,
            });
          }
        }
      }
    }
  }

  setMinday = async () => {
    const { shipmentDetail, session } = this.props;
    const pickupCoors = {
      latitude: shipmentDetail.addresses.pickup.location.latitude,
      longitude: shipmentDetail.addresses.pickup.location.longitude,
    };
    const diff = await computeDifferenceAddress(pickupCoors, [session]);
    const duration = diff[0].routes[0].legs[0].duration.value;
    const diffDay = secondsToDay(duration);
    this.setState({
      minDay: diffDay,
    });
  }

  valueMinEarlyDate = (pickupDate) => {
    const minEarliestByDate = moment(pickupDate).add(EARLY_DAY_PLUS, 'd').format(DATE_FORMAT);
    return minEarliestByDate;
  }

  valueMinLatestDate = (duration, pickupDate) => {
    const minLatestDate = moment(pickupDate).add(duration + LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
    return minLatestDate;
  }


  updateAddress = async (address, longitude, latitude, shortAddress) => {
    const {
      addressKey,
      isPickup,
      actions,
      listing,
      isUpdate,
      updateAddressFromMap,
    } = this.props;
    const { destinationAddress, pickupAddress, shipmentDetail } = listing;
    this.setState({
      address,
      currentAddress: address,
      listViewDisplayed: false,
    });
    if (isUpdate) {
      if (isPickup) {
        const validAddress = shipmentDetail.addresses.destinations.find((item) => item.location.latitude === latitude && item.location.longitude === longitude);
        if (typeof validAddress !== 'undefined') {
          Alert.alert('Notice', 'We can not choose this place, please choose another place!');
          return;
        }
      }
      if (shipmentDetail.addresses.pickup.location.latitude === latitude && shipmentDetail.addresses.pickup.location.longitude === longitude) {
        Alert.alert('Notice', 'We can not choose this place, please choose another place!');
        return;
      }
      const validAdress = await getDistanceMatrix({
        latitude,
        longitude,
      }, {
        latitude: shipmentDetail.addresses.destinations[0].location.latitude,
        longitude: shipmentDetail.addresses.destinations[0].location.longitude,
      });
      if (validAdress.status === 'OK') {
        updateAddressFromMap(address, longitude, latitude, shortAddress);
      } else {
        Alert.alert('We can not choose this place, please choose another place!');
      }
      return;
    }
    if (isPickup) {
      const keyObj = Object.keys(destinationAddress);
      const desHasAddress = [];
      keyObj.forEach((key) => {
        if (destinationAddress[key].address) {
          desHasAddress.push(destinationAddress[key]);
        }
      });
      if (desHasAddress.length) {
        const validAddress = desHasAddress.find((des) => des.latitude === latitude && des.longitude === longitude);
        if (typeof validAddress !== 'undefined') {
          Alert.alert('Notice', 'We can not choose this place, please choose another place!');
          return;
        }
        const validAdress = await getDistanceMatrix({
          latitude,
          longitude,
        }, {
          latitude: desHasAddress[0].latitude,
          longitude: desHasAddress[0].longitude,
        });
        if (validAdress.status === 'OK') {
          actions.getDistanceMatrix({
            pickup: {
              ...listing.pickupAddress,
              address,
              longitude,
              latitude,
              shortAddress,
            },
            destinations: destinationAddress,
          });
        } else {
          Alert.alert('We can not choose this place, please choose another place!');
        }
      } else {
        actions.updatePickupAddress({
          ...listing.pickupAddress, address, longitude, latitude, shortAddress,
        });
      }
    } else if (Object.entries(pickupAddress).length > 0 && pickupAddress.address) {
      const validAdress = await getDistanceMatrix({ latitude: pickupAddress.latitude, longitude: pickupAddress.longitude }, {
        latitude,
        longitude,
      });
      if (pickupAddress.latitude === latitude && pickupAddress.longitude === longitude) {
        Alert.alert('Notice', 'We can not choose this place, please choose another place!');
        return;
      }

      if (validAdress.status === 'OK') {
        destinationAddress[addressKey] = {
          address, longitude, latitude, shortAddress
        };
        actions.getDistanceMatrix({
          pickup: pickupAddress,
          destinations: destinationAddress,
          addressKey,
        });
      } else {
        Alert.alert('We can not choose this place, please choose another place!');
      }
    } else {
      console.log('this.state 2', this.state);
      destinationAddress[addressKey] = {
        address, longitude, latitude, shortAddress
      };
      actions.updateDestinationAddress({ ...destinationAddress });
    }
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? DATE_FORMAT : DATE_FORMAT_VN;
    }
    return DATE_FORMAT;
  }

  handleChangeLocationType = (locationTypeId) => {
    const { actions, isUpdate } = this.props;
    if (isUpdate) {
      actions.setAddressDataUpdating({
        locationTypeId: locationTypeId.value,
      });
    }
    this.setState({ locationTypeId: locationTypeId.value });
  }

  handleChangeNote = (val) => {
    const { actions } = this.props;
    const { note } = this.state;
    actions.setAddressDataUpdating({
      note,
    });
  }

  returnAddressData(ignoreValidate) {
    const { isPickup, listing, addressKey, draftAddress, draftId, destinationInfo } = this.props;
    const { destinationAddress } = listing;
    this.setState({ submit: !ignoreValidate });
    console.log('returnAddressData addressKey', addressKey);
    console.log('returnAddressData destinationAddress', destinationAddress);
    console.log('returnAddressData draftAddress', draftAddress);
    console.log('returnAddressData destinationInfo', destinationInfo);
    if (isPickup) {
      const data = {
        ...this.state,
        ...listing.pickupAddress,
        pickupDate: listing.pickupDate
      };
      console.log('')
      if (ignoreValidate) {
        return data;
      }

      // validate form
      if (this.validatePickup()) {
        return data;
      }

      return false;
    }
    const data = {
      ...this.state,
      ...destinationAddress[addressKey],
      id: draftId ? destinationInfo.id : addressKey + 1,
      latitude: destinationAddress[addressKey] && destinationAddress[addressKey].latitude,
      longitude: destinationAddress[addressKey] && destinationAddress[addressKey].longitude
    };
    console.log('data', data);
    if (ignoreValidate) {
      return data;
    }

    // validate form
    if (this.validateDestination()) {
      return data;
    }

    return false;
  }

  validatePickup() {
    const { listing } = this.props;
    const data = {
      ...this.state, ...listing.pickupAddress
    };
    return !this.validateForm(VALIDATE_TYPE.LOCATION_TYPE, data.locationTypeId)
      && !this.validateForm(VALIDATE_TYPE.ADDRESS, data.address);
  }

  validateDestination() {
    const { listing, addressKey } = this.props;
    const data = {
      ...this.state, ...listing.destinationAddress[addressKey]
    };
    return !this.validateForm(VALIDATE_TYPE.EARLY_DATE, data.earliestByDate)
      && !this.validateForm(VALIDATE_TYPE.LATEST_DATE, data.latestByDate)
      && !this.validateForm(VALIDATE_TYPE.EARLY_DAY, data.earliestBy)
      && !this.validateForm(VALIDATE_TYPE.LATEST_DAY, data.latestBy)
      && !this.validateForm(VALIDATE_TYPE.ADDRESS, data.address)
      && !this.validateForm(VALIDATE_TYPE.LOCATION_TYPE, data.locationTypeId);
  }

  duplicate() {
    // duplicate
    const {
      earliestByDate, latestByDate, earliestBy, latestBy, locationTypeId, locationServices
    } = this.state;
    const { listing, addressKey } = this.props;
    const address = listing.destinationAddress[addressKey] ? listing.destinationAddress[addressKey].address : null;
    if (
      !this.validateForm(VALIDATE_TYPE.EARLY_DAY, earliestBy)
      || !this.validateForm(VALIDATE_TYPE.LATEST_DAY, latestBy)
      || !this.validateForm(VALIDATE_TYPE.ADDRESS, address)
      || !this.validateForm(VALIDATE_TYPE.LOCATION_TYPE, locationTypeId)
      || !this.validateForm(VALIDATE_TYPE.EARLY_DATE, earliestByDate)
      || !this.validateForm(VALIDATE_TYPE.LATEST_DATE, latestByDate)
    ) {
      const {
        addressLength, actions, duplicateAction
      } = this.props;
      const { destinationAddress } = listing;
      destinationAddress[addressLength] = { ...destinationAddress[addressKey] };
      actions.updateDestinationAddress({ ...destinationAddress });
      // reset some state
      const dataReset = {
        dropdown: false,
        submit: false
      };

      this.setState({ ...dataReset });
      duplicateAction({ ...this.state, ...dataReset });
    }
  }

  removeAddress() {
    const {
      listing, addressKey, addressLength, actions
    } = this.props;
    const { destinationAddress } = listing;
    let i;
    for (i = addressKey; i < addressLength - 1; i += 1) {
      destinationAddress[i] = { ...destinationAddress[(i + 1)] };
    }
    delete destinationAddress[addressLength - 1];
    actions.updateDestinationAddress({ ...destinationAddress });
  }

  validateForm(type, value) {
    const { listing } = this.props;
    let isError = null;
    switch (type) {
      case VALIDATE_TYPE.EARLY_DATE:
      case VALIDATE_TYPE.LATEST_DATE:
      case VALIDATE_TYPE.ADDRESS:
      case VALIDATE_TYPE.LOCATION_TYPE:
      case VALIDATE_TYPE.EARLY_DAY:
      case VALIDATE_TYPE.LATEST_DAY:
        isError = !value; break;
      default: return false;
    }
    if (isError) { return (<Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />); }
    return false;
  }

  showDropdown() {
    const { dropdown } = this.state;
    this.setState({ dropdown: !dropdown });
  }

  handleDelete() {
    const { onDelete, addressKey } = this.props;
    onDelete(addressKey, true);
  }

  changeDate(dateStr, pickupDate) {
    const {
      actions,
      isUpdate,
      updatePickupDate,
    } = this.props;
    if (isUpdate) {
      updatePickupDate(pickupDate);
      return;
    }
    actions.updatePickupDate(newLastDate(pickupDate));
  }

  changeDateEarly(dateStr, data) {
    const earliestByDate = moment(data).format(DATE_FORMAT);
    let {
      latestByDate,
      latestBy,
      earliestBy
    } = this.state;
    const {
      listing,
      isUpdate,
      actions,
      shipmentDetail,
    } = this.props;
    if (isUpdate) {
      const pickupDate = moment(shipmentDetail.addresses.pickup.pickupDate).format(DATE_FORMAT);
      this.setState({

      });
      actions.setAddressDataUpdating({
        earliestByDate: moment(data).utc().toISOString(),
        latestByDate: moment(data).add(LATEST_DAY_PLUS, 'd').utc().toISOString(),
        earliestBy: moment(earliestByDate).diff(pickupDate, 'd'),
        latestBy: moment(data).add(LATEST_DAY_PLUS, 'd').diff(pickupDate, 'd'),
      });
      return;
    }
    if (moment(latestByDate).diff(earliestByDate, 'd') < LATEST_DAY_PLUS) {
      latestByDate = moment(earliestByDate).add(LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
    }
    const pickupDate = moment(listing.pickupDate).format(DATE_FORMAT);

   
    earliestBy = moment(earliestByDate).diff(pickupDate, 'd');
    latestBy = moment(latestByDate).diff(pickupDate, 'd');
    this.setState({
      earliestByDate,
      latestByDate,
      earliestBy,
      latestBy,
    });
  }

  changeDateLatest(dateStr, data) {
    const {
      listing, isUpdate, actions, shipmentDetail
    } = this.props;
    if (isUpdate) {
      const latestByDate = moment(data).format(DATE_FORMAT);
      const pickupDate = moment(shipmentDetail.addresses.pickup.pickupDate).format(DATE_FORMAT);
      actions.setAddressDataUpdating({
        latestByDate: moment(data).utc().toISOString(),
        latestBy: moment(latestByDate).diff(pickupDate, 'd'),
      });
      return;
    }
    const pickupDate = moment(listing.pickupDate).format(DATE_FORMAT);
    const latestByDate = moment(data).format(DATE_FORMAT);
    this.setState({
      latestByDate,
      latestBy: moment(latestByDate).diff(pickupDate, 'd'),
    });
  }

  changeServices(locationServices) {
    const { actions, isUpdate } = this.props;
    if (isUpdate) {
      actions.setAddressDataUpdating({
        locationServices: Object.keys(locationServices),
      });
    }
    this.setState({ locationServices: { ...locationServices } });
  }

  changeDateRange(dateRangeType) { this.setState({ dateRangeType }); }

  handlePressPlus(name = 'earliestBy') {
    let {
      earliestBy, latestBy, earliestByDate, latestByDate,
    } = this.state;
    const {
      listing, isUpdate, actions, session
    } = this.props;
    if (isUpdate) {
      const earliestByDateClientTime = dateClientWithISOString(session.earliestByDate);
      const latestByDateClientTime = dateClientWithISOString(session.latestByDate);
      if (name === 'earliestBy') {
        actions.setAddressDataUpdating({
          earliestBy: session.earliestBy + 1,
          latestBy: session.earliestBy + 1 + 2,
          earliestByDate: moment(earliestByDateClientTime).add(1, 'd').utc().toISOString(),
          latestByDate: moment(latestByDateClientTime).add(1, 'd').utc().toISOString(),
        });
      } else {
        actions.setAddressDataUpdating({
          latestBy: session.latestBy + 1,
          latestByDate: moment(latestByDateClientTime).add(1, 'd').utc().toISOString(),
        });
      }
      return true;
    }
    if (name === 'earliestBy' && earliestBy) {
      earliestBy += 1;
      earliestByDate = newLastDate(listing.pickupDate);
      earliestByDate = moment(listing.pickupDate).add(earliestBy, 'd').format(DATE_FORMAT);
      if (earliestBy && (latestBy - earliestBy < LATEST_DAY_PLUS)) {
        latestBy = earliestBy + LATEST_DAY_PLUS;
        latestByDate = newLastDate(listing.pickupDate);
        latestByDate = moment(listing.pickupDate).add(latestBy, 'd').format(DATE_FORMAT);
      }
    } else if (latestBy) {
      latestBy += 1;
      latestByDate = moment(listing.pickupDate).add(latestBy, 'd').format(DATE_FORMAT);
    }
    this.setState({
      earliestBy, latestBy, earliestByDate, latestByDate,
    });
  }

  handlePressMinus(name = 'earliestBy') {
    let {
      earliestBy, latestBy, earliestByDate, latestByDate,
    } = this.state;
    const {
      listing, isUpdate, actions, session
    } = this.props;
    const { minDay } = this.state;
    if (isUpdate) {
      const earliestByDateClientTime = dateClientWithISOString(session.earliestByDate);
      const latestByDateClientTime = dateClientWithISOString(session.latestByDate);
      if (name === 'earliestBy') {
        if (session.earliestBy && session.earliestBy > minDay) {
          actions.setAddressDataUpdating({
            earliestBy: session.earliestBy - 1,
            earliestByDate: moment(earliestByDateClientTime).subtract(1, 'd').utc().toISOString(),
          });
        }
      } else if (session.latestBy - session.earliestBy > LATEST_DAY_PLUS) {
        actions.setAddressDataUpdating({
          latestBy: session.latestBy - 1,
          latestByDate: moment(latestByDateClientTime).subtract(1, 'd').utc().toISOString(),
        });
      }
      return true;
    }
    if (name === 'earliestBy') {
      if (earliestBy && earliestBy > minDay) {
        earliestBy -= 1;
        earliestByDate = moment(listing.pickupDate).add(earliestBy, 'd').format(DATE_FORMAT);
      }
    } else if (latestBy && (latestBy - earliestBy > LATEST_DAY_PLUS)) {
      latestBy -= 1;
      latestByDate = moment(listing.pickupDate).add(latestBy, 'd').format(DATE_FORMAT);
    }
    this.setState({
      earliestBy, latestBy, earliestByDate, latestByDate,
    });
  }

  renderPickupDate() {
    const {
      app, listing, isUpdate, session
    } = this.props;
    if (!isUpdate) {
      const pickupDate = listing.pickupDate ? newLastDate(listing.pickupDate) : null;
      const minPickupDate = listing.pickupAddress.minPickupDate ? newLastDate(listing.pickupAddress.minPickupDate) : new Date();
      const maxPickupDate = moment(new Date()).add(COMMON.LIMIT_PICKUP_DATE, 'd');
      return (
        <View style={styles.mb20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('listing.pickup_date', { locale: app.languageCode })}
          </Text>
          <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
            <View style={styles.mr10}>
              <Image source={IMAGE_CONSTANT.calendarIcon} />
            </View>
            {pickupDate && (
              <DatePicker
                date={pickupDate}
                minDate={minPickupDate}
                maxDate={new Date(maxPickupDate)}
                mode="date"
                locale={app.countryCode}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
                androidMode="default"
                onDateChange={(dateStr, date) => this.changeDate(dateStr, date)}
                showIcon={false}
                style={{ flex: 1 }}
                customStyles={{
                  dateInput: {
                    paddingLeft: 0,
                    marginLeft: 0,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                    textAlign: 'left'
                  },
                }}
              />
            )}
          </View>
        </View>
      );
    }
    const pickupDate = session.pickupDate ? dateClientWithISOString(session.pickupDate) : null;
    return (
      <View style={styles.mb20}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
          {I18n.t('shipment.address.date', { locale: app.languageCode })}
        </Text>
        <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Image source={IMAGE_CONSTANT.calendarIcon} />
          </View>
          {session && (
            <DatePicker
              date={new Date(pickupDate)}
              minDate={new Date()}
              mode="date"
              locale={app.countryCode}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
              androidMode="default"
              onDateChange={(dateStr, date) => this.changeDate(dateStr, date)}
              showIcon={false}
              style={{ flex: 1 }}
              customStyles={{
                dateInput: {
                  paddingLeft: 0,
                  marginLeft: 0,
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  textAlign: 'left'
                },
              }}
            />
          )}
        </View>
      </View>
    );
  }

  renderDestinationDate() {
    const { dateRangeType } = this.state;
    const { app, isUpdate } = this.props;
    if (!isUpdate) {
      return (
        <View>
          <View style={styles.mb20}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {I18n.t('listing.destination_date_range', { locale: app.languageCode })}
            </Text>
            <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
              <TouchableOpacity
                style={[styles.flex, styles.alignItemsCenter]}
                onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DAYS)}
              >
                <Radio
                  selected={dateRangeType === DATE_RANGE_TYPE.DAYS}
                  color="#3fae29"
                  selectedColor="#3fae29"
                  standardStyle
                  onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DAYS)}
                />
                <Text style={[styles.defaultSize, styles.ml10]}>
                  {I18n.t('listing.days', { locale: app.languageCode })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flex, styles.alignItemsCenter, styles.ml20]}
                onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DATE_RANGE)}
              >
                <Radio
                  selected={dateRangeType === DATE_RANGE_TYPE.DATE_RANGE}
                  color="#3fae29"
                  selectedColor="#3fae29"
                  standardStyle
                  onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DATE_RANGE)}
                />
                <Text style={[styles.defaultSize, styles.ml10]}>
                  {I18n.t('listing.date_range', { locale: app.languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {dateRangeType === DATE_RANGE_TYPE.DAYS ? this.renderTypeDays() : this.renderTypeDateRange()}
        </View>
      );
    }
    return (
      <View>
        <View style={styles.mb20}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('listing.destination_date_range', { locale: app.languageCode })}
          </Text>
          <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter]}
              onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DAYS)}
            >
              <Radio
                selected={dateRangeType === DATE_RANGE_TYPE.DAYS}
                color="#3fae29"
                selectedColor="#3fae29"
                standardStyle
                onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DAYS)}
              />
              <Text style={[styles.defaultSize, styles.ml10]}>
                {I18n.t('listing.days', { locale: app.languageCode })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter, styles.ml20]}
              onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DATE_RANGE)}
            >
              <Radio
                selected={dateRangeType === DATE_RANGE_TYPE.DATE_RANGE}
                color="#3fae29"
                selectedColor="#3fae29"
                standardStyle
                onPress={() => this.changeDateRange(DATE_RANGE_TYPE.DATE_RANGE)}
              />
              <Text style={[styles.defaultSize, styles.ml10]}>
                {I18n.t('listing.date_range', { locale: app.languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {dateRangeType === DATE_RANGE_TYPE.DAYS ? this.renderTypeDays() : this.renderTypeDateRange()}
      </View>
    );
  }

  renderTypeDateRange() {
    const {
      app, listing, isUpdate, session, shipmentDetail
    } = this.props;
    const {
      earliestByDate, latestByDate, submit, earliestBy
    } = this.state;
    if (!isUpdate) {
      const earliestByDateClientTime = earliestByDate ? dateClientWithISOString(moment(earliestByDate).utc().toISOString()) : null;
      const latestByDateClientTime = latestByDate ? dateClientWithISOString(moment(latestByDate).utc().toISOString()) : null;
      const pickupDateClientTime = dateClientWithISOString(moment(listing.pickupDate).utc().toISOString());
      const minDateEarly = moment(pickupDateClientTime).add(1, 'd').format(DATE_FORMAT);
      const minDateLatest = moment(earliestByDateClientTime).add(LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
      return (
        <View>
          <View style={styles.mb20}>
            {
              ((submit && this.validateForm(VALIDATE_TYPE.EARLY_DATE, earliestByDate)) ? (
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.errorText]}>
                    {I18n.t('listing.earliest_by', { locale: app.languageCode })}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.earliest_by', { locale: app.languageCode })}
                </Text>
              ))
            }
            <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.mr10}>
                <Image source={IMAGE_CONSTANT.calendarIcon} />
              </View>
              {earliestByDate ? (
                <DatePicker
                  date={new Date(earliestByDateClientTime)}
                  minDate={new Date(minDateEarly)}
                  mode="date"
                  locale={app.countryCode}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
                  androidMode="default"
                  onDateChange={(dateStr, date) => this.changeDateEarly(dateStr, date)}
                  showIcon={false}
                  style={{ flex: 1 }}
                  customStyles={{
                    dateInput: {
                      paddingLeft: 0,
                      marginLeft: 0,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                      textAlign: 'left'
                    },
                  }}
                />
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.grayText]}>
                  {I18n.t('listing.earliest_by', { locale: app.languageCode })}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.mb20}>
            {
              ((submit && this.validateForm(VALIDATE_TYPE.LATEST_DATE, latestByDate)) ? (
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.errorText]}>
                    {I18n.t('listing.latest_by', { locale: app.languageCode })}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.latest_by', { locale: app.languageCode })}
                </Text>
              ))
            }
            <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.mr10}>
                <Image source={IMAGE_CONSTANT.calendarIcon} />
              </View>
              {latestByDate ? (
                <DatePicker
                  date={new Date(latestByDateClientTime)}
                  minDate={new Date(minDateLatest)}
                  mode="date"
                  locale={app.countryCode}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
                  androidMode="default"
                  onDateChange={(dateStr, date) => this.changeDateLatest(dateStr, date)}
                  showIcon={false}
                  style={{ flex: 1 }}
                  customStyles={{
                    dateInput: {
                      paddingLeft: 0,
                      marginLeft: 0,
                      borderWidth: 0,
                      alignItems: 'flex-start',
                      textAlign: 'left'
                    },
                  }}
                />
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.grayText]}>
                  {I18n.t('listing.latest_by', { locale: app.languageCode })}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    }
    const earliestByDateClientTime = session.earliestByDate ? dateClientWithISOString(session.earliestByDate) : null;
    const latestByDateClientTime = session.latestByDate ? dateClientWithISOString(session.latestByDate) : null;
    const pickupDateClientTime = dateClientWithISOString(shipmentDetail.addresses.pickup.pickupDate);
    const minDateEarly = moment(pickupDateClientTime).add(1, 'd').format(DATE_FORMAT);
    const minDateLatest = moment(earliestByDateClientTime).add(LATEST_DAY_PLUS, 'd').format(DATE_FORMAT);
    return (
      <View>
        <View style={styles.mb20}>
          <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
            <View style={styles.mr10}>
              <Image source={IMAGE_CONSTANT.calendarIcon} />
            </View>
            <DatePicker
              date={new Date(earliestByDateClientTime)}
              minDate={new Date(minDateEarly)}
              mode="date"
              locale={app.countryCode}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
              androidMode="default"
              onDateChange={(dateStr, date) => this.changeDateEarly(dateStr, date)}
              showIcon={false}
              style={{ flex: 1 }}
              customStyles={{
                dateInput: {
                  paddingLeft: 0,
                  marginLeft: 0,
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  textAlign: 'left'
                },
              }}
            />
          </View>
        </View>
        <View style={styles.mb20}>
          <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
            <View style={styles.mr10}>
              <Image source={IMAGE_CONSTANT.calendarIcon} />
            </View>
            <DatePicker
              date={new Date(latestByDateClientTime)}
              minDate={new Date(minDateLatest)}
              mode="date"
              locale={app.countryCode}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              format={this.getDateFormatByCountry(app.countryCode, app.languageCode)}
              androidMode="default"
              onDateChange={(dateStr, date) => this.changeDateLatest(dateStr, date)}
              showIcon={false}
              style={{ flex: 1 }}
              customStyles={{
                dateInput: {
                  paddingLeft: 0,
                  marginLeft: 0,
                  borderWidth: 0,
                  alignItems: 'flex-start',
                  textAlign: 'left'
                },
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  renderTypeDays() {
    const {
      earliestBy, latestBy, submit, minDay
    } = this.state;
    const { app, isUpdate, session } = this.props;
    if (!isUpdate) {
      return (
        <View>
          <View style={styles.mb20}>
            <View style={styles.mt10}>
              {
                ((submit && this.validateForm(VALIDATE_TYPE.EARLY_DAY, earliestBy)) ? (
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.errorText]}>
                      {I18n.t('listing.earliest_by', { locale: app.languageCode })}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {I18n.t('listing.earliest_by', { locale: app.languageCode })}
                  </Text>
                ))
              }
              <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter, styles.mt10]}>
                <TextInput
                  style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                  placeholder={I18n.t('listing.today', { locale: app.languageCode })}
                  editable={false}
                  value={earliestBy ? earliestBy.toString() : ''}
                />
                <TouchableOpacity
                  style={[styles.buttonAction, earliestBy > minDay ? null : styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                  activeOpacity={0.9}
                  onPress={() => this.handlePressMinus()}
                >
                  <Text style={[styles.actionSize, earliestBy > minDay ? styles.whiteText : styles.defaultTextColor]}>
                    -
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                  activeOpacity={0.9}
                  onPress={() => this.handlePressPlus()}
                >
                  <Text style={[styles.actionSize, styles.whiteText]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.mb20}>
            {
              ((submit && this.validateForm(VALIDATE_TYPE.LATEST_DAY, latestBy)) ? (
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.errorText, styles.bold]}>
                    {I18n.t('listing.latest_by', { locale: app.languageCode })}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.latest_by', { locale: app.languageCode })}
                </Text>
              ))
            }
            <View style={styles.mt10}>
              <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                <TextInput
                  style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                  value={latestBy ? latestBy.toString() : ''}
                  placeholder={I18n.t('listing.today', { locale: app.languageCode })}
                  editable={false}
                />
                <TouchableOpacity
                  style={[styles.buttonAction, latestBy > earliestBy + LATEST_DAY_PLUS ? null : styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                  activeOpacity={0.9}
                  onPress={() => this.handlePressMinus('latest')}
                >
                  <Text style={[styles.actionSize, latestBy > earliestBy + LATEST_DAY_PLUS ? styles.whiteText : styles.defaultTextColor]}>
                    -
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                  activeOpacity={0.9}
                  onPress={() => this.handlePressPlus('latest')}
                >
                  <Text style={[styles.actionSize, styles.whiteText]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={styles.mb20}>
          <View style={styles.mt10}>
            <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter, styles.mt10]}>
              <TextInput
                style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                placeholder={I18n.t('listing.today', { locale: app.languageCode })}
                editable={false}
                value={session.earliestBy.toString()}
              />
              <TouchableOpacity
                style={[styles.buttonAction, session.earliestBy > minDay ? null : styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
                onPress={() => this.handlePressMinus()}
              >
                <Text style={[styles.actionSize, session.earliestBy > minDay ? styles.whiteText : styles.defaultTextColor]}>
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
                onPress={() => this.handlePressPlus()}
              >
                <Text style={[styles.actionSize, styles.whiteText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.mb20}>
          <View style={styles.mt10}>
            <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
              <TextInput
                style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
                value={session.latestBy ? session.latestBy.toString() : ''}
                placeholder={I18n.t('listing.today', { locale: app.languageCode })}
                editable={false}
              />
              <TouchableOpacity
                style={[styles.buttonAction, session.latestBy > session.earliestBy + LATEST_DAY_PLUS ? null : styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
                onPress={() => this.handlePressMinus('latest')}
              >
                <Text style={[styles.actionSize, session.latestBy > session.earliestBy + LATEST_DAY_PLUS ? styles.whiteText : styles.defaultTextColor]}>
                  -
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
                activeOpacity={0.9}
                onPress={() => this.handlePressPlus('latest')}
              >
                <Text style={[styles.actionSize, styles.whiteText]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderTool() {
    const {
      dropdown, locationTypeId, locationServices
    } = this.state;
    const {
      app, isDelete, isPickup, listing, addressKey
    } = this.props;
    console.log('listing', listing.destinationAddress[addressKey]);
    return (
      <View style={[styles.flexOne, styles.flex, styles.justifyContentEnd, styles.alignItemsCenter]}>
        <TouchableOpacity
          style={[styles.mr20, { padding: 10, paddingRight: 0 }]}
          activeOpacity={0.9}
          onPress={() => this.showDropdown()}
        >
          <Image source={IMAGE_CONSTANT.groupMenu} style={{ width: 31, height: 8 }} />
        </TouchableOpacity>
        {dropdown && (
          <View style={styles.dropdown}>
            <View style={styles.dropdownArrow} />
            <View style={[styles.dropdownGroup]}>
              {((!isPickup && listing.destinationAddress[addressKey]) || locationTypeId || Object.keys(locationServices).length > 0) ? (
                <TouchableOpacity
                  style={[
                    styles.flex,
                    styles.alignItemsCenter,
                  ]}
                  activeOpacity={0.9}
                  onPress={this.duplicate}
                >
                  <DuplicateIcon />
                  <Text style={[styles.defaultSize, styles.ml10]}>
                    {I18n.t('listing.duplicate', { locale: app.languageCode })}
                  </Text>
                </TouchableOpacity>
              )
                : (
                  <View
                    style={[
                      styles.flex,
                      styles.alignItemsCenter,
                      styles.disableButton
                    ]}
                  >
                    <DuplicateIcon color="gray" />
                    <Text style={[styles.defaultSize, styles.ml10, styles.grayText]}>
                      {I18n.t('listing.duplicate', { locale: app.languageCode })}
                    </Text>
                  </View>
                )}
              {isDelete && (
                <TouchableOpacity
                  style={[styles.flex, styles.alignItemsCenter, styles.mt20]}
                  activeOpacity={0.9}
                  onPress={this.handleDelete}
                >
                  <Image source={IMAGE_CONSTANT.deleteIconRed} style={{ width: 17, height: 21 }} />
                  <Text style={[styles.defaultSize, styles.ml10]}>
                    {I18n.t('listing.remove', { locale: app.languageCode })}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }

  updateExpand = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

   onSelectAddress = (data, details = null) => {
     const {
       actions,
       listing,
       isUpdate,
       isPickup,
       addressKey,
     } = this.props;
     this.setState({
       listViewDisplayed: false,
     });
     const { destinationAddress, pickupAddress } = listing;
     if (!isUpdate) {
       if (details) {
         if (isPickup) {
           const newPickupAddress = { ...pickupAddress };
           newPickupAddress.address = details.formatted_address;
           newPickupAddress.longitude = details.geometry.location.lng;
           newPickupAddress.latitude = details.geometry.location.lat;
           newPickupAddress.shortAddress = details.name;
           // get duration from google api
           if (Object.entries(destinationAddress).length > 0) {
             const validAddress = Object.keys(destinationAddress).find((entry) => destinationAddress[entry].latitude === newPickupAddress.latitude && destinationAddress[entry].longitude === newPickupAddress.longitude);
             if (typeof validAddress !== 'undefined') {
               Alert.alert('Notice', 'We can not choose this place, please choose another place!');
               return;
             }
             actions.getDistanceMatrix({
               pickup: newPickupAddress,
               destinations: destinationAddress,
             });
           } else {
             actions.updatePickupAddress(newPickupAddress);
           }
         } else {
           console.log('this.state', this.state);
           const newDestinationAddress = { ...destinationAddress };
           const destination = { ...newDestinationAddress[addressKey] };
           destination.address = details.formatted_address;
           destination.longitude = details.geometry.location.lng;
           destination.latitude = details.geometry.location.lat;
           destination.shortAddress = details.name;
           if (pickupAddress) {
             if (pickupAddress.latitude === destination.latitude && pickupAddress.longitude === destination.longitude) {
               Alert.alert('Notice', 'We can not choose this place, please choose another place!');
               return;
             }
           }
           newDestinationAddress[addressKey] = destination;
           // update time (get duration from google api)
           if (Object.entries(pickupAddress).length > 0 && pickupAddress.address) {
             actions.getDistanceMatrix({
               pickup: pickupAddress,
               destinations: newDestinationAddress,
               addressKey
             });
           } else {
             actions.updateDestinationAddress(newDestinationAddress);
           }
         }
       }
     } else {
       const { shipmentDetail } = this.props;
       const { lat, lng } = details.geometry.location;
       if (isPickup) {
         const validAddress = shipmentDetail.addresses.destinations.find((item) => item.location.latitude === lat && item.location.longitude === lng);
         if (typeof validAddress !== 'undefined') {
           Alert.alert('Notice', 'We can not choose this place, please choose another place!');
           return;
         }
       }

       if (shipmentDetail.addresses.pickup.location.latitude === lat && shipmentDetail.addresses.pickup.location.longitude === lng) {
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
       });
     }
   }

   onClearAddress = () => {
     const {
       actions,
       listing,
       isUpdate,
       isPickup,
       addressKey,
     } = this.props;
     this.setState({
       currentAddress: '',
       listViewDisplayed: false,
     });
     if (isUpdate) {
       actions.setAddressDataUpdating({
         address: '',
         location: {},
         shortAddress: '',
       });
       return;
     }
     const { destinationAddress } = listing;
     if (isPickup) {
       actions.updatePickupAddress({
         address: '',
         shortAddress: '',
         latitude: 0,
         longitude: 0,
       });
     } else {
       const destination = { ...destinationAddress };
       destination[addressKey] = {
         address: '',
         shortAddress: '',
         latitude: 0,
         longitude: 0,
         duration: 0,
       };
       actions.updateDestinationAddress(destination);
     }
   }

   render() {
     const {
       expanded,
       locationTypeId,
       showMap,
       submit,
       locationServices,
       dropdown,
       note,
       listViewDisplayed,
       currentAddress,
     } = this.state;
     const {
       listing,
       isPickup,
       name,
       addressKey,
       app,
       isUpdate,
       session,
       defaultLocationTypes,
       actions,
       validNote,
       updatingAddressData,
       submitUpdate,
     } = this.props;

     const locationTypeName = getNameLocationType(defaultLocationTypes, (session && session.locationTypeId) || locationTypeId);
     let address = '';
     if (isUpdate) {
       address = session.address;
     } else if (isPickup && listing.pickupAddress.address) {
       address = listing.pickupAddress.address;
     } else if (!isPickup && listing.destinationAddress[addressKey]) {
       address = listing.destinationAddress[addressKey].address;
     }
     const styleShowServices = !expanded ? { height: 0, overflow: 'hidden' } : null;
     return (
       <View>
         {!isUpdate && (
         <View style={[styles.flex]}>
           <Text style={styles.formHeader}>
             {isPickup ? name : `${I18n.t('destination ', { locale: app.languageCode })} ${name}`}
           </Text>
           {!isPickup && this.renderTool()}
         </View>
         )}
         <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.pt30, styles.mb30, styles.formLine, { zIndex: -1 }]}>
           <View style={[styles.mb30, { zIndex: -1 }]}>
             <View style={[styles.flex, styles.alignItemsCenter, { marginBottom: 10 }]}>
               <View style={styles.flexOne}>
                 {
                  ((isUpdate ? submitUpdate && this.validateForm(VALIDATE_TYPE.ADDRESS, updatingAddressData.address) : submit && this.validateForm(VALIDATE_TYPE.ADDRESS, address)) ? (
                    <View style={[styles.flex, styles.alignItemsCenter]}>
                      <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                      <Text style={[styles.defaultSize, styles.defaultTextColor, styles.errorText, styles.bold]}>
                        {isUpdate ? I18n.t('shipment.address.address', { locale: app.languageCode }) : isPickup ? I18n.t('listing.pickup_address', { locale: app.languageCode }) : I18n.t('listing.des_address', { locale: app.languageCode })}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                      {isUpdate ? I18n.t('shipment.address.address', { locale: app.languageCode }) : isPickup ? I18n.t('listing.pickup_address', { locale: app.languageCode }) : I18n.t('listing.des_address', { locale: app.languageCode })}
                    </Text>
                  ))
                }
               </View>
               <TouchableOpacity
                 activeOpacity={0.9}
                 onPress={() => this.setState({ showMap: !showMap })}
               >
                 <Text style={[styles.defaultSize, styles.mainColorText, styles.bold]}>
                   {showMap ? I18n.t('listing.close_map', { locale: app.languageCode }) : I18n.t('listing.select_on_map', { locale: app.languageCode })}
                 </Text>
               </TouchableOpacity>
             </View>
             {/* Render Map & Pin Location - Deliveree will provide icon marker */}
             <CargopediaMap
               showMap={showMap}
               isUpdate={isUpdate}
               isPickup={isPickup}
               updateAddress={this.updateAddress}
               session={session}
               initData={{ ...listing.pickupAddress }}
               marker={isPickup ? { ...listing.pickupAddress } : { ...listing.destinationAddress[addressKey] }}
             />

             {/* End Render Map & Pin Location - Deliveree will provide icon marker */}

             <GooglePlacesAutocomplete
               fetchDetails
               minLength={2}
               autoFocus={false}
               onPress={this.onSelectAddress}
               query={{
                 key: GOOGLE_API_KEY,
                 language: app.languageCode,
                 types: null,
                 components: `country:${app.countryCode || 'us'}`
               }}
               listViewDisplayed={listViewDisplayed}
               placeholder=""
               nearbyPlacesAPI="GooglePlacesSearch"
               debounce={200}
               styles={{
                 textInputContainer: {
                   backgroundColor: 'transparent',
                   marginTop: showMap ? 10 : 0,
                   width: '100%',
                   height: 60,
                   borderColor: 'rgba(219, 219, 219, 1)',
                   borderTopColor: 'rgba(219, 219, 219, 1)',
                   borderBottomColor: 'rgba(219, 219, 219, 1)',
                   borderTopWidth: 1,
                   borderLeftWidth: 1,
                   borderRightWidth: 1,
                   borderBottomWidth: 1,
                   borderRadius: 4,
                   alignItems: 'center',
                 },
                 textInput: {
                   fontSize: 15,
                   fontFamily: 'Roboto-Regular',
                   color: '#000',
                   height: 'auto',
                   marginTop: 0,
                   marginLeft: 0,
                   marginRight: 0,
                   paddingTop: 0,
                   paddingBottom: 0,
                 },
               }}
               getDefaultValue={() => address}
               renderRightButton={() => {
                 if (address || currentAddress) {
                   return (
                     <TouchableOpacity style={{ justifyContent: 'center', paddingRight: 10 }} onPress={this.onClearAddress}>
                       <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 18, height: 18 }} />
                     </TouchableOpacity>
                   );
                 }
                 return null;
               }}
               textInputProps={{
                 multiline: true,
                 onFocus: () => {
                   this.setState({
                     focusInput: true,
                     listViewDisplayed: currentAddress.length > 1,
                   });
                 },
                 onBlur: () => {
                   this.setState({
                     focusInput: false,
                     listViewDisplayed: false,
                   });
                 },
                 onChangeText: (value) => {
                   const { focusInput } = this.state;
                   this.setState({
                     currentAddress: value,
                     listViewDisplayed: focusInput && value.length > 1,
                   });
                   if (isUpdate && focusInput) {
                     actions.setAddressDataUpdating({
                       address: '',
                       location: {},
                       shortAddress: '',
                     });
                     return;
                   }
                   const { destinationAddress, pickupAddress } = listing;
                   if (isPickup) {
                     if (pickupAddress && pickupAddress.address && focusInput) {
                       actions.updatePickupAddress({
                         address: '',
                         shortAddress: '',
                         latitude: 0,
                         longitude: 0,
                       });
                     }
                   } else {
                     const destination = { ...destinationAddress };
                     if (Object.entries(destinationAddress).length > 0) {
                       if (destination[addressKey] && destination[addressKey].address && focusInput) {
                         destination[addressKey] = {
                           address: '',
                           shortAddress: '',
                           latitude: 0,
                           longitude: 0,
                           duration: 0,
                         };
                         actions.updateDestinationAddress(destination);
                       }
                     }
                   }
                 },
                 value: address || currentAddress
               }}
             />
           </View>
           {isPickup ? this.renderPickupDate() : isUpdate ? isPickup ? this.renderPickupDate() : this.renderDestinationDate() : this.renderDestinationDate()}
           <View style={styles.mb30}>
             {
              ((submit && this.validateForm(VALIDATE_TYPE.LOCATION_TYPE, locationTypeId)) ? (
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.errorText, styles.bold]}>
                    {isUpdate ? I18n.t('shipment.address.location_type', { locale: app.languageCode }) : isPickup ? I18n.t('listing.pickup_location_type', { locale: app.languageCode }) : I18n.t('listing.destination_location_type', { locale: app.languageCode })}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {isUpdate ? I18n.t('shipment.address.location_type', { locale: app.languageCode }) : isPickup ? I18n.t('listing.pickup_location_type', { locale: app.languageCode }) : I18n.t('listing.destination_location_type', { locale: app.languageCode })}
                </Text>
              ))
            }
             <View style={[styles.mt10, { zIndex: 1 }]}>
               <Select
                 containerStyle={{
                   borderWidth: 1,
                   borderColor: 'rgba(219, 219, 219, 1)',
                   borderRadius: 4,
                 }}
                 activeContainerStyle={{
                   borderTopWidth: 1,
                   borderLeftWidth: 1,
                   borderRightWidth: 1,
                   borderColor: 'rgba(81, 175, 43, 1)',
                   borderBottomLeftRadius: 0,
                   borderBottomRightRadius: 0,
                 }}
                 style={[{ borderColor: 'transparent', height: 60 }]}
                 indicatorIcon={<Image source={IMAGE_CONSTANT.arrowDownGreen} style={{ width: 15, height: 9, alignSelf: 'center' }} />}
                 indicatorIconUp={<Image source={IMAGE_CONSTANT.arrowUpGreen} style={{ width: 15, height: 9, alignSelf: 'center' }} />}
                 onSelect={this.handleChangeLocationType}
                 defaultText={locationTypeName || I18n.t('listing.select_location_type', { locale: app.languageCode })}
                 textStyle={{
                   flex: 1,
                   width: '100%',
                   alignSelf: 'center',
                   textAlignVertical: 'center',
                   fontSize: 17,
                   fontFamily: 'Roboto-Regular',
                   color: !locationTypeId ? locationTypeName ? '#000' : 'rgba(161, 161, 161, 1)' : '#000',
                 }}
                 transparent
                 optionListStyle={{
                   borderLeftWidth: 1,
                   borderRightWidth: 1,
                   borderBottomWidth: 1,
                   borderColor: 'rgba(81, 175, 43, 1)',
                   borderBottomLeftRadius: 4,
                   borderBottomRightRadius: 4,
                   backgroundColor: '#fff'
                 }}
               >
                 {listing.locationTypes.map((item) => (
                   <Option
                     key={item.value}
                     style={{
                       height: 60,
                       borderWidth: 1,
                       borderColor: 'rgba(219,219,219,1)',
                       flexDirection: 'column',
                       justifyContent: 'center',
                       backgroundColor: ((session && item.value === session.locationTypeId) || item.value === String(locationTypeId)) ? 'rgba(236, 236, 236, 1)' : 'transparent'
                     }}
                     styleText={{ fontSize: 17, fontFamily: 'Roboto-Regular', }}
                     value={item}
                   >
                     {item.name}
                   </Option>
                 ))}
               </Select>
             </View>
           </View>
           {isUpdate && (
           <View style={{ zIndex: -1 }}>
             <View style={[styles.mb30]}>
               {validNote ? (
                 <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                   {I18n.t('shipment.address.notes', { locale: app.languageCode })}
                 </Text>
               ) : (
                 <View style={[styles.flex, styles.alignItemsCenter]}>
                   <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 12, height: 12 }} />
                   <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.redText, styles.bold]}>
                     {I18n.t('shipment.address.notes_error', { locale: app.languageCode })}
                   </Text>
                 </View>
               )}
               <View style={styles.mt10}>
                 <TextInput
                   style={[styles.input, !validNote && styles.inputError]}
                   value={note}
                   onChangeText={(val) => this.setState({ note: val })}
                   onBlur={this.handleChangeNote}
                   placeholder="optional"
                 />
               </View>
             </View>
             <View style={[styles.mb30]}>
               <Attactments actions={actions} session={session} languageCode={app.languageCode} />
             </View>
           </View>
           )}
           {/* Render Services */}
           <View style={[{ zIndex: -1 }, styleShowServices]}>
             <View style={[styles.lineSilver, styles.mb30]} />
             <View style={styles.mb10}>
               <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                 {I18n.t('listing.location_services', { locale: app.languageCode })}
               </Text>
               <View style={[styles.mt20]}>
                 <Services
                   changeServices={this.changeServices}
                   initData={isUpdate ? parseLocationServicesToObject(listing.defaultLocationServices, session.locationServices) : (locationServices || {})}
                 />
               </View>
             </View>
           </View>

           <View style={[styles.lineAction, { zIndex: -1 }]} />
           <TouchableOpacity
             style={{ zIndex: -1 }}
             activeOpacity={0.9}
             onPress={this.updateExpand}
           >
             <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
               {expanded
                 ? <Image source={IMAGE_CONSTANT.hideExpand} />
                 : <Image source={IMAGE_CONSTANT.showExpand} />}
               <Text style={[styles.ml10, styles.defaultSize, styles.mainColorText, styles.bold]}>
                 {expanded ? I18n.t('listing.hide_options', { locale: app.languageCode }) : I18n.t('listing.options', { locale: app.languageCode })}
               </Text>
             </View>
           </TouchableOpacity>
         </View>
         {dropdown && (
         <View style={{
           position: 'absolute',
           width: '100%',
           height: '100%',
           backgroundColor: 'transparent',
           zIndex: -1,
         }}
         >
           <TouchableWithoutFeedback onPress={() => this.setState({ dropdown: false })}>
             <View style={{
               left: 0, top: 0, width: '100%', height: '100%'
             }}
             />
           </TouchableWithoutFeedback>
         </View>
         )}
       </View>
     );
   }
}

Addresses.propTypes = {
  isPickup: PropTypes.bool,
  addressKey: PropTypes.number
};

Addresses.defaultProps = {
  isPickup: false,
  addressKey: 0
};

const mapStateToProps = (state) => ({
  app: state.app,
  listing: state.listing,
  defaultLocationTypes: state.listing.defaultLocationTypes,
  shipmentDetail: state.listing.shipmentDetail,
  isEditing: state.listing.isEditing,
  updatingAddressData: state.listing.updatingAddressData,
  draftAddress: state.listing.draftAddress,
  draftId: state.listing.draftId,
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
)(Addresses);
