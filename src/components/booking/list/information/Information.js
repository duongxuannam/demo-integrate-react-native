import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import I18n from '../../../../config/locales';
// COMPONENTS
import HandleUnitComponent from './handleUnitList';
import UnitQuantityComponent from './unitQuantity';
import TransportSelector from './transportSelection';
import AdditionalService from '../../services_types/AdditionalServices';
import DuplicateIcon from '../../../common/DuplicateIcon';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';

// CSS
import styles from '../../style';
import { roundDecimalToMatch } from '../../../../helpers/regex';
import { getTransportTypeObj } from '../../../../helpers/shipment.helper';

class Information extends React.PureComponent {
  constructor(props) {
    super(props);
    let defaultGoodDesc = '';
    let isMatchedPattern = true;
    if (props.booking.handleUnitSelected) {
      const unitName = props.booking.unitQuantity && props.booking.unitQuantity > 1 ? props.booking.handleUnitSelected.names : props.booking.handleUnitSelected.name;
      const defaultText = `${(props.booking.unitQuantity || 1)} ${unitName} ${I18n.t('listing.goodDescString.part1', { locale: props.languageCode })} ${(props.booking.unitQuantity || 1) * (props.booking.weight || 0)}${I18n.t('listing.goodDescString.part2', { locale: props.languageCode })} `;
      defaultGoodDesc = String(props.booking.goodDesc || '').replace(defaultText, '');
      isMatchedPattern = String(props.booking.goodDesc || '').startsWith(defaultText);
    }
    this.handleUnitSelected = (props.booking && props.booking.handleUnitSelected) || null;
    this.unitQuantity = (props.booking && props.booking.unitQuantity) || 1;
    this.length = (props.booking && props.booking.length) || null;
    this.width = (props.booking && props.booking.width) || null;
    this.height = (props.booking && props.booking.height) || null;
    this.weight = (props.booking && props.booking.weight) || null;
    this.transportModeSelected = (props.booking && props.booking.transportModeSelected) || null;

    this.state = {
      booking: props.booking,
      expanded: false,
      dropdown: false,
      // handleUnitSelected: null,
      goodDescription: defaultGoodDesc,
      itemServices: (props.booking && props.booking.itemServices) || [],
      error: {
        handleUnitError: false,
        unitQuantityError: false,
        lengthError: false,
        heightError: false,
        widthError: false,
        weightError: false,
        transportTypeError: false,
        goodDescError: false,
        goodDescMinLengthError: false,
      },
      isEditGoodDesc: !isMatchedPattern,
    };
  }

  componentDidMount() {
    const { isEditing, booking } = this.props;
    if (isEditing) {
      this.setDataInformation(booking);
      this.setState({ itemServices: booking.itemServices });
    }
  }

  componentDidUpdate(prevPropvs) {
    const { booking, isEditing } = this.props;
    if (!isEditing && booking !== prevPropvs.booking) {
      this.transportModeSelected = booking.transportModeSelected;
    }
  }

  onGetAllInformation = (ignoreValidation) => {
    const {
      itemServices,
      goodDescription,
      isEditGoodDesc,
      error,
      newGoodDecs
    } = this.state;
    const {
      itemIndex,
      booking,
      isEditing,
      draftId,
      transportTypesDefault,
      transportTypeId
    } = this.props;
    let status = true;
    let goodDesc = '';
    console.log('onGetAllInformation', booking);
    if (newGoodDecs !== null && newGoodDecs !== undefined && isEditing) {
      goodDesc = newGoodDecs;
    } else {
      goodDesc = isEditGoodDesc ? goodDescription : this.getTextDefault(goodDescription);
    }
    if (!ignoreValidation) {
      status = this.checkAllInformation();
    }
    return {
      status,
      id: draftId ? booking.id : this.id || itemIndex,
      name: booking.name,
      isFirstItem: booking.isFirstItem,
      handleUnitSelected: { ...this.handleUnitSelected } || null,
      unitQuantity: this.unitQuantity || null,
      length: this.length || null,
      width: this.width || null,
      height: this.height || null,
      weight: this.weight || null,
      transportModeSelected: transportTypeId ? getTransportTypeObj(transportTypesDefault, transportTypeId) : { ...this.transportModeSelected } || null,
      goodDesc: goodDesc || null,
      itemServices: [...itemServices],
      isDelete: false,
      shipmentId: this.shipmentId || null,
    };
  }

