import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// COMPONENTS
import BaseComponent from '../../../common/BaseComponent';
import ProgressUpdatePhoto from '../ProgressUpdatePhoto';
import NoteInput from '../NoteInput';
import progressActions from '../../../../store/actions/progressAction';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import APP, {
  PROGRESS_TYPE,
  ADDRESS_STATUS,
  FORMAT_TIME,
} from '../../../../constants/app';

// HELPER
import {
  dateClientWithFormat,
  getFormatDate,
  getFormatDateDayMonth,
} from '../../../../helpers/date.helper';

// CSS
import styles from '../../style';
import { SHIPMENT_STATUS } from '../../../../helpers/constant.helper';

class DeliveryDestinationProgressItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
      validateDataSuccess: true,
    };
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
    const { actions, shipmentID, deliveryDestinationProgressItem } = this.props;
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

    if (
      deliveryDestinationProgressItem.driverFiles.filter(
        (f) => f.fileName !== null,
      ).length <= 0
    ) {
      const message = this.getTextLanguage('destinationError');
      this.driverPhotoRef.setErrorMessage(message);
      return;
    }

    const status = this.checkAllInfoDispatch();
    if (status) {
      this.setState({ validateDataSuccess: true });
      actions.confirmDeliveryProgress(shipmentID, {
        addressId: deliveryDestinationProgressItem.addressId,
        stepDelivery: PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase(),),
      });
    } else {
      this.setState({ validateDataSuccess: false });
    }
  };

  checkAllInfoDispatch = () => {
    const { deliveryDestinationProgressItem } = this.props;
    let status = true;
    if (!this.driverNoteRef.getValueInput()) {
      status = false;
    }
    const haveImage = deliveryDestinationProgressItem.driverFiles.filter(
      (item) => item.imageUrl !== null,
    );
    if (haveImage.length === 0) {
      status = false;
    }
    return status;
  };

  checkRenderExpand = () => {
    const { shipmentStatus } = this.props;
    if (shipmentStatus >= 10) {
      this.setState((prevState) => ({ expanded: !prevState.expanded }));
    }
  }

  handleUploadPhoto = (photo, index) => {
    console.log('Photo: ', photo);
    const { actions, deliveryDestinationProgressItem } = this.props;
    actions.uploadBookedPhoto(deliveryDestinationProgressItem.addressId, {
      Section: PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      },
    });
  };

  handleRemovePhoto = (photo, index) => {
    console.log('Photo Remove: ', photo);
    const { actions, deliveryDestinationProgressItem } = this.props;
    actions.removeBookedPhoto(deliveryDestinationProgressItem.addressId, {
      Section: PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      },
    });
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
      const { actions, deliveryDestinationProgressItem, shipmentID } = this.props;
      actions.updateProgressShipment(shipmentID, {
        Section: PROGRESS_TYPE.DESTINATION.replace(/^\w/, (c) => c.toUpperCase()),
        Data: {
          DriverNotes: value,
          addressId: deliveryDestinationProgressItem.addressId
        },
      });
    }
  };

  renderErrorNote = (message) => (
    <View
      style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }]}
    >
      <Image
        source={IMAGE_CONSTANT.errorIcon}
        style={{ width: 20, height: 20 }}
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
        ]}>
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
    const { deliveryDestinationProgressItem, shipmentStatus } = this.props;
    const { validateDataSuccess } = this.state;
    const disable = deliveryDestinationProgressItem.status === ADDRESS_STATUS.COMPLETED;
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
          ]}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {this.getTextLanguage('notes')}
          </Text>
          {deliveryDestinationProgressItem.customerNotes !== '' && (
            <Text style={styles.inputProgress}>
              {deliveryDestinationProgressItem.customerNotes}
            </Text>
          )}
          <Text
            style={[
              styles.defaultSize,
              styles.defaultTextColor,
              styles.paddingVertical10,
              styles.bold
            ]}>
            {this.getTextLanguage('files')}
          </Text>
          <View
            style={[
              styles.uploadList,
              styles.marginHorizontalMinus10,
              styles.flex,
              styles.alignItemsCenter,
            ]}>
            {// Should be create component for select Update photo
            deliveryDestinationProgressItem.customerFiles &&
              deliveryDestinationProgressItem.customerFiles.length > 0 && (
                <ProgressUpdatePhoto
                  photos={deliveryDestinationProgressItem.customerFiles}
                  canEdit={false}
                  type="booked-customer-file"
                />
              )}
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
          ]}>
          <View style={styles.formGroupInput}>
            <View
              style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
              <Text
                style={[
                  styles.defaultSize,
                  styles.defaultTextColor,
                  styles.bold,
                ]}>
                {this.getTextLanguage('notes')}
              </Text>
            </View>
            <NoteInput
              ref={this.getDriverNoteRef}
              viewStyle={{paddingHorizontal: 10}}
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
              defaultText={deliveryDestinationProgressItem.driverNotes}
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
                ]}>
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
                ]}>
                {deliveryDestinationProgressItem.driverFiles &&
                  deliveryDestinationProgressItem.driverFiles.length >
                    0 && (
                    <ProgressUpdatePhoto
                      ref={this.getDriverPhotoRef}
                      photos={deliveryDestinationProgressItem.driverFiles}
                      canEdit={!disable}
                      type="booked-driver-file"
                      updateProgressPhoto={this.handleUploadPhoto}
                      removeProgressPhoto={this.handleRemovePhoto}
                      customErrorView={this.renderErrorPhoto}
                      onErrorPhoto={this.handleErrorPhoto}
                    />
                  )}
              </View>
              <Text
                style={[styles.smallSize, styles.grayText, styles.mt20]}>
                {this.getTextLanguage('upload_up_to_3_file')}
              </Text>
            </View>
          </View>
        </View>
        {deliveryDestinationProgressItem.status === 'Completed' ? (
          <View style={{width: '100%', height: 10}} />
        ) : (
          <View style={[styles.mt30, styles.mb10]}>
            {!validateDataSuccess &&
              this.renderErrorNote('Fail update! Please Try again')}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.confirmItem}
              disabled={disable}>
              <Text style={[styles.formGroupButton, styles.mainBg]}>
                {this.getTextLanguage('confirmDelivery')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  renderExpanded() {
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {this.renderExpandedDefault()}
      </>
    );
  }

  renderMissingIcon = () => (
    <View style={[styles.flex, styles.alignItemsCenter, styles.mt5]}>
      <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} resizeMode="contain" />
      <Text style={[styles.smallSize, styles.redText]}>
        {this.getTextLanguage('delivery_info_missing')}
      </Text>
    </View>
  );

  renderDeliveryDateOn = (isActivated, data) => {
    const { languageCode, countryCode } = this.props;
    if (!isActivated) {
      return (
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text
            style={[styles.mr10, styles.smallSize, styles.defaultTextColor]}
          >
            {this.getTextLanguage('delivery_due_on')}
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
            {dateClientWithFormat(data.deliveryDate, getFormatDateDayMonth(countryCode, languageCode))}
          </Text>
        </View>
      );
    }
    return (
      <View>
        <Text
          style={[
            styles.smallSize,
            styles.defaultTextColor,
            {paddingRight: 40},
          ]}>
          {data.address}
        </Text>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text
            style={[
              styles.mr10,
              styles.smallSize,
              styles.defaultTextColor,
            ]}>
            {this.getTextLanguage('delivered_on')}
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
              data.deliveryDate,
              getFormatDateDayMonth(countryCode, languageCode),
            )}
          </Text>
        </View>
      </View>
    );
  };

  toggleCollapse = () => {
    const {
      actions,
      deliveryDestinationProgressItem,
      shipmentStatus
    } = this.props;
    if (
      // shipmentStatus === SHIPMENT_STATUS.COMPLETED ||
      shipmentStatus === SHIPMENT_STATUS.CANCELLED
    ) {
      return;
    }
    actions.changeCurrentProgress(
      PROGRESS_TYPE.DESTINATION,
      deliveryDestinationProgressItem.addressId,
    );
  };

  render() {
    const {
      deliveryDestinationProgressItem,
      currentProgress,
      pickup,
      itemIndex
    } = this.props;
    const active = deliveryDestinationProgressItem.status === ADDRESS_STATUS.COMPLETED;
    let itemViewStyle = [styles.paddingVertical10, styles.whiteBg];
    let titleStyle = [styles.defaultTextColor];

    let iconMissingView = this.renderMissingIcon();

    if (active) {
      itemViewStyle = [styles.paddingVertical10, styles.lightGreenBg];
      titleStyle = [styles.mainColorText, styles.bold];
      iconMissingView = null;
    }

    const deliveryDateOnView = this.renderDeliveryDateOn(active, deliveryDestinationProgressItem);
    const expanded = currentProgress.type === PROGRESS_TYPE.DESTINATION
      && currentProgress.idDestination === deliveryDestinationProgressItem.addressId;
    const canCollapse = pickup.status === ADDRESS_STATUS.COMPLETED;
    return (
      <View style={[styles.mb20, styles.paddingHorizontal20, ...itemViewStyle]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.toggleCollapse}
          disabled={!canCollapse}
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
                      ? IMAGE_CONSTANT.shipmentGoods
                      : IMAGE_CONSTANT.shipmentGoodsUnActive
                  }
                />
              </View>
              <View>
                <Text style={[
                  styles.defaultSize,
                  ...titleStyle
                ]}
                >
                  {`${this.getTextLanguage('delivery_destination')} ${itemIndex + 1}`}
                </Text>
                {iconMissingView}
                {deliveryDateOnView}
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

const mapStateToProps = (state, ownProps) => ({
  languageCode: state.config.languageCode,
  deliveryDestinationProgressItem:
    (state.progress.deliveryDestination
      && state.progress.deliveryDestination.length > 0
      && state.progress.deliveryDestination[ownProps.itemIndex])
    || null,
  countryCode: state.config.countryCode,
  shipmentID: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  currentProgress: state.progress.currentProgress,
  pickup: state.progress.pickup,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateProgressShipment: progressActions.updateProgress,
      uploadBookedPhoto: progressActions.uploadPhotoProgress,
      removeBookedPhoto: progressActions.removePhotoProgress,
      confirmDeliveryProgress: progressActions.updateAddressDestination,
      changeCurrentProgress: progressActions.changeCurrentProgress,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DeliveryDestinationProgressItem);
