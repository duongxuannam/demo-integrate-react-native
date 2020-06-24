import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconCustomerService from '../../components/common/CustomerService';
import appActions from '../../store/actions/appAction';
import listingActions from '../../store/actions/listingAction';
import StepButton from '../../components/booking/step_button/StepButton';
import BookingInformation from '../../components/booking/BookingInformation';
import BookingAddresses from '../../components/booking/BookingAddresses';
import BookingBook from '../../components/booking/BookingBook';
import IMAGE_CONSTANT from '../../constants/images';
import { getTransportTypeObj } from '../../helpers/shipment.helper';
import I18N from '../../config/locales';
import { getAddress } from '../../services/map.services';

class BookingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {
        items: [], // data step 1,
        address: null, // data step 2,
        isBooked: false, // check booked
        isSwitchCountry: false,
        validData: false,
        units: '',
        totalWeight: null,
      }
    };
    this.refKeyboard = null;
    this.refTop = null;
  }

  componentDidMount() {
    const { actions, currentStep } = this.props;
    actions.getAddressData();
    actions.getHandleUnit();
    actions.getHandleUnitDefault();
    actions.getTransportTypes();
    actions.getTransportTypesDefault();
    actions.getAdditionalServices();
    actions.getAdditionalServicesDefault();
    actions.getLocationServicesDefault();
    actions.getLocationTypesDefault();
    if (Platform.OS === 'android') {
      // get location permission
      this.getLocationAndroid();
      // actions.updatePosition(106.6465892, 10.8011183);
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          actions.updatePosition(position.coords.longitude, position.coords.latitude);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
    // if (currentStep === 3) {
    //   this.renderShipmentDetail();
    // }
  }

  componentDidUpdate(prevProps) {
    const {
      currentStep, actions, app, countryCode, token, updatingCountry, summary
    } = this.props;
    if (currentStep !== prevProps.currentStep) {
      if (currentStep === 3) {
        actions.getAdvertDescription(app.countryCode);
        actions.getSummary('1', () => {
          console.log('getSummary success', summary);
          // this.renderShipmentDetail(summary);
        });
      }
      // scroll to top
      if (this.refTop && this.refKeyboard) {
        this.refTop.measure((fx, fy, width, height, px, py) => {
          this.refKeyboard.props.scrollToPosition(0, py);
        });
      }
    }

    if (summary !== prevProps.summary) {
      console.log('did update', summary);
      this.renderShipmentDetail(summary);
    }

    // if (prevProps.updatingCountry !== updatingCountry) {
    //   // Handle switch country step 1
    //   if (token && countryCode !== updatingCountry.countryCode) {
    //     if (currentStep === 1) {
    //       Alert.alert(
    //         'Notice',
    //         'Your booking may lost data and you have to re-input again',
    //         [
    //           {
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel'
    //           },
    //           { text: 'OK', onPress: () => { actions.setAppData(updatingCountry); actions.updateSwitchCountry() } }
    //         ],
    //         { cancelable: false }
    //       );
    //       // let canSwitchCountry = true;
    //       // const itemInformationList = this.bookingInformation && this.bookingInformation.getInformationBooking(true);
    //       // itemInformationList.forEach((item) => {
    //       //   if (!item.handleUnitSelected.id
    //       //     && !item.unitQuantity
    //       //     && !item.length
    //       //     && !item.width
    //       //     && !item.height
    //       //     && !item.weight
    //       //     && !item.transportModeSelected.id
    //       //     && item.itemServices.length === 0
    //       //     && !item.goodDesc) {
    //       //     canSwitchCountry = true;
    //       //   } else {
    //       //     canSwitchCountry = this.bookingInformation.checkAllInformation();
    //       //     this.setState({
    //       //       validData: canSwitchCountry,
    //       //     });
    //       //   }
    //       // });
    //       // if (canSwitchCountry) {
    //       //   actions.setAppData(updatingCountry);
    //       //   canSwitchCountry = false;
    //       // }
    //     }

    //     if (currentStep === 2) {
    //       Alert.alert(
    //         'Notice',
    //         'Your booking may lost data and you have to re-input again',
    //         [
    //           {
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel'
    //           },
    //           { text: 'OK', onPress: () => { actions.setAppData(updatingCountry); actions.updateSwitchCountry() } }
    //         ],
    //         { cancelable: false }
    //       );
    //       // const addressInformationList = this.bookingAddress && this.bookingAddress.getAllData(true);
    //       // const isDefaultPickup = this.isDefaultPickup(addressInformationList.pickup);
    //       // const isDefaultDestination = this.isDefaultDestination(addressInformationList.destinations);
    //       // if (isDefaultPickup && isDefaultDestination) {
    //       //   actions.setAppData(updatingCountry);
    //       //   actions.updateSwitchCountry();
    //       // } else {
    //       //   const validData = this.bookingAddress && this.bookingAddress.getAllData(false);
    //       //   if (validData) {
    //       //     actions.setAppData(updatingCountry);
    //       //     this.setState({
    //       //       validData: true,
    //       //     });
    //       //   }
    //       // }
    //     }
    //   }
    // }

    // if (prevProps.countryCode !== countryCode) {
    //   const { validData } = this.state;
    //   if (token) {
    //     this.setState({
    //       isSwitchCountry: true,
    //     });
    //     if (validData) {
    //       this.callSaveDraft();
    //       this.setState({
    //         validData: false,
    //       });
    //     }
    //   }
    // }
  }

  handleSetTitleShipment = async (units) => {
    const { addresses } = this.props;
    return `${units} from ${addresses.pickup.shortAddress} to ${addresses.destinations[addresses.destinations.length - 1].shortAddress}`;
  }

  renderShipmentDetailLessThanThree = async (summary) => {
    if (summary) {
      const data = summary.items.map((shipment, index) => `${shipment.quantity} ${shipment.handlingUnitName.toLowerCase()}${summary.items.length - index > 1 ? ', ' : ''}`).join('');
      const title = await this.handleSetTitleShipment(data);
      this.setState({
        units: data,
        totalWeight: summary.totalWeight,
      }, () => {
        const { actions } = this.props;
        actions.setTitleShipment(title, data, summary.totalWeight);
      });
    }
  }

  renderShipmentDetailMoreThanThree = async (summary) => {
    const { languageCode } = this.props;
    let stringData = '';
    if (summary) {
      summary.items.forEach((shipment, index) => {
        if (index < 3) {
          stringData += `${shipment.quantity} ${shipment.handlingUnitName.toLowerCase()}${index === 2 ? ' + ' : ', '}`;
        }

        if (summary.items.length - index === 1) {
          stringData += `${summary.items.length - 3} ${summary.items.length > 4
            ? I18N.t('shipment.title.items', { locale: languageCode }) : I18N.t('shipment.title.item', { locale: languageCode })}`;
        }
      });
      const title = await this.handleSetTitleShipment(stringData);
      this.setState({
        units: stringData,
        totalWeight: summary.totalWeight,
      }, () => {
        const { actions } = this.props;
        actions.setTitleShipment(title, stringData, summary.totalWeight);
      });
    }
  }


  renderShipmentDetail = (summary) => {
    console.log('summary', summary);
    if (summary.length > 0) {
      if (summary[0] && summary[0].source.items.length > 3) {
        this.renderShipmentDetailMoreThanThree(summary[0].source);
      } else {
        this.renderShipmentDetailLessThanThree(summary[0].source);
      }
    }
  }

  isDefaultPickup = (data) => {
    if (moment(data.pickupDate).format('DD-MM-YYYY') === moment(new Date()).format('DD-MM-YYYY')
      && !data.address
      && !data.locationTypeId
      && Object.keys(data.locationServices).length === 0
    ) {
      return true;
    }
    return false;
  }

  isDefaultDestination = (data) => {
    let isDefault = true;
    data.forEach((item) => {
      if (!item.earliestBy
        && !item.latestBy
        && !item.earliestByDate
        && !item.latestByDate
        && !item.locationTypeId
        && !item.address
        && Object.keys(item.locationServices).length === 0
      ) {
        isDefault = true;
      } else {
        isDefault = false;
      }
    });
    return isDefault;
  }

  getLocationAndroid = async () => {
    try {
      const { actions } = this.props;
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          message: '',
          title: 'Location Access Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            actions.updatePosition(position.coords.longitude, position.coords.latitude);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log('Location services permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  handleShowModalSaveDeaft = (itemInformationList) => {
    const { currentStep } = this.props;
    if (currentStep === 1) {
      let canSaveDraft = true;
      itemInformationList.forEach((item) => {
        if (!item.status) {
          canSaveDraft = false;
        }
      });

      if (!canSaveDraft) {
        return;
      }
      this.bookingInformation.callSaveDraft(itemInformationList);
    }
  }

  handleOnLoadedNewItem = (node) => {
    if (this.refKeyboard) {
      console.log('ITEM REF: ', node);
      // this.refKeyboard.measureLayout(node, (x,y) => {
      //   console.log("X, Y: ", x, y);
      // });
      // this.refKeyboard.props.scrollToPosition(0,884.5,true);
      this.refKeyboard.props.scrollToFocusedInput(node, -250);
    }
  }

  handleOnLoadedNewAddressItem = (node) => {
    if (this.refKeyboard) {
      console.log('ADDRESS ITEM REF: ', node);
      this.refKeyboard.props.scrollToFocusedInput(node, -50);
    }
  }

  callSaveDraft = () => {
    const {
      currentStep,
      draftItem,
      draftId,
      transportTypesDefault,
      actions,
    } = this.props;
    if (currentStep === 1) {
      let canSaveDraft = true;
      let itemInformationList = [];
      itemInformationList = this.bookingInformation && this.bookingInformation.getInformationBooking(false);
      itemInformationList.forEach((item) => {
        if (!item.status) {
          canSaveDraft = false;
        }
      });

      if (!canSaveDraft) {
        return;
      }
      let bodyItemDraft = [];
      if (draftId) {
        bodyItemDraft = [];
        console.log('itemInformationList', itemInformationList);
        console.log('itemInformationList draftItem', draftItem);
        itemInformationList.forEach((item) => {
          if (typeof item.id === 'string') {
            bodyItemDraft.push({
              id: item.id,
              handleUnitSelected: item.handleUnitSelected,
              unitQuantity: item.unitQuantity,
              length: item.length,
              width: item.width,
              height: item.height,
              weight: item.weight,
              description: item.goodDesc || '',
              itemServices: item.itemServices.map((res) => res.id),
              shipmentId: draftId,
              transportModeSelected: getTransportTypeObj(transportTypesDefault, itemInformationList[itemInformationList.length - 1].transportModeSelected.id),
              isDeleted: item.isDelete || item.isDeleted || false,
            });
          } else {
            bodyItemDraft.push({
              handleUnitSelected: item.handleUnitSelected,
              unitQuantity: item.unitQuantity,
              length: item.length,
              width: item.width,
              height: item.height,
              weight: item.weight,
              description: item.goodDesc || '',
              itemServices: item.itemServices.map((res) => res.id),
              shipmentId: draftId,
              transportModeSelected: getTransportTypeObj(transportTypesDefault, itemInformationList[itemInformationList.length - 1].transportModeSelected.id),
              isDeleted: item.isDelete || item.isDeleted || false,
            });
          }
        });
        const itemDelete = draftItem.filter((item) => item.isDeleted);
        console.log('itemDelete', itemDelete);
        if (itemDelete) {
          bodyItemDraft.push(...itemDelete);
        }
        // actions.updateDraftItems(bodyItemDraft, 'save');
      }
      console.log('new itemInformationList', itemInformationList);
      console.log('bodyItemDraft 2', bodyItemDraft);
      this.bookingInformation.callSaveDraft(draftId ? bodyItemDraft : itemInformationList);
    }

    if (currentStep === 2) {
      this.bookingAddress && this.bookingAddress.showModal();
    }
  }

  callDiscard = () => {
    const { actions } = this.props;
    actions.discardListingDraft();
  }

  saveDraftSuccessful = () => {
    Alert.alert('Save Draft', 'Save Draft Successfully.');
    this.setState({ currentStep: 2 });
  }

  saveDraftFailed = () => {
  }

  getQuote = () => {
    const {
      currentStep, actions, draftItem, draftId, transportTypesDefault
    } = this.props;
    const { listing: { address } } = this.state;

    if (currentStep === 1) {
      const itemInformationList = this.bookingInformation && this.bookingInformation.getInformationBooking(false);
      let canSaveDraft = true;
      itemInformationList.forEach((item) => {
        if (!item.status) {
          canSaveDraft = false;
        }
      });

      if (!canSaveDraft) {
        return;
      }
      const bodyItemDraft = [];
      if (draftId) {
        console.log('itemInformationList', itemInformationList);
        console.log('itemInformationList draftItem', draftItem);
        itemInformationList.forEach((item) => {
          if (typeof item.id === 'string') {
            bodyItemDraft.push({
              id: item.id,
              handleUnitSelected: item.handleUnitSelected,
              unitQuantity: item.unitQuantity,
              length: item.length,
              width: item.width,
              height: item.height,
              weight: item.weight,
              description: item.goodDesc || '',
              itemServices: item.itemServices.map((res) => res.id),
              shipmentId: draftId,
              transportModeSelected: getTransportTypeObj(transportTypesDefault, itemInformationList[itemInformationList.length - 1].transportModeSelected.id),
              isDeleted: item.isDelete || item.isDeleted || false,
            });
          } else {
            bodyItemDraft.push({
              handleUnitSelected: item.handleUnitSelected,
              unitQuantity: item.unitQuantity,
              length: item.length,
              width: item.width,
              height: item.height,
              weight: item.weight,
              description: item.goodDesc || '',
              itemServices: item.itemServices.map((res) => res.id),
              shipmentId: draftId,
              transportModeSelected: getTransportTypeObj(transportTypesDefault, itemInformationList[itemInformationList.length - 1].transportModeSelected.id),
              isDeleted: item.isDelete || item.isDeleted || false,
            });
          }
        });
      }
      let itemDelete = [];
      if (draftItem.length) {
        itemDelete = draftItem.filter((item) => item.isDeleted);
        bodyItemDraft.push(...itemDelete);
      }
      console.log('itemDelete', itemDelete);
      // if (itemDelete.length) {
      //   bodyItemDraft.push(...itemDelete);
      // }
      console.log('new itemInformationList', itemInformationList);
      console.log('bodyItemDraft 2', bodyItemDraft);
      actions.callGetQuote(draftId ? bodyItemDraft : itemInformationList);
    }

    if (currentStep === 2) {
      this.bookingAddress && this.bookingAddress.saveQuote();
    }
  }

  handleSwitchedCountrySaveDraft = () => {
    this.setState({
      isSwitchCountry: false,
    });
  }

  renderView = () => {
    const { currentStep, navigation } = this.props;
    const { isSwitchCountry, units, totalWeight } = this.state;
    switch (currentStep) {
      case 1: {
        const isRefresh = navigation.getParam('isRefresh');
        return (
          <BookingInformation
            ref={(ref) => { this.bookingInformation = ref; }}
            onSaveDraftSuccess={this.saveDraftSuccessful}
            isRefresh={isRefresh}
            onError={this.saveDraftFailed}
            isSwitchCountry={isSwitchCountry}
            switchedCountry={this.handleSwitchedCountrySaveDraft}
            onLoadedNewItem={this.handleOnLoadedNewItem}
          />
        );
      }
      case 2:
        return (
          <BookingAddresses
            ref={(ref) => { this.bookingAddress = ref; }}
            isSwitchCountry={isSwitchCountry}
            switchedCountry={this.handleSwitchedCountrySaveDraft}
            onLoadedNewAddressItem={this.handleOnLoadedNewAddressItem}
          />
        );
      case 3:
        return (
          <BookingBook navigation={navigation} units={units} totalWeight={totalWeight} />
        );
      default:
        break;
    }
  }

  renderTitle = () => {
    const { currentStep, languageCode } = this.props;
    switch (currentStep) {
      case 1:
        return (
          <Text>{I18N.t('bookingContainer.titleBreadcrumb.information', { locale: languageCode })}</Text>
        );
      case 2:
        return (
          <Text>{I18N.t('bookingContainer.titleBreadcrumb.address', { locale: languageCode })}</Text>
        );
      case 3:
        return (
          <Text>{I18N.t('bookingContainer.titleBreadcrumb.bookNow', { locale: languageCode })}</Text>
        );
      default:
        break;
    }
  }

  render() {
    const { currentStep, app, isEditing } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <KeyboardAwareScrollView
          nestedScrollEnabled
          extraScrollHeight={15}
          innerRef={(ref) => {
            this.refKeyboard = ref;
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]} ref={(ref) => this.refTop = ref}>
            <View style={[styles.pagination, styles.mr15, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.paginationCircle, currentStep === 1 && styles.paginationCircleActive]} />
              <View style={[styles.paginationCircle, currentStep === 2 && styles.paginationCircleActive]} />
              <View style={[styles.paginationCircle, styles.paginationCircleLast, currentStep === 3 && styles.paginationCircleActive]} />
            </View>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              {this.renderTitle()}
            </Text>
            <IconCustomerService />
          </View>
          {/* {app.errorMessage && <MsgErrorApi errorMsg={I18N.t(app.errorMessage)} styleProp={{ backgroundColor: 'transparent' }} />} */}
          {this.renderView()}
        </KeyboardAwareScrollView>

        {/* Step Button will be hide in step 3 */}
        <StepButton
          isEditing={isEditing}
          discard={this.callDiscard}
          step={currentStep}
          saveDraft={this.callSaveDraft}
          getQuote={this.getQuote}
          languageCode={app.languageCode}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  updatingCountry: state.app.updatingCountry,
  currentStep: state.listing.currentStep,
  token: state.auth.token,
  countryCode: state.app.countryCode,
  languageCode: state.app.languageCode,
  summary: state.listing.summary,
  addresses: state.listing.dataStep2,
  draftItem: state.listing.draftItem,
  draftId: state.listing.draftId,
  transportTypesDefault: state.listing.transportTypesDefault,
  isEditing: state.listing.isEditing,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...appActions, ...listingActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null, {
    forwardRef: true
  }
)(BookingContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  pad20: {
    padding: 20,
  },
  mr20: {
    marginRight: 20,
  },
  mr15: {
    marginRight: 15,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
  paginationCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  paginationCircleActive: {
    backgroundColor: 'rgba(81, 175, 43, 1)',
  },
  paginationCircleLast: {
    marginRight: 0,
  },
});