  setDataInformation = (data) => {
    const { shipmentDetail, languageCode } = this.props;
    console.log('setDataInformation', data);
    this.id = data.id;
    this.handleUnitSelected = data.handleUnitSelected;
    this.unitQuantity = data.unitQuantity;
    this.length = data.length;
    this.width = data.width;
    this.height = data.height;
    this.weight = data.weight;
    this.transportModeSelected = data.transportModeSelected;
    this.shipmentId = shipmentDetail.id;

    let defaultGoodDesc = '';
    let isMatchedPattern = true;
    if (data.handleUnitSelected) {
      const unitName = data.unitQuantity && data.unitQuantity > 1 ? data.handleUnitSelected.names : data.handleUnitSelected.name;
      const defaultText = `${(data.unitQuantity || 1)} ${unitName} ${I18n.t('listing.goodDescString.part1', { locale: languageCode })} ${(data.unitQuantity || 1) * (data.weight || 0)}${I18n.t('listing.goodDescString.part2', { locale: languageCode })} `;
      defaultGoodDesc = String(data.goodDesc || '').replace(defaultText, '');
      isMatchedPattern = String(data.goodDesc || '').startsWith(defaultText);
    }

    this.setState({
      itemServices: data.itemServices,
      goodDescription: defaultGoodDesc,
      isEditGoodDesc: !isMatchedPattern,
    }, () => {
      this.onGetAllInformation(true);
    });
  }

  checkAllInformation = () => {
    const { error } = this.state;
    const { booking } = this.props;
    let status = true;
    if (!this.handleUnitSelected) {
      status = false;
      error.handleUnitError = true;
    } else {
      error.handleUnitError = false;
    }

    if (!this.unitQuantity) {
      status = false;
      error.unitQuantityError = true;
    } else {
      error.unitQuantityError = false;
    }

    if (!this.length) {
      status = false;
      error.lengthError = true;
    } else {
      error.lengthError = false;
    }

    if (!this.width) {
      status = false;
      error.widthError = true;
    } else {
      error.widthError = false;
    }

    if (!this.height) {
      status = false;
      error.heightError = true;
    } else {
      error.heightError = false;
    }

    if (!this.weight) {
      status = false;
      error.weightError = true;
    } else {
      error.weightError = false;
    }

    if (!this.transportModeSelected && booking.isFirstItem) {
      status = false;
      error.transportTypeError = true;
    } else {
      error.transportTypeError = false;
    }

    if (!status) {
      this.setState({ error: { ...error } });
    } else {
      this.setState({
        error: {
          handleUnitError: false,
          unitQuantityError: false,
          lengthError: false,
          heightError: false,
          widthError: false,
          weightError: false,
          transportTypeError: false,
          goodDescError: false,
          goodDescMinLengthError: false,
        }
      });
    }
    return status;
  }

  onSelectHandleUnit = (unit) => {
    this.handleUnitSelected = unit;
    this.updateGoodDescInput();
  }

  onChangedUnitQuantity = (unitQuantity) => {
    this.unitQuantity = unitQuantity;
    this.updateGoodDescInput();
  }

  onChangedLength = (value) => {
    // console.log('LENGTH: ', unitQuantity);
    this.length = value;
  }

  onChangedWidth = (value) => {
    // console.log('WIDTH: ', unitQuantity);
    this.width = value;
  }

  onChangedHeight = (value) => {
    // console.log('LENGTH: ', unitQuantity);
    this.height = value;
  }

  onChangedWeight = (value) => {
    // console.log('LENGTH: ', unitQuantity);
    this.weight = value;
    this.updateGoodDescInput();
  }

