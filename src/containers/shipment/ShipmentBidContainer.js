import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// COMPONENTS
// import Header from '../../components/shipment/detail/Header';
import TabsMenu from '../../components/common/TabsMenu';

// Tabs
// import ShipmentTab from '../../components/shipment/detail/Details';
import ProgressTab from '../../components/shipment/progress/Progress';
import CommunicationTab from '../../components/shipment/communication/Communication';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

// CSS
import styles from '../style';

class ShipmentBidContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  navigateToScreen(route) {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView nestedScrollEnabled>
          {/* Header */}
          {/* <Header /> */}

          {/* Tabs */}
          <TabsMenu
            source={[
              {
                id: 1, title: 'Shipment', isBadge: false, icon: IMAGE_CONSTANT.deliveryIcon, route: 'ShipmentDetailStack'
              },
              {
                id: 2, title: 'Progress', isBadge: false, icon: IMAGE_CONSTANT.progressIcon, route: 'QuotesStack'
              },
              {
                id: 3, title: 'Communication', isBadge: true, icon: IMAGE_CONSTANT.communicationIcon, route: 'QuotesStack'
              },
              {
                id: 4, title: 'Payment', isBadge: false, icon: IMAGE_CONSTANT.paymentIcon, route: 'QuotesStack'
              },
            ]}
            activeTab={1}
            navigateToScreen={this.navigateToScreen}
          />

          {/* {Shipment Tab} */}
          {/* {<ShipmentTab />} */}

          {/* {Progress Tab} */}
          {<ProgressTab />}

          {/* {Communication} */}
          {/* <CommunicationTab /> */}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default ShipmentBidContainer;
