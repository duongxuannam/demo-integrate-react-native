import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import listingActions from '../../store/actions/listingAction';
import appActions from '../../store/actions/appAction';
import IMAGE_CONSTANT from '../../constants/images';
import styles from '../booking/style';
import SelectFromMap from '../shipment/detail/SelectFromMap';
import I18n from '../../config/locales';

class EditAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onCloseModal() {
    const { actions } = this.props;
    actions.closeAddressModal();
  }

  render() {
    const {
      languageCode,
      actions,
      updatingAddressData,
    } = this.props;
    return (
      <SafeAreaView style={{
        width: '100%',
        height: '100%',
      }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.onCloseModal()}
            >
              <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.whiteBg, {
              flex: 4,
            }]}
          >
            <View style={[styles.flex, { marginTop: -31 }]}>
              <Text style={styles.formHeader}>
                { updatingAddressData.pickupDate 
                  ? I18n.t('listing.pickup_address', { locale: languageCode })
                  : I18n.t('listing.des_address', { locale: languageCode })}
              </Text>
              <View style={styles.flexOne} />
            </View>
            <ScrollView
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              <SelectFromMap
                session={updatingAddressData}
                languageCode={languageCode}
                actions={actions}
              />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  summaryShipment: state.listing.summaryShipment,
  shipmentDetail: state.listing.shipmentDetail,
  dataStep2: state.listing.dataStep2,
  languageCode: state.app.languageCode,
  modalStatus: state.app.modalStatus,
  updatingAddress: state.listing.updatingAddress,
  updatingAddressData: state.listing.updatingAddressData,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingActions, ...appActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null, {
    forwardRef: true
  }
)(EditAddress);
