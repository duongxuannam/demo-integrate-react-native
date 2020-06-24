import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import I18n from '../../../config/locales';

// CSS
import styles from '../style';

class AddNewBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { addNew, languageCode, title } = this.props;
    return (
      <View style={[styles.whiteBg, styles.paddingVertical15, styles.mb30, styles.formLine]}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => addNew()}>
          <View style={[styles.flex, styles.alignItemsCenter, styles.paddingHorizontal20]}>
            <View style={[styles.addNewBooking, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
              <Text style={[styles.addNewBookingText, styles.whiteText, { textAlignVertical: 'center', textAlign: 'center' }]}>+</Text>
            </View>
            <Text style={[styles.ml20, styles.defaultSize, styles.defaultTextColor, styles.bold]}>{ title || I18n.t('listing.addOtherItem', { locale: languageCode })}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AddNewBooking;
