import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { CheckBox } from 'native-base';
import IconCustomerService from '../../common/CustomerService';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';

export default class FormDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonsSelected: [],
      isValid: false,
      isSubmit: false,
    };
  }

  onCheckBoxPress = (id) => {
    const { reasonsSelected } = this.state;
    const tmp = reasonsSelected;

    if (tmp.includes(id)) {
      tmp.splice(tmp.indexOf(id), 1);
    } else {
      tmp.push(id);
    }
    this.setState({
      reasonsSelected: tmp,
      isValid: tmp.length > 0
    });
  }

  checkSelectedReason = () => {
    const { reasonsSelected } = this.state;
    this.setState({
      isValid: reasonsSelected.length > 0,
    });
    return reasonsSelected.length > 0;
  }

  handleDelete = (isSave) => {
    const { reasonsSelected } = this.state;
    const { deleteShipment } = this.props;
    this.setState({
      isSubmit: true,
    });
    const isValid = this.checkSelectedReason();
    if (isValid) {
      deleteShipment(true, isSave, reasonsSelected);
    }
  }

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  renderConfirm = () => {
    const {
      shipmentDetail, back, deleteShipment, languageCode
    } = this.props;
    return (
      <>
        <View style={[styles.whiteBg,
          styles.paddingHorizontal20,
          styles.paddingVertical30,
          styles.mb30]}
        >
          <View style={styles.mb20}>
            <Text style={[styles.verifyText, styles.textCenter, styles.defaultSize]}>
              {I18N.t('shipment.delete.confirm.title', { locale: languageCode })}
            </Text>
          </View>
          <Text style={[styles.verifyNumber, styles.textCenter, styles.titleSize, styles.bold]}>
            {shipmentDetail.title}
          </Text>
        </View>
        <View style={[styles.mb20, styles.flex]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => back()}
          >
            <Text style={[styles.formGroupButton,
              styles.buttonGreenBorder,
              styles.flexOne,
              styles.ml20,
              styles.mr10]}
            >
              {I18N.t('shipment.delete.confirm.back', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={() => deleteShipment(false, false)}
          >
            <Text style={[styles.formGroupButton, styles.redBg, styles.flexOne, styles.mr20, styles.ml10]}>
              {I18N.t('shipment.delete.confirm.delete', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.mb20, styles.pl20, styles.pr20]}>
          <Text style={[styles.grayText, styles.textCenter, styles.flexWrapper]}>
            {I18N.t('shipment.delete.confirm.hint', { locale: languageCode })}
          </Text>
        </View>
      </>
    );
  }

  renderListConfirm = () => {
    const {
      back, languageCode, deleteReasons, configs,
    } = this.props;
    const { reasonsSelected, isValid, isSubmit } = this.state;
    return (
      <ScrollView nestedScrollEnabled>
        <View style={[styles.whiteBg,
          styles.paddingHorizontal20,
          styles.paddingVertical30,
          styles.mb30]}
        >
          <View style={[styles.pad15, styles.lightSilver, styles.Radius4]}>
            <View style={[styles.mb15, styles.flex, styles.alignItemsCenter]}>
              <Image source={IMAGE_CONSTANT.csBanner} style={{ width: 72, height: 72 }} />
              <View style={[styles.flexOne, styles.ml15]}>
                <Text style={[styles.smallerSize, styles.grayText]}>
                  {I18N.t('shipment.delete.delete_reason.support', { locale: languageCode })}
                </Text>
              </View>
            </View>
            <IconCustomerService
              title={I18N.t('shipment.delete.delete_reason.live_chat', { locale: languageCode })}
              activeOpacity={0.9}
              styleTitle={[styles.formGroupButton, styles.mainBg]}
            />
          </View>
          <View style={styles.mt15}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, (isSubmit && !isValid) && styles.redText, styles.bold]}>
              {(isSubmit && !isValid) && <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 15, height: 15 }} />}
              {I18N.t('shipment.delete.delete_reason.title', { locale: languageCode })}
            </Text>
            <View style={[styles.mt10, styles.mb20]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {I18N.t('shipment.delete.delete_reason.selections', { locale: languageCode })}
              </Text>
            </View>
            {deleteReasons.map((item) => (
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb20]} key={item.id}>
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <TouchableOpacity
                    style={[styles.flex, styles.alignItemsCenter]}
                    onPress={() => this.onCheckBoxPress(item.id)}
                  >
                    <CheckBox
                      checked={!!reasonsSelected.includes(item.id)}
                      color={(isSubmit && !isValid) ? 'red' : '#3fae29'}
                      selectedColor="#3fae29"
                      onPress={() => this.onCheckBoxPress(item.id)}
                    />
                    <Text style={[styles.defaultSize, styles.ml20]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mb20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => back()}
          >
            <Text style={[styles.formGroupButton,
              styles.buttonGreenBorder,
              styles.ml20,
              styles.mr20]}
            >
              {I18N.t('shipment.delete.delete_reason.back', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mb20}>
          <View style={[styles.formGroupButton, styles.flex, styles.alignItemsCenter, styles.redBg, styles.mr20, styles.ml20, styles.h60]}>
            <View style={styles.flexOne}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.handleDelete(true)}
              >
                <Text style={[styles.titleSize,
                  styles.whiteText, styles.textCenter]}
                >
                  {I18N.t('shipment.delete.delete_reason.save_and_delete', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.circleOr, styles.alignItemsCenter, styles.justifyContentCenter, styles.relative]}>
              <View style={[styles.circleOrLine, styles.h60]} />
              <Text style={[styles.circleOrText, styles.textCenter, styles.smallSize, styles.defaultTextColor, {
                width: languageCode === 'vi' ? 40 : 24,
                height: 24,
              }]}
              >
                {I18N.t('shipment.delete.delete_reason.or', { locale: languageCode })}
              </Text>
            </View>
            <View style={styles.flexOne}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.handleDelete(false)}
              >
                <Text style={[styles.titleSize,
                  styles.whiteText, styles.textCenter]}
                >
                  {I18N.t('shipment.delete.delete_reason.delete_now', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.mb20, styles.pl20, styles.pr20]}>
          <Text style={[styles.grayText, styles.textCenter, styles.flexWrapper]}>
            {I18N.t('shipment.delete.delete_reason.cancelling_agree', { locale: languageCode })}
            <Text
              style={[styles.mainColorText, styles.smallSize, styles.bold]}
              onPress={() => this.openWebBrowser(configs.TermConditionsURL)}
            >
              &nbsp;
              {I18N.t('shipment.delete.delete_reason.cancelling_policy', { locale: languageCode })}
            </Text>
          </Text>
        </View>
      </ScrollView>
    );
  }

  render() {
    const { shipmentDetail, isBooked, languageCode } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.alignItemsCenter, styles.pad20]}>
          <Text style={[styles.title, styles.flexOne, styles.mr20]}>
            {I18N.t('shipment.delete.heading', { locale: languageCode })}
          </Text>
          <IconCustomerService />
        </View>
        {isBooked ? this.renderListConfirm() : this.renderConfirm()}
      </>
    );
  }
}
