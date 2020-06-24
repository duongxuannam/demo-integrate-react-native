import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
} from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

class DropdownList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      dropdown: false,
    }
  }

  showDropdown() {
    const { disabled } = this.props
    if (disabled === false) {
      this.setState(prevState => ({
        dropdown: !prevState.dropdown,
      }))
    }
  }

  handleChange(type) {
    const { onChange } = this.props
    this.setState(prevState => ({
      dropdown: !prevState.dropdown,
    }), () => {
      onChange(type)
    })
  }

  render() {
    const { dropdown } = this.state
    const { source, icon, positionTop, positionRight, width } = this.props
    const isCustomIcon = icon && icon.props.children;
    return (
      <>
        <TouchableOpacity
          style={[styles.flex, styles.justifyContentEnd, styles.alignItemsCenter]}
          activeOpacity={0.9}
          ref={ref => this.touchable = ref}
          onPress={() => this.showDropdown()}
        >
          {isCustomIcon ? icon : <Image source={icon} />}
        </TouchableOpacity>
        {dropdown && (
          <View style={[styles.dropdown, { top: positionTop, right: positionRight, width: width || null }]}>
            <View style={styles.dropdownArrow} />
            <View style={styles.dropdownGroup}>
              {source.map((session, key) => {
                if (session.isActive === false) {
                  return (
                    <View key={`action-click-${key}`} style={source.length - 1 === key ? null : styles.mb15}>
                      <View style={[styles.flex, styles.alignItemsCenter]}>
                        { session.icon && <Image source={session.icon} /> }
                        <Text style={[styles.defaultSize, styles.ml10, { color: session.color || 'rgba(68, 68, 68, 1)' }]}>
                          {session.title}
                        </Text>
                      </View>
                      <Text style={[styles.smallSize, { color: session.color || 'rgba(68, 68, 68, 1)', width: 110 }]}>
                        Not available with active bids.
                      </Text>
                    </View>
                  )
                }

                return (
                  <TouchableOpacity
                    key={`action-click-${key}`}
                    style={[styles.flex, styles.alignItemsCenter, source.length - 1 === key ? null : styles.mb15]}
                    activeOpacity={0.9}
                    onPress={() => this.handleChange(session.title)}
                  >
                    <Image source={session.icon} />
                    <Text style={[styles.defaultSize, styles.ml10, { color: session.color || 'rgba(68, 68, 68, 1)' }]}>
                      {session.title}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}
      </>
    )
  }
}

const styles = StyleSheet.create({
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  zIndex1: {
    zIndex: 1,
  },
  zIndex2: {
    zIndex: 2,
  },
  ml20: {
    marginLeft: 20,
  },
  mb15: {
    marginBottom: 15,
  },
  ml10: {
    marginLeft: 10,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
  dropdown: {
    position: 'absolute',
    right: 10,
    zIndex: 2,
  },
  dropdownArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    marginTop: -8,
    position: 'absolute',
    right: 15,
    top: 1,
    zIndex: 3,
  },
  dropdownGroup: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 30,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
  },
})


DropdownList.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({}),
    PropTypes.array
  ]),
  disabled: PropTypes.bool,
  positionTop: PropTypes.number,
  positionRight: PropTypes.number,
  width: PropTypes.number,
  onChange: PropTypes.func,
}

DropdownList.defaultProps = {
  icon: {},
  disabled: false,
  positionTop: 0,
  positionRight: 0,
  width: 0,
  onChange: undefined,
}

export default DropdownList
