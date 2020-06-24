import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OptionList from './optionlist';
import Indicator from './indicator';

export default class Select extends Component {

  constructor(props) {
    super(props);
    this.selected = this.props.selected;
    this.listSelected = this.props.listSelected;
    this.state = {
      modalVisible: this.props.modalVisible,
      defaultText: this.props.defaultText,
      selected: this.props.selected,
      listSelected: this.props.listSelected,
      modalStyle: {},
    };
  }

  onItemSelect(label, value) {
    const { singleChoice, listSelected, onSelect, removeItemFromSelectList, onAddedItemToSelectList } = this.props;
    if (singleChoice) {
      onSelect(value, label);
      this.setState({
        modalVisible: false,
        defaultText: label
      });
    } else {
      const item = listSelected.includes(value);
      if (item) {
        const index = listSelected.findIndex((e) => e.id === value.id);
        removeItemFromSelectList(index);
      } else {
        onAddedItemToSelectList(value);
      }
    }
  }

  onClose = () => {
    this.setState({
      modalVisible: false
    });
  }

  /*
    Fired when user clicks the button
  */
  onPress = () => {
    Keyboard.dismiss();

    this.slectedListView.measureInWindow((fx, fy, width, height) => {
      // console.log('Component width is: ' + width)
      // console.log('Component height is: ' + height)
      // console.log('X offset to frame: ' + fx)
      // console.log('Y offset to frame: ' + fy)
      const { singleChoice } = this.props;
      let margin = 8;
      if (this.heightContainList) {
        margin += this.heightContainList;
      }
      const top = singleChoice ? fy + height - 1 : fy + height - margin;
      this.setState({
        modalVisible: !this.state.modalVisible,
        modalStyle: {
          marginTop: top,
          marginLeft: fx,
          width,
        }
      });
    });
  }

  /*
   Fires when user clicks on modal. primarily used to close
   the select box
   */

  onModalPress() {
    this.setState({
      modalVisible: false
    });
  }

  setSelectedText(text) {
    this.setState({
      defaultText: text
    });
  }

  renderItemSelected = () => {
    const {
      listSelected,
      uniqueKey,
      displayKey,
      tagBorderColor,
      tagTextColor,
      tagRemoveIconColor,
      fontFamily,
      itemSelectedBackgroundColor
    } = this.props;
    return listSelected.map((item, index) => {
      return (
        <View
          style={[
            styles.selectedItem,
            {
              width: item[displayKey].length * 8 + 60,
              justifyContent: 'center',
              height: 40,
              borderColor: tagBorderColor,
              backgroundColor: itemSelectedBackgroundColor,
            }
          ]}
          key={item[uniqueKey]}
        >
          <Text
            style={[
              {
                flex: 1,
                color: tagTextColor,
                fontSize: 15,
                fontFamily: 'Roboto-Regular',
              },
              fontFamily ? { fontFamily } : {}
            ]}
            numberOfLines={1}
          >
            {item[displayKey]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // this._removeItem(item);
              // const index = listSelected.findIndex(e => e.id === value.id)
              this.props.removeItemFromSelectList(index);
            }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              style={{
                color: tagRemoveIconColor,
                fontSize: 22,
                marginLeft: 10,
                fontFamily: 'Roboto-Regular',
              }}
            />
          </TouchableOpacity>
        </View>
      );
    });
  }

  getStatusIndicator = (modalVisible) => {
    const { indicatorIcon, indicatorIconUp } = this.props;
    if (indicatorIconUp) {
      return modalVisible ? indicatorIconUp : indicatorIcon;
    }

    return indicatorIcon;
  }

