import React from 'react';
import {
  Image,
  Text,
  View,
} from 'react-native';
import styles from '../work-flows/style';

export default class MessageError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { errorMsg } = this.props;
    return (
      <View style={[styles.formGroupLabel, styles.flex, styles.alignItemsCenter, styles.mb10]}>
        <Image source={require('../../assets/images/common/error-icon.png')} style={{ width: 20, height: 20 }} />
        <Text style={[styles.ml10, styles.defaultSize, styles.errorText, styles.bold]}>{errorMsg}</Text>
      </View>
    )
  }
}