import React, { forwardRef } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Dimensions,
  findNodeHandle,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AddNewBooking from './add_new/AddNewBooking';
import Information from './list/information/Information';
import I18n from '../../config/locales';
import { getUnitObj, getAdditionalServicesObj, getTransportTypeObj } from '../../helpers/shipment.helper';
import listingAction from '../../store/actions/listingAction';
import styles from './style';

const { width } = Dimensions.get('window');

class BookingInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isDeleteModal: false,
      bookings: []
    };
    this.listRef = [];
  }

  componentDidMount() {
    const { tempBooking, transportTypesDefault, } = this.props;
    if (tempBooking.length > 0) {
      this.setBookingData(tempBooking);
    } else {
      this.setState({
        bookings: [{
          id: 1,
          name: '1',
          handleUnitSelected: null,
          isFirstItem: true,
          unitQuantity: 1,
          length: null,
          width: null,
          height: null,
          weight: null,
          goodDesc: '',
          itemServices: [],
          transportModeSelected: this.getDefaultTransportType(transportTypesDefault),
        }]
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      draftItem,
      onSaveDraftSuccess,
      isRefresh,
      countryCode,
      token,
      onLoadedNewItem,
      transportTypesDefault,
      isEditing,
      isDraftShipment,
      defaultAdditionalServices,
    } = this.props;
    const { bookings } = this.state;
    if (prevProps.isRefresh !== isRefresh) {
      this.setState({ bookings: [] });
    }
    if (prevProps.isDraftShipment !== isDraftShipment) {
      if (isDraftShipment) {
        const { tempBooking } = this.props;
        this.setBookingData(tempBooking);
      }
    }

    if (prevState.bookings.length > 0 && bookings.length === 0) {
      this.setState({
        bookings: [{
          id: 1,
          name: '1',
          handleUnitSelected: null,
          isFirstItem: true,
          unitQuantity: 1,
          length: null,
          width: null,
          height: null,
          weight: null,
          goodDesc: '',
          itemServices: [],
          transportModeSelected: this.getDefaultTransportType(transportTypesDefault),
        }]
      });
    }

    if (bookings.length > prevState.bookings.length && prevState.bookings.length > 0) {
      const newItemRef = this.listRef.filter((ref) => ref !== null)[this.listRef.length - 1];
      const node = findNodeHandle(newItemRef);
      if (onLoadedNewItem) {
        onLoadedNewItem(node);
      }
    }

    if (draftItem.length && draftItem !== prevProps.draftItem) {
      console.log('111111111111111111111111111111', draftItem)
      console.log('222222222222222222222222', bookings)
      const { defaultHandleUnits, transportTypeId } = this.props;
      const newBooking = [];
      const bookingsData = bookings.filter((data) => data !== null);
      console.log('bookingsData', bookingsData);
      bookingsData.forEach((booking, index) => {
        newBooking.push({
          ...booking,
          id: draftItem[index].id,
          height: draftItem[index].height,
          weight: draftItem[index].weight,
          width: draftItem[index].width,
          isFirstItem: index === 0,
          goodDesc: draftItem[index].description,
          itemServices: draftItem[index].additionalServices.map((item) => getAdditionalServicesObj(defaultAdditionalServices, item)),
          shipmentId: draftItem[index].shipmentId,
          length: draftItem[index].length,
          unitQuantity: draftItem[index].unitQuantity,
          transportModeSelected: transportTypeId ? getTransportTypeObj(transportTypesDefault, transportTypeId) : booking.transportModeSelected,
          handleUnitSelected: getUnitObj(defaultHandleUnits, draftItem[index].handlingUnitId),
        });
      });
      console.log('newBooking', newBooking);
      this.setState({
        bookings: newBooking,
      });
      onSaveDraftSuccess();
    }

    if (prevProps.countryCode !== countryCode) {
      if (!token) {
        this.setState({
          bookings: [],
        });
      }
    }

    if (transportTypesDefault !== prevProps.transportTypesDefault && !isEditing) {
      this.transportType = this.getDefaultTransportType(transportTypesDefault);
      this.setState({
        bookings: [{
          id: 1,
          name: '1',
          handleUnitSelected: null,
          isFirstItem: true,
          unitQuantity: 1,
          length: null,
          width: null,
          height: null,
          weight: null,
          goodDesc: '',
          itemServices: [],
          transportModeSelected: this.transportType,
        }]
      });
    }
  }

  setBookingData = (tempBooking) => {
    console.log('setBookingData', tempBooking);
    const { isEditing } = this.props;
    let count = 0;
    const convertDataTemp = tempBooking.map((booking, index) => {
      if (booking == null) {
        return null;
      }
      count += 1;
      if (booking.transportModeSelected) {
        this.transportType = booking.transportModeSelected;
      }
      return { ...booking, name: `${count}`, id: isEditing ? booking.id : count };
    });
    this.setState({
      bookings: [...convertDataTemp]
    });
  }

  getDefaultTransportType = (transportTypesDefault) => {
    const { configs } = this.props;
    const defaultTransportType = transportTypesDefault.find((item) => item.id === configs.TransportTypeDefault); // AFTER LATER AFTER API HAS MULTI LANGUGAE
    return defaultTransportType;
  }

  getInformationBooking = (ignoreValidation) => {
    const newListReft = this.listRef.filter((l) => l !== null);
    console.log('newListReft', newListReft);
    const bookingList = newListReft.map((e) => {
      return e.onGetAllInformation(ignoreValidation);
    });
    console.log('bookingList', bookingList);
    return bookingList || [];
  }

  checkAllInformation = () => {
    const newListReft = this.listRef.filter((l) => l !== null);
    const bookingList = newListReft.map((e) => {
      return e.checkAllInformation();
    });
    return bookingList[0];
  }

  handleAddNew = () => {
    const { bookings } = this.state;
    const { languageCode, isEditing, actions } = this.props;
    const bookingList = this.getInformationBooking(false);
    let canAdd = true;
    bookingList.forEach((b) => {
      if (!b.status) {
        canAdd = false;
      }
    });

    if (canAdd) {
      let count = 0;
      const newBookingMap = bookings.map((b, index) => {
        if (b == null) {
          return null;
        }
        count += 1;
        return {
          ...b,
        };
      });
      const objtNewData = {
        id: bookings.length + 1,
        name: `${count + 1}`,
        isFirstItem: false,
        handleUnitSelected: null,
        unitQuantity: 1,
        length: null,
        width: null,
        height: null,
        weight: null,
        goodDesc: '',
        itemServices: [],
        transportModeSelected: this.transportType || bookings[0].transportModeSelected || null,
      };
      this.setState({
        bookings: [
          ...bookings,
          objtNewData,
        ]
      }, () => {
        console.log('add new', objtNewData)
        if (isEditing) {
          actions.editingAddItem(objtNewData)
        }
      });
    }
  }

  handleSelectTransport = (transport) => {
    const { actions } = this.props;
    this.transportType = transport;
    actions.setTransportTypeId(transport.id);
  }

  callSaveDraft = (itemList) => {
    const { token, actions } = this.props;
    if (!token) {
      // User not logged in
      actions.callSaveDraft(false, itemList);
      return;
    }
    this.showModalSaveDraft(itemList);
  }

  callGetQuote = (itemList) => {
    const { token, actions } = this.props;
    if (!token) {
      // User not logged in
      actions.callGetQuoteWithoutLoggedIn(itemList);
      return;
    }
    // actions.callGetQuote(itemList);
    actions.callSaveDraft(true, itemList);
  }

  showModalDelete = (booking) => {
    this.setState({
      isVisible: true,
      isDeleteModal: true,
      bookingOnHandle: booking,
    });
  }

  showModalSaveDraft = (itemList) => {
    this.setState({
      isVisible: true,
      bookingOnHandle: itemList,
    });
  }

  closeModal = () => {
    const { actions, isSwitchCountry, switchedCountry } = this.props;
    this.setState({
      isVisible: false,
      isDeleteModal: false,
      bookingOnHandle: undefined,
    });

    if (isSwitchCountry) {
      actions.updateSwitchCountry();
      this.setState({
        bookings: [],
      });
      switchedCountry();
    }
  }

  handleDuplicateItem = (item) => {
    const { bookings } = this.state;
    const { isEditing, actions } = this.props;
    let count = 0;
    const newBookingMap = bookings.map((b, index) => {
      if (b == null) {
        return null;
      }
      count += 1;
      return {
        ...b,
      };
    });
    const objDuplicate = {
      ...item,
      id: bookings.length + 1,
      name: `${count + 1}`,
      isFirstItem: false,
    }
    this.setState({
      bookings: [...bookings, objDuplicate]
    }, () => {
      console.log('duplicate', objDuplicate);
      if (isEditing) {
        actions.editingDuplicateItem(objDuplicate)
      }
    });
  }

  removeBookingItem = (bookingOnHandle) => {
    const { bookings } = this.state;
    const { languageCode, isEditing, actions, draftId } = this.props;
    console.log('removeBookingItem', bookingOnHandle);
    const transportItem = this.transportType;
    const newBooking = [...bookings];
    newBooking[bookingOnHandle.index - 1] = null;
    this.listRef[bookingOnHandle.index - 1] = null;
    console.log('List Ref REMOVED: ', this.listRef, bookingOnHandle.index);

    // this.listRef.splice(index - 1, 1);
    let count = 0;
    const newListBooking = newBooking.map((booking, index) => {
      if (booking == null) {
        return null;
      }
      count += 1;
      if (index >= bookingOnHandle.index) {
        return {
          ...booking,
          name: `${count}`,
          isFirstItem: count === 1,
          transportModeSelected: transportItem
        };
      }

      return { ...booking, isFirstItem: count === 1, transportModeSelected: transportItem };
    });

    if (draftId) {
      actions.updateDraftItems(bookingOnHandle, 'remove');
    }

    this.setState({
      isVisible: false,
      isDeleteModal: false,
      bookingOnHandle: undefined,
      bookings: [...newListBooking],
    });

    if (isEditing) {
      console.log('bookingOnHandle', bookingOnHandle);
      actions.editingRemoveItem(bookingOnHandle, draftId);
    }
  }

  handleSaveDraftSwitchCountry = (bookingOnHandle, isSwitchCountry) => {
    const { actions, switchedCountry } = this.props;
    actions.callSaveDraft(true, bookingOnHandle, isSwitchCountry, (res, err) => {
      if (res) {
        this.setState({
          bookings: []
        });
        switchedCountry();
      }
    });
    this.setState({
      isVisible: false,
      isDeleteModal: false,
      bookingOnHandle: undefined,
    });
  }

  showModal() {
    const { bookingOnHandle, isDeleteModal } = this.state;
    const { languageCode, isSwitchCountry } = this.props;
    return (
      <View
        style={[styles.whiteBg, styles.pad20, {
          height: 285,
        }]}
      >
        <Text style={[styles.defaultSize, styles.bold]}>
          {(isDeleteModal && I18n.t('listing.deleteItemModal', { locale: languageCode })) || I18n.t('listing.saveDraft', { locale: languageCode })}
        </Text>
        <View style={[styles.mt20, styles.lineSilver]} />
        <View style={[styles.mt30, styles.mb30, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <Text style={[styles.defaultSize, styles.textCenter, { width: width / 1.2 }]}>
            {(isDeleteModal && `${I18n.t('listing.deleteItemModalContent', { locale: languageCode })} ${I18n.t('listing.item', { locale: languageCode })} ${bookingOnHandle && bookingOnHandle.booking.name}?`) || I18n.t('listing.saveDraftModalContent', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.flex}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => (isDeleteModal ? this.closeModal() : this.handleSaveDraftSwitchCountry(bookingOnHandle, isSwitchCountry))}
          >
            <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.mr10]}>
              {(isDeleteModal && I18n.t('listing.back', { locale: languageCode })) || I18n.t('listing.saveDraft', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => (isDeleteModal ? this.removeBookingItem(bookingOnHandle) : this.closeModal())}
          >
            <Text style={[styles.formGroupButton, isDeleteModal ? styles.formGroupButtonRed : styles.formGroupButton, styles.flexOne, styles.ml10]}>
              {(isDeleteModal && I18n.t('listing.delete', { locale: languageCode })) || I18n.t('listing.continue', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { bookings, isVisible } = this.state;
    const { languageCode, draftId } = this.props;
    this.listRef = [];
    console.log('bookings', bookings);
    return (
      <View>
        {bookings.map((booking, key) => (booking && (
          <View key={`booking-${booking.id}}`} style={{ zIndex: 999 - key }}>
            <Information
              ref={(ref) => (ref && this.listRef.push(ref))}
              isCanRemoved={bookings.filter((b) => b !== null).length > 1}
              itemIndex={(key + 1)}
              booking={{ ...booking }}
              callDuplicateItem={this.handleDuplicateItem}
              onDelete={this.showModalDelete}
              draftId={draftId}
              onSelectTransport={this.handleSelectTransport}
            />
          </View>
        )))}
        <AddNewBooking addNew={this.handleAddNew} languageCode={languageCode} />

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
            {this.showModal()}
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  tempBooking: state.listing.tempBooking,
  draftItem: state.listing.draftItem,
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  isEditing: state.listing.isEditing,
  shipmentDetail: state.listing.shipmentDetail,
  defaultAdditionalServices: state.listing.defaultAdditionalServices,
  transportTypesDefault: state.listing.transportTypesDefault,
  defaultHandleUnits: state.listing.defaultHandleUnits,
  dataStep1Editing: state.listing.dataStep1Editing,
  isDraftShipment: state.listing.isDraftShipment,
  draftId: state.listing.draftId,
  configs: state.app.configs,
  transportTypeId: state.listing.transportTypeId,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...listingAction
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(BookingInformation);
