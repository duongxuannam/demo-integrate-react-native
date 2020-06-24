import { createStackNavigator } from 'react-navigation-stack';

/* SCREEN */
import StartContainer from '../containers/main/StartContainer';
import ShipmentContainer from '../containers/shipment/ShipmentContainer';
import ShipmentDetailContainer from '../containers/shipment/ShipmentDetailContainer';
import ShipmentPlaceContainer from '../containers/shipment/ShipmentPlaceContainer';
import ShipmentBidContainer from '../containers/shipment/ShipmentBidContainer';

const MainTabNavigator = createStackNavigator(
  {
    ShipmentStack: {
      screen: ShipmentContainer,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentDetailStack: {
      screen: ShipmentDetailContainer,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentPlaceStack: {
      screen: ShipmentPlaceContainer,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentBidStack: {
      screen: ShipmentBidContainer,
      navigationOptions: {
        header: null,
      },
    },
    StartStack2: {
      screen: StartContainer,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'ShipmentStack',
    headerMode: 'none',
  },
);
MainTabNavigator.path = '';

export default MainTabNavigator;
