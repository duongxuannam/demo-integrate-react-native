import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import I18N from '../../../config/locales';
import Addresses from '../../booking/list/Addresses';
import styles from '../style';
import listingAction from '../../../store/actions/listingAction';
import { emailRex, validatePhoneNumberWithCountry } from '../../../helpers/regex';

class SelectFromMap extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      validNote: true,
      submitUpdate: false,
    }
  }

  handleUpdateDate = (date) => {
    const { actions } = this.props;
    const dateUTC = moment(date).utc().toISOString();
    actions.setAddressDataUpdating({
      pickupDate: dateUTC,
    });
  }

  handleUpdateAddress = (address, longitude, latitude, shortAddress) => {
    const { actions } = this.props;
    actions.setAddressDataUpdating({
      address,
      location: {
        latitude,
        longitude,
      },
      shortAddress,
    });
  }

  renderPickupDate = () => {
    const { session } = this.props;
    const { validNote, submitUpdate } = this.state;
    return (
      <Addresses
        isPickup
        isUpdate
        submitUpdate={submitUpdate}
        validNote={validNote}
        updatePickupDate={(data) => this.handleUpdateDate(data)}
        updateAddressFromMap={(address, longitude, latitude, shortAddress) => this.handleUpdateAddress(address, longitude, latitude, shortAddress)}
        session={session}
      />
    )
  }

  renderDestination = () => {
    const { session } = this.props;
    const { validNote, submitUpdate } = this.state;

    return (
      <Addresses
        isUpdate
        submitUpdate={submitUpdate}
        validNote={validNote}
        updateAddressFromMap={(address, longitude, latitude, shortAddress) => this.handleUpdateAddress(address, longitude, latitude, shortAddress)}
        session={session}
      />
    )
  }

  checkValidNote = (note) => {
    const { countryCode } = this.props;
    if (note) {
      const isFormatEmail = emailRex(note);
      const isFormatPhone = validatePhoneNumberWithCountry(note, countryCode);
      return !(isFormatEmail || isFormatPhone);

    }
    return true;
  }

  saveAddressData = async () => {
    const { updatingAddressData, actions } = this.props;
    this.setState({
      submitUpdate: true,
    });
    const validNote = this.checkValidNote(updatingAddressData.note);
    if(updatingAddressData.address) {
      if (validNote) {
        if (updatingAddressData.pickupDate) {
          const time = new Date(updatingAddressData.pickupDate.endsWith('Z') ? updatingAddressData.pickupDate : `${updatingAddressData.pickupDate}Z`);
          const now = new Date();
          time.setHours(now.getHours(), now.getMinutes());
          const bodySendApi = {
            PickupDate: moment(time).utc().toISOString(),
            LocationTypeId: updatingAddressData.locationTypeId,
            LocationServices: updatingAddressData.locationServices,
            Address: updatingAddressData.address,
            Note: updatingAddressData.note,
            Location: {
              Latitude: updatingAddressData.location.latitude,
              Longitude: updatingAddressData.location.longitude,
            },
            ShortAddress: updatingAddressData.shortAddress,
          };
          actions.editPickupAddress(updatingAddressData.id, bodySendApi, updatingAddressData.location.latitude, updatingAddressData.location.longitude, () => {
          });
        } else {
          const now = new Date();
          const earliestByDate = new Date(updatingAddressData.earliestByDate.endsWith('Z') ? updatingAddressData.earliestByDate : `${updatingAddressData.earliestByDate}Z`);
          earliestByDate.setHours(now.getHours(), now.getMinutes());
          const latestByDate = new Date(updatingAddressData.latestByDate.endsWith('Z') ? updatingAddressData.latestByDate : `${updatingAddressData.latestByDate}Z`);
          latestByDate.setHours(now.getHours(), now.getMinutes());
          const bodySendApi = {
            dateRangeType: updatingAddressData.dateRangeType,
            earliestByDate: moment(earliestByDate).utc().toISOString(),
            latestByDate: moment(latestByDate).utc().toISOString(),
            earliestBy: updatingAddressData.earliestBy,
            latestBy: updatingAddressData.latestBy,
            locationTypeId: updatingAddressData.locationTypeId,
            address: updatingAddressData.address,
            note: updatingAddressData.note,
            locationServices: updatingAddressData.locationServices,
            Location: {
              Latitude: updatingAddressData.location.latitude,
              Longitude: updatingAddressData.location.longitude,
            },
            ShortAddress: updatingAddressData.shortAddress,
          }
          actions.editDestinationAddress(updatingAddressData.id, bodySendApi, updatingAddressData.location.latitude, updatingAddressData.location.longitude, () => {
          });
        }
      } else {
        this.setState({
          validNote: false,
        })
      }
    }
  }

  render() {
    const { session, languageCode } = this.props;
    return (
      <View style={[styles.mb20]}>
        {session.pickupDate ? this.renderPickupDate() : this.renderDestination()}
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.saveAddressData}
          >
            <Text style={[styles.formGroupButtonModal, styles.marginHorizontal20]}>
              {I18N.t('update', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  updatingAddressData: state.listing.updatingAddressData,
  shipmentDetail: state.listing.shipmentDetail,
  countryCode: state.app.countryCode,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectFromMap);
