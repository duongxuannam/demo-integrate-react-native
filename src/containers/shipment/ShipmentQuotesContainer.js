import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// COMPONENTS
import TabsMenu from '../../components/common/TabsMenu';
import DropdownList from '../../components/common/DropdownList';

// Tabs
import ShipmentTab from '../../components/shipment/Details';
import ProgressTab from '../../components/shipment/progress/Progress';
import CommunicationTab from '../../components/shipment/communication/Communication';
import PaymentTab from '../../components/shipment/payment/Payment';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

class ShipmentQuotesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'payment',
      activeTab: 3,
    };

    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  switchTab = (tab, id) => {
    const { currentTab } = this.state;
    if (currentTab !== tab) {
      this.setState({
        currentTab: tab,
        activeTab: id,
      });
    }
  }

  renderTab = () => {
    const { currentTab } = this.state;
    switch (currentTab) {
      case 'payment':
        return <PaymentTab />;
      case 'progress':
        return <ProgressTab />;
      case 'communication':
        return <CommunicationTab />;
      default:
        // return <ShipmentTab />;
        return true;
    }
  }

  navigateToScreen(route) {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    navigation.dispatch(navigateAction);
  }

  render() {
    const { activeTab } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView nestedScrollEnabled>
          {/* Header */}
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              1999 Ford F450 Reg Cab, Gas with Bucket
            </Text>
            <DropdownList
              icon={IMAGE_CONSTANT.groupMenuDisabled}
              source={[
                {
                  id: 1, icon: IMAGE_CONSTANT.editIcon, title: 'Edit', color: 'rgba(161, 161, 161, 1)', isActive: false
                },
                {
                  id: 2, icon: IMAGE_CONSTANT.duplicateIcon, title: 'Un-list', color: 'rgba(14, 115, 15, 1)', isActive: true
                },
                {
                  id: 3, icon: IMAGE_CONSTANT.deleteIconRed, title: 'Delete', color: 'rgba(244, 67, 54, 1)', isActive: true
                },
              ]}
              onChange={this.handleChange}
              positionTop={61}
              disabled
            />
          </View>

          {/* Tabs */}
          <TabsMenu
            source={[
              {
                id: 0,
                title: 'Shipment',
                isBadge: false,
                icon: IMAGE_CONSTANT.deliveryIcon,
                tab: 'shipment'
              },
              {
                id: 1,
                title: 'Progress',
                isBadge: false,
                icon: IMAGE_CONSTANT.progressIcon,
                tab: 'progress'
              },
              {
                id: 2,
                title: 'Communication',
                isBadge: true,
                icon: IMAGE_CONSTANT.communicationIcon,
                tab: 'communication'
              },
              {
                id: 3,
                title: 'Payment',
                isBadge: false,
                icon: IMAGE_CONSTANT.paymentIcon,
                tab: 'payment'
              },
            ]}
            activeTab={activeTab}
            switchTab={this.switchTab}
          />
          {this.renderTab()}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
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
  mt30: {
    marginTop: 30,
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
  mb30: {
    marginBottom: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
});

export default ShipmentQuotesContainer;
