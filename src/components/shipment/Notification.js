import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

// CSS
import styles from './style';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={[styles.yellowBg, styles.notificationBox, styles.flex, styles.alignItemsCenter, styles.mb20]}>
        <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
        <View style={styles.flexOne}>
          <Text style={[styles.notificationText, styles.notificationSize, styles.bold, styles.ml10, styles.mr25]}>
            Login to have matching shipments sent directly to your Whatsapp.
          </Text>
        </View>
        <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
      </View>
    );
  }
}

export default Notification;
