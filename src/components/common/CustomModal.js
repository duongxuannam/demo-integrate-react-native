import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import IMAGE_CONSTANT from '../../constants/images';

const HEIGHT_HEADER = 60;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(88, 175, 43, 1)',
    height: HEIGHT_HEADER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexIndex: {
    flex: 1,
  },
  relative: {
    position: 'relative'
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
});

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onPressButton, hideRightButton } = this.props;
    return (
      <View style={[styles.container, styles.row]}>
        <View style={[styles.flexIndex, { justifyContent: 'center', alignItems: 'flex-start' }]}>
          <View style={{ paddingLeft: 17 }}>
            <Image source={IMAGE_CONSTANT.logo} />
          </View>
        </View>
        <View style={{ width: 100, justifyContent: 'center', alignItems: 'flex-end' }}>
          { !hideRightButton
            && (
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss(); onPressButton(); }}>
                <View style={{ paddingRight: 20 }}>
                  <Image source={IMAGE_CONSTANT.menu} style={{ width: 24, height: 24 }} />
                </View>
              </TouchableOpacity>
            </View>
            )}
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  onPressButton: PropTypes.func.isRequired,
  hideRightButton: PropTypes.bool.isRequired,
};

export { Header, HEIGHT_HEADER };