  onExpaned = () => {
    const { isEditGoodDesc, goodDescription } = this.state;
    const { isEditing } = this.props;
    this.setState((prevState) => ({ expanded: !prevState.expanded }));
    // if (!isEditGoodDesc || !isEditing) {
    //   this.setState({
    //     goodDescription: goodDescription || this.getTextDefault(goodDescription)
    //   });
    // }
  }

  getTextDefault = (textValue = ' ') => {
    const { languageCode, isEditing } = this.props;
    const { isEditGoodDesc } = this.state;
    let text = '';
    if (!this.handleUnitSelected) {
      text = '';
    } else {
      const quantity = this.unitQuantity || 1;
      const unitName = quantity > 1 ? this.handleUnitSelected.names : this.handleUnitSelected.name;
      const totalWeight = quantity * (this.weight || 0);
      text = `${quantity} ${unitName} ${I18n.t('listing.goodDescString.part1', { locale: languageCode })} ${roundDecimalToMatch(totalWeight, 1)}${I18n.t('listing.goodDescString.part2', { locale: languageCode })} `;
    }

    if (!text && !textValue) {
      return '';
    }

    if (text && isEditGoodDesc && !isEditing) {
      // this.setState({
      //   goodDescription: textValue
      // });
      return textValue;
    }
    return (`${text}${textValue}`) || null;
  }

  handleTransportSelected = (type) => {
    this.transportModeSelected = type;
    const { onSelectTransport } = this.props;
    onSelectTransport(type);
  }

  handleServiceSelected = (item) => {
    const { itemServices } = this.state;
    const itemIndex = itemServices.findIndex((i) => i.id === item.id);
    if (itemIndex > -1) {
      itemServices.splice(itemIndex, 1);
    } else {
      itemServices.push(item);
    }
    this.setState({ itemServices: [...itemServices] });
  }

  showDropdown = () => {
    this.setState((prevState) => ({
      dropdown: !prevState.dropdown,
    }));
  }

  handleDelete = () => {
    const { onDelete, itemIndex, booking } = this.props;
    console.log('handleDelete', itemIndex, booking);
    onDelete({ booking, index: itemIndex });
  }

  changeTextGoodsDesc = (text) => {
    const { isEditing, languageCode } = this.props;
    if (isEditing) {
      this.setState({
        newGoodDecs: text
      });
    }

    let pattern = '';
    if (!this.handleUnitSelected) {
      pattern = '';
    } else {
      const quantity = this.unitQuantity || 1;
      const unitName = quantity > 1 ? this.handleUnitSelected.names : this.handleUnitSelected.name;
      const totalWeight = quantity * (this.weight || 0);
      pattern = `${quantity} ${unitName} ${I18n.t('listing.goodDescString.part1', { locale: languageCode })} ${roundDecimalToMatch(totalWeight, 1)}${I18n.t('listing.goodDescString.part2', { locale: languageCode })} `;
    }

    const isMatchedPattern = text.startsWith(pattern);

    this.setState({
      goodDescription: isMatchedPattern ? text.replace(pattern, '') : text,
      isEditGoodDesc: !isMatchedPattern
    });
  }

  duplicateItem = () => {
    const { callDuplicateItem, itemIndex, booking } = this.props;
    const { itemServices, goodDescription, isEditGoodDesc } = this.state;
    this.setState({ dropdown: false });
    if (!this.handleUnitSelected && !this.unitQuantity && !this.length && !this.width && !this.weight && !this.height) {
      if (booking.isFirstItem) {
        if (!this.transportModeSelected) {
          return;
        }
      } else {
        return;
      }
    }

    // if (itemIndex === 1 && !this.transportModeSelected) {
    //   return;
    // }
    let goodDesc = '';
    if (isEditGoodDesc) {
      goodDesc = goodDescription;
    } else {
      const textGD = this.getTextDefault(goodDescription);
      goodDesc = textGD || this.goodDesc;
    }

    callDuplicateItem({
      status: !((!this.handleUnitSelected || !this.unitQuantity || !this.length || !this.width || !this.weight || !this.height || !this.transportModeSelected)),
      name: booking.name,
      isFirstItem: booking.isFirstItem,
      handleUnitSelected: { ...this.handleUnitSelected } || null,
      unitQuantity: this.unitQuantity || null,
      length: this.length || null,
      width: this.width || null,
      height: this.height || null,
      weight: this.weight || null,
      transportModeSelected: { ...this.transportModeSelected } || null,
      itemServices: [...itemServices],
      goodDesc
    });
  }

