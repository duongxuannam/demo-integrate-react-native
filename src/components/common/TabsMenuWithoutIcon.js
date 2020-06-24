import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
const { width } = Dimensions.get('window')
class TabsMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSwitchTab(tab, checkTabActive, id) {
    const { switchTab } = this.props;
    if (checkTabActive === false) {
      switchTab(tab, id);
    }
  }

  render() {
    const {
      activeTab, notification, source
    } = this.props;
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.tabs]}>
        {source.map((session, key) => (
          <TouchableOpacity 
            key={`tab-list-${session.id}`}
            activeOpacity={0.9}
            style={[activeTab === key ? styles.whiteBg : null, { width: width / 3 }]}
            onPress={() => this.onSwitchTab(session.tab, activeTab === key, session.id)}
          >
            <View style={[styles.tab, styles.relative, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, key === (source.length - 1) ? styles.tabLast : null ]}>
              <Text style={[styles.defaultSize, styles.ml10, activeTab === key ? styles.bold : null]}>
                {session.title}
              </Text>
              {typeof notification !== 'undefined' && Object.keys(notification).length > 0 && key === notification.tab && notification.value > 0
                ? (
                  <View style={styles.ml5}>
                    <Text style={styles.notification}>
                      {notification.value}
                    </Text>
                  </View>
                )
                : null}
              {session.isBadge
                ? (
                  <Text style={styles.badge}>
                    <View style={styles.circle} />
                  </Text>
                )
                : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  justifyContentCenter: {
    justifyContent: 'center',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  normal: {
    fontFamily: 'Roboto-Regular',
  },
  pad20: {
    padding: 20,
  },
  mt20: {
    marginTop: 20,
  },
  mr20: {
    marginRight: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  ml10: {
    marginLeft: 10,
  },
  ml5: {
    marginLeft: 5,
  },
  relative: {
    position: 'relative',
  },
  tabs: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 1)',
  },
  tab: {
    height: 54,
    borderRightWidth: 1,
    borderRightColor: 'rgba(219, 219, 219, 1)',
  },
  tabLast: {
    borderRightWidth: 0,
  },
  w60: {
    width: 64,
  },
  badge: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(14, 115, 15, 1)',
  },
  notification: {
    width: 23,
    height: 23,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 219, 0, 1)',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
})

TabsMenu.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  switchTab: PropTypes.func.isRequired,
  activeTab: PropTypes.number,
  notification: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]),
  showText: PropTypes.bool,
}

TabsMenu.defaultProps = {
  activeTab: 0,
  notification: {},
  showText: false,
}

export default TabsMenu
