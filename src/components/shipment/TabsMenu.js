import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

// CSS
import styles from './style';

class TabsMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleNavigate(route, checkTabActive) {
    const { navigateToScreen } = this.props;
    if (checkTabActive === false) {
      navigateToScreen(route);
    }
  }

  render() {
    const { activeTab, source } = this.props;
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.tabs]}>
        {source.map((session, key) => (
          <TouchableOpacity
            key={`tab-list-shipment-${session.id}`}
            activeOpacity={0.9}
            style={[activeTab === key ? styles.whiteBg : null, styles.flexOne]}
            onPress={() => this.handleNavigate(session, activeTab === key)}
          >
            <View style={[styles.tab, styles.relative, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, key === (source.length - 1) ? styles.tabLast : null ]}>
              <Text style={[styles.defaultSize, styles.defaultColor, activeTab === key ? styles.bold : null]}>
                {session.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

export default TabsMenu;
