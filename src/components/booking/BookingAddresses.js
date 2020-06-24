/* eslint-disable react/no-deprecated */
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Dimensions,
  ScrollView,
  findNodeHandle,
  SafeAreaView,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import listingActions from '../../store/actions/listingAction';

// COMPONENTS
import AddNewBooking from './add_new/AddNewBooking';
import Addresses from './list/Addresses';
import SelectFromMap from './map/SelectFromMap';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';
import {
  DATE_RANGE_TYPE,
} from '../../constants/app';

//
import I18n from '../../config/locales';

// CSS
import styles from './style';
import { dateClientWithISOString } from '../../helpers/date.helper';

const { width } = Dimensions.get('window');

class BookingAddresses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      destinations: [],
      pickup: null,
      isDelete: false,
    };
    this.initAddress = {
      shipmentId: null,
      dateRangeType: DATE_RANGE_TYPE.DAYS,
      duration: null,
      minDay: null,
      earliestBy: null,
      latestBy: null,
      earliestByDate: null,
      latestByDate: null,
      pickupDate: null,
      minPickupDate: null,
      locationServices: [],
      locationTypeId: null,
      duplicateDisable: true,
      address: '',
      name: 1,
      id: 1,
    };
    this.coordinates = {
      pickup: {},
      destionations: { 1: null },
    };
    this.addressRef = {};
    this.pickupRef = null;

    this.showModal = this.showModal.bind(this);
    this.duplicateAction = this.duplicateAction.bind(this);
    this.removeAction = this.removeAction.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.saveAsDraft = this.saveAsDraft.bind(this);
    this.saveQuote = this.saveQuote.bind(this);
    this.modalAction = this.modalAction.bind(this);
  }

  componentDidMount() {
    const { listing } = this.props;
    let checkDelete = 0;
    if (Object.keys(listing.tempAddress).length > 0) {
      const { destinations } = listing.tempAddress;
      const newDest = [];
      destinations.map((item) => {
        if (item) {
          checkDelete += 1;
          const newItem = { ...item };
          newItem.earliestByDate = dateClientWithISOString(newItem.earliestByDate);
          newItem.latestByDate = dateClientWithISOString(newItem.latestByDate);
          newDest.push(newItem);
        }
        return true;
      });
      this.setState({
        destinations: newDest,
        pickup: { ...listing.tempAddress.pickup },
        isDelete: checkDelete > 1,
      });
    } else {
      this.setState({
        destinations: [this.initAddress],
        pickup: { ...this.initAddress },
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { destinations, pickup } = this.state;
    const {
      onLoadedNewAddressItem, draftAddress, draftId, listing
    } = this.props;
    if (destinations.length > prevState.destinations.length && prevState.destinations.length > 0) {
      const arrayAddress = Object.values(this.addressRef);
      const newItemRef = arrayAddress.filter((ref) => ref !== null)[arrayAddress.length - 1];
      const node = findNodeHandle(newItemRef);
      if (onLoadedNewAddressItem) {
        onLoadedNewAddressItem(node);
      }
    }

    if (draftAddress && draftAddress !== prevProps.draftAddress) {
      const newDestinations = [];
      const destinationsData = destinations.filter((data) => data !== null);
      const newPickupData = {
        id: draftAddress.pickup.id,
        address: draftAddress.pickup.address,
        shortAddress: draftAddress.pickup.shortAddress,
        duplicateDisable: true,
        locationServices: draftAddress.pickup.locationServices,
        locationTypeId: draftAddress.pickup.locationTypeId,
        minPickupDate: new Date(),
        pickupDate: draftAddress.pickup.pickupDate,
        shipmentId: draftId,
        status: draftAddress.pickup.status,
        location: {
          latitude: draftAddress.pickup.location.latitude,
          longitude: draftAddress.pickup.location.longitude,
        }
      };
      console.log('destinationsData', destinationsData);
      console.log('draftAddress', draftAddress);
      destinationsData.forEach((des, index) => {
        if (draftAddress.destinations.length) {
          newDestinations.push({
            address: draftAddress.destinations[index].address,
            dateRangeType: draftAddress.destinations[index].dateRangeType,
            duplicateDisable: true,
            duration: null,
            earliestBy: draftAddress.destinations[index].earliestBy,
            earliestByDate: draftAddress.destinations[index].earliestByDate,
            id: draftAddress.destinations[index].id,
            latestBy: draftAddress.destinations[index].latestBy,
            latestByDate: draftAddress.destinations[index].latestByDate,
            locationServices: draftAddress.destinations[index].locationServices,
            locationTypeId: draftAddress.destinations[index].locationTypeId,
            minDay: new Date(draftAddress.pickup.pickupDate),
            minPickupDate: new Date(draftAddress.pickup.pickupDate),
            name: des.name,
            shipmentId: draftId,
          });
        }
      });
      console.log('newDestinations', newDestinations);
      if (draftAddress.destinations.length) {
        this.setState({
          destinations: newDestinations
        });
      }
      this.setState({
        pickup: newPickupData,
      });
    }
  }

  getAllData(ignoreValidate) {
    let notError = true;
    const pickup = this.pickupRef.returnAddressData(ignoreValidate);
    const destinations = [];
    const arrayAddress = Object.values(this.addressRef);
    arrayAddress.map((item) => {
      if (item) {
        const value = item.returnAddressData(ignoreValidate);
        if (!value) { notError = false; }
        destinations.push(value);
      }
      return true;
    });
    if (notError) return { pickup, destinations };
    return notError;
  }

  handleAddNew = () => {
    const addresses = this.getAllData(false);
    const { isEditing, actions } = this.props;
    if (addresses) {
      const { destinations } = this.state;
      const { app } = this.props;
      let stt = 1;
      destinations.map((item) => { if (item) { stt += 1; } });
      const objNewDes = {
        ...this.initAddress,
        name: stt,
        id: stt,
      };
      this.setState({
        destinations: [
          ...destinations,
          objNewDes,
        ],
        isDelete: true,
      }, () => {
        if (isEditing) {
          actions.editingAddAddress(objNewDes);
        }
      });
    }
  }

  resetDataWhenSwitchCountry = () => {
    const { switchedCountry } = this.props;
    this.setState((prevState) => ({
      initAddress: {
        ...prevState.initAddress,
        shipmentId: null,
        dateRangeType: DATE_RANGE_TYPE.DAYS,
        duration: null,
        minDay: null,
        earliestBy: null,
        latestBy: null,
        earliestByDate: null,
        latestByDate: null,
        pickupDate: null,
        minPickupDate: null,
        locationServices: [],
        locationTypeId: null,
        duplicateDisable: true,
        name: 1,
      }
    }));
    switchedCountry();
  }

  saveAsDraft() {
    const addresses = this.getAllData();
    if (addresses) {
      const {
        actions,
        token,
        listing,
        isSwitchCountry,
        draftItem,
      } = this.props;
      if (!token) {
        actions.saveStateAddress(addresses);
      } else if (listing.shipmentId) {
        actions.saveAddressAsDraft(addresses, draftItem, isSwitchCountry, (res) => {
          if (res) {
            this.resetDataWhenSwitchCountry();
          }
        });
      } else {
        const { dataStep1 } = listing;
        actions.saveAddressAsDraft(addresses, dataStep1, isSwitchCountry, (res) => {
          if (res) {
            this.resetDataWhenSwitchCountry();
          }
        });
      }
    }
  }

  saveQuote() {
    const addresses = this.getAllData(false);
    if (addresses && addresses.pickup) {
      const { actions } = this.props;
      actions.saveAddressQuote(addresses);
    }
  }

  modalAction() {
    const { isDeleteModal } = this.state;
    isDeleteModal ? this.removeAction() : this.saveAsDraft();
    this.setState({
      isVisible: false,
      addressKey: undefined,
      isDeleteModal: false
    });
  }

  showModal(addressKey = undefined, isDeleteModal = false) {
    if (!isDeleteModal && !this.getAllData(false)) return;
    this.setState({
      isVisible: true,
      addressKey,
      isDeleteModal,
    });
  }

  closeModal() {
    const { actions, isSwitchCountry } = this.props;
    this.setState({
      isVisible: false,
      addressKey: undefined,
      isDeleteModal: false,
    });
    if (isSwitchCountry) {
      actions.updateSwitchCountry();
      this.resetDataWhenSwitchCountry();
    }
  }

  duplicateAction(item) {
    const { destinations } = this.state;
    const { isEditing, actions } = this.props;
    let stt = 1;
    destinations.map((data) => {
      if (data) stt += 1;
      return true;
    });
    item.name = stt;
    if (isEditing) {
      item.id = stt;
      item.shipmentId = null;
      actions.editingDuplicateAddress(item);
    }
    this.setState({
      destinations: [...destinations, item],
      isDelete: true,
    });
  }

  removeAction() {
    const { destinations, addressKey } = this.state;
    const {
      isEditing, actions, draftAddress, draftId
    } = this.props;
    if (isEditing) {
      actions.editingRemoveAddress(destinations[addressKey]);
    }

    if (draftId) {
      const bodyAddress = {};
      bodyAddress.id = destinations[addressKey].id;
      actions.updateDraftAddress(bodyAddress, 'remove');
    }
    this.addressRef[addressKey].removeAddress();
    let newData = [];
    let stt = 0;
    destinations[addressKey] = null;
    newData = destinations.map((item) => {
      const newItem = item;
      if (item) {
        stt += 1;
        newItem.name = stt;
      }
      return newItem;
    });
    this.setState({
      destinations: [...newData],
      isVisible: false,
      addressKey: undefined,
      isDelete: stt > 1,
    });
  }

  updateGoodDescInput() {
    const { goodDescription } = this.state;
    if (this.goodDescInput) {
      this.goodDescInput.setNativeProps({ text: this.getTextDefault(goodDescription) });
    }
  }

  render() {
    const {
      pickup, destinations, addressKey, isVisible, isDeleteModal, isDelete,
    } = this.state;
    const { app } = this.props;
    const total = destinations.length;
    this.addressRef = {};
    console.log('render pickup', pickup);
    console.log('render destinations', destinations);
    const desHasData = destinations.filter((item) => item !== null);
    return (
      <View>
        <View style={{ zIndex: 999 }}>
          { pickup
            && (
            <Addresses
              isPickup
              onSelectFromMap={this.showSelectFromMap}
              name={I18n.t('pickup', { locale: app.languageCode })}
              mainCoordinate={this.coordinates}
              initData={pickup}
              ref={(ref) => { this.pickupRef = ref; }}
            />
            )}
        </View>

        {
          desHasData.map((booking, key) => {
            if (booking !== null) {
              return (
                <View key={`booking-${key + 1}`} style={{ zIndex: 998 - key }}>
                  <Addresses
                    // eslint-disable-next-line no-unused-expressions
                    ref={(ref) => this.addressRef[key] = ref}
                    onDelete={this.showModal}
                    addressKey={key}
                    name={booking.name}
                    mainCoordinate={this.coordinates}
                    addressLength={total}
                    initData={booking}
                    destinationInfo={booking}
                    duplicateAction={this.duplicateAction}
                    isDelete={isDelete}
                  />
                </View>
              );
            }
            return null;
          })
        }

        <AddNewBooking
          addNew={this.handleAddNew}
          languageCode={app.languageCode}
          title={I18n.t('listing.addOtherDestination', { locale: app.languageCode })}
        />

        {/* Modal Delete Booking */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisible}
          onRequestClose={() => this.closeModal()}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
              }}
              onPress={() => this.closeModal()}
            />
            <View
              style={[styles.whiteBg, styles.pad20, {
                height: 285,
              }]}
            >
              <Text style={[styles.defaultSize, styles.bold]}>
                {isDeleteModal ? I18n.t('delete_item', { locale: app.languageCode }) : I18n.t('listing.saveDraft', { locale: app.languageCode })}
              </Text>
              <View style={[styles.mt20, styles.lineSilver]} />
              <View style={[styles.mt30, styles.mb30, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <Text style={[styles.defaultSize, styles.textCenter, { width: width / 1.2 }]}>
                  {
                    isDeleteModal ? `${I18n.t('want_to_delete', { locale: app.languageCode })} destination ${destinations[addressKey].name}?` : I18n.t('listing.saveDraftModalContent', { locale: app.languageCode })
                  }
                </Text>
              </View>
              <View style={styles.flex}>

                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                  onPress={() => (isDeleteModal ? this.closeModal() : this.modalAction())}
                >
                  <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.mr10]}>
                    {(isDeleteModal && I18n.t('listing.back', { locale: app.languageCode })) || I18n.t('listing.saveDraft', { locale: app.languageCode })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                  onPress={() => (isDeleteModal ? this.modalAction() : this.closeModal())}
                >
                  <Text style={[styles.formGroupButton, isDeleteModal ? styles.formGroupButtonRed : styles.formGroupButton, styles.flexOne, styles.ml10]}>
                    {(isDeleteModal && I18n.t('listing.delete', { locale: app.languageCode })) || I18n.t('listing.continue', { locale: app.languageCode })}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  listing: state.listing,
  token: state.auth.token,
  app: state.app,
  isEditing: state.listing.isEditing,
  shipmentDetail: state.listing.shipmentDetail,
  draftItem: state.listing.draftItem,
  draftAddress: state.listing.draftAddress,
  draftId: state.listing.draftId,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    forwardRef: true,
  }
)(BookingAddresses);