  render() {
    const {
      containerStyle,
      activeContainerStyle,
      style,
      defaultText,
      textStyle,
      backdropStyle,
      optionListStyle,
      transparent,
      animationType,
      indicator,
      indicatorColor,
      indicatorSize,
      indicatorStyle,
      indicatorIcon,
      indicatorIconUp,
      selectedStyle,
      selected,
      listSelected,
      singleChoice,
      containerListItemSelectStyle,
    } = this.props;

    const { modalVisible } = this.state;
    return (
      <View
        style={[containerStyle, modalVisible && activeContainerStyle]}
        ref={(ref) => {
          this.slectedListView = ref;
        }}
        onLayout={(e) => {
          // console.log("Event ", e.nativeEvent.layout)
        }}
      >
        <TouchableWithoutFeedback onPress={this.onPress}>
          <View style={[styles.selectBox, style]}>
            <View style={styles.selectBoxContent}>
              <Text
                style={textStyle}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {defaultText}
              </Text>
              {(indicatorIcon && this.getStatusIndicator(modalVisible)) || (
                <Indicator
                  direction={indicator}
                  color={indicatorColor}
                  size={indicatorSize}
                  style={indicatorStyle}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
        {
          (listSelected && listSelected.length > 0) ? (
            <View ref="containerList"
              onLayout={
                (event) => {
                  this.heightContainList = event.nativeEvent.layout.height;
                }
              }
              style={containerListItemSelectStyle}
            >
              {this.renderItemSelected()}
            </View>
          ) : null
        }
        <Modal
          transparent={transparent}
          animationType={animationType}
          visible={modalVisible}
          onRequestClose={this.onClose}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
        >
          <TouchableWithoutFeedback onPress={this.onModalPress.bind(this)}>
            <View style={[styles.modalOverlay, backdropStyle]}>
              <OptionList
                onSelect={this.onItemSelect.bind(this)}
                selectedStyle={selectedStyle}
                selected={singleChoice ? selected : listSelected}
                style={[optionListStyle, this.state.modalStyle]}
              >
                {this.props.children}
              </OptionList>
            </View>
          </TouchableWithoutFeedback>

        </Modal>
      </View>
    );
  }
}

Select.propTypes = {
  containerStyle: ViewPropTypes.style,
  activeContainerStyle: ViewPropTypes.style,
  containerListItemSelectStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
  modalVisible: PropTypes.bool,
  singleChoice: PropTypes.bool,
  defaultText: PropTypes.string,
  onSelect: PropTypes.func,
  onAddedItemToSelectList: PropTypes.func, // func use for select mutilple
  removeItemFromSelectList: PropTypes.func, // func use for select mutilple
  textStyle: Text.propTypes.style,
  backdropStyle: ViewPropTypes.style,
  optionListStyle: ViewPropTypes.style,
  indicator: PropTypes.string,
  indicatorColor: PropTypes.string,
  indicatorSize: PropTypes.number,
  indicatorStyle: ViewPropTypes.style,
  tagBorderColor: PropTypes.string,
  itemSelectedBackgroundColor: PropTypes.string,
  tagTextColor: PropTypes.string,
  tagRemoveIconColor: PropTypes.string,
  indicatorIcon: PropTypes.element,
  indicatorIconUp: PropTypes.element,
  displayKey: PropTypes.string,
  uniqueKey: PropTypes.string,
  fontFamily: PropTypes.string,
  transparent: PropTypes.bool,
  animationType: PropTypes.string
};

Select.defaultProps = {
  containerStyle: {},
  activeContainerStyle: {},
  containerListItemSelectStyle: {},
  style: {},
  textStyle: {},
  backdropStyle: {},
  optionListStyle: {},
  indicatorStyle: {},
  defaultText: '',
  onSelect: () => { },
  transparent: false,
  animationType: 'none',
  singleChoice: true,
  indicator: 'none',
  indicatorColor: 'black',
  indicatorSize: 10,
  indicatorIcon: null,
  indicatorIconUp: null,
  modalVisible: false,
  displayKey: 'name',
  uniqueKey: 'id',
  tagBorderColor: '#000',
  itemSelectedBackgroundColor: '#fff',
  tagTextColor: '#000',
  tagRemoveIconColor: '#000',
  fontFamily: '',
  onAddedItemToSelectList: () => { },
  removeItemFromSelectList: () => { },
};

const styles = StyleSheet.create({
  selectBox: {
    borderWidth: 1,
    width: '100%',
    borderColor: '#000'
  },
  selectBoxContent: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  modalOverlay: {
    flex: 1,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2,
  },
});
