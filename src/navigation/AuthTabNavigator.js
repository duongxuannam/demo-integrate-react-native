import { createSwitchNavigator } from 'react-navigation';

/* SCREEN */
import LoginContainer from '../containers/Login/LoginContainer';

const AuthTabNavigator = createSwitchNavigator({
  Login: {
    screen: LoginContainer,
  },
}, {
  initialRouteName: 'Login',
});

AuthTabNavigator.path = '';

export default AuthTabNavigator;
