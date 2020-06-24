import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import progressActions from '../../../../store/actions/progressAction';

// COMPONENTS
import Select from '../../../common/Select';
import BaseComponent from '../../../common/BaseComponent';
import ProgressUpdatePhoto from '../ProgressUpdatePhoto';
import NoteInput from '../NoteInput';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import APP, { PROGRESS_TYPE, ADDRESS_STATUS, FORMAT_TIME } from '../../../../constants/app';

// HELPER
import {
  dateClientWithFormat,
  getFormatDateDayMonth,
} from '../../../../helpers/date.helper';

import I18n from '../../../../config/locales';
// CSS
import styles from '../../style';
import { SHIPMENT_STATUS } from '../../../../helpers/constant.helper';

class PickupProgressItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
      initComponent: false,
      validateDataSuccess: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentProgress !== this.props.currentProgress) {
      this.setState({ expanded: this.props.currentProgress === PROGRESS_TYPE.PICKUP });
    }
  }

  checkAllInfoDispatch = () => {
    const { pickup } = this.props;
    let status = true;
    if (!this.driverNoteRef.getValueInput()) {
      status = false;
    }
    const haveImage = pickup.driverFiles.filter(
      (item) => item.imageUrl !== null,
    );

    if (haveImage.length === 0) {
      status = false;
    }
    return status;
  };

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

  handleEndDriverNote = () => {
    const isValid = this.driverNoteRef.validateValue();
    if (isValid) {
      // string not has contain email or phone number
      const errorMessage = this.getTextLanguage('errorDriverNote1');
      this.driverNoteRef.setErrorMessage(errorMessage);
      return;
    }
    const value = this.driverNoteRef.getValueInput();
    if (value) {
      const { actions, pickup, shipmentID } = this.props;
      actions.updateProgressShipment(shipmentID, {
        Section: PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase()),
        Data: {
          DriverNotes: value,
          addressId: pickup.addressId
        },
      });
    }
  };

  handleUploadPhoto = (photo, index) => {
    console.log('Photo: ', photo);
    const { actions, pickup } = this.props;
    actions.uploadPickupPhoto(pickup.addressId, {
      Section: PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      },
    });
  };

  confirmItem = () => {
    const { actions, shipmentID, pickup } = this.props;
    const isValid = this.driverNoteRef.validateValue();
    if (isValid) {
      // string not has contain email or phone number
      const errorMessage = this.getTextLanguage('errorDriverNote1');
      this.driverNoteRef.setErrorMessage(errorMessage);
      return;
    }

    if (!this.driverNoteRef.getValueInput()) {
      const note = this.getTextLanguage('notes');
      const isRequired = this.getTextLanguage('is_required');
      this.driverNoteRef.setErrorMessage(`${note} ${isRequired}`);
      return;
    }

    if (pickup.driverFiles.filter((f) => f.fileName !== null).length <= 0) {
      const message = this.getTextLanguage('destinationError');
      this.driverPhotoRef.setErrorMessage(message);
      return;
    }

    const status = this.checkAllInfoDispatch();
    if (status) {
      const param = {
        addressId: pickup.addressId,
        stepDelivery: PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase(),),
      };
      this.setState({ validateDataSuccess: true });
      actions.updateAddressDestination(shipmentID, param);
    } else {
      this.setState({ validateDataSuccess: false });
    }
  };

  renderErrorNote = (message) => (
    <View
      style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }]}
    >
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ width: 20, height: 20 }}
        resizeMode="contain"
      />
      <Text
        style={[
          {
            marginLeft: 10,
            fontSize: 16,
            color: '#f44336',
            fontFamily: 'Roboto-Bold',
            flex: 1,
          },
        ]}
      >
        {`${message}.`}
      </Text>
    </View>
  );

  handleErrorPhoto = (error) => {
    if (error.type === APP.PHOTO_ERROR_TYPE.SIZE) {
      const message = `${this.getTextLanguage('photoErrorSize')} ${
        error.fileName
      }`;
      this.driverPhotoRef.setErrorMessage(message);
      return;
    }

    const message = this.getTextLanguage('photoErrorUnknown');
    this.driverPhotoRef.setErrorMessage(message);
  };

  handleRemovePhoto = (photo, index) => {
    console.log('Photo Remove: ', photo);
    const { actions, pickup } = this.props;
    actions.removePickupPhoto(pickup.addressId, {
      Section: PROGRESS_TYPE.PICKUP.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      },
    });
  };

  resetError = () => this.driverPhotoRef.clearErrorData();

  renderErrorPhoto = (message) => (
    <View
      style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}
    >
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ marginRight: 5, marginTop: 5 }}
      />
      <Text
        style={{
          fontSize: 17,
          color: '#f44336',
          fontFamily: 'Roboto-Bold',
          width: '80%',
        }}
      >
        {message}
      </Text>
      <TouchableOpacity
        style={{ zIndex: 99 }}
        activeOpacity={0.9}
        onPress={this.resetError}
      >
        <Image
          source={IMAGE_CONSTANT.circleClose}
          style={{ width: 25, height: 25 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  renderExpandedDefault() {
    const { pickup } = this.props;
    const { validateDataSuccess, error } = this.state;
    const disable = pickup.status === ADDRESS_STATUS.COMPLETED;
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
          {pickup.customerNotes !== '' && (
            <Text style={styles.inputProgress}>{pickup.customerNotes}</Text>
          )}
          <Text
            style={[styles.defaultSize, styles.defaultTextColor, styles.paddingVertical10, styles.bold]}
          >
            {this.getTextLanguage('files')}
          </Text>
          <View
            style={[
              styles.marginHorizontalMinus10,
              styles.flex,
              styles.alignItemsCenter,
            ]}
          >
            {// Should be create component for select Update photo
              pickup.customerFiles && pickup.customerFiles.length > 0 && (
                <ProgressUpdatePhoto
                  photos={pickup.customerFiles}
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
          <View style={styles.formGroupInput}>
            <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text
                style={[
                  styles.defaultSize,
                  styles.defaultTextColor,
                  styles.bold,
                ]}
              >
                {this.getTextLanguage('notes')}
              </Text>
            </View>
            <NoteInput
              ref={this.getDriverNoteRef}
              viewStyle={{ paddingHorizontal: 10 }}
              viewInputStyle={{
                minHeight: 60,
                borderWidth: 1,
                borderColor: 'rgba(219, 219, 219, 1)',
                borderRadius: 4,
                paddingHorizontal: 15,
              }}
              inputStyle={{
                fontSize: 17,
                fontFamily: 'Roboto-Regular',
                color: 'rgba(68, 68, 68, 1)',
              }}
              defaultText={pickup.driverNotes}
              onEndEditing={this.handleEndDriverNote}
              conditionRegexArray={[
                /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/,
                /[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,15}/gm,
              ]}
              customErrorView={this.renderErrorNote}
              maxLength={250}
              editable={!disable}
            />
          </View>
          <View style={styles.mt30}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text
                style={[
                  styles.defaultSize,
                  styles.defaultTextColor,
                  styles.bold,
                ]}
              >
                {this.getTextLanguage('add_files')}
              </Text>
            </View>

            <View style={styles.mt10}>
              <View
                style={[
                  styles.uploadList,
                  styles.marginHorizontalMinus10,
                  styles.flex,
                  styles.alignItemsCenter,
                ]}
              >
                {pickup.driverFiles && pickup.driverFiles.length > 0 && (
                  <ProgressUpdatePhoto
                    ref={this.getDriverPhotoRef}
                    photos={pickup.driverFiles}
                    canEdit={!disable}
                    type="booked-driver-file"
                    updateProgressPhoto={this.handleUploadPhoto}
                    removeProgressPhoto={this.handleRemovePhoto}
                    customErrorView={this.renderErrorPhoto}
                    onErrorPhoto={this.handleErrorPhoto}
                  />
                )}
              </View>
              <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>
                {this.getTextLanguage('upload_up_to_3_file')}
              </Text>
            </View>
          </View>
        </View>
        {
          !pickup.active ? (
            <View style={[styles.mt30, styles.mb10]}>
              {!validateDataSuccess
                && this.renderErrorNote('Fail update! Please Try again')}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.confirmItem}
                disabled={disable}
              >
                <Text style={[styles.formGroupButton, styles.mainBg]}>
                  {this.getTextLanguage('confirmPickup')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : <View style={{ width: '100%', height: 10 }} />
        }
      </View>
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
    actions.changeCurrentProgress(PROGRESS_TYPE.PICKUP);
  };

  renderExpanded() {
    const { type } = this.state;
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {this.renderExpandedDefault()}
      </>
    );
  }

  render() {
    const { number } = this.state;
    const {
      languageCode,
      pickup,
      currentProgress,
      dispatch,
      countryCode,
    } = this.props;
    const active = pickup.status === ADDRESS_STATUS.COMPLETED;
    const expanded = currentProgress.type === PROGRESS_TYPE.PICKUP;
    const canCollapse = dispatch.active;
    return (
      <View
        style={[
          styles.mb20,
          styles.paddingHorizontal20,
          styles.paddingVertical10,
          active ? styles.lightGreenBg : styles.whiteBg,
        ]}>
        <TouchableOpacity
          activeOpacity={1}
          disabled={!canCollapse}
          onPress={this.toggleCollapse}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View
              style={[
                styles.flexOne,
                styles.flex,
                styles.alignItemsCenter,
                styles.mr5,
              ]}>
              <View style={styles.mr10}>
                <Image
                  source={
                    active
                      ? IMAGE_CONSTANT.shipmentMove
                      : IMAGE_CONSTANT.shipmentMoveUnActive
                  }
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.defaultSize,
                    active ? styles.mainColorText : styles.defaultTextColor,
                    active && styles.bold,
                  ]}>
                  {`${this.getTextLanguage('pickup')} ${number || ''}`}
                </Text>
                {!active && (
                  <View
                    style={[
                      styles.flex,
                      styles.alignItemsCenter,
                      styles.mt5,
                    ]}>
                    <Image
                      source={IMAGE_CONSTANT.errorIcon}
                      style={styles.mr5}
                    />
                    <Text style={[styles.smallSize, styles.redText]}>
                      {I18n.t('pickup_info_missing', {
                        locale: languageCode,
                      })}
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
                      ]}>
                      {this.getTextLanguage('pickup_due_on')}
                    </Text>
                    <Text
                      style={[
                        styles.date,
                        styles.dateText,
                        styles.defaultTextColor,
                        styles.smallSize,
                        styles.bold,
                      ]}>
                      {dateClientWithFormat(
                        pickup.pickupDate,
                        getFormatDateDayMonth(countryCode, languageCode),
                      )}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text
                      style={[
                        styles.smallSize,
                        styles.defaultTextColor,
                        {paddingRight: 40},
                      ]}>
                      {pickup.address}
                    </Text>
                    <View style={[styles.flex, styles.alignItemsCenter]}>
                      <Text
                        style={[
                          styles.mr10,
                          styles.smallSize,
                          styles.defaultTextColor,
                        ]}>
                        {this.getTextLanguage('picked_up_on')}
                      </Text>
                      <Text
                        style={[
                          styles.date,
                          styles.dateText,
                          {color: 'rgba(15, 115, 15, 1)'},
                          styles.smallSize,
                          styles.bold,
                        ]}>
                        {dateClientWithFormat(
                          pickup.pickupDate,
                          getFormatDateDayMonth(countryCode, languageCode),
                        )}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            {expanded ? (
              <Image
                source={IMAGE_CONSTANT.arrowUp}
                style={{width: 24, height: 24}}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={IMAGE_CONSTANT.arrowDown}
                style={{width: 24, height: 24}}
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
  pickup: state.progress.pickup,
  dispatch: state.progress.dispatch,
  shipmentID: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  currentProgress: state.progress.currentProgress,
  countryCode: state.config.countryCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateProgressShipment: progressActions.updateProgress,
      uploadPickupPhoto: progressActions.uploadPhotoProgress,
      removePickupPhoto: progressActions.removePhotoProgress,
      changeCurrentProgress: progressActions.changeCurrentProgress,
      updateAddressDestination: progressActions.updateAddressDestination,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PickupProgressItem);
