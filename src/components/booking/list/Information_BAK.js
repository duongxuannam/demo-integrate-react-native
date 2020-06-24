import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

import I18n from '../../../config/locales';
// COMPONENTS
import UrlImage from '../../common/Image';
import Select from '../../common/Select';
import Services from '../services_types/Services';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';

// CSS
import styles from '../style';

class Information extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      booking: props.booking,
      expandUnit: false,
      expandList: 8,
      expanded: false,
      dropdown: false,
      handleUnitSelected: null,
      transportTypeSelected: null,
      unitQuantity: 0,
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      goodDescription: '',
      error: {
        handleUnitError: false,
        unitQuantityError: false,
        lengthError: false,
        heightError: false,
        widthError: false,
        transportTypeError: false
      },
    };
  }

  selectHandleUnit = (unit) => {
    this.setState({ handleUnitSelected: unit });
  }

  selectTransportType = (type) => {
    this.setState({ transportTypeSelected: type });
  }


  renderMapUnit = (unitList, expandList) => {
    const { expandUnit, error, handleUnitSelected } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={[styles.flex, styles.flexOne, styles.flexWrapper, styles.groupUnit]}>
        {unitList.map((unit, key) => key <= expandList && (
          <TouchableOpacity key={`${unit.id}`} onPress={() => this.selectHandleUnit(unit)}>
            <View key={`list-${unit.id}`} style={[styles.flex, styles.alignItemsCenter, styles.unit, error.handleUnitError && styles.inputError, handleUnitSelected && handleUnitSelected.id === unit.id && styles.mainBg]}>
              <UrlImage
                sizeWidth={24} 
                sizeHeight={10}
                sizeBorderRadius={0}
                source={unit.icon}
              />
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.ml10]}>
                {unit.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {unitList.length > 8 && expandUnit === false
          ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ expandList: 999, expandUnit: true })}
            >
              <View style={[styles.alignItemsCenter, styles.flex, styles.unit, error.handleUnitError && styles.inputError]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mr10, styles.flexOne]}>
                  {I18n.t('listing.other', { locale: languageCode })}
                </Text>
                {unitList.length > 8 && <Image source={IMAGE_CONSTANT.arrowDownGreen} style={{ width: 15, height: 9 }} />}
              </View>
            </TouchableOpacity>
          )
          : null}
      </View>
    );
  }

  showDropdown = () => {
    this.setState((prevState) => ({
      dropdown: !prevState.dropdown,
    }));
  }

  handleDelete = () => {
    const { booking } = this.state;
    const { onDelete } = this.props;
    onDelete(booking);
  }

  changeValueQuantity = (text) => {
    if (String(text - 0) !== 'NaN') {
      this.setState({ unitQuantity: text - 0 });
    }
  }

  decreaseUnitQuantity = () => {
    const { unitQuantity } = this.state;
    if (unitQuantity > 0) {
      this.setState({ unitQuantity: unitQuantity - 1 });
    }
  }

  increaseUnitQuantity = () => {
    const { unitQuantity } = this.state;
    this.setState({ unitQuantity: unitQuantity + 1 });
  }

  changeValueLength = (text) => {
    if (String(text - 0) !== 'NaN') {
      this.setState({ length: text - 0 });
    }
  }

  changeValueWidth = (text) => {
    if (String(text - 0) !== 'NaN') {
      this.setState({ width: text - 0 });
    }
  }

  changeValueHeight = (text) => {
    if (String(text - 0) !== 'NaN') {
      this.setState({ height: text - 0 });
    }
  }

  changeValueWeight = (text) => {
    if (String(text - 0) !== 'NaN') {
      this.setState({ weight: text - 0 });
    }
  }

  changeTextGoodsDesc = (text) => {
    this.setState({ goodDescription: text });
  }

  renderViewItemSelect = (item) => {
    return (
      <View>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Bold', color: '#000' }}>{item.name}</Text>
        <Text style={[{ fontSize: 12, fontFamily: 'Roboto-Regular', }, styles.grayText]}>{item.description}</Text>
      </View>
    );
  }

  render() {
    const {
      booking, dropdown, expanded, expandList, selected,
      error,
      unitQuantity, length, width, height, weight,
      goodDescription, languageCode,
    } = this.state;
    const { handleUnits, transportTypes } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.zIndex2]}>
          <Text style={styles.formHeader}>
            {booking.name}
          </Text>
          <TouchableOpacity
            style={[styles.flexOne, styles.flex, styles.justifyContentEnd, styles.alignItemsCenter, styles.pr20, styles.mb5]}
            activeOpacity={0.9}
            ref={ref => this.touchable = ref}
            onPress={this.showDropdown}
          >
            <Image source={IMAGE_CONSTANT.groupMenu} style={{ width: 31, height: 8 }} />
          </TouchableOpacity>
          {dropdown && (
            <View style={styles.dropdown}>
              <View style={styles.dropdownArrow} />
              <View style={styles.dropdownGroup}>
                <TouchableOpacity
                  style={[styles.flex, styles.alignItemsCenter, styles.mb20]}
                  activeOpacity={0.9}
                  onPress={() => alert('1')}
                >
                  <Image source={IMAGE_CONSTANT.duplicateIcon} />
                  <Text style={[styles.defaultSize, styles.ml10]}>
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
          )}
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.pt30, styles.mb30, styles.formLine, styles.zIndex1]}>
          <View style={styles.mb30}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              {error.handleUnitError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
              <Text style={[styles.defaultSize, error.handleUnitError && styles.errorText, styles.bold]}>
                {I18n.t('listing.handleUnit', { locale: languageCode })}
              </Text>
            </View>
            <View style={styles.mt20}>
              {this.renderMapUnit(handleUnits, expandList)}
            </View>
          </View>
          <View style={styles.mb30}>
            {error.unitQuantityError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, error.unitQuantityError && styles.errorText]}>
              {I18n.t('listing.unitQuantity', { locale: languageCode })}
            </Text>
            <View style={styles.mt20}>
              <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                <TextInput
                  style={[styles.input, error.unitQuantityError && styles.inputError, styles.noneBorderRadius, styles.flexOne, { marginLeft: 2 }]}
                  value={String(unitQuantity)}
                  keyboardType="number-pad"
                  onChangeText={this.changeValueQuantity}
                />
                <TouchableOpacity
                  style={[styles.buttonAction, { borderRightWidth: 0 }, styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter, error.unitQuantityError && styles.inputErrorBorder]}
                  activeOpacity={0.9}
                  onPress={this.decreaseUnitQuantity}
                >
                  <Text style={[styles.actionSize, styles.defaultTextColor]}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter, error.unitQuantityError && styles.inputErrorBorder]}
                  activeOpacity={0.9}
                  onPress={this.increaseUnitQuantity}
                >
                  <Text style={[styles.actionSize, styles.whiteText]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.mb30}>
            <View style={[styles.groupUnitInfo, styles.relative, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.flexThree}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.length', { locale: languageCode })}
                </Text>
                <View style={styles.mt20}>
                  <TextInput
                    style={[styles.input, error.lengthError && styles.inputError, styles.topRightRadiusNone, styles.bottomRightRadiusNone]}
                    defaultValue={String(length)}
                    value={String(length)}
                    onChangeText={this.changeValueLength}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={styles.flexThree}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.width', { locale: languageCode })}
                </Text>
                <View style={styles.mt20}>
                  <TextInput
                    style={[styles.input, error.widthError && styles.inputError, styles.noneBorderRadius, styles.borderLeftWidthNone]}
                    defaultValue={String(width)}
                    value={String(width)}
                    onChangeText={this.changeValueWidth}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={styles.flexThree}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('listing.height', { locale: languageCode })}
                </Text>
                <View style={styles.mt20}>
                  <TextInput
                    style={[styles.input, error.heightError && styles.inputError, styles.noneBorderRadius, styles.borderLeftWidthNone]}
                    defaultValue={String(height)}
                    value={String(height)}
                    onChangeText={this.changeValueHeight}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              <View style={[styles.flexTwo]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}> </Text>
                <View style={[
                  styles.mt20,
                  styles.flex,
                  styles.alignItemsCenter,
                  styles.justifyContentCenter,
                  styles.silverBg,
                  styles.h60,
                  styles.topRightRadiusFour,
                  styles.bottomRightRadiusFour
                ]}
                >
                  <Text style={[styles.defaultSize, styles.defaultTextColor]}>{I18n.t('listing.cm', { locale: languageCode })}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.mb30}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {I18n.t('listing.weight', { locale: languageCode })}
            </Text>
            <View style={[styles.mt20, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.flexOne}>
                <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                  <TextInput
                    style={[styles.input, styles.noneBorderRadius, styles.flexThree]}
                    defaultValue={String(weight)}
                    value={String(weight)}
                    onChangeText={this.changeValueWeight}
                    keyboardType="number-pad"
                  />
                  <View style={[styles.flex, styles.flexTwo, styles.alignItemsCenter, styles.justifyContentCenter, styles.silverBg, styles.h60]}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor]}>{I18n.t('listing.kg', { locale: languageCode })}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.flexOne, styles.ml10]}>
                <View style={[styles.alignItemsEnd, styles.justifyContentEnd]}>
                  <Text style={[styles.defaultSize, styles.grayText]}>
                    {I18n.t('listing.totalItemWeight', { locale: languageCode })}
                  </Text>
                  <Text style={[styles.defaultSize, styles.grayText]}>{`${unitQuantity * weight} ${I18n.t('listing.kg', { locale: languageCode })}`}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.mb30}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              {I18n.t('listing.transportMode', { locale: languageCode })}
            </Text>
            <View style={[styles.mt20, { zIndex: 5 }]}>
              <Select
                placeholder={`${I18n.t('listing.selectTransportMode', { locale: languageCode })}`}
                source={transportTypes || []}
                selectedValue={selected}
                onValueChange={this.selectTransportType}
                itemView={this.renderViewItemSelect}
                error={error.transportTypeError}
              />
              <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>{I18n.t('listing.selectTransportDesc', { locale: languageCode })}</Text>
            </View>
          </View>
          {expanded && (
            <View style={{ zIndex: -1 }}>
              <View style={[styles.mb30]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>{I18n.t('listing.goodDesc', { locale: languageCode })}</Text>
                <View style={styles.mt20}>
                  <View style={[styles.formGroupInput, styles.flex, styles.alignItemsCenter]}>
                    <TextInput
                      style={[styles.input, styles.flexOne]}
                      defaultValue={goodDescription}
                      value={goodDescription}
                      autoCorrect={false}
                      onChangeText={this.changeTextGoodsDesc}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.lineSilver, styles.mb30]} />
              <View style={styles.mb10}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>{I18n.t('listing.additionalService', { locale: languageCode })}</Text>
                <View style={styles.mt20}>
                  <Services source={booking.services_types} />
                </View>
              </View>
            </View>
          )}
          <View style={[styles.lineAction, { zIndex: -1 }]} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState(prevState => ({ expanded: !prevState.expanded }))}
            style={{ zIndex: -1 }}
          >
            <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
              {expanded
                ? <Image source={IMAGE_CONSTANT.hideExpand} />
                : <Image source={IMAGE_CONSTANT.showExpand} />}
              <Text style={[styles.ml10, styles.bold, styles.defaultSize, styles.mainColorText]}>
                {expanded ? I18n.t('listing.hideOption', { locale: languageCode }) : I18n.t('listing.option', { locale: languageCode })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>


      </>
    );
  }
}

const mapStateToProps = (state) => ({
  handleUnits: state.listing.handleUnits,
  transportTypes: state.listing.transportTypes,
  languageCode: state.app.languageCode,
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
)(Information);
