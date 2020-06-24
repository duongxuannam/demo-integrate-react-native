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
import progressActions from '../../../store/actions/progressAction';

// COMPONENTS
import Select from '../../common/Select';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import { PROGRESS_TYPE, PROGRESS_NAME } from '../../../constants/app';

import { bookedUI, dispatchUI } from '../../../model/progress';
import TapUpload from '../attactments/TapUpload';
import I18n from '../../../config/locales';
// CSS
import styles from '../style';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
      initComponent: false,
    };
  }

  componentDidMount() {
    const { idx, progress, type } = this.props;
    let data = {};
    switch (type) {
      case PROGRESS_TYPE.DESTINATION:
        data = progress[PROGRESS_TYPE.DESTINATION][idx];
        break;
      default:
        data = progress[type];
    }
    console.log('data', data);
    this.setState({
      initComponent: true,
      ...data,
    });
  }

  confirmItem = () => {
    const { actions, shipmentID } = this.props;
    const {
      type,
      driverNotes,
    } = this.state;
    let data = {};
    switch (type) {
      case PROGRESS_TYPE.DISPATCH:
        data = this.checkValidateDispath();
        if (!data.validate) {
          // call action
        }
        break;
      case PROGRESS_TYPE.PICKUP:
        data = this.checkValidateDefault();
        if (!data.validate) {
          // call action
          const param = {
            Section: type,
            Data: {
              driverNotes,
            }
          };
          actions.updateProgress(shipmentID, param);
        }
        break;
      default: break;
    }
    this.setState({ ...data.errorMessage });
  }

  checkValidateDispath = () => {
    const errorMessage = {};
    const {
      vehicles,
      truckMake,
      model,
      transportMode,
      license,
      driverName
    } = this.state;
    errorMessage.vehiclesError = !vehicles;
    errorMessage.truckMakeError = !truckMake;
    errorMessage.modelError = !model;
    errorMessage.licenseError = !license;
    errorMessage.transportModeError = !transportMode;
    errorMessage.driverNameError = !driverName;
    const validate = !vehicles || !truckMake || !model || !license || !transportMode || !driverName;
    return { errorMessage, validate };
  }

  checkValidateDefault = () => {
    const errorMessage = {};
    const {
      driverNotes
    } = this.state;
    errorMessage.driverNotesError = !driverNotes;
    const validate = !driverNotes;
    return { errorMessage, validate };
  }

  renderIcon = (type, active) => {
    const toLowerCaseType = type.toLowerCase();
    let iconStatus = '';
    switch (toLowerCaseType) {
      case PROGRESS_TYPE.BOOKED:
        iconStatus = <Image source={IMAGE_CONSTANT.shipmentBook} />;
        break;
      case PROGRESS_TYPE.DISPATCH:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentVehicle} /> : <Image source={IMAGE_CONSTANT.shipmentVehicleUnActive} />;
        break;
      case PROGRESS_TYPE.PICKUP:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentMove} /> : <Image source={IMAGE_CONSTANT.shipmentMoveUnActive} />;
        break;
      default:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentGoods} /> : <Image source={IMAGE_CONSTANT.shipmentGoodsUnActive} />;
        break;
    }
    return iconStatus;
  }

  renderExpandedDefault() {
    const { languageCode } = this.props;
    const {
      customerNotes,
      customerFiles,
      driverNotes,
      driverFiles,
      active,
      type,
      noEdit
    } = this.state;
    return (
      <View style={[styles.mt30, styles.mb10]}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={styles.formHeader}>
            { I18n.t('customer_comments', { locale: languageCode }) }
          </Text>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30, styles.grayBorder]}
        >
          <Text style={[styles.defaultSize, styles.defaultTextColor]}>
            { I18n.t('notes', { locale: languageCode }) }
          </Text>
          <Text style={styles.input}>
            { customerNotes }
          </Text>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mt20]}>
            { I18n.t('files', { locale: languageCode }) }
          </Text>
          <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
            {
              customerFiles.map((item) => (
                <TapUpload
                  photo={item}
                  noEdit
                />
              ))
            }
          </View>
        </View>

        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={styles.formHeader}>
            { I18n.t('your_comments', { locale: languageCode }) }
          </Text>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.grayBorder]}
        >
          <View style={styles.formGroupInput}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
              { I18n.t('notes', { locale: languageCode }) }
            </Text>
            <TextInput
              style={styles.input}
              value={driverNotes}
              editable={active}
              noEdit={noEdit}
              onChangeText={(text) => this.setState({ driverNotes: text })}
            />
          </View>
          <View style={styles.mt30}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              { I18n.t('add_files', { locale: languageCode }) }
              <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>
                (
                {I18n.t('optional', { locale: languageCode })}
                )
              </Text>
            </Text>
            <View style={styles.mt10}>
              <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
                {
                  driverFiles.map((item) => (
                    <TapUpload
                      photo={item}
                      noEdit={noEdit}
                    />
                  ))
                }
              </View>
              <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>
                { I18n.t('upload_up_to_3_file', { locale: languageCode }) }
              </Text>
            </View>
          </View>
        </View>
        {
          !noEdit && type !== PROGRESS_TYPE.BOOKED && (
          <View style={[styles.mt30, styles.mb10]}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.confirmItem}>
              <Text style={[styles.formGroupButton, styles.mainBg]}>
                { I18n.t('confirm_dispatch', { locale: languageCode }) }
              </Text>
            </TouchableOpacity>
          </View>
          )
        }
      </View>
    );
  }

  renderErrorUI = (error, message = null) => error ? (<Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 18, height: 18 }} />) : null

  renderExpandedDispath() {
    const { languageCode } = this.props;
    const {
      vehicles,
      truckMake,
      model,
      transportMode,
      license,
      colour,
      driverName,
      driverMobile,
      active,
      vehiclesError,
      truckMakeError,
      modelError,
      licenseError,
      transportModeError,
      driverNameError,
      noEdit
    } = this.state;
    console.log('noEdit', noEdit);
    return (
      <View style={[styles.mt30, styles.mb10]}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={styles.formHeader}>
            { I18n.t('your_comments', { locale: languageCode }) }
          </Text>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.grayBorder]}
        >
          <View>
            { this.renderErrorUI(vehiclesError) }
            <Select
              placeholder="Saved vehicles"
              source={[
                { value: 0, name: 'Demo Select 1' },
                { value: 1, name: 'Demo Select 2' },
                { value: 2, name: 'Demo Select 3' },
                { value: 3, name: 'Demo Select 4' },
                { value: 4, name: 'Demo Select 5' },
                { value: 5, name: 'Demo Select 6' },
                { value: 8, name: 'Demo Select 8' },
              ]}
              selectedValue={vehicles}
              onValueChange={() => console.log('sss')}
              whiteBg
              noEdit={noEdit}
            />
          </View>
          <View style={[styles.line, styles.mt20, styles.mb20]} />
          <View style={[styles.formGroupInput, styles.mb30]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                { I18n.t('truck_make', { locale: languageCode }) }
              </Text>
              { this.renderErrorUI(truckMakeError) }
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mitsubishi"
              value={truckMake}
              editable={active}
              onChangeText={(text) => this.setState({ truckMake: text })}
            />
          </View>
          <View style={[styles.formGroupInput, styles.mb30]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                { I18n.t('model', { locale: languageCode }) }
              </Text>
              { this.renderErrorUI(modelError) }
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Fuso FJ"
              value={model}
              editable={active}
              onChangeText={(text) => this.setState({ model: text })}
            />
          </View>
          <View style={[styles.formGroupInput, styles.mb30]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                { I18n.t('transport_mode', { locale: languageCode }) }
              </Text>
              { this.renderErrorUI(transportModeError) }
            </View>
            <View>
              <Select
                placeholder="Select one"
                source={[
                  { value: 0, name: 'Demo Select 1' },
                  { value: 1, name: 'Demo Select 2' },
                  { value: 2, name: 'Demo Select 3' },
                  { value: 3, name: 'Demo Select 4' },
                  { value: 4, name: 'Demo Select 5' },
                  { value: 5, name: 'Demo Select 6' },
                ]}
                selectedValue={transportMode}
                onValueChange={() => console.log('sss')}
                whiteBg
                noEdit={!active}
              />
            </View>
          </View>
          {/* {License Plate} */}
          <View style={[styles.formGroupInput, styles.mb30]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                { I18n.t('license_plate', { locale: languageCode }) }
              </Text>
              { this.renderErrorUI(licenseError) }
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Black, Silver"
              value={license}
              editable={active}
            />
          </View>
          <View style={[styles.formGroupInput, styles.mb30]}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
              { I18n.t('colour', { locale: languageCode }) }
              <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>
                (
                {I18n.t('optional', { locale: languageCode })}
                )
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Black, Silver"
              value={colour}
              editable={active}
            />
          </View>
          <View style={[styles.formGroupInput, styles.mb30]}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10, styles.flexOne]}>
                { I18n.t('driver_name', { locale: languageCode }) }
              </Text>
              { this.renderErrorUI(driverNameError) }
              <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 18, height: 18 }} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter driver name"
              value={driverName}
              editable={active}
            />
          </View>
          <View style={[styles.formGroupInput]}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
              { I18n.t('driver_mobile_phone', { locale: languageCode }) }
              <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>
                (
                {I18n.t('optional', { locale: languageCode })}
                )
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter driver contact number"
              value={driverMobile}
              editable={active}
            />
          </View>
        </View>
        {
          active && (
          <View style={[styles.mt30, styles.mb10]}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.confirmItem}>
              <Text style={[styles.formGroupButton, styles.mainBg]}>
                { I18n.t('confirm_dispatch', { locale: languageCode }) }
              </Text>
            </TouchableOpacity>
          </View>
          )
        }
      </View>
    );
  }

  renderExpanded() {
    const { type } = this.state;
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {type === PROGRESS_TYPE.DISPATCH ? this.renderExpandedDispath() : this.renderExpandedDefault() }
      </>
    );
  }

  render() {
    const {
      expanded,
      initComponent,
      active,
      type,
      number
    } = this.state;
    const { languageCode } = this.props;
    if (!initComponent) return null;
    console.log('statteee', this.state);
    return (
      <View style={[
        styles.mb20,
        styles.paddingHorizontal20,
        active ? styles.paddingVertical20 : styles.paddingVertical10,
        active ? styles.lightGreenBg : styles.whiteBg
      ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.flexOne, styles.flex, styles.alignItemsCenter, styles.mr5]}>
              <View style={styles.mr10}>
                {this.renderIcon(type, active)}
              </View>
              <View>
                <Text style={[
                  styles.defaultSize,
                  active ? styles.mainColorText : styles.defaultTextColor,
                  active && styles.bold,
                ]}
                >
                  {`${I18n.t(type, { locale: languageCode })} ${number || ''}`}
                </Text>
                {!active && (
                  <View style={[styles.flex, styles.alignItemsCenter, styles.mt5]}>
                    <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />
                    <Text style={[styles.smallSize, styles.redText]}>
                      { I18n.t('dispatch_info_missing', { locale: languageCode }) }
                    </Text>
                  </View>
                )}
                {!active
                  ? (
                    <View style={[styles.flex, styles.alignItemsCenter]}>
                      <Text style={[styles.mr10, styles.smallSize, styles.defaultTextColor]}>Dispatch due on</Text>
                      <Text style={[styles.date, styles.dateText, styles.defaultTextColor, styles.smallSize, styles.bold]}>
                        14-Mar to 31-Mar
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.smallSize, styles.defaultTextColor]}>
                      05:13 am, 13-May-19
                    </Text>
                  )}
              </View>
            </View>
            {expanded
              ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
              : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
          </View>
        </TouchableOpacity>
        {expanded ? this.renderExpanded() : null}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  progress: state.progress,
  shipmentID: state.shipment.shipmentDetail.id
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...progressActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Item);
