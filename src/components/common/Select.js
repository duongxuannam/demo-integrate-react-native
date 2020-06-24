import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native'

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images'

class Select extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  onValueChange(session) {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }), () => {
      const { onValueChange, closeDropDown } = this.props;
      onValueChange(session);
      if (closeDropDown) {
        closeDropDown();
      }
    });
  }

  showDropdown() {
    const { expanded } = this.state;
    const {
      openDropDown,
      closeDropDown
    } = this.props;
    console.log("EXPANDED: ", expanded);

    if (!expanded && openDropDown) {
      openDropDown();
    }

    if (expanded && closeDropDown) {
      closeDropDown();
    }

    this.touchable.measure((fx, fy, width, height, px, py) => {
      this.setState(prevState => ({
        expanded: !prevState.expanded,
        XPosition: px,
        YPosition: py,
      }));
    });
  }

  findSelectActive(value) {
    const {
      source,
      selectedValue,
    } = this.props;

    if (!selectedValue) return false;
    const findObj = source.find(x => x.value === selectedValue.value);
    return findObj.value === value;
  }

  render() {
    const {
      expanded,
      XPosition,
      YPosition,
    } = this.state;
    const {
      source,
      onValueChange,
      selectedValue,
      placeholder,
      error,
      itemView,
      whiteBg,
      noEdit
    } = this.props;

    return (
      <>
        <TouchableOpacity
          style={{ zIndex: 99 }}
          activeOpacity={0.9}
          ref={ref => this.touchable = ref}
          onPress={noEdit ? null : () => this.showDropdown()}
        >
          <View style={[whiteBg ? styles.whiteBg : null, styles.select, error ? styles.selectError : null, styles.h60, styles.flex, styles.alignItemsCenter]}>
            <View style={styles.flexOne}>
              <Text style={[styles.defaultSize, selectedValue ? styles.title : styles.titlePlaceholder]}>
                {selectedValue ? selectedValue.name : placeholder}
              </Text>
              {selectedValue && selectedValue.placeholder && (
                <Text style={[styles.titlePlaceholder, styles.smallSize]}>
                  {selectedValue.placeholder}
                </Text>
              )}
              {selectedValue && selectedValue.description && (
                <Text style={[styles.titlePlaceholder, styles.smallSize]}>
                  {selectedValue.description}
                </Text>
              )}
            </View>
            {expanded
              ? error ? <Image source={IMAGE_CONSTANT.arrowDownRed} style={{ width: 15, height: 9 }} /> : <Image source={IMAGE_CONSTANT.arrowUpGreen} style={{ width: 15, height: 9 }} />
              : error ? <Image source={IMAGE_CONSTANT.arrowDownRed} style={{ width: 15, height: 9 }} /> : <Image source={IMAGE_CONSTANT.arrowDownGreen} style={{ width: 15, height: 9 }} />}
          </View>
        </TouchableOpacity>
        {expanded && (
          <View
            style={[styles.selectDropdown, {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99,
              height: source.length > 4 ? 270 : 'auto',
              overflow: 'visible',
            }]}
          >
            <TouchableOpacity style={[styles.h56, { overflow: 'visible', }]} onPress={() => this.showDropdown()} />
            <ScrollView
              nestedScrollEnabled
              style={styles.whiteBg}
              contentContainerStyle={{ zIndex: 99, overflow: 'visible', }}
            >
              {source.map((session, key) => (
                <TouchableWithoutFeedback
                  key={`select-list-${key}`}
                  onPress={() => this.onValueChange(session)}
                >
                  <View
                    style={[
                      styles.h60,
                      styles.flex,
                      styles.alignItemsCenter,
                      styles.selectDropdownList,
                      this.findSelectActive(session.value) ? styles.selectDropdownListActive : null,
                      { overflow: 'visible', }
                    ]}
                  >
                    {/*  */}
                    {
                      itemView(session)
                      || (
                        <Text style={styles.selectDropdownListTitle}>
                          {session.name}
                        </Text>
                      )
                    }
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  h56: {
    height: 56,
  },
  h60: {
    height: 60,
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  titlePlaceholder: {
    color: 'rgba(161, 161, 161, 1)',
  },
  select: {
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  selectError: {
    borderColor: '#f44336',
    backgroundColor: '#fef5f5',
  },
  selectDropdown: {
    borderWidth: 1,
    borderColor: 'rgba(81, 175, 43, 1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  selectDropdownList: {
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
  },
  selectDropdownListActive: {
    backgroundColor: 'rgba(236, 236, 236, 1)',
  },
  selectDropdownListTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
});

Select.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  onValueChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  selectedValue: PropTypes.shape({}),
  error: PropTypes.bool,
  itemView: PropTypes.func,
  whiteBg: PropTypes.bool,
  noEdit: PropTypes.bool
};

Select.defaultProps = {
  itemView: () => null,
  placeholder: undefined,
  selectedValue: undefined,
  error: false,
  whiteBg: false,
  noEdit: false
};

export default Select;
