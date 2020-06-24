import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';
import NavigationService from '../../helpers/NavigationService';
import { Badge } from 'native-base';
import { NOTIFICATION_TYPE } from '../../constants/app';
import IMAGE_CONSTANT from '../../constants/images';
import Notifications from './Notifications';

const HEIGHT_HEADER = 60;
const { width, height } = Dimensions.get('window');

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

  closePopover = () => {
    this.setState({ isVisible: false });
  }

  getNotificationData = () => {
    const { actions, notificationType, token } = this.props;
    if (token === null) {
      NavigationService.navigate('Login');
      return;
    }
    this.showPopover();
    if (notificationType) {
      actions.getTotalUnread();
      actions.getNotification(NOTIFICATION_TYPE.STATUS_ALL, 4);
    }
  };

  widthNotification = (total) => {
    if (total < 10) {
      return 36;
    } if (total < 100) {
      return 42;
    }
    return 48;
  }

  titleNumberNotification = (total) => {
    if (total < 100) {
      return `${total}`;
    } if (total < 1) {
      return '';
    }
    return '99+';
  }

  showIconNotification = () => {
    const { isVisible } = this.state;
    const { totalUnread } = this.props;
    return (
      <View
        style={{
          height: 50,
          width: this.widthNotification(totalUnread),
          justifyContent: 'center',
        }}>
        <Image
          source={
            !isVisible
              ? IMAGE_CONSTANT.menuNotificationWhite
              : IMAGE_CONSTANT.menuNotification
          }
          style={{width: 21, height: 24}}
          resizeMode="center"
        />
        {!isVisible && (totalUnread > 0) && (
          <Badge
            style={{
              backgroundColor: 'rgba(255, 219, 0, 1)',
              position: 'absolute',
              top: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'rgba(98, 193, 48, 1)', // rgba(81, 175, 43, 1)
              borderWidth: 2,
            }}>
            <Text
              style={{
                color: 'rgba(14, 115, 15, 1)',
                fontSize: 13,
                fontWeight: 'bold',
              }}>
              {this.titleNumberNotification(totalUnread)}
            </Text>
          </Badge>
        )}
      </View>
    );
  };

  render() {
    const { isVisible, XPosition } = this.state;
    const {
      icon, children, customHeight, addLeftPosition, notificationType
    } = this.props;
    const isCustomIcon = icon && icon.props.children;
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.9}
          ref={ref => (this.touchable = ref)}
          onPress={this.getNotificationData}>
          {isCustomIcon ? icon : this.showIconNotification()}
        </TouchableOpacity>

        {/* Modal Popover */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisible}
          onRequestClose={this.closePopover}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: HEIGHT_HEADER,
              }}
              onPress={this.closePopover}
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
                left: parseInt(XPosition + (addLeftPosition || 0)),
                top: 1,
              }}
            />
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 4,
                width,
                // height: customHeight || height - (HEIGHT_HEADER * 2),
              }}>
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

export default PopoverExample;
