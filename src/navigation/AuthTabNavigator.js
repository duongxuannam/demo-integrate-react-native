import { createSwitchNavigator } from 'react-navigation';

/* SCREEN */
import StartContainer from '../containers/main/StartContainer';
import SelectCountryContainer from '../containers/select_country/SelectCountryContainer';
import LoginContainer from '../containers/work-flows/LoginContainer';
import SignupContainer from '../containers/work-flows/SignupContainer';
import SMSVerificationContainer from '../containers/work-flows/SMSVerificationContainer';
import ResetPasswordContainer from '../containers/work-flows/ResetPasswordContainer';
import SwtichAccountContainer from '../containers/work-flows/SwtichAccountContainer';

const AuthTabNavigator = createSwitchNavigator({
  SelectCountryStack: {
    screen: SelectCountryContainer,
  },
  LoginStack: {
    screen: LoginContainer,
  },
  SignupStack: {
    screen: SignupContainer,
  },
  SwitchAccountStack: {
    screen: SwtichAccountContainer,
  },
  SMSVerificationStack: {
    screen: SMSVerificationContainer,
  },
  ResetPasswordStack: {
    screen: ResetPasswordContainer,
  },
  StartStack: {
    screen: StartContainer,
  },
}, {
  initialRouteName: 'SelectCountryStack',
});

AuthTabNavigator.path = '';

export default AuthTabNavigator;
