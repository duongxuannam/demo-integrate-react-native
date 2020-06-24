import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  TextInput
} from 'react-native';

import IMAGE_CONSTANT from '../../../constants/images';
import { truncateString } from '../../../helpers/regex';
import styles from '../style';
import { IsCanEditShipment } from '../../../helpers/shipment.helper';

export default class Referral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preReferral: '',
      referral: '',
      editRef: false,
    };
  }

  componentDidMount() {
    this.setReferralValue();
  }

  componentDidUpdate(prevProps) {
    const { shipmentDetail } = this.props;
    if (shipmentDetail.referenceCode !== prevProps.shipmentDetail.referenceCode) {
      this.setState({
        referral: shipmentDetail.referenceCode,
      });
    }
  }

  setReferralValue = () => {
    const { shipmentDetail } = this.props;
    const { referral } = this.state;
    this.setState({
      referral: shipmentDetail && shipmentDetail.referenceCode || '',
    }, () => {
      this.setState({
        preReferral: referral,
      });
    });
  }

  saveReferral = () => {
    const { actions, shipmentDetail } = this.props;
    const { referral, preReferral } = this.state;
    if (referral) {
      this.setState({
        referral,
        preReferral: referral,
      });
    } else {
      this.setState({
        referral: preReferral,
      });
    }
    this.setState({ editRef: false });
    actions.updateBasicShipment(shipmentDetail.id, {
      referenceCode: referral,
    }, (res, error) => {
      console.log('update ref success');
    });
  }

  changeReferral = (val) => {
    const { preReferral } = this.state;
    if (val) {
      this.setState({
        referral: val,
      });
    } else {
      this.setState({
        referral: preReferral,
      });
    }
  }

  handleEditRef = () => {
    this.setState({
      editRef: true,
    });
    this.refReferral.focus();
  };

  render() {
    const { editRef, referral } = this.state;
    const { shipmentDetail } = this.props;
    return (
      <View style={[styles.ml20, styles.flexOne, styles.flex]}>
        <TextInput
          ref={(ref) => this.refReferral = ref}
          editable={editRef}
          style={[styles.shipmentID, styles.defaultTextColor, styles.smallSize, styles.mr5, { maxWidth: 95, textAlign: 'center' }]}
          value={editRef ? referral : truncateString(referral, 9)}
          onChangeText={(val) => this.changeReferral(val)}
          onBlur={this.saveReferral}
          maxLength={50}
        />
        <TouchableOpacity
          style={[styles.shipmentRef, styles.shipmentID, styles.justifyContentCenter]}
          activeOpacity={0.9}
          onPress={this.handleEditRef}
        >
          <Image
            source={IMAGE_CONSTANT.editIcon}
            style={{ width: 18, height: 18 }}
          />
        </TouchableOpacity>
        <View style={styles.flexOne} />
      </View>
    );
  }
}
