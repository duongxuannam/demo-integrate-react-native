import React from 'react';
import {
  Text,
  View,
  BackHandler,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} style={{ flex: 1 }}>
        <Header
          headerLeft={this.headerLeft}
          headerRight={this.headerRight}
        />
        <View style={[styles.actions, styles.h44pt]}>
          <TouchableOpacity style={{ width: 180 }} activeOpacity={0.9} onPress={() => navigate('BookingStack')}>
            <View style={[styles.ml20, styles.flex, styles.alignItemsCenter, styles.h44pt]}>
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.flexOne, styles.ml10]}>
                { I18n.t('home_page') }
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}