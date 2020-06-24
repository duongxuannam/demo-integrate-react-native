import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Badge } from 'native-base';
import { SafeAreaView } from 'react-navigation';

import { HEIGHT_HEADER } from './Header';
import { NOTIFICATION_TYPE } from '../../constants/app';
import IMAGE_CONSTANT from '../../constants/images';
import Notifications from './Notifications';
import NavigationService from '../../helpers/NavigationService';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

class PopoverExample extends Component {
  state = {
    isVisible: false,
  };

  showPopover() {
    this.touchable.measure((fx, fy, width, height, px, py) => {
      this.setState((prevState) => ({
        isVisible: !prevState.isVisible,
        XPosition: px,
      }));
    });
  }

  closePopover() {
    this.setState({ isVisible: false });
  }

  widthNotification = (total) => {
    if (total < 10) {
      return 36;
    }
    if (total < 100) {
      return 42;
    }
    return 48;
  };

  titleNumberNotification = (total) => {
    if (total < 100) {
      return `${total}`;
    }
    if (total < 1) {
      return '';
    }
    return '99+';
  };

  showIconNotification = () => {
    const { isVisible } = this.state;
    const { totalUnread } = this.props;
    // const totalUnread = 0
    console.log('totalUnread: ', totalUnread);
    return (
      <View
        style={{
          height: 50,
          width: this.widthNotification(totalUnread),
          justifyContent: 'center',
        }}
      >
        <Image
          source={
            !isVisible
              ? IMAGE_CONSTANT.menuNotificationWhite
              : IMAGE_CONSTANT.menuNotification
          }
          style={{ width: 21, height: 24 }}
          resizeMode="center"
        />
        {!isVisible && totalUnread > 0 && (
          <Badge
            style={{
              backgroundColor: 'rgba(255, 219, 0, 1)',
              position: 'absolute',
              top: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'rgba(81, 175, 43, 1)', // rgba(81, 175, 43, 1)
              borderWidth: 2,
            }}
          >
            <Text
              style={{
                color: 'rgba(14, 115, 15, 1)',
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              {this.titleNumberNotification(totalUnread)}
            </Text>
          </Badge>
        )}
      </View>
    );
  };

  getNotificationData = () => {
    const { actions, notificationType, token } = this.props;
    if (token === null) {
      NavigationService.navigate('LoginStack');
      return;
    } this.showPopover();
    if (notificationType) {
      actions.getTotalUnread();
      actions.getNotification(NOTIFICATION_TYPE.STATUS_ALL, 4);
    }
  };

  render() {
    const { isVisible, XPosition } = this.state;
    const { icon, children, notificationType } = this.props;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          ref={(ref) => (this.touchable = ref)}
          onPress={this.getNotificationData}
        >
          {notificationType ? (
            this.showIconNotification()
          ) : (
            <Image source={icon} style={{ width: 21, height: 24 }} />
          )}
        </TouchableOpacity>

        {/* Modal Popover */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisible}
          onRequestClose={() => this.closePopover()}
        >
          <SafeAreaView style={{ flex: 1 }} forceInset={{ bottom: 'never' }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: HEIGHT_HEADER,
              }}
              onPress={() => this.closePopover()}
            />
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderLeftWidth: 12,
                borderRightWidth: 12,
                borderBottomWidth: 12,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: '#fff',
                marginTop: -12,
                left: parseInt(XPosition),
                top: 1,
              }}
            />
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 4,
                width,
                // height: height - HEIGHT_HEADER * 2,
              }}
            >
              {notificationType ? (
                <Notifications closePopover={() => this.closePopover()} />
              ) : (
                children
              )}
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
              }}
              onPress={() => this.closePopover()}
            />
          </SafeAreaView>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({

});

export default PopoverExample;