  updateGoodDescInput() {
    const { isEditGoodDesc } = this.state;
    if (!isEditGoodDesc) {
      if (this.goodDescInput) {
        // this.setState({
        //   goodDescription: ''
        // });
        const { goodDescription } = this.state;
        this.goodDescInput.setNativeProps({ text: this.getTextDefault(goodDescription) });
      }
    }
  }

  loadDropdown(isCanRemoved = false) {
    const {
      booking
    } = this.state;

    const { languageCode } = this.props;
    let canDuplicated = true;

    if ((!this.handleUnitSelected || Object.keys(this.handleUnitSelected).length === 0) && !this.unitQuantity && !this.length && !this.width && !this.weight && !this.height) {
      if (booking.isFirstItem) {
        if (!this.transportModeSelected) {
          canDuplicated = false;
        }
      } else {
        canDuplicated = false;
      }
    }

    if (isCanRemoved) {
      return (
        <View style={styles.dropdown}>
          <View style={styles.dropdownArrow} />
          <View style={styles.dropdownGroup}>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter, styles.mb20]}
              activeOpacity={0.9}
              onPress={this.duplicateItem}
            >
              {/* <Image source={IMAGE_CONSTANT.duplicateIcon} /> */}
              <DuplicateIcon width={14} height={14} color={canDuplicated ? '#3fae29' : 'rgba(161, 161, 161, 1)'} />
              <Text style={[styles.defaultSize, styles.ml10, !canDuplicated && styles.grayText]}>
                {I18n.t('listing.duplicate', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flex, styles.alignItemsCenter]}
              activeOpacity={0.9}
              onPress={() => this.handleDelete(booking)}
            >
              <Image source={IMAGE_CONSTANT.deleteIconRed} style={{ width: 17, height: 21 }} />
              <Text style={[styles.defaultSize, styles.ml10]}>
                {I18n.t('listing.remove', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[[styles.dropdown]]}>
        <View style={styles.dropdownArrow} />
        <View style={styles.dropdownGroup}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
            onPress={this.duplicateItem}
          >
            {/* <Image source={IMAGE_CONSTANT.duplicateIcon} /> */}
            <DuplicateIcon width={14} height={14} color={canDuplicated ? '#3fae29' : 'rgba(161, 161, 161, 1)'} />
            <Text style={[styles.defaultSize, styles.ml10, !canDuplicated && styles.grayText]}>
              {I18n.t('listing.duplicate', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const {
      dropdown, expanded,
      itemServices,
      error,
      goodDescription,
      isEditGoodDesc,
    } = this.state;
    const {
      isCanRemoved, booking, languageCode, isEditing
    } = this.props;
    console.log('booking', booking);
    this.goodDesc = (!isEditGoodDesc || !isEditing) ? this.getTextDefault(goodDescription) : goodDescription;
    return (
      <View>
        <View style={[styles.flex]}>
          <Text style={styles.formHeader}>
            {`${I18n.t('listing.item', { locale: languageCode })} ${booking.name}`}
          </Text>
          <View style={[styles.flexOne, styles.flex, styles.justifyContentEnd, styles.alignItemsCenter]}>
            <TouchableOpacity
              style={[styles.mr20, styles.mb5]}
              activeOpacity={0.9}
              ref={(ref) => this.touchable = ref}
              onPress={this.showDropdown}
            >
              <Image source={IMAGE_CONSTANT.groupMenu} style={{ width: 31, height: 8 }} />
            </TouchableOpacity>
          </View>
          {dropdown && this.loadDropdown(isCanRemoved)}
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.pt30, styles.mb30, styles.formLine, { zIndex: -1 }]}>
          {/** Unit List */}
          <HandleUnitComponent
            handleUnitSelected={booking.handleUnitSelected || null}
            onItemSelect={this.onSelectHandleUnit}
            handleUnitError={error.handleUnitError}
          />
          {/** unit Quantity and metrics */}
          <View style={{ zIndex: -1 }}>
            <UnitQuantityComponent
              metricsValue={{
                unitQuantity: (booking && booking.unitQuantity) || 1,
                length: (booking && booking.length) || null,
                width: (booking && booking.width) || null,
                height: (booking && booking.height) || null,
                weight: (booking && booking.weight) || null
              }}
              onUnitChange={this.onChangedUnitQuantity}
              onLengthChange={this.onChangedLength}
              onWidthChange={this.onChangedWidth}
              onHeightChange={this.onChangedHeight}
              onWeightChange={this.onChangedWeight}
              unitQuantityError={error.unitQuantityError}
              lengthError={error.lengthError}
              heightError={error.heightError}
              widthError={error.widthError}
              weightError={error.weightError}
            />
          </View>

          {/** transport Selector */}
          {
            booking.isFirstItem && (
              <TransportSelector
                transportItemValue={(booking && booking.transportModeSelected) || null}
                onSelectedTransport={this.handleTransportSelected}
                transportTypeError={error.transportTypeError}
              />
            )
          }

          {expanded && (
            <View style={{ zIndex: -1 }}>
              <View style={[styles.mb30]}>
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  {error.goodDescError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
                  <Text style={[styles.defaultSize, styles.defaultTextColor, error.goodDescError && styles.errorText, styles.bold]}>{(error.goodDescMinLengthError && I18n.t('listing.goodDescMinLengthError')) || I18n.t('listing.goodDesc')}</Text>
                </View>
                <View style={styles.mt20}>
                  <View style={[styles.formGroupInput, styles.flex, styles.alignItemsCenter, { height: 'auto', minHeight: 60 }]}>
                    <TextInput
                      ref={(ref) => { this.goodDescInput = ref; }}
                      style={[styles.input, styles.flexOne, { textAlignVertical: 'center', height: 'auto', minHeight: 60 }, error.goodDescError && styles.inputError]}
                      value={this.goodDesc}
                      autoCorrect={false}
                      autoCompleteType="off"
                      onChangeText={this.changeTextGoodsDesc}
                      maxLength={100}
                      multiline
                      numberOfLines={0}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.lineSilver, styles.mb30]} />
              <View style={styles.mb10}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>{I18n.t('listing.additionalService', { locale: languageCode })}</Text>
                <View style={styles.mt20}>
                  <AdditionalService itemsSelected={itemServices} onChangeItemSelected={this.handleServiceSelected} />
                </View>
              </View>
            </View>
          )}
          <View style={[styles.lineAction, { zIndex: -1 }]} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.onExpaned}
            style={{ zIndex: -1 }}
          >
            <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
              {expanded
                ? <Image source={IMAGE_CONSTANT.hideExpand} />
                : <Image source={IMAGE_CONSTANT.showExpand} />}
              <Text style={[styles.ml10, styles.defaultSize, styles.mainColorText, styles.bold]}>
                {expanded ? I18n.t('listing.hideOption', { locale: languageCode }) : I18n.t('listing.option', { locale: languageCode })}
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

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  isEditing: state.listing.isEditing,
  shipmentDetail: state.listing.shipmentDetail,
  transportTypesDefault: state.listing.transportTypesDefault,
  transportTypeId: state.listing.transportTypeId,
});

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(
//     {
//       getHandleUnits: listingAction.getHandleUnit,
//     },
//     dispatch,
//   ),
// });

export default connect(
  mapStateToProps,
  {},
  null,
  { forwardRef: true }
)(Information);
