import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import I18N from '../../../config/locales';
import { computeTimeLeft } from '../../../helpers/shipment.helper';
import styles from '../style';
import { EXPRIRED_TIME_LEFT } from '../../../constants/app';

export default class LTLShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: ''
    };
  }

  componentDidMount() {
    this.showTimeLeft();
    this.countDownTimeLeft = setInterval(() => {
      this.showTimeLeft();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.countDownTimeLeft);
  }

  showTimeLeft = () => {
    const { shipmentDetail } = this.props;
    const timeLeft = computeTimeLeft(shipmentDetail.shipmentDetail.changedStatusDate);
    this.setState({
      timeLeft
    }, () => {
      const { timeLeft: newTimeLeft } = this.state;
      if (newTimeLeft === EXPRIRED_TIME_LEFT) {
        clearInterval(this.countDownTimeLeft);
      }
    });
  }

  render() {
    const { languageCode } = this.props;
    const { timeLeft } = this.state;
    return (
      <View style={[styles.flex, styles.alignItemsCenter, styles.mb20]}>
        <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
          {I18N.t('shipment.detail.time_left', { locale: languageCode })}
        </Text>
        <View style={[styles.ml20, styles.flexOne, styles.flex]}>
          <Text style={styles.shipmentTime}>
            {timeLeft}
          </Text>
          <View style={styles.flexOne} />
        </View>
      </View>
    );
  }
}
