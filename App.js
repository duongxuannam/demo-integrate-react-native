import React, {Component} from 'react';
import {Linking} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import NavigationService from './src/helpers/NavigationService';
import Store from './src/store';

const {store, persistor} = Store();

export default class App extends Component {
  componentDidMount() {
    Linking.getInitialURL().then(url => {
      this.handleInitialURL({url});
    });
    Linking.addEventListener('url', e => this.handleOpenURL(e));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', e => this.handleOpenURL(e));
  }

  handleOpenURL = event => {
    if (!event.url) {
      return;
    }
    const route = event.url.replace(/.*?:\/\//g, '').split('?')[1];
    const sliceParams = route.split('&');
    const resetPwdToken = sliceParams[0].split('reset_password_token=')[1];
    const resetPwdSentAt = sliceParams[1].split('reset_password_sent_at=')[1];
    if (resetPwdToken && resetPwdSentAt) {
      NavigationService.navigate('ResetPasswordStack', {
        resetPwdToken,
        resetPwdSentAt,
      });
    }
  };

  handleInitialURL = event => {
    if (!event.url) {
      return;
    }

    const route = event.url.replace(/.*?:\/\//g, '').split('?')[1];
    const sliceParams = route.split('&');
    const resetPwdToken = sliceParams[0].split('reset_password_token=')[1];
    const resetPwdSentAt = sliceParams[1].split('reset_password_sent_at=')[1];
    if (resetPwdToken && resetPwdSentAt) {
      NavigationService.navigate('ResetPasswordStack', {
        resetPwdToken,
        resetPwdSentAt,
      });
    }
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
