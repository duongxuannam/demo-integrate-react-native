import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import progressActions from '../../../../store/actions/progressAction';

// COMPONENTS
import Select from '../../../common/Select';
import BaseComponent from '../../../common/BaseComponent';
import FormInput from '../../../common/FormInput';
import ProgressUpdatePhoto from '../ProgressUpdatePhoto';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import APP, { PROGRESS_TYPE, LISTING_STATUS } from '../../../../constants/app';

import {
  dateClientWithFormat,
  getFormatDateDayMonth,
} from '../../../../helpers/date.helper';
// CSS
import styles from '../../style';
import { SHIPMENT_STATUS } from '../../../../helpers/constant.helper';

class DispatchProgressItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      // expanded: props.expanded || false,
      active: null,
      type: null,
      selectedVehicles: null,
      // selectedTransportMode: { name: 'TT03' }, // Any
      selectedTransportMode: null,
      validateDataSuccess: true,
      error: {
        vehiclesError: false,
        truckMakeError: false,
        modelError: false,
        licenseError: false,
        transportModeError: false,
        transportTypeError: false,
        driverNameError: false,
      },
    };
  }

  componentDidMount() {
    const { transportMode, dispatch } = this.props;
    if (dispatch.transportMode !== null) {
      const IDTransportMode = transportMode.find(
        (item) => item.id === dispatch.transportMode
      );
      this.setState({ selectedTransportMode: IDTransportMode });
    }
  }

  getDriverNoteRef = (ref) => {
    this.driverNoteRef = ref;
  };

  getDriverPhotoRef = (ref) => {
    this.driverPhotoRef = ref;
  };

  getTextLanguage = (key) => {
    const { languageCode } = this.props;
    return this.getLanguageLocation(key, languageCode);
  };

  confirmItem = () => {
    const { actions, shipmentID, dispatch } = this.props;
    const status = this.checkAllInfoDispatch();

    if (status) {
      const param = {
        addressId: dispatch.addressId,
        stepDelivery: PROGRESS_TYPE.DISPATCH.replace(/^\w/, (c) => c.toUpperCase(),),
      };
      this.setState({ validateDataSuccess: true });
      actions.updateAddressDestination(shipmentID, param);
    } else {
      this.setState({ validateDataSuccess: false });
    }
  };

  checkAllInfoDispatch = () => {
    const { error, selectedTransportMode } = this.state;
    let status = true;
    // if (!selectedVehicles) {
    //   status = false;
    //   error.vehiclesError = true;
    // } else {
    //   error.vehiclesError = false;
    // }
    if (!this.keywordTruckMakeRef.validateValue()) {
      status = false;
      error.truckMakeError = true;
    } else {
      error.truckMakeError = false;
    }

    if (!this.keywordModelRef.validateValue()) {
      status = false;
      error.modelError = true;
    } else {
      error.modelError = false;
    }

    if (!selectedTransportMode) {
      status = false;
      error.transportModeError = true;
    } else {
      error.transportModeError = false;
    }

    if (!this.keywordLicenseRef.validateValue()) {
      status = false;
      error.licenseError = true;
    } else {
      error.licenseError = false;
    }

    if (!this.keywordDriverNameRef.validateValue()) {
      status = false;
      error.driverNameError = true;
    } else {
      error.driverNameError = false;
    }

    if (!status) {
      this.setState({ error: { ...error } });
    } else {
      this.setState({
        error: {
          vehiclesError: false,
          truckMakeError: false,
          modelError: false,
          licenseError: false,
          transportModeError: false,
          transportTypeError: false,
          driverNameError: false,
        },
      });
    }
    return status;
  };

  getTextInputTruckMakeRef = (ref) => {
    this.keywordTruckMakeRef = ref;
  };

  getTextInputModelRef = (ref) => {
    this.keywordModelRef = ref;
  };

  getTextInputLicenseRef = (ref) => {
    this.keywordLicenseRef = ref;
  };

  getTextInputColourRef = (ref) => {
    this.keywordColourRef = ref;
  };

  getTextInputDriverNameRef = (ref) => {
    this.keywordDriverNameRef = ref;
  };

  getTextInputDriverMobileRef = (ref) => {
    this.keywordDriverMobileRef = ref;
  };

  handleChangeVehicles = (selected) => {
    const { error } = this.state;
    error.vehiclesError = false;
    this.setState({ selectedVehicles: selected, error });
    const { actions, shipmentID } = this.props;
    const param = {
      Section: PROGRESS_TYPE.DISPATCH,
      Data: {
        SavedVehicle: selected.name,
      },
    };
    if (selected.name !== '') {
      actions.updateProgress(shipmentID, param);
    }
  };

  handleChangeTransportMode = (selected) => {
    const { error } = this.state;
    error.transportModeError = false;
    this.setState({ selectedTransportMode: selected, error });
    const { actions, shipmentID } = this.props;
    const param = {
      Section: PROGRESS_TYPE.DISPATCH,
      Data: {
        TransportMode: selected.id,
      },
    };
    if (selected.id !== '') {
      actions.updateProgress(shipmentID, param);
    }
  };

  renderErrorMessage = (message) => (
    <View style={[styles.flex, styles.alignItemsCenter, { marginBottom: 10 }]}>
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ width: 18, height: 18, marginRight: 5 }}
        resizeMode="contain"
      />
      <Text style={[styles.errorText, styles.defaultSize, styles.bold]}>
        {`${message} ${this.getTextLanguage('is_required')}.`}
      </Text>
    </View>
  );

  renderErrorMessageConfirm = (message) => (
    <View style={[styles.flex, styles.alignItemsCenter, { marginBottom: 10 }]}>
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ width: 18, height: 18, marginRight: 5 }}
        resizeMode="contain"
      />
      <Text style={[styles.errorText, styles.defaultSize, styles.bold]}>
        {`${message}.`}
      </Text>
    </View>
  );

  saveTruckMake = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordTruckMakeRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          TruckMake: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  saveModel = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordModelRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          Mode: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  saveLicencePlate = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordLicenseRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          LicencePlate: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  saveColor = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordColourRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          Color: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  saveDriverName = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordDriverNameRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          DriverName: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  saveDriverPhone = () => {
    const { actions, shipmentID } = this.props;
    const value = this.keywordDriverMobileRef.getValueInput();
    if (value !== '') {
      const param = {
        Section: PROGRESS_TYPE.DISPATCH,
        Data: {
          DriverPhone: value,
        },
      };
      actions.updateProgress(shipmentID, param);
    }
  };

  renderExpandedDefault() {
    const { dispatch, transportMode, account } = this.props;
    const {
      selectedVehicles,
      selectedTransportMode,
      error,
      validateDataSuccess,
    } = this.state;
    const defaultDriverName = dispatch.driverName === '' ? account.name : dispatch.driverName;
    const defaultDriverPhone = dispatch.driverMobile === '' ? account.phone : dispatch.driverMobile;
    const disable = !dispatch.active;
    return (
      <View style={[styles.mt30, styles.mb10]}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={styles.formHeader}>
            {this.getTextLanguage('customer_comments')}
          </Text>
        </View>
        <View
          style={[
            styles.whiteBg,
            styles.paddingHorizontal20,
            styles.paddingVertical30,
            styles.mb30,
            styles.grayBorder,
          ]}
        >

          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {this.getTextLanguage('notes')}
          </Text>
          {dispatch.customerNotes !== '' && (
            <Text style={styles.inputProgress}>{dispatch.customerNotes}</Text>
          )}
          <Text
            style={[styles.defaultSize, styles.defaultTextColor, styles.paddingVertical10, styles.bold]}
          >
            {this.getTextLanguage('files')}
          </Text>
          <View
            style={[
              styles.uploadList,
              styles.marginHorizontalMinus10,
              styles.flex,
              styles.alignItemsCenter,
            ]}
          >
            {// Should be create component for select Update photo
            dispatch.customerFiles && dispatch.customerFiles.length > 0 && (
              <ProgressUpdatePhoto
                photos={dispatch.customerFiles}
                canEdit={false}
                type="booked-customer-file"
              />
            )
}
          </View>
        </View>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={styles.formHeader}>
            {this.getTextLanguage('your_comments')}
          </Text>
        </View>
        <View
          style={[
            styles.whiteBg,
            styles.paddingHorizontal20,
            styles.paddingVertical30,
            styles.grayBorder,
          ]}
        >
          <View>
            <View style={styles.mb10}>
              {this.renderErrorUI(error.vehiclesError)}
            </View>
            <View>
              <Select
                placeholder={this.getTextLanguage('shipment.progress.saved_vehicles')}
                source={[]}
                // source={[dispatch.vehicles]}
                selectedValue={selectedVehicles}
                onValueChange={this.handleChangeVehicles}
                whiteBg
                noEdit={!disable}
                error={error.vehiclesError}
              />
            </View>
          </View>
          <View style={[styles.line, styles.mt20, styles.mb20, Platform.OS === 'ios' && { zIndex: -1 }]} />
          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <FormInput
              ref={this.getTextInputTruckMakeRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={dispatch.truckMake}
              editable={disable}
              maxLength={50}
              placeHolder="e.g. Mitsubishi"
              errorPos="MIDDLE"
              label={this.getTextLanguage('truck_make')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('truck_make'))}
              onEndEditing={this.saveTruckMake}
            />
          </View>
          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <FormInput
              ref={this.getTextInputModelRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={dispatch.model}
              editable={disable}
              maxLength={50}
              placeHolder="e.g. Fuso FJ"
              errorPos="MIDDLE"
              label={this.getTextLanguage('model')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('model'))}
              onEndEditing={this.saveModel}
            />
          </View>
          <View style={[styles.mb30]}>
            <View
              style={[styles.flex, styles.alignItemsCenter, styles.mb10, Platform.OS === 'ios' && { zIndex: -1 }]}
            >
              {this.renderErrorUI(
                error.transportModeError && !selectedTransportMode,
              )}
              <Text
                style={[
                  styles.defaultSize,
                  error.transportModeError && !selectedTransportMode
                    ? styles.redText
                    : styles.defaultTextColor,
                  styles.bold,
                ]}
              >
                {error.transportModeError && !selectedTransportMode
                  ? `${this.getTextLanguage(
                    'transport_mode',
                  )} ${this.getTextLanguage('is_required')}`
                  : this.getTextLanguage('transport_mode')}
              </Text>
            </View>
            <View>
              <Select
                placeholder={this.getTextLanguage('shipment.progress.select_one')}
                // source={[dispatch.transportMode]}
                source={transportMode}
                selectedValue={selectedTransportMode}
                onValueChange={this.handleChangeTransportMode}
                whiteBg
                error={error.transportModeError && !selectedTransportMode}
                noEdit={!disable}
              />
            </View>
          </View>
          <View style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}>
            <FormInput
              ref={this.getTextInputLicenseRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={dispatch.license}
              editable={disable}
              placeHolder="2396"
              errorPos="MIDDLE"
              label={this.getTextLanguage('license_plate')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('license_plate'))}
              onEndEditing={this.saveLicencePlate}
            />
          </View>
          <View
            style={[styles.mb30, Platform.OS === 'ios' && { zIndex: -1 }]}
          >
            <Text
              style={[
                styles.defaultSize,
                styles.defaultTextColor,
                styles.bold,
                styles.mb10,
              ]}
            >
              {this.getTextLanguage('colour')}
              <Text
                style={[styles.smallerSize, styles.grayText, styles.normal]}
              >
                {`  (${this.getTextLanguage('optional')})`}
              </Text>
            </Text>
            <FormInput
              ref={this.getTextInputColourRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              defaultText={dispatch.colour}
              editable={disable}
              placeHolder="e.g. Black, Silver"
              onEndEditing={this.saveColor}
            />
          </View>
          <View style={[styles.mb30]}>
            <FormInput
              ref={this.getTextInputDriverNameRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              // defaultText={dispatch.driverName}
              defaultText={defaultDriverName}
              editable={disable}
              placeHolder="Enter driver name"
              errorPos="MIDDLE"
              label={this.getTextLanguage('driver_name')}
              labelStyle={[styles.defaultSize, styles.bold]}
              viewLabelStyle={styles.mb10}
              customErrorView={() => this.renderErrorMessage(this.getTextLanguage('driver_name'))}
              onEndEditing={this.saveDriverName}
            />
          </View>
          <View>
            <Text
              style={[
                styles.defaultSize,
                styles.defaultTextColor,
                styles.bold,
                styles.mb10,
              ]}
            >
              {this.getTextLanguage('driver_mobile_phone')}
              <Text
                style={[styles.smallerSize, styles.grayText, styles.normal]}
              >
                {`  (${this.getTextLanguage('optional')})`}
              </Text>
            </Text>
            <FormInput
              ref={this.getTextInputDriverMobileRef}
              viewInputStyle={[
                styles.viewInput,
                styles.justifyContentCenter,
              ]}
              inputStyle={[styles.defaultSize, styles.defaultTextColor]}
              // defaultText={dispatch.driverMobile}
              defaultText={defaultDriverPhone}
              editable={disable}
              placeHolder="Enter driver contact number"
              keyboardType="phone-pad"
              onEndEditing={this.saveDriverPhone}
            />
          </View>
        </View>
        {!dispatch.active ? (
          <View style={[styles.mt30, styles.mb10]}>
            {!validateDataSuccess
              && this.renderErrorMessageConfirm('Fail update! Please Try again')}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.confirmItem}
              disabled={!disable}
            >
              <Text style={[styles.formGroupButton, styles.mainBg]}>
                {this.getTextLanguage('confirm_dispatch')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ height: 10, width: '100%' }} />
        )}
      </View>
    );
  }

  renderErrorUI = (error, message = null) => (error ? (
    <Image
      source={IMAGE_CONSTANT.errorIcon}
      style={{ width: 18, height: 18, marginRight: 5 }}
      resizeMode="contain"
    />
  ) : null);

  renderExpanded() {
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {this.renderExpandedDefault()}
      </>
    );
  }

  toggleCollapse = () => {
    const { actions, shipmentStatus } = this.props;
    if (
      // shipmentStatus === SHIPMENT_STATUS.COMPLETED ||
      shipmentStatus === SHIPMENT_STATUS.CANCELLED
    ) {
      return;
    }
    actions.changeCurrentProgress(PROGRESS_TYPE.DISPATCH);
  };

  render() {
    const { number } = this.state;
    const {
      dispatch,
      currentProgress,
      languageCode,
      countryCode,
      booked,
      pickup,
      shipmentStatus,
      account,
    } = this.props;
    const {
      truckMake, model, license, driverName, active
    } = dispatch;
    const expanded = currentProgress.type === PROGRESS_TYPE.DISPATCH;
    // console.log('dispatch: ', dispatch);
    // console.log('booked: ', booked);
    // console.log('pickup: ', pickup);
    // console.log('shipmentStatus: ', shipmentStatus);
    // console.log('account: ', account);
    return (
      <View
        style={[
          styles.mb20,
          styles.paddingHorizontal20,
          styles.paddingVertical10,
          active ? styles.lightGreenBg : styles.whiteBg,
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          // onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          onPress={this.toggleCollapse}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View
              style={[
                styles.flexOne,
                styles.flex,
                styles.alignItemsCenter,
                styles.mr5,
              ]}
            >
              <View style={styles.mr10}>
                <Image
                  source={
                    active
                      ? IMAGE_CONSTANT.shipmentVehicle
                      : IMAGE_CONSTANT.shipmentVehicleUnActive
                  }
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.defaultSize,
                    active ? styles.mainColorText : styles.defaultTextColor,
                    active && styles.bold,
                  ]}
                >
                  {`${this.getTextLanguage('dispatch')} ${number || ''}`}
                </Text>
                {!active && (
                  <View
                    style={[
                      styles.flex,
                      styles.alignItemsCenter,
                      styles.mt5,
                    ]}
                  >
                    <Image
                      source={IMAGE_CONSTANT.errorIcon}
                      style={styles.mr5}
                      resizeMode="contain"
                    />
                    <Text style={[styles.smallSize, styles.redText]}>
                      {this.getTextLanguage('dispatch_info_missing')}
                    </Text>
                  </View>
                )}
                {!active ? (
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Text
                      style={[
                        styles.mr10,
                        styles.smallSize,
                        styles.defaultTextColor,
                      ]}
                    >
                      {this.getTextLanguage('dispatch_due_on')}
                    </Text>
                    <Text
                      style={[
                        styles.date,
                        styles.dateText,
                        styles.defaultTextColor,
                        styles.smallSize,
                        styles.bold,
                      ]}
                    >
                      {/* 14-Mar to 31-Mar */}
                      {`${dateClientWithFormat(
                        booked.bookedDate,
                        getFormatDateDayMonth(countryCode, languageCode),
                      )} ${this.getTextLanguage(
                        'shipment.detail.to',
                      )} ${dateClientWithFormat(
                        pickup.pickupDate,
                        getFormatDateDayMonth(countryCode, languageCode),
                      )}`}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[styles.smallSize, styles.defaultTextColor]}
                    >
                      {`${truckMake} - ${model} - ${license}`}
                    </Text>
                    <Text
                      style={[styles.smallSize, styles.defaultTextColor]}
                    >
                      {driverName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {expanded ? (
              <Image
                source={IMAGE_CONSTANT.arrowUp}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={IMAGE_CONSTANT.arrowDown}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
        {expanded ? this.renderExpanded() : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  dispatch: state.progress.dispatch,
  shipmentID: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  transportMode: state.shipment.defaultTransportTypes,
  currentProgress: state.progress.currentProgress,
  countryCode: state.config.countryCode,
  booked: state.progress.booked,
  pickup: state.progress.pickup,
  account: state.auth.account,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...progressActions }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DispatchProgressItem);
