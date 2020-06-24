import React from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import I18n from '../../../../config/locales';
import IMAGE_CONSTANT from '../../../../constants/images';

import styles from '../../style';
import { formatMetricsWithCommas, roundDecimalToMatch } from '../../../../helpers/regex';

class UnitQuanityComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unitQuantity: props.metricsValue.unitQuantity,
      length: props.metricsValue.length,
      width: props.metricsValue.width,
      height: props.metricsValue.height,
      weight: props.metricsValue.weight,
      endLength: false,
      endWidth: false,
      endHeight: false,
      endWeight: false,
    };
  }

  // // eslint-disable-next-line camelcase
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.isEditing) {
  //     if (nextProps.metricsValue.width) {
  //       this.setState({
  //         unitQuantity: nextProps.metricsValue.unitQuantity,
  //         length: nextProps.metricsValue.length,
  //         width: nextProps.metricsValue.width,
  //         height: nextProps.metricsValue.height,
  //         weight: nextProps.metricsValue.weight,
  //       });
  //     }
  //   }
  // }

  changeValueQuantity = (text) => {
    const { onUnitChange } = this.props;
    if (!text || text <= 0) {
      this.setState({ unitQuantity: 1 });
      return;
    }
    const value = text.replace(/,/g, '');

    const lastCharacter = String(value).charAt(value.length - 1);
    if (lastCharacter === '.') {
      // this.setState({ unitQuantity: value });
      // onUnitChange(value === '.' ? -1 : value - 0);
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ unitQuantity: value - 0 });
      onUnitChange(value - 0);
    }
  }

  decreaseUnitQuantity = () => {
    const { unitQuantity } = this.state;
    const { onUnitChange } = this.props;
    if ((unitQuantity - 0) > 1) {
      this.setState({ unitQuantity: unitQuantity - 1 });
      onUnitChange(unitQuantity - 1);
    }
  }

  increaseUnitQuantity = () => {
    const { unitQuantity } = this.state;
    const { onUnitChange } = this.props;
    this.setState({ unitQuantity: (unitQuantity - 0) + 1 });
    onUnitChange((unitQuantity - 0) + 1);
  }

  changeValueLength = (text) => {
    const { onLengthChange } = this.props;
    const value = text.replace(/,/g, '');
    const lastCharacter = String(value).charAt(value.length - 1);
    // if (lastCharacter === '.' && (String(value).match(/\./g) || []).length === 1) {
    //   this.setState({ length: value, endLength: false });
    //   onLengthChange(value === '.' ? -1 : value - 0);
    //   return;
    // }

    if (lastCharacter === '.') {
      return;
    }

    if (value === '') {
      this.setState({ length: null, endLength: false });
      onLengthChange(null);
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ length: value - 0, endLength: false });
      onLengthChange(value - 0);
    }
  }

  changeValueWidth = (text) => {
    const { onWidthChange } = this.props;
    const value = text.replace(/,/g, '');
    const lastCharacter = String(value).charAt(value.length - 1);
    // if (lastCharacter === '.' && (String(value).match(/\./g) || []).length === 1) {
    //   this.setState({ width: value, endWidth: false });
    //   onWidthChange(value === '.' ? -1 : value - 0);
    //   return;
    // }

    if (lastCharacter === '.') {
      return;
    }

    if (value === '') {
      this.setState({ width: null, endWidth: false });
      onWidthChange(null);
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ width: value - 0, endWidth: false });
      onWidthChange(value - 0);
    }
  }

  changeValueHeight = (text) => {
    const { onHeightChange } = this.props;
    const value = text.replace(/,/g, '');
    const lastCharacter = String(value).charAt(value.length - 1);
    // if (lastCharacter === '.' && (String(value).match(/\./g) || []).length === 1) {
    //   this.setState({ height: value, endHeight: false });
    //   onHeightChange(value === '.' ? -1 : value - 0);
    //   return;
    // }

    if (lastCharacter === '.') {
      return;
    }

    if (value === '') {
      this.setState({ height: null, endHeight: false });
      onHeightChange(null);
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ height: value - 0, endHeight: false });
      onHeightChange(value - 0);
    }
  }

  changeValueWeight = (text) => {
    const { onWeightChange } = this.props;
    const value = text.replace(/,/g, '');
    const lastCharacter = String(value).charAt(text.length - 1);
    if (lastCharacter === '.' && (String(value).match(/\./g) || []).length === 1) {
      this.setState({ weight: value, endWeight: false });
      onWeightChange(value === '.' ? -1 : (value - 0));
      return;
    }

    if (value === '') {
      this.setState({ weight: null, endWeight: false });
      onWeightChange(null);
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ weight: value - 0, endWeight: false });
      onWeightChange(value - 0);
    }
  }

  formatQuantity = (text) => {
    const lastCharacter = String(text).charAt(text.length - 1);
    if (String(text - 0) !== 'NaN' && lastCharacter !== '.' && (String(text).match(/\./g) || []).length > 1) {
      return formatMetricsWithCommas(String(Math.round(text - 0)));
    }
    return formatMetricsWithCommas(String(text));
  }

  formatMetrics = (text, isEnd = false) => {
    const lastCharacter = String(text).charAt(text.length - 1);
    if (String(text - 0) !== 'NaN') {
      if (lastCharacter === '.' && (String(text).match(/\./g) || []).length === 1) {
        return text;
      }
      return (isEnd && String((text - 0).toFixed(1))) || text;
    }
    return text;
  }


  handleEndLength = () => this.setState({ endLength: true })

  handleEndWidth = () => this.setState({ endWidth: true })

  handleEndHeight = () => this.setState({ endHeight: true })

  handleEndWeight = () => {
    const { weight } = this.state;
    this.setState({ endWeight: true, weight: weight - 0 });
  }

  formatLength = (text, isEnd = false, isWeight) => {
    const lastCharacter = String(text).charAt(text.length - 1);
    if (String(text - 0) !== 'NaN') {
      if (lastCharacter === '.' && (String(text).match(/\./g) || []).length === 1) {
        return String(text);
      }
      if (text === '') {
        return text;
      }
      if (isWeight) {
        return (isEnd && formatMetricsWithCommas(String((text - 0).toFixed(1)))) || String(text);
      }
      return (isEnd && formatMetricsWithCommas(String((text - 0).toFixed(0)))) || String(text);
    }
    return String(text);
  }

  render() {
    const {
      unitQuantity,
      length,
      width,
      height,
      weight,
      endLength,
      endWidth,
      endHeight,
      endWeight,
    } = this.state;
    const {
      unitQuantityError,
      lengthError,
      heightError,
      widthError,
      weightError,
      languageCode,
    } = this.props;

    const lengthInput = this.formatLength(length || (length === 0 && '0') || '', endLength);
    const widthInput = this.formatLength(width || (width === 0 && '0') || '', endWidth);
    const heightInput = this.formatLength(height || (height === 0 && '0') || '', endHeight);
    const weightInput = this.formatLength(weight || (weight === 0 && '0') || '', endWeight, true);

    return (
      <View style={styles.zIndex1}>
        <View style={styles.mb30}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            {unitQuantityError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
            <Text style={[styles.defaultSize, styles.defaultTextColor, unitQuantityError && styles.errorText, styles.bold]}>
              {I18n.t('listing.unitQuantity', { locale: languageCode })}
            </Text>
          </View>
          <View style={styles.mt20}>
            <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
              <TextInput
                style={[styles.input, unitQuantityError && styles.inputError, unitQuantityError && styles.italicText, styles.noneBorderRadius, styles.flexOne, { marginLeft: 2 }]}
                value={this.formatQuantity(String(unitQuantity))}
                keyboardType="numeric"
                onChangeText={this.changeValueQuantity}
              />
              <TouchableOpacity
                style={[styles.buttonAction, { borderRightWidth: 0 }, styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter, unitQuantityError && styles.inputErrorBorder]}
                activeOpacity={0.9}
                onPress={this.decreaseUnitQuantity}
              >
                <Text style={[styles.actionSize, styles.defaultTextColor]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter, unitQuantityError && styles.inputErrorBorder]}
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
              <View style={[styles.flex, styles.alignItemsCenter]}>
                {lengthError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
                <Text style={[styles.defaultSize, styles.defaultTextColor, lengthError && styles.errorText, styles.bold]} adjustsFontSizeToFit>
                  {I18n.t('listing.length', { locale: languageCode })}
                </Text>
              </View>
              <View style={styles.mt20}>
                <TextInput
                  style={[styles.input, lengthError && styles.inputError, styles.topRightRadiusNone, styles.bottomRightRadiusNone, !lengthInput && styles.italicText, lengthError && styles.italicText]}
                  placeholder={I18n.t('listing.defaultMetrics', { locale: languageCode })}
                  defaultValue={this.formatQuantity(String(lengthInput))}
                  value={this.formatQuantity(String(lengthInput))}
                  onChangeText={this.changeValueLength}
                  onEndEditing={this.handleEndLength}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.flexThree}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                {widthError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
                <Text style={[styles.defaultSize, styles.defaultTextColor, widthError && styles.errorText, styles.bold]}>
                  {I18n.t('listing.width', { locale: languageCode })}
                </Text>
              </View>
              <View style={styles.mt20}>
                <TextInput
                  style={[styles.input, widthError && styles.inputError, styles.noneBorderRadius, styles.borderLeftWidthNone, !widthInput && styles.italicText, widthError && styles.italicText]}
                  placeholder={I18n.t('listing.defaultMetrics', { locale: languageCode })}
                  defaultValue={this.formatQuantity(String(widthInput))}
                  value={this.formatQuantity(String(widthInput))}
                  onChangeText={this.changeValueWidth}
                  onEndEditing={this.handleEndWidth}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.flexThree}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                {heightError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
                <Text style={[styles.defaultSize, styles.defaultTextColor, heightError && styles.errorText, styles.bold]}>
                  {I18n.t('listing.height', { locale: languageCode })}
                </Text>
              </View>
              <View style={styles.mt20}>
                <TextInput
                  style={[styles.input, heightError && styles.inputError, styles.noneBorderRadius, !heightInput && styles.italicText, heightError && styles.italicText]}
                  placeholder={I18n.t('listing.defaultMetrics', { locale: languageCode })}
                  defaultValue={this.formatQuantity(String(heightInput))}
                  value={this.formatQuantity(String(heightInput))}
                  onChangeText={this.changeValueHeight}
                  onEndEditing={this.handleEndHeight}
                  keyboardType="numeric"
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
                styles.bottomRightRadiusFour,
                (heightError || widthError || lengthError) && { borderWidth: 1, borderColor: '#f44336' }
              ]}
              >
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>{I18n.t('listing.cm', { locale: languageCode })}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.mb30}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            {weightError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
            <Text style={[styles.defaultSize, styles.defaultTextColor, weightError && styles.errorText, styles.bold]}>
              {I18n.t('listing.weight', { locale: languageCode })}
            </Text>
          </View>
          <View style={[styles.mt20, styles.flex, styles.alignItemsCenter]}>
            <View style={styles.flexOne}>
              <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                <TextInput
                  style={[styles.input, styles.noneBorderRadius, styles.flexThree, { marginLeft: 1, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }, weightError && styles.inputError, !weightInput && styles.italicText, weightError && styles.italicText]}
                  placeholder={I18n.t('listing.defaultMetrics', { locale: languageCode })}
                  defaultValue={weightInput}
                  value={weightInput}
                  onChangeText={this.changeValueWeight}
                  onEndEditing={this.handleEndWeight}
                  keyboardType="numeric"
                />
                <View style={[styles.flex, styles.flexTwo, styles.alignItemsCenter, styles.justifyContentCenter, styles.silverBg, styles.h60, weightError && {
                  borderTopWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#f44336',
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }]}
                >
                  <Text style={[styles.defaultSize, styles.defaultTextColor, { margin: 1 }]}>{I18n.t('listing.kg', { locale: languageCode })}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.flexOne, styles.ml10]}>
              <View style={[styles.alignItemsEnd, styles.justifyContentEnd]}>
                <Text style={[styles.defaultSize, styles.grayText]}>
                  {I18n.t('listing.totalItemWeight', { locale: languageCode })}
                </Text>
                <Text style={[styles.defaultSize, styles.grayText]}>{`${roundDecimalToMatch(unitQuantity * weight, 1)} ${I18n.t('listing.kg', { locale: languageCode })}`}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

UnitQuanityComponent.propTypes = {
  lengthError: PropTypes.bool,
  heightError: PropTypes.bool,
  widthError: PropTypes.bool,
  weightError: PropTypes.bool,
  unitQuantityError: PropTypes.bool,
  onUnitChange: PropTypes.func.isRequired,
  onLengthChange: PropTypes.func.isRequired,
  onWidthChange: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onWeightChange: PropTypes.func.isRequired,
};

UnitQuanityComponent.defaultProps = {
  lengthError: false,
  heightError: false,
  widthError: false,
  weightError: false,
  unitQuantityError: false,
};

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  isEditing: state.listing.isEditing,
});

export default connect(
  mapStateToProps,
  {},
)(UnitQuanityComponent);
