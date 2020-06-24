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
import progressActions from '../../../../store/actions/progressAction';
import NoteInput from '../NoteInput';

// HELPER
import {
  dateClientWithFormat,
  getFormatDate,
} from '../../../../helpers/date.helper';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';
import APP, { PROGRESS_TYPE, LISTING_STATUS } from '../../../../constants/app';

// CSS
import styles from '../../style';
import { SHIPMENT_STATUS } from '../../../../helpers/constant.helper';

class BookedProgressItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
    };
  }

  componentDidMount() {
    const { currentProgress } = this.props;
    this.setState({
      expanded:
        currentProgress.type === PROGRESS_TYPE.BOOKED
    });
  }

  getDriverNoteRef = (ref) => { this.driverNoteRef = ref; }

  getDriverPhotoRef = (ref) => { this.driverPhotoRef = ref; }

  getTextLanguage = (key) => {
    const { languageCode } = this.props;
    return this.getLanguageLocation(key, languageCode);
  }

  handleEndDriverNote = () => {
    const isValid = this.driverNoteRef.validateValue();
    if (isValid) {
      // string not has contain email or phone number
      const errorMessage = this.getTextLanguage('errorDriverNote1');
      this.driverNoteRef.setErrorMessage(errorMessage);
      return;
    }
    const value = this.driverNoteRef.getValueInput();
    const { actions, shipmentID } = this.props;
    if (value) {
      actions.updateProgressShipment(shipmentID, {
        Section: PROGRESS_TYPE.BOOKED.replace(/^\w/, (c) => c.toUpperCase()),
        Data: {
          driverNotes: value,
        }
      });
    }
  }

  handleUploadPhoto = (photo, index) => {
    console.log('Photo: ', photo);
    const { actions, shipmentID } = this.props;
    actions.uploadBookedPhoto(shipmentID, {
      Section: PROGRESS_TYPE.BOOKED.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      }
    });
  }

  handleRemovePhoto = (photo, index) => {
    console.log('Photo Remove: ', photo);
    const { actions, shipmentID } = this.props;
    actions.removeBookedPhoto(shipmentID, {
      Section: PROGRESS_TYPE.BOOKED.replace(/^\w/, (c) => c.toUpperCase()),
      Data: {
        index,
        driverFiles: photo,
      }
    });
  }

  renderErrorNote = (message) => (
    <View style={[{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }]}>
      <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 20, height: 20 }} />
      <Text style={[{
        marginLeft: 10,
        fontSize: 16,
        color: '#f44336',
        fontFamily: 'Roboto-Bold',
        flex: 1
      }]}
      >
        {message}
      </Text>
    </View>
  )

  handleErrorPhoto = (error) => {
    if (error.type === APP.PHOTO_ERROR_TYPE.SIZE) {
      const message = `${this.getTextLanguage('photoErrorSize')} ${error.fileName}`;
      this.driverPhotoRef.setErrorMessage(message);
      return;
    }

    const message = this.getTextLanguage('photoErrorUnknown');
    this.driverPhotoRef.setErrorMessage(message);
  }

  resetError = () => this.driverPhotoRef.clearErrorData();

  renderErrorPhoto = (message) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
      <Image source={IMAGE_CONSTANT.errorIcon} style={{ marginRight: 5, marginTop: 5 }} />
      <Text style={{
        fontSize: 17,
        color: '#f44336',
        fontFamily: 'Roboto-Bold',
        width: '80%'
      }}
      >
        {message}
      </Text>
      <TouchableOpacity
        style={{ zIndex: 99 }}
        activeOpacity={0.9}
        onPress={this.resetError}
      >
        <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 25, height: 25 }} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )

  renderExpandedDefault() {
    const { booked, shipmentStatus } = this.props;
    const enable = shipmentStatus === LISTING_STATUS.BOOKED;
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
            styles.grayBorder
          ]}
        >
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {this.getTextLanguage('notes')}
          </Text>
          {
            booked.customerNotes !== '' && (
              <Text style={styles.inputProgress}>
                {booked.customerNotes}
              </Text>
            )
          }
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.paddingVertical10, styles.bold]}>
            {this.getTextLanguage('files')}
          </Text>
          <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
            {
              // Should be create component for select Update photo
              booked.customerFiles && booked.customerFiles.length > 0 && (
                <ProgressUpdatePhoto
                  photos={booked.customerFiles}
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
        <View style={[
          styles.whiteBg,
          styles.paddingHorizontal20,
          styles.paddingVertical30,
          styles.grayBorder
        ]}
        >
          <View style={styles.formGroupInput}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
              {this.getTextLanguage('notes')}
            </Text>
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
                color: 'rgba(68, 68, 68, 1)'
              }}
              defaultText={booked.driverNotes}
              onEndEditing={this.handleEndDriverNote}
              conditionRegexArray={[
                /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/,
                /[+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,15}/gm
              ]}
              customErrorView={this.renderErrorNote}
              maxLength={250}
              // editable={enable}
            />
          </View>
          <View style={styles.mt30}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {this.getTextLanguage('add_files')}
              <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>
                {`  (${this.getTextLanguage('optional')})`}
              </Text>
            </Text>
            <View style={styles.mt10}>
              <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
                {
                  booked.driverFiles && booked.driverFiles.length > 0 && (
                    <ProgressUpdatePhoto
                      ref={this.getDriverPhotoRef}
                      photos={booked.driverFiles}
                      // canEdit={enable}
                      type="booked-driver-file"
                      updateProgressPhoto={this.handleUploadPhoto}
                      removeProgressPhoto={this.handleRemovePhoto}
                      customErrorView={this.renderErrorPhoto}
                      onErrorPhoto={this.handleErrorPhoto}
                    />
                  )
                }
              </View>
              <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>
                {this.getTextLanguage('upload_up_to_3_file')}
              </Text>
            </View>
          </View>
        </View>
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

  toggleCollapse = () => {
    const { actions, shipmentStatus } = this.props;
    if (
      // shipmentStatus === SHIPMENT_STATUS.COMPLETED ||
      shipmentStatus === SHIPMENT_STATUS.CANCELLED
    ) {
      return;
    }

    actions.changeCurrentProgress(PROGRESS_TYPE.BOOKED);
  }

  render() {
    // const {
    //   expanded,
    // } = this.state;
    const {
      booked, currentProgress, countryCode, languageCode
    } = this.props;
    const expanded = currentProgress.type === PROGRESS_TYPE.BOOKED;
    return (
      <View
        style={[
          styles.mb20,
          styles.paddingHorizontal20,
          styles.paddingVertical20,
          styles.lightGreenBg,
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
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
                <Image source={booked.active ? IMAGE_CONSTANT.shipmentBook : IMAGE_CONSTANT.shipmentBook} />
              </View>
              <View>
                <Text
                  style={[
                    styles.defaultSize,
                    styles.mainColorText,
                    styles.bold,
                  ]}
                >
                  {this.getTextLanguage('booked')}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {booked.bookedDate && dateClientWithFormat(booked.bookedDate, getFormatDate(countryCode, languageCode))}
                </Text>
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
        {expanded && this.renderExpanded()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  booked: state.progress.booked,
  shipmentID: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  currentProgress: state.progress.currentProgress,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      updateProgressShipment: progressActions.updateProgress,
      uploadBookedPhoto: progressActions.uploadPhotoProgress,
      removeBookedPhoto: progressActions.removePhotoProgress,
      changeCurrentProgress: progressActions.changeCurrentProgress,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookedProgressItem);
