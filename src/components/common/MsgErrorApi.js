import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';

// CSS
import styles from '../work-flows/style';

export default class MsgErrorApi extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { errorMsg, styleProp } = this.props;
    return (
    <React.Fragment>
      <View style={[styles.whiteBg, styleProp]}>
        <View style={[styles.borderBoxColorErrApi, styles.mb30]}>
          <Text style={[styles.resetPasswordAlertTop, styles.resetPasswordExpiredTop, styles.defaultSize, styles.textCenter, styles.pad20]}>
            {errorMsg}
          </Text>
        </View>
      </View>
    </React.Fragment>
    )
  }
}
