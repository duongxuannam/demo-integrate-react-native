import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import _ from 'lodash';

import DatePicker from 'react-native-datepicker';
import I18n from '../../../config/locales';

import styles from '../style';
import IMAGE_CONSTANT from '../../../constants/images';
import URLImage from '../../common/Image';
import { formatDate, dateClientWithISOString, dateClientWithFormat } from '../../../helpers/date.helper';

const FORMAT_DATE = 'D-MMM';

class TransitTimeAndPrice extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listLocationServices: []
    };
  }

  componentDidMount() {
    const { listAddress } = this.props;
    this.getListLocationServices(listAddress);
  }

  getDataResult = () => {
    const {
      agreeCount,
      totalService
    } = this.getCountAgreement();

    return {
      status: agreeCount >= totalService,
      // eslint-disable-next-line react/destructuring-assignment
      data: this.state.listLocationServices,
    };
  }

  getListLocationServices = (listAddress) => {
    const { defaultLocationServices } = this.props;
    const listLocationServices = [];
    listAddress.forEach((item, index) => {
      const listLocationServiceItem = item.locationServices.map((id) => {
        const locationService = defaultLocationServices.find((l) => l.id === id);
        return {
          ...locationService,
          isAgreed: null
        } || null;
      });
      const newList = listLocationServiceItem.filter((e) => e !== null);
      listLocationServices.push({
        ...item,
        proposedDate: index === 0 ? item.pickupDate : item.earliestByDate,
        locationServices: [...newList]
      });
    });
    this.setState({ listLocationServices: (listLocationServices || []) });
  }

  onDateChange = (addressID) => (dateStr, pickupDate) => {
    const { listLocationServices } = this.state;
    const newListLocationService = _.clone(listLocationServices);
    const addressItem = newListLocationService.find((s) => s.id === addressID);
    if (addressItem) {
      addressItem.proposedDate = moment(pickupDate).local().toISOString();
      this.setState({ listLocationServices: [...newListLocationService] });
    }
  }

  setItemAgreement = (isAgree, addressId, serviceId) => () => {
    const { listLocationServices } = this.state;
    const newListLocationService = _.clone(listLocationServices);
    const addressItem = newListLocationService.find((s) => s.id === addressId);
    if (addressItem) {
      const servicesItem = addressItem.locationServices.find((l) => l.id === serviceId);
      servicesItem.isAgreed = isAgree;
      this.setState({ listLocationServices: [...newListLocationService] });
    }
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? 'DD-MMM' : 'DD-[Th]MM';
    }
    return 'DD-MMM';
  }

  getCountAgreement = () => {
    const { listLocationServices } = this.state;
    let totalService = 0;
    let agreeCount = 0;
    listLocationServices.forEach((item) => {
      if (item.locationServices.length > 0) {
        totalService += item.locationServices.length;
        const itemTotalAgreement = item.locationServices.filter((l) => l.isAgreed !== null).length;
        agreeCount += itemTotalAgreement;
      }
    });
    return {
      totalService,
      agreeCount
    };
  }

  renderItemService = () => {
    const { listLocationServices } = this.state;
    const { languageCode, countryCode } = this.props;
    console.log('LOCATION ITEM: ', listLocationServices);

    return listLocationServices.map((s, index) => {
      if (index === 0) {
        /* {Pickup} */
        return (
          <View key={s.id}>
            <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20]}>
              <View style={[styles.flex, styles.mb20]}>
                <View style={styles.relative}>
                  <Image source={IMAGE_CONSTANT.pinBlueCircle} />
                  <Text style={[styles.whiteText, styles.smallSize, styles.pin, styles.bold]}>
                    FR
                  </Text>
                </View>
                <View style={[styles.flexOne, styles.ml10, { marginTop: 6 }]}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {s.address || 'no address'}
                  </Text>
                  <Text style={[styles.defaultSize, styles.grayText]}>
                    {(s.locationServices.length === 0 && I18n.t('bid.noLocationServices', { locale: languageCode })) || `${s.locationServices.length} ${I18n.t('bid.numLocationServiceRequited', { locale: languageCode })}`}
                  </Text>
                  {s.locationServices.length > 0 && (
                    <View style={[styles.mt10, styles.Radius4, styles.formLineBg, styles.pad15]}>
                      <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                        {I18n.t('bid.locationServices', { locale: languageCode })}
                      </Text>
                      <View style={[styles.circleGrayBorder, styles.mt15, styles.mb15]} />
                      {s.locationServices.map((l) => (
                        <View key={l.id} style={[l.isAgreed === null ? styles.additionalError : styles.additionalGreen, styles.paddingHorizontal20, styles.pt15, styles.pb15, styles.mb20, styles.flex, styles.Radius4, styles.alignItemsCenter]}>
                          <View style={[styles.flexOne, styles.flex]}>
                            <URLImage source={l.isAgreed ? l.iconUrlActive : l.iconUrl} style={{ marginTop: 5 }} sizeWidth={20} sizeHeight={20} />
                            <View style={styles.ml15}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>{l.name}</Text>
                            </View>
                          </View>
                          <View style={[styles.flex, styles.ml15]}>
                            <TouchableOpacity
                              style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, l.isAgreed ? styles.greenBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                              onPress={this.setItemAgreement(true, s.id, l.id)}
                            >
                              <Image source={l.isAgreed ? IMAGE_CONSTANT.checkMarkWhite : IMAGE_CONSTANT.checkMark} style={{ width: 25, height: 18 }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, l.isAgreed === false ? styles.redBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                              onPress={this.setItemAgreement(false, s.id, l.id)}
                            >
                              <Image source={l.isAgreed === false ? IMAGE_CONSTANT.closeWhite : IMAGE_CONSTANT.close} style={{ width: 18, height: 18 }} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                  <View style={[styles.mt10, styles.mb20, styles.flex, styles.alignItemsCenter]}>
                    <Text style={[styles.smallSize, styles.defaultTextColor]}>
                      {I18n.t('bid.requested', { locale: languageCode })}
                    </Text>
                    <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>{dateClientWithFormat(s.pickupDate, this.getDateFormatByCountry(countryCode, languageCode))}</Text>
                  </View>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                    {I18n.t('bid.proposedDate', { locale: languageCode })}
                  </Text>
                  <View style={[styles.input, styles.whiteBg, styles.flex, styles.alignItemsCenter]}>
                    <View style={styles.mr10}>
                      <Image source={IMAGE_CONSTANT.calendarIcon} />
                    </View>
                    <DatePicker
                      mode="date"
                      format={this.getDateFormatByCountry(countryCode, languageCode)}
                      minDate={new Date(dateClientWithFormat(s.pickupDate))}
                      date={new Date(dateClientWithFormat(s.proposedDate))}
                      onDateChange={this.onDateChange(s.id)}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      androidMode="default"
                      showIcon={false}
                      style={{ flex: 1 }}
                      customStyles={{
                        dateInput: {
                          paddingLeft: 0,
                          marginLeft: 0,
                          borderWidth: 0,
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        },
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.lineSilver, styles.marginHorizontal20]} />
          </View>
        );
      }

      return (
        <View key={s.id}>
          {/* {Destination 1} */}
          <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20]}>
            <View style={[styles.flex, styles.mb20]}>
              <View style={styles.relative}>
                <Image source={IMAGE_CONSTANT.pinYellowCircle} />
                <Text style={[styles.defaultTextColor, styles.smallSize, styles.pin, styles.bold]}>
                  {index}
                </Text>
              </View>
              <View style={[styles.flexOne, styles.ml10, { marginTop: 6 }]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {s.address || 'no address'}
                </Text>
                <Text style={[styles.defaultSize, styles.grayText]}>
                  {(s.locationServices.length === 0 && I18n.t('bid.noLocationServices', { locale: languageCode })) || `${s.locationServices.length} ${I18n.t('bid.numLocationServiceRequited', { locale: languageCode })}`}
                </Text>
                {s.locationServices.length > 0 && (
                  <View style={[styles.mt10, styles.Radius4, styles.formLineBg, styles.pad15]}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                      {I18n.t('bid.locationServices', { locale: languageCode })}
                    </Text>
                    <View style={[styles.circleGrayBorder, styles.mt15, styles.mb15]} />
                    {s.locationServices.map((l) => (
                      <View key={l.id} style={[l.isAgreed === null ? styles.additionalError : styles.additionalGreen, styles.paddingHorizontal20, styles.pt15, styles.pb15, styles.mb20, styles.flex, styles.Radius4, styles.alignItemsCenter]}>
                        <View style={[styles.flexOne, styles.flex]}>
                          <URLImage source={l.isAgreed ? l.iconUrlActive : l.iconUrl} style={{ marginTop: 5 }} sizeWidth={20} sizeHeight={20} />
                          <View style={styles.ml15}>
                            <Text style={[styles.smallSize, styles.defaultTextColor]}>{l.name}</Text>
                          </View>
                        </View>
                        <View style={[styles.flex, styles.ml15]}>
                          <TouchableOpacity
                            style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, l.isAgreed ? styles.greenBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                            onPress={this.setItemAgreement(true, s.id, l.id)}
                          >
                            <Image source={l.isAgreed ? IMAGE_CONSTANT.checkMarkWhite : IMAGE_CONSTANT.checkMark} style={{ width: 25, height: 18 }} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.ml5, styles.w50, styles.h50, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, l.isAgreed === false ? styles.redBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                            onPress={this.setItemAgreement(false, s.id, l.id)}
                          >
                            <Image source={l.isAgreed === false ? IMAGE_CONSTANT.closeWhite : IMAGE_CONSTANT.close} style={{ width: 18, height: 18 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>

                )}
                <View style={[styles.mt10, styles.mb20, styles.flex, styles.alignItemsCenter]}>
                  <Text style={[styles.smallSize, styles.defaultTextColor]}>
                    {I18n.t('bid.requested', { locale: languageCode })}
                  </Text>
                  <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>{`${dateClientWithFormat(s.earliestByDate, this.getDateFormatByCountry(countryCode, languageCode))} ${I18n.t('bid.to', { locale: languageCode })} ${dateClientWithFormat(s.latestByDate, this.getDateFormatByCountry(countryCode, languageCode))}`}</Text>
                </View>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                  {I18n.t('bid.proposedDate', { locale: languageCode })}
                </Text>
                <View style={[styles.input, styles.whiteBg, styles.flex, styles.alignItemsCenter]}>
                  <View style={styles.mr10}>
                    <Image source={IMAGE_CONSTANT.calendarIcon} />
                  </View>
                  <DatePicker
                    mode="date"
                    minDate={new Date(dateClientWithFormat(s.earliestByDate))}
                    format={this.getDateFormatByCountry(countryCode, languageCode)}
                    date={new Date(dateClientWithFormat(s.proposedDate))}
                    onDateChange={this.onDateChange(s.id)}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    androidMode="default"
                    showIcon={false}
                    style={{ flex: 1 }}
                    customStyles={{
                      dateInput: {
                        paddingLeft: 0,
                        marginLeft: 0,
                        borderWidth: 0,
                        alignItems: 'flex-start',
                        textAlign: 'left',
                      },
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.lineSilver, styles.marginHorizontal20]} />
        </View>
      );
    });
  }

  render() {
    const { languageCode } = this.props;
    const {
      totalService,
      agreeCount
    } = this.getCountAgreement();

    return (
      <View style={[styles.whiteBg, styles.formLine, styles.paddingVertical20, styles.mb30]}>
        <View style={[styles.flex, styles.alignItemsCenter, styles.marginHorizontal20]}>
          <Text style={[styles.flexOne, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
            {I18n.t('bid.transTimeAndPrice', { locale: languageCode })}
          </Text>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            {agreeCount < totalService && <Image source={IMAGE_CONSTANT.errorIcon} />}
            <Text style={[styles.ml5, styles.defaultSize, agreeCount < totalService ? styles.redText : styles.mainColorText, styles.bold]}>
              {totalService > 0 && `${agreeCount}/${totalService}`}
            </Text>
          </View>
        </View>
        <View style={[styles.line, styles.marginHorizontal20, styles.mt15]} />
        {this.renderItemService()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  defaultLocationServices: state.shipment.defaultLocationServices
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
)(TransitTimeAndPrice);
