import { createStackNavigator } from 'react-navigation-stack';

/* SCREEN */
// import NotificationContainer from '../containers/notification/NotificationContainer';
import ShipmentContainer from '../containers/shipment/ShipmentContainer';
import ManagementShipment from '../containers/shipment/ManagementShipment';
import ConfirmShipment from '../containers/shipment/ConfirmShipment';
// import SwtichAccountContainer from '../containers/work-flows/SwtichAccountContainer';
import HomeContainer from '../containers/main/HomeContainer';
import EditProfileContainer from '../containers/work-flows/EditProfileContainer';
import BookingContainer from '../containers/booking/BookingContainer';
import ShipmentQuotesContainer from '../containers/shipment/ShipmentQuotesContainer';

const MainTabNavigator = createStackNavigator(
  {
    HomeStack: {
      screen: HomeContainer,
      navigationOptions: {
        header: null,
      },
    },
    EditProfileStack: {
      screen: EditProfileContainer,
      navigationOptions: {
        header: null,
      },
    },
    BookingStack: {
      screen: BookingContainer,
      navigationOptions: {
        header: null,
      },
    },
    ManagementShipmentStack: {
      screen: ManagementShipment,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentConfirmStack: {
      screen: ConfirmShipment,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentStack: {
      screen: ShipmentContainer,
      navigationOptions: {
        header: null,
      },
    },
    ShipmentQuotesStack: {
      screen: ShipmentQuotesContainer,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'BookingStack',
    headerMode: 'none',
  },
);
MainTabNavigator.path = '';

export default MainTabNavigator;
