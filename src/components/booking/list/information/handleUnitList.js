import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UrlImage from '../../../common/Image';

import I18n from '../../../../config/locales';

// CONSTANT
import IMAGE_CONSTANT from '../../../../constants/images';

import styles from '../../style';
import ArrowDownIcon from '../../../common/ArrowDownIcon';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

class HandleUnitComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandUnit: false,
      expandList: 6,
      handleUnitSelected: props.handleUnitSelected || null,
    };

    this.selectHandleUnit = this.selectHandleUnit.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isEditing, handleUnitSelected } = this.props;
    if (prevProps.isEditing !== isEditing) {
      if (isEditing) {
        this.selectHandleUnit(handleUnitSelected);
      }
    }
  }

  getColorArrowDown = (isListSelect = false) => {
    const { handleUnitSelected } = this.state;
    const { handleUnitError } = this.props;
    const selectedColor = '#51AF2B';
    if (handleUnitError) {
      return '#f44336';
    }

    if (isListSelect) {
      return handleUnitSelected ? '#FFF' : selectedColor;
    }

    return '#A1A1A1';
  }

  selectHandleUnit(unit) {
    const { onItemSelect } = this.props;
    onItemSelect(unit);
    this.setState({ handleUnitSelected: unit, expandUnit: false });
  }

  renderMapUnit() {
    const {
      expandUnit,
      expandList,
      handleUnitSelected,
    } = this.state;

    const {
      handleUnits,
      handleUnitError,
      languageCode
    } = this.props;

    const listSelect = handleUnitSelected && handleUnits.length > 0 && handleUnits.find((h, i) => ((i > 6) && h.id === handleUnitSelected.id));
    console.log('handleUnitSelected', handleUnitSelected);
    console.log('listSelect', listSelect);
    return (
      <>
        <View style={[styles.flex, styles.flexOne, styles.flexWrapper, styles.groupUnit]}>
          {handleUnits.map((unit, key) => key <= expandList && (
            <TouchableOpacity key={`${unit.id}`} onPress={() => this.selectHandleUnit(unit)}>
              <View key={`list-${unit.id}`} style={[styles.flex, styles.flexOne, styles.alignItemsCenter, styles.unit, handleUnitError && styles.inputError, handleUnitSelected && handleUnitSelected.id === unit.id && styles.mainBg]}>
                <UrlImage
                  sizeWidth={30}
                  sizeHeight={30}
                  sizeBorderRadius={15}
                  isFullPic={false}
                  source={unit.icon}
                />
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, handleUnitSelected && handleUnitSelected.id === unit.id && styles.whiteText, styles.medium]}>
                  {unit.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {handleUnits.length > 6
            ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ expandUnit: !expandUnit })}
              >
                <View style={[styles.alignItemsCenter, styles.flex, styles.unit, { paddingRight: 5 }, handleUnitError && styles.inputError, handleUnitSelected && listSelect && styles.mainBg]}>
                  {
                    listSelect && handleUnitSelected && (
                      <UrlImage
                        sizeWidth={30}
                        sizeHeight={30}
                        sizeBorderRadius={15}
                        isFullPic={false}
                        source={handleUnitSelected.icon}
                      />
                    )
                  }
                  <Text style={[styles.flexOne, styles.defaultSize, styles.defaultTextColor, styles.ml10, styles.mr5, { height: 30 }]}>
                    {(!listSelect && I18n.t('listing.other', { locale: languageCode })) || (handleUnitSelected && handleUnitSelected.name) || null}
                  </Text>
                  {/* {handleUnits.length > 6 && <Image source={IMAGE_CONSTANT.arrowDownGreen} style={{ width: 15, height: 9 }} />} */}
                  {handleUnits.length > 6 && <ArrowDownIcon width={10} heigh={6} color={this.getColorArrowDown(!!listSelect)} />}
                </View>
              </TouchableOpacity>
            )
            : null}
        </View>
        {handleUnits.length > expandList && expandUnit
          ? (
            <View
              style={[styles.zIndex2, {
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#fff',
                height: 270
              }]}
            >
              <ScrollView nestedScrollEnabled>
                {handleUnits.map((unit, key) => key > expandList && (
                  <TouchableOpacity key={`${unit.id}`} onPress={() => this.selectHandleUnit(unit)}>
                    <View key={`list-${unit.id}`} style={[styles.flex, styles.alignItemsCenter, styles.unit, handleUnitError && styles.inputError, handleUnitSelected && handleUnitSelected.id === unit.id && styles.mainBg]}>
                      <UrlImage
                        sizeWidth={30}
                        sizeHeight={30}
                        sizeBorderRadius={15}
                        source={unit.icon}
                      />
                      <Text style={[styles.defaultSize, styles.defaultTextColor, styles.ml10, handleUnitError && styles.inputError, handleUnitSelected && handleUnitSelected.id === unit.id && styles.whiteText]}>
                        {unit.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )
          : null
        }
      </>
    );
  }

  render() {
    const {
      handleUnitError,
      languageCode
    } = this.props;

    return (
      <View style={styles.mb30}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          {handleUnitError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
          <Text style={[styles.defaultSize, handleUnitError && styles.errorText, styles.bold]}>
            {I18n.t('listing.handleUnit', { locale: languageCode })}
          </Text>
        </View>
        <View style={styles.mt20}>
          {this.renderMapUnit()}
        </View>
      </View>
    );
  }
}

HandleUnitComponent.propTypes = {
  handleUnitError: PropTypes.bool,
  onItemSelect: PropTypes.func.isRequired,
};

HandleUnitComponent.defaultProps = {
  handleUnitError: false,
};

const mapStateToProps = (state) => ({
  handleUnits: state.listing.handleUnits,
  languageCode: state.app.languageCode,
  isEditing: state.listing.isEditing,
});

export default connect(
  mapStateToProps,
  {},
)(HandleUnitComponent);
