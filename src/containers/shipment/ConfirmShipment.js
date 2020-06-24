import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import IconCustomerService from '../../components/common/CustomerService';
import styles from '../../components/work-flows/style';
import listingAction from '../../store/actions/listingAction';
import { COMMON } from '../../constants/app';

class ConfirmShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: COMMON.COUNTDOWN_CONFIRM_SHIPMENT,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.countDownAction(this.interval), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countDownAction = (eventInterval) => {
    const { countDown } = this.state;
    const { endCountdown } = this.props;

    this.setState((state) => ({
      countDown: state.countDown - 1
    }));

    if (countDown === 1) {
      clearInterval(eventInterval);
      endCountdown();
    }
  }

  render() {
    const { endCountdown, titleShipment, languageCode } = this.props;
    const { countDown } = this.state;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={stylesInFile.container}>
        <ScrollView>
          <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
            <Text style={[styles.title, styles.flexOne, styles.mr20]}>
              {I18n.t('shipment.confirm.created', { locale: languageCode })}
            </Text>
            <IconCustomerService />
          </View>
          <View style={[styles.whiteBg, styles.paddingHorizontal20,
            styles.paddingVertical30, styles.mb30]}
          >
            <View style={styles.mb20}>
              <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
                {I18n.t('shipment.confirm.coming_soon', { locale: languageCode })}
              </Text>
            </View>
            <Text style={[styles.verifyNumber, styles.textCenter, styles.titleSize, styles.bold]}>
              {titleShipment}
            </Text>
          </View>
          <View style={[styles.mb20, styles.flex]}>
            <TouchableOpacity
              style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
              activeOpacity={0.9}
              onPress={() => {
                clearInterval(this.interval);
                endCountdown();
              }}
            >
              <Text style={[styles.formGroupButton, styles.flexOne, styles.mr20, styles.ml10]}>
                {I18n.t('shipment.confirm.view', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.mb30, styles.flexOne, styles.flex, styles.textCenter]}>
            <Text style={[styles.smallSize, styles.grayText]}>
              {I18n.t('shipment.confirm.close', { locale: languageCode })}
            </Text>
            {' '}
            <Text style={[styles.redText, styles.bold]}>{`${countDown}s`}</Text>
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  shipmentId: state.listing.shipmentId,
  shipmentDetail: state.listing.shipmentDetail,
  languageCode: state.app.languageCode,
  titleShipment: state.listing.titleShipment,
  configs: state.app.configs,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction },
    dispatch,
  ),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmShipment);

const stylesInFile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  pad20: {
    padding: 20,
  },
  mr20: {
    marginRight: 20,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
});
