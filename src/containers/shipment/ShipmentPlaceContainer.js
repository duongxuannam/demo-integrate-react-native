import React, { Component, useCallback } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox, StyleProvider } from 'native-base';
import Place from '../../components/shipment/place/Place';
import I18n from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';
import URLImage from '../../components/common/Image';
import styles from '../style';
import { dateClientWithFormat } from '../../helpers/date.helper';
import { roundDecimalToMatch } from '../../helpers/shipment.helper';
import getTheme from '../../constants/theme/components';
import variables from '../../constants/theme/variables/commonColor';
import shipmentAction from '../../store/actions/shipmentAction';
import driverAction from '../../store/actions/driverAction';
import appActions from '../../store/actions/appAction';
import { formatMetricsWithCommas } from '../../helpers/regex';

const FORMAT_DATE = 'D-MMM';

class ShipmentPlaceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleShow: false,
      showHealthCheck: false,
      healthCheckData: null,
      languageCode: 'en',
      confirmPolicy: false,
    };

    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  openConfirmBid = () => this.setState({ isVisibleShow: true, showHealthCheck: false })

  callCreateQuote = () => {
    const { healthCheckData } = this.state;
    const { actions } = this.props;
    actions.createQuote(healthCheckData);
    this.setState({ isVisibleShow: false });
  }

  isConfirmPolicyChanged = () => {
    const { confirmPolicy } = this.state;
    this.setState({ confirmPolicy: !confirmPolicy });
  }

  handleHealthCheck = (healthCheckData, languageCode) => {
    const { actions, shipmentDetail } = this.props;
    actions.getTopLowestBid(shipmentDetail.id, healthCheckData.bidPrice);
    this.setState({
      showHealthCheck: true,
      healthCheckData,
      languageCode
    });
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? 'DD-MMM' : 'DD-[Th]MM';
    }
    return 'DD-MMM';
  }

  showHealthCheck = () => {
    const { healthCheckData, languageCode } = this.state;
    const { countryCode, topLowestBid } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
        <View
          style={[styles.whiteBg, {
            flex: 4,
          }]}
        >
          <ScrollView
            nestedScrollEnabled
          >
            <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
              <Text style={[styles.font19, styles.defaultTextColor, styles.bold]}>
                {I18n.t('bid.notFinishYet', { locale: languageCode })}
              </Text>
              <View style={[styles.mt20, styles.mb20]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                  {I18n.t('bid.healthCheckMessage', { locale: languageCode })}
                </Text>
              </View>
              {healthCheckData.additionalPlaceBidData !== null && (
                <View style={[styles.whiteBg, styles.mb30, {
                  paddingVertical: 20,
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(219, 219, 219, 1)',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(219, 219, 219, 1)',
                  zIndex: 1,
                }]}
                >
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Text style={[styles.flexOne, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                      {I18n.t('bid.addServices', { locale: languageCode })}
                    </Text>
                  </View>
                  <View style={[styles.line, styles.mt15]} />
                  <View style={[styles.mt20]}>
                    {healthCheckData.additionalPlaceBidData.map((a) => (
                      <View
                        key={a.id}
                        style={[{
                          backgroundColor: 'rgba(63, 174, 41, 0.05)',
                          borderWidth: 1,
                          borderColor: 'rgba(63, 174, 41, 1)',
                          paddingVertical: 15,
                          paddingHorizontal: 10
                        }, styles.mb20, styles.flex, styles.Radius4, styles.alignItemsCenter]}
                      >
                        <View style={[styles.flexOne, styles.flex]}>
                          <URLImage source={a.isAgreed ? a.iconUrlActive : a.iconUrl} style={{ marginTop: 5 }} sizeWidth={20} sizeHeight={20} />
                          <View style={{ marginLeft: 15 }}>
                            <Text style={[styles.defaultSize, styles.defaultTextColor]}>{a.name}</Text>
                            <Text style={[styles.smallerSize, styles.grayText]}>{a.description}</Text>
                          </View>
                        </View>
                        <View style={[styles.flex, { marginLeft: 15 }]}>
                          <View
                            style={[{
                              marginLeft: 15,
                              width: 50,
                              height: 50
                            }, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, a.isAgreed ? styles.greenBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                          >
                            <Image source={a.isAgreed ? IMAGE_CONSTANT.checkMarkWhite : IMAGE_CONSTANT.checkMark} style={{ width: 25, height: 18 }} />
                          </View>
                          <View
                            style={[{
                              marginLeft: 15,
                              width: 50,
                              height: 50
                            }, styles.Radius4, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, a.isAgreed === false ? styles.redBg : { borderWidth: 1, borderColor: 'rgba(161, 161, 161, 1)', backgroundColor: '#fff' }]}
                          >
                            <Image source={a.isAgreed === false ? IMAGE_CONSTANT.closeWhite : IMAGE_CONSTANT.close} style={{ width: 18, height: 18 }} />
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {healthCheckData.transitData !== null && healthCheckData.transitData.map((t, index) => {
                if (t === null) { return null; }
                let serviceSelected = '';
                if (t.locationServices.length === 0) {
                  serviceSelected = I18n.t('bid.noLocationServices', { locale: languageCode });
                } else {
                  serviceSelected = `${t.locationServices.length} ${I18n.t('bid.numLocationServiceRequited', { locale: languageCode })}`;
                }
                const proposedDate = moment(dateClientWithFormat(t.proposedDate, FORMAT_DATE), FORMAT_DATE);
                const earliestDate = (index > 0 && moment(dateClientWithFormat(t.earliestByDate, FORMAT_DATE), FORMAT_DATE)) || null;
                const latestDate = (index > 0 && moment(dateClientWithFormat(t.latestByDate, FORMAT_DATE), FORMAT_DATE)) || null;
                return (
                  <View key={t.id} style={[styles.mb20, styles.placeError, styles.Radius4, styles.pad20]}>
                    <View style={[styles.flex]}>
                      <View style={styles.relative}>
                        <Image source={index === 0 ? IMAGE_CONSTANT.pinBlueCircle : IMAGE_CONSTANT.pinYellowCircle} />
                        <Text style={[index === 0 ? styles.whiteText : styles.defaultTextColor, styles.bold, styles.smallSize, styles.pin]}>
                          {index === 0 ? 'FR' : String(index)}
                        </Text>
                      </View>
                      <View style={[styles.flexOne, styles.ml10]}>
                        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                          {t.address}
                        </Text>
                        <Text style={[styles.defaultSize, styles.grayText]}>
                          {serviceSelected}
                        </Text>
                        {index === 0 && t.pickupDate !== t.proposedDate && (
                          <View>
                            <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                                {I18n.t('bid.requested', { locale: languageCode })}
                              </Text>
                              <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>{dateClientWithFormat(t.pickupDate, this.getDateFormatByCountry(countryCode, languageCode))}</Text>
                            </View>
                            <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                                {I18n.t('bid.proposed', { locale: languageCode })}
                              </Text>
                              <Text style={[styles.smallSize, styles.redText, styles.ml10, styles.boxFilter, styles.boxFilterError, styles.boxFilterResetPadding, styles.bold]}>{dateClientWithFormat(t.proposedDate, this.getDateFormatByCountry(countryCode, languageCode))}</Text>
                            </View>
                          </View>
                        )}
                        {index > 0 && (proposedDate < earliestDate || proposedDate > latestDate) && (
                          <View>
                            <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                                {I18n.t('bid.requested', { locale: languageCode })}
                              </Text>
                              <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>{`${dateClientWithFormat(t.earliestByDate, this.getDateFormatByCountry(countryCode, languageCode))} ${I18n.t('bid.to', { locale: languageCode })} ${dateClientWithFormat(t.latestByDate, this.getDateFormatByCountry(countryCode, languageCode))}`}</Text>
                            </View>
                            <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                                {I18n.t('bid.proposed', { locale: languageCode })}
                              </Text>
                              <Text style={[styles.smallSize, styles.redText, styles.ml10, styles.boxFilter, styles.boxFilterError, styles.boxFilterResetPadding, styles.bold]}>{dateClientWithFormat(t.proposedDate, this.getDateFormatByCountry(countryCode, languageCode))}</Text>
                            </View>
                          </View>
                        )}
                        {
                          t.locationServices.filter((l) => l.isAgreed === true).length < t.locationServices.length && t.locationServices.map((l) => (
                            <View key={l.id} style={[styles.flex, styles.mt10]}>
                              <View style={[{ width: 22, height: 18 }, styles.mr10, styles.Radius2, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, l.isAgreed ? styles.greenBg : styles.redBg]}>
                                <Image source={l.isAgreed ? IMAGE_CONSTANT.checkMarkWhite : IMAGE_CONSTANT.closeWhite} style={{ width: 14, height: 10 }} />
                              </View>
                              <Text style={[styles.font14, styles.defaultTextColor]}>
                                {l.name}
                              </Text>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                  </View>
                );
              })}
              <View style={[styles.silverBg, styles.Radius4, styles.pad20]}>
                <View style={[styles.flex]}>
                  <View style={styles.relative}>
                    {(healthCheckData.bidPrice > (healthCheckData.targetPrice * 1.1) || healthCheckData.bidPrice < (healthCheckData.targetPrice * 0.9)) && (<Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 24, height: 24 }} />)}
                  </View>
                  <View style={[styles.flexOne, styles.ml10]}>
                    {
                      healthCheckData.bidPrice > healthCheckData.targetPrice * 1.1 && (
                        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                          {String(I18n.t('bid.warningBidHigher', { locale: languageCode })).replace('[value]', roundDecimalToMatch(Math.abs(100 - ((healthCheckData.bidPrice / healthCheckData.targetPrice) * 100)), 0))}
                        </Text>
                      )
                    }
                    {
                      healthCheckData.bidPrice < healthCheckData.targetPrice * 0.9 && (
                        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                          {String(I18n.t('bid.warningBidHigher', { locale: languageCode })).replace('[value]', roundDecimalToMatch(Math.abs(100 - ((healthCheckData.bidPrice / healthCheckData.targetPrice) * 100)), 0))}
                        </Text>
                      )
                    }
                    {
                      healthCheckData.bidPrice <= (healthCheckData.targetPrice * 1.1) && healthCheckData.bidPrice >= (healthCheckData.targetPrice * 0.9) && (
                        <Text style={[styles.defaultSize, styles.mainColorText, styles.bold]}>
                          {String(I18n.t('bid.fairBidMessage', { locale: languageCode })).replace('[value]', topLowestBid + 1)}
                        </Text>
                      )
                    }
                    <Text style={[styles.font23, styles.bold]}>
                      <Text style={[styles.font16, styles.defaultTextColor, styles.mt10]}>{healthCheckData.customerCurrency}</Text>
                      {' '}
                      {formatMetricsWithCommas(healthCheckData.bidPrice)}
                    </Text>
                    {
                      healthCheckData.isShipmentBP && (
                        <View style={[styles.flex, styles.alignItemsCenter, styles.mt10]}>
                          <Image source={IMAGE_CONSTANT.bpAccount} style={{ width: 22, height: 15 }} />
                          <Text style={[styles.font14, styles.defaultTextColor, styles.ml10]}>
                            {I18n.t('bid.bp', { locale: languageCode })}
                          </Text>
                        </View>
                      )
                    }
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.line} />
            <View style={[styles.pad15, styles.flex, styles.alignItemsCenter]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ showHealthCheck: false })}
                style={[styles.flexOne, { marginRight: 7 }]}
              >
                <Text style={[styles.formGroupButton, styles.buttonGreenBorder]}>
                  {I18n.t('bid.editBid', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.openConfirmBid}
                style={[styles.flexOne, { marginLeft: 7 }]}
              >
                <Text style={[styles.formGroupButton]}>
                  {I18n.t('bid.continue', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  showConfirmBid = () => {
    console.log('CONFIRM BID');
    const { languageCode, healthCheckData, confirmPolicy } = this.state;
    const { countryCode, dataConfig } = this.props;
    const credit = 3000;
    const driverCredit = 4000;
    let newTransitData = null;
    if ((healthCheckData.transitData)) {
      console.log('CONFIRM BID 1');
      newTransitData = healthCheckData.listAddress.map((addressItem) => {
        const updatedItem = healthCheckData.transitData.find((t) => t && t.id === addressItem.id);
        return updatedItem ? { ...updatedItem } : { ...addressItem };
      });
    } else {
      console.log('CONFIRM BID 2');
      newTransitData = [...healthCheckData.listAddress];
    }

    console.log('NEW TRANSIST DATA: ', newTransitData);

    const stringDateFormat = this.getDateFormatByCountry(countryCode, languageCode);
    
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
        <View
          style={[styles.whiteBg, {
            flex: 4,
          }]}
        >
          <ScrollView
            nestedScrollEnabled
          >
            <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
              <Text style={[styles.font19, styles.defaultTextColor, styles.bold]}>
                {I18n.t('bid.confirmBidTitle', { locale: languageCode })}
              </Text>
              <View style={[styles.mt20, styles.mb20]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                  {healthCheckData.shipmentTitle}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {`${healthCheckData.totalUnits} ${healthCheckData.totalUnits > 1 ? I18n.t('bid.units', { locale: languageCode }) : I18n.t('bid.unit', { locale: languageCode })} • ${roundDecimalToMatch(healthCheckData.totalWeight, 1)} ${healthCheckData.totalWeight > 1 ? 'kgs' : 'kg'}`}
                </Text>
              </View>
              <View style={[styles.silverBg, styles.Radius4, styles.paddingVertical15, styles.paddingHorizontal20]}>
                <Text style={[styles.font23, styles.textCenter, styles.bold]}>
                  <Text style={[styles.smallSize, styles.defaultTextColor]}>{healthCheckData.customerCurrency}</Text>
                  {' '}
                  {formatMetricsWithCommas(healthCheckData.bidPrice)}
                </Text>
                {
                  healthCheckData.isShipmentBP && (
                    <View style={[styles.mt10, styles.flex, styles.justifyContentCenter, styles.alignItemsCenter]}>
                      <Image source={IMAGE_CONSTANT.bpAccount} style={{ width: 22, height: 15 }} />
                      <Text style={[styles.ml10, styles.bold, styles.defaultSize, styles.defaultTextColor]}>
                        {I18n.t('bid.bp', { locale: languageCode })}
                      </Text>
                    </View>
                  )
                }
              </View>
              <View style={[styles.mt20, styles.mb20]}>
                <View style={[styles.linePin, {
                  zIndex: 1,
                  left: 19,
                  top: 10,
                  bottom: 75
                }]}
                />
                <View style={{ zIndex: 2 }}>
                  {
                    newTransitData.map((item, index) => {
                      let pickupLabelIcon = index;
                      let pickupDateValue = null;
                      let pickupEarliestValue = null;
                      let pickupLatestValue = null;
                      console.log('ITEM: ', item);
                      if (index === 0) {
                        pickupLabelIcon = 'FR';
                        pickupDateValue = item.proposedDate || item.pickupDate;
                      }

                      if (newTransitData.length === 2 && index === 1) {
                        pickupLabelIcon = 'TO';
                      }

                      if (index > 0) {
                        const proposedDate = new Date(dateClientWithFormat(item.proposedDate || item.earliestByDate));
                        const earliestDate = new Date(dateClientWithFormat(item.earliestByDate));
                        const latestDate = new Date(dateClientWithFormat(item.latestByDate));
                        pickupEarliestValue = proposedDate < earliestDate ? item.proposedDate : item.earliestByDate;
                        pickupLatestValue = proposedDate > latestDate ? item.proposedDate : item.latestByDate;
                      }

                      return (
                        <View key={item.id} style={[styles.flex, styles.mb20]}>
                          <View style={styles.relative}>
                            <Image source={index === 0 ? IMAGE_CONSTANT.pinBlueCircle : IMAGE_CONSTANT.pinYellowCircle} />
                            <Text style={[styles.whiteText, styles.bold, styles.smallSize, styles.pin]}>
                              {pickupLabelIcon}
                            </Text>
                          </View>
                          <View style={[styles.flexOne, styles.ml10]}>
                            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                              {item.address}
                            </Text>
                            <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                              {(item.locationServices.length > 0 && `${`${item.locationServices.length}`} ${I18n.t('bid.numLocationServiceRequited', { locale: languageCode })}`) || I18n.t('bid.noLocationServices', { locale: languageCode })}
                            </Text>
                            <View style={[styles.mt10, styles.mb20, styles.flex, styles.alignItemsCenter]}>
                              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                                {I18n.t('shipment.detail.pickup_on', { locale: languageCode })}
                              </Text>
                              <Text style={[styles.smallSize, styles.defaultTextColor, styles.ml10, styles.boxFilter, styles.boxFilterResetPadding, styles.bold]}>{index === 0 ? dateClientWithFormat(pickupDateValue, stringDateFormat) : `${dateClientWithFormat(pickupEarliestValue, stringDateFormat)} ${I18n.t('bid.to', { locale: languageCode })} ${dateClientWithFormat(pickupLatestValue, stringDateFormat)}`}</Text>
                            </View>
                          </View>
                        </View>
                      );
                    })
                  }
                </View>
              </View>
              <View style={styles.line} />
              <View style={[styles.mt30, styles.mb10, styles.flex]}>
                <StyleProvider style={getTheme(variables)}>
                  <CheckBox checked={confirmPolicy} color="#3fae29" selectedColor="#3fae29" onPress={this.isConfirmPolicyChanged} />
                </StyleProvider>
                <Text style={[styles.defaultSize, styles.marginHorizontal20, confirmPolicy ? styles.defaultTextColor : styles.errorText]}>
                  {I18n.t('bid.confirm.text', { locale: languageCode })}
                </Text>
              </View>
              <Text style={[styles.flexOne, styles.flex, styles.pr20, { marginLeft: 38 }]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                  {`${I18n.t('bid.bidConfirmLabel1', { locale: languageCode })} `}
                </Text>
                <Text
                  style={[styles.mainColorText, styles.defaultSize, styles.bold]}
                  onPress={()=> Linking.openURL(dataConfig.CancellationPolicyURL)}
                >
                  {`${I18n.t('bid.bidConfirmLabel2', { locale: languageCode })} `}
                </Text>
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                  {`${I18n.t('bid.bidConfirmLabel3', { locale: languageCode })} `}
                </Text>
                <Text
                  style={[styles.mainColorText, styles.defaultSize, styles.bold]}
                  onPress={()=> Linking.openURL(dataConfig.TermConditionsURL)}
                >
                  {`${I18n.t('bid.termsAndConditions', { locale: languageCode })} `}
                </Text>
                {
                languageCode === 'vi' && (
                <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                  {`${I18n.t('bid.ownDeliveree', { locale: languageCode })} `}
                </Text>
                )
                }
              </Text>
              <View style={[styles.formLine, { marginVertical: 30 }]}>
                {
                  (driverCredit >= credit && confirmPolicy && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, styles.darkGreenBg, styles.h60, styles.Radius4]}
                      onPress={this.callCreateQuote}
                    >
                      <Text style={[styles.font20, styles.whiteText, styles.textCenter, styles.bold]}>
                        {I18n.t('bid.confirmBid', { locale: languageCode })}
                      </Text>
                      <View style={[styles.ml10, styles.mr5]}>
                        <Image source={IMAGE_CONSTANT.box} />
                      </View>
                      <Text style={[styles.font20, styles.whiteText, styles.textCenter, styles.bold]}>
                        {credit}
                      </Text>
                    </TouchableOpacity>
                  )) || (
                    <View
                      activeOpacity={0.9}
                      style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter, { backgroundColor: 'rgba(51, 115, 25, 0.5)' }, styles.h60, styles.Radius4]}
                    >
                      <Text style={[styles.font20, styles.whiteText, styles.textCenter, styles.bold]}>
                        {I18n.t('bid.confirmBid', { locale: languageCode })}
                      </Text>
                      <View style={[styles.ml10, styles.mr5]}>
                        <Image source={IMAGE_CONSTANT.box} />
                      </View>
                      <Text style={[styles.font20, styles.whiteText, styles.textCenter, styles.bold]}>
                        {credit}
                      </Text>
                    </View>
                  )
                }
              </View>
              {
                driverCredit < credit && (
                  <View style={[styles.mb20, styles.placeError, styles.Radius4, { paddingVertical: 15, paddingHorizontal: 20 }]}>
                    <Text style={[styles.flexOne, styles.flex, styles.textCenter]}>
                      <Text style={[styles.defaultSize, styles.errorText]}>
                        {`${I18n.t('bid.errorCredit', { locale: languageCode })}. `}
                      </Text>
                      <Text
                        style={[styles.mainColorText, styles.defaultSize, styles.bold]}
                      >
                        {`${I18n.t('bid.tapHere', { locale: languageCode })} `}
                      </Text>
                      <Text style={[styles.defaultSize, styles.errorText]}>
                        {`${I18n.t('bid.toLearnMore', { locale: languageCode })}.`}
                      </Text>
                    </Text>
                  </View>
                )
              }
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.setState({ isVisibleShow: false, confirmPolicy: false })}
              >
                <Text style={[styles.defaultSize, styles.mainColorText, styles.textCenter, styles.mb10, styles.bold]}>
                  {I18n.t('bid.back', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>

    );
  }

  gotoBack = (isBack) => () => {
    if (isBack) {
      const { navigation, actions } = this.props;
      actions.clearError();
      navigation.goBack();
    } else {
      const { actions } = this.props;
      actions.clearError();
    }
  }

  showErrorMessage = (error, languageCode) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: '80%', paddingHorizontal: 10, paddingBottom: 10, backgroundColor: 'rgba(81, 175, 43, 1)', borderRadius: 5
      }}
      >
        <View style={[styles.flex, styles.alignItemsCenter, { padding: 10 }]}>
          <Text style={[styles.title, styles.flexOne, styles.whiteText, styles.bold]}>
            {I18n.t('bid.error', { locale: languageCode })}
          </Text>
        </View>
        <View style={[styles.whiteBg]}>
          <View style={[styles.whiteBg, styles.paddingHorizontal20, { paddingVertical: 20 }, styles.mb10]}>
            <Text style={[
              styles.textCenter,
              {
                backgroundColor: 'rgba(255, 205, 0, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 205, 0, 1)',
                paddingHorizontal: 10,
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
                borderRadius: 5,
                color: 'red',
                paddingVertical: 10,
              },
              styles.defaultSize
            ]}
            >
              {error && error.error}
            </Text>
          </View>
          <View style={[styles.mb20, styles.flex]}>
            <TouchableOpacity
              style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
              activeOpacity={0.9}
              onPress={this.gotoBack(error && error.isGoBack)}
            >
              <Text style={[styles.formGroupButton, styles.flexOne, styles.mr20, styles.ml20]}>
                {I18n.t('shipment.detail.warning.okay', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )

  navigateToScreen(route) {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    navigation.dispatch(navigateAction);
  }

  render() {
    const { isVisibleShow, showHealthCheck, healthCheckData } = this.state;
    const { error, languageCode } = this.props;
    const isShow = !!error;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView nestedScrollEnabled>
          <Place healthCheck={this.handleHealthCheck} />
        </KeyboardAwareScrollView>

        {/* {Modal Confirm} */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleShow}
          onRequestClose={() => this.setState({ isVisibleShow: false })}
        >
          {healthCheckData && isVisibleShow && this.showConfirmBid()}
        </Modal>

        {/* {Modal Health Check} */}
        <Modal
          animationType="slide"
          transparent
          visible={showHealthCheck}
          onRequestClose={() => this.setState({ showHealthCheck: false })}
        >
          {healthCheckData && showHealthCheck && this.showHealthCheck()}
        </Modal>

        <Modal
          animationType="slide"
          transparent
          visible={isShow}
          onRequestClose={() => this.setState({ showHealthCheck: false })}
        >
          {this.showErrorMessage(error, languageCode)}
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  error: state.app.errorMessage,
  dataConfig: state.config.dataConfig,
  shipmentDetail: state.shipment.shipmentDetail,
  topLowestBid: state.driver.topLowestBid,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      createQuote: shipmentAction.createQuote,
      clearError: appActions.clearError,
      getTopLowestBid: driverAction.getTopLowestBid
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentPlaceContainer);
