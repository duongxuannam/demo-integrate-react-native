import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import I18n from '../../../config/locales';

import styles from '../style';
import IMAGE_CONSTANT from '../../../constants/images';
import URLImage from '../../common/Image';

class AdditionalServiceBid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listAdditionalService: []
    };
  }

  componentDidMount() {
    const { listItem } = this.props;
    if (listItem.length > 0) {
      this.getListAdditionalService(listItem);
    }
  }

  getDataResult = () => {
    const {
      agreeCount,
      totalService
    } = this.getCountAgreement();

    return {
      status: agreeCount >= totalService,
      // eslint-disable-next-line react/destructuring-assignment
      data: this.state.listAdditionalService,
    };
  };

  getCountAgreement = () => {
    const { listAdditionalService } = this.state;
    const totalService = listAdditionalService.length;
    const agreeCount = listAdditionalService.filter((item) => item.isAgreed !== null).length;
    return {
      agreeCount,
      totalService
    };
  }

  getListAdditionalService = (listItem) => {
    const { defaultAdditionalServices } = this.props;

    // Generate Additional Services String Id Data
    let listAdditionalServiceID = [];
    listItem.forEach((item) => {
      listAdditionalServiceID = _.union(listAdditionalServiceID, item.additionalServices);
    });

    const listAdditionalService = listAdditionalServiceID.map((id) => {
      const addServiceItem = defaultAdditionalServices.find((defaultAddService) => defaultAddService.id === id);
      return {
        ...addServiceItem,
        isAgreed: null
      } || null;
    });

    this.setState({ listAdditionalService: listAdditionalService || [] });
  }

  setItemAgreement = (isAgree, serviceId) => () => {
    const { listAdditionalService } = this.state;
    const newListAdditionalService = _.clone(listAdditionalService);
    const serviceItem = newListAdditionalService.find((s) => s.id === serviceId);
    if (serviceItem) {
      serviceItem.isAgreed = isAgree;
      this.setState({ listAdditionalService: [...newListAdditionalService] });
    }
  }

  renderItemService = () => {
    const { listAdditionalService } = this.state;
    return listAdditionalService.map((s) => (
      <View key={s.id} style={[s.isAgreed === null ? styles.additionalError : styles.additionalGreen, styles.paddingHorizontal20, styles.pt15, styles.pb15, styles.mb20, styles.flex, styles.Radius4, styles.alignItemsCenter]}>
        <View style={[styles.flexOne, styles.flex]}>
          <URLImage source={s.isAgreed ? s.iconUrlActive : s.iconUrl} style={{ marginTop: 5 }} sizeWidth={20} sizeHeight={20} />
          <View style={styles.ml15}>
            <Text style={[styles.defaultSize, styles.defaultTextColor]}>{s.name}</Text>
            <Text style={[styles.smallerSize, styles.grayText]}>{s.description}</Text>
          </View>
        </View>
        <View style={[styles.flex, styles.ml15]}>
          <TouchableOpacity
            style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, s.isAgreed ? styles.greenBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
            onPress={this.setItemAgreement(true, s.id)}
          >
            <Image source={s.isAgreed ? IMAGE_CONSTANT.checkMarkWhite : IMAGE_CONSTANT.checkMark} style={{ width: 25, height: 18 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, s.isAgreed === false ? styles.redBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
            onPress={this.setItemAgreement(false, s.id)}
          >
            <Image source={s.isAgreed === false ? IMAGE_CONSTANT.closeWhite : IMAGE_CONSTANT.close} style={{ width: 18, height: 18 }} />
          </TouchableOpacity>
        </View>
      </View>
    ));
  }

  render() {
    const { languageCode } = this.props;
    const {
      agreeCount,
      totalService
    } = this.getCountAgreement();

    return (
      <View style={[styles.whiteBg, styles.formLine, styles.paddingVertical20, styles.mb30]}>
        <View style={[styles.flex, styles.alignItemsCenter, styles.marginHorizontal20]}>
          <Text style={[styles.flexOne, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('bid.addServices', { locale: languageCode })}
          </Text>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            {agreeCount < totalService && <Image source={IMAGE_CONSTANT.errorIcon} />}
            <Text style={[styles.ml5, styles.defaultSize, totalService > 0 ? (agreeCount < totalService ? styles.redText : styles.mainColorText) : styles.grayText, styles.bold]}>
              {totalService > 0 ? `${agreeCount}/${totalService}` : `${I18n.t('bid.noServices', { locale: languageCode })}`}
            </Text>
          </View>
        </View>
        {totalService > 0 && (<View style={[styles.line, styles.marginHorizontal20, styles.mt15]} />)}
        <View style={[styles.marginHorizontal20, styles.mt20]}>
          {this.renderItemService()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  defaultAdditionalServices: state.shipment.defaultAdditionalServices,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {},
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(AdditionalServiceBid);
