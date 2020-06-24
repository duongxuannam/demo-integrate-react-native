import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import styles from './style';
import { moderateScale } from '../../helpers/scaling.helpers';
import { CompletedSvg } from '../common/Svg';

import {
  roundDecimalToMatch,
  getDateString,
  getExpiredString,
  roundToMatch
} from '../../helpers/shipment.helper';
import { getFormatDate } from '../../helpers/date.helper';

import { formatMetricsWithCommas } from '../../helpers/regex';
import driverAction from '../../store/actions/driverAction';
import chatAction from '../../store/actions/chatAction';
import shipmentAction from '../../store/actions/shipmentAction';
import APP_CONSTANT, {
  SHIPMENT_STATUS,
  PICK_STATUS,
} from '../../helpers/constant.helper';
import {PROGRESS_TYPE} from '../../constants/app';
import progressActions from '../../store/actions/progressAction';


class ShipmentItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      linePinHeight: 0,
    };
  }

  callPinItem = () => {
    const { actions, data } = this.props;
    actions.pinShipment(data.id, data.isPin);
  };

  callExpandItem = () => {
    const { actions, data } = this.props;
    actions.selectShipment(data.id);
  };

  renderLowerPrice = (data, languageCode) => (data.totalQuotes > 0 ? (
    <View style={[styles.flex, styles.mb10]}>
      <View style={[styles.mr15, styles.w80]}>
        <Text style={[styles.smallSize, styles.grayText]}>
          {I18n.t('shipment.lowest', { locale: languageCode })}
        </Text>
      </View>
      <View>
        <Text
          style={[styles.smallSize, styles.defaultTextColor, styles.medium]}
        >
          {`${data.customerCurrency} ${formatMetricsWithCommas(
            data.lowestBid,
          )} • ${data.totalQuotes} ${
            data.totalQuotes > 1
              ? I18n.t('shipment.items.quotes', { locale: languageCode })
              : I18n.t('shipment.items.quote', { locale: languageCode })
          }`}
        </Text>
      </View>
    </View>
  ) : (
    <View style={[styles.flex, styles.mb10]}>
      <View style={[styles.flex, styles.alignItemsCenter]}>
        <Image
          style={{ width: 15, height: 15, marginRight: 5 }}
          source={IMAGE_CONSTANT.handLike}
          resizeMethod="auto"
        />
        <Text
          style={[styles.smallSize, styles.defaultTextColor, styles.medium]}
        >
          {I18n.t('shipment.beFirstBid', { locale: languageCode })}
        </Text>
      </View>
    </View>
  ));

  renderSizeText = (items, languageCode) => {
    if (items && items.length > 1) {
      return (
        <Text
          style={[
            styles.smallSize,
            styles.mainColorText,
            styles.medium,
            { textDecorationLine: 'underline' },
          ]}
          onPress={this.handleViewDetail(true)}
        >
          {I18n.t('shipment.multipleSize', { locale: languageCode })}
        </Text>
      );
    }

    if (items && items.length === 1) {
      const lengthSize = `${I18n.t('shipment.lengthSt', {
        locale: languageCode,
      })}${roundToMatch(items[0].length, 0)}`;
      const widthSize = `${I18n.t('shipment.widthSt', {
        locale: languageCode,
      })}${roundToMatch(items[0].width, 0)}`;
      const heightSize = `${I18n.t('shipment.heightSt', {
        locale: languageCode,
      })}${roundToMatch(items[0].height, 0)}`;
      const textSize = `${lengthSize}, ${widthSize}, ${heightSize} cm`;
      return (
        <Text
          style={[styles.smallSize, styles.defaultTextColor, styles.bold]}
          numberOfLines={2}
        >
          {textSize}
        </Text>
      );
    }

    return null;
  };

  getLocationType = (locationTypeID) => {
    const { defaultLocationTypes } = this.props;
    if (
      Array.isArray(defaultLocationTypes)
      && defaultLocationTypes.length > 0
    ) {
      const locationType = defaultLocationTypes.find(
        (l) => l.locationServiceId === locationTypeID,
      );
      return (locationType && locationType.name) || locationTypeID;
    }
    return locationTypeID;
  };

  getItemView = (event) => {
    const { height } = event.nativeEvent.layout;
    this.setState({ linePinHeight: height + 20 });
  };

  handleViewDetail = (isMultipleSize = false) => () => {
    const { actions, data } = this.props;
    actions.viewDetail(data.id, isMultipleSize);
    actions.setQuoteDetail(data.id);
  };

  renderExpandView = (data, countryCode, languageCode) => {
    const { linePinHeight } = this.state;
    const listingEnd = data.changedStatusDate
      && getExpiredString(
        data.changedStatusDate,
        countryCode,
        languageCode,
        getFormatDate(countryCode, languageCode)
      );
    return (
      <View
        style={[
          styles.formLine,
          styles.formLineBg,
          styles.paddingHorizontal20,
          styles.pb20,
          { borderTopColor: '#F5F5F5' },
        ]}>
        <View style={[styles.lineSilver, { height: 1.5 }]} />
        <View style={[styles.relative, styles.mt20]}>
          <View
            style={[
              styles.linePin,
              {
                zIndex: 1,
                left: 19,
                top: 10,
                height: linePinHeight,
              },
            ]}
          />
          <View style={{zIndex: 2}}>
            <View
              style={[styles.flex, styles.mb20]}
              onLayout={this.getItemView}>
              <View style={styles.relative}>
                <Image source={IMAGE_CONSTANT.pinBlueCircle} />
                <Text
                  style={[
                    styles.whiteText,
                    styles.smallSize,
                    styles.bold,
                    styles.pin,
                  ]}>
                  FR
                </Text>
              </View>
              <View style={[styles.flexOne, styles.ml10]}>
                <Text
                  style={[
                    styles.smallSize,
                    styles.defaultTextColor,
                    styles.medium,
                  ]}
                  numberOfLines={2}>
                  {data.addresses.pickup &&
                    (data.addresses.pickup.shortAddress ||
                      data.addresses.pickup.address)}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {data.addresses.pickup &&
                    getDateString(
                      data.addresses.pickup.pickupDate,
                      countryCode,
                      languageCode,
                    )}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {data.addresses.pickup &&
                    this.getLocationType(
                      data.addresses.pickup.locationTypeId,
                    )}
                </Text>
              </View>
            </View>
            <View style={[styles.flex, styles.mb20]}>
              <View style={styles.relative}>
                <Image source={IMAGE_CONSTANT.pinYellowCircle} />
                <Text
                  style={[
                    styles.defaultTextColor,
                    styles.smallSize,
                    styles.bold,
                    styles.pin,
                  ]}>
                  TO
                </Text>
              </View>
              <View style={[styles.flexOne, styles.ml10]}>
                <Text
                  style={[
                    styles.smallSize,
                    styles.defaultTextColor,
                    styles.medium,
                  ]}>
                  {data.addresses.pickup &&
                    (data.addresses.lastDestination.shortAddress ||
                      data.addresses.lastDestination.address)}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {`${getDateString(
                    data.addresses.lastDestination.earliestByDate,
                    countryCode,
                    languageCode,
                  )} ${I18n.t('bid.to', {
                    locale: languageCode,
                  })} ${getDateString(
                    data.addresses.lastDestination.latestByDate,
                    countryCode,
                    languageCode,
                  )}`}
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor]}>
                  {this.getLocationType(
                    data.addresses.lastDestination.locationTypeId,
                  )}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.lineSilver} />
        </View>
        <View style={[styles.mt20, styles.mb20]}>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.summary.listing_id', {
                  locale: languageCode,
                })}`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {`DL-LTL-${data.code}`}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.listingStarted', {
                  locale: languageCode,
                })}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {data.changedStatusDate &&
                  getDateString(
                    data.changedStatusDate,
                    countryCode,
                    languageCode,
                    getFormatDate(countryCode, languageCode)
                  )}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.listingEnd', {
                  locale: languageCode,
                })}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {listingEnd}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.photos', {locale: languageCode})}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {data.photos && data.photos.length}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.quotes', {locale: languageCode})}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {data.totalQuotes}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.detail.items', {
                  locale: languageCode,
                })}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {(data.items && data.items.length) || 0}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.weight', {locale: languageCode})}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.medium,
                ]}>
                {roundDecimalToMatch(data.totalWeight, 1)}
              </Text>
            </View>
          </View>
          <View style={[styles.flex]}>
            <View style={[styles.mr15, styles.w110]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.size', {locale: languageCode})}:`}
              </Text>
            </View>
            <View style={{width: '60%'}}>
              {this.renderSizeText(data.items, languageCode)}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
          activeOpacity={0.9}
          onPress={this.handleViewDetail(false)}>
          <Text
            style={[styles.formGroupButton, styles.flexOne, styles.mr10]}>
            {I18n.t('shipment.detail.view_detail', {locale: languageCode})}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  loadPrice = (price, currency) => {
    const formatPrice = roundDecimalToMatch(price, 2);
    return `${currency} ${formatMetricsWithCommas(formatPrice)}`;
  };

  showProgressIcon = (shipmentStatus, pickupStatus) => {
    if (
      shipmentStatus === SHIPMENT_STATUS.IN_PROGRESS
      && pickupStatus === PICK_STATUS.COMPLETED
    ) {
      return (
        <Image
          source={IMAGE_CONSTANT.hourglassIcon}
          style={{ width: 26, height: 26 }}
          resizeMode="contain"
        />
      );
    }
    if (
      shipmentStatus === SHIPMENT_STATUS.BOOKED
      || shipmentStatus === SHIPMENT_STATUS.IN_PROGRESS
    ) {
      return (
        <Image
          source={IMAGE_CONSTANT.hourIcon}
          style={{ width: 26, height: 26 }}
          resizeMode="contain"
        />
      );
    }
    if (shipmentStatus === SHIPMENT_STATUS.COMPLETED) {
      return <CompletedSvg width={26} height={26} />;
    }
    return <View width={26} height={26} />;
  };

  showTextDriverStatus = (shipmentStatus, pickupStatus, languageCode) => {
    switch (shipmentStatus) {
      case SHIPMENT_STATUS.BOOKED:
        return I18n.t('shipment.waiting_for_dispatch', { locale: languageCode });
      case SHIPMENT_STATUS.IN_PROGRESS:
        return I18n.t(pickupStatus === PICK_STATUS.COMPLETED ? 'shipment.waiting_for_delivery_destination' : 'shipment.waiting_for_pickup', { locale: languageCode });
      case SHIPMENT_STATUS.COMPLETED:
        return I18n.t('shipment.completed', { locale: languageCode });
      case SHIPMENT_STATUS.CANCELLED:
        return I18n.t('shipment.cancelled', { locale: languageCode });
      case SHIPMENT_STATUS.DRAFT:
        return 'DRAFT';
      case SHIPMENT_STATUS.HOLD:
        return 'HOLD';
      case SHIPMENT_STATUS.WAITING_APPROVAL:
        return 'WAITING_APPROVAL';
      case SHIPMENT_STATUS.UNLISTED:
        return 'UNLISTED';
      case SHIPMENT_STATUS.BLOCKED:
        return 'BLOCKED';
      case SHIPMENT_STATUS.APPROVED:
        return 'APPROVED';
      default:
        break;
    }
  };

  onViewDetail = () => {
    const { actions, data } = this.props;
    actions.viewDetail(data.id);
    actions.changeCurrentProgress(null);
  }

  viewProgress = () => {
    const { actions, data } = this.props;
    actions.getProgress(data.id);
    actions.changeCurrentProgress(null);
  }

  viewCommunication = () => {
    const { actions, data } = this.props;
    actions.viewDetail(data.id, false, false, false, false, true);
  }

  myShipmentItem = () => {
    const { languageCode, data, countryCode } = this.props;
    const days = `${I18n.t('shipment.detail.days', { locale: languageCode })}`;
    const day = `${I18n.t('shipment.detail.day', { locale: languageCode })}`;
    const transitTime = roundDecimalToMatch(data.totalTransitTime, 0);
    const distanceValue = formatMetricsWithCommas(
      roundDecimalToMatch(data.totalDistance),
    );
    const totalWeight = formatMetricsWithCommas(
      roundDecimalToMatch(data.totalWeight, 1),
    );

    return (
      <View
        style={[
          styles.formLine,
          styles.whiteBg,
          styles.mb30,
          styles.paddingHorizontal20,
          styles.paddingVertical10,
        ]}>
        <View
          style={[
            styles.flex,
            styles.mb15,
            styles.alignItemsCenter,
            styles.justifySpaceBetween,
          ]}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            {this.showProgressIcon(data.status, data.addresses.pickup.status)}
            <View style={[styles.ml10, styles.justifyContentCenter]}>
              <Text
                style={[
                  styles.grayText,
                  styles.font18,
                  styles.defaultTextColor,
                  styles.bold,
                ]}>
                {`DL-LTL-${data.code}`}
              </Text>
              <Text
                style={[
                  styles.grayText,
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.bold,
                ]}>
                {this.showTextDriverStatus(
                  data.status,
                  data.addresses.pickup.status,
                  languageCode,
                )}
              </Text>
            </View>
          </View>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.mr10}
              onPress={this.viewCommunication}
            >
              <Image
                source={IMAGE_CONSTANT.messageNotifyIcon}
                style={{width: 36, height: 36}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.ml10}
              onPress={this.callPinItem}>
              <Image
                source={
                  data.isPin ? IMAGE_CONSTANT.pinActive : IMAGE_CONSTANT.pin
                }
                style={{width: 36, height: 36}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.line} />
        <View style={[styles.mt20, styles.mb20]}>
          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.customer', {locale: languageCode})}:`}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.smallSize,
                  styles.defaultTextColor,
                  styles.bold,
                ]}>
                {data.user && data.user.name}
              </Text>
            </View>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.pickup', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {data.addresses.pickup &&
                getDateString(
                  data.addresses.pickup.pickupDate,
                  countryCode,
                  languageCode,
                )}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.transit_time', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {`${transitTime} ${transitTime > 1 ? days : day}`}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.distance', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}
              numberOfLines={2}>
              {`${distanceValue} km`}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.destinations', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {data.totalDestination}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.detail.items', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {(data.items && data.items.length) || 0}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.weight', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {`${totalWeight} kg`}
            </Text>
          </View>

          <View style={[styles.flex, styles.mb15]}>
            <View style={[styles.mr20, styles.w120]}>
              <Text style={[styles.smallSize, styles.grayText]}>
                {`${I18n.t('shipment.net_earnings', {locale: languageCode})}:`}
              </Text>
            </View>
            <Text
              style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
              {this.loadPrice(data.customerPrice, data.customerCurrency)}
            </Text>
          </View>
        </View>
        <View style={[styles.flex, styles.mb20]}>
          <TouchableOpacity
            style={[
              styles.alignItemsCenter,
              styles.flexOne,
              styles.flex,
              styles.mr5,
            ]}
            activeOpacity={0.9}
            onPress={this.viewProgress}>
            <Text
              style={[
                styles.flexOne,
                styles.mr10,
                {
                  color: 'rgba(81, 175, 43, 1)',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  borderColor: 'rgba(81, 175, 43, 1)',
                  borderWidth: 1,
                  height: 60,
                  borderRadius: 4,
                  fontFamily: 'Roboto-Bold',
                  fontSize: moderateScale(18),
                  lineHeight: 60,
                  textAlign: 'center',
                },
              ]}>
              {I18n.t('shipment.update_progress', {locale: languageCode})}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.alignItemsCenter,
              styles.flexOne,
              styles.flex,
              styles.ml5,
            ]}
            activeOpacity={0.9}
            onPress={this.onViewDetail}>
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr10]}>
              {I18n.t('shipment.detail.view_detail', {locale: languageCode})}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    // const { isExpand } = this.state;
    const {
      languageCode,
      data,
      countryCode,
      currentShipmentID,
      TabFilter,
    } = this.props;
    const shipmentStop = data.addresses.destinations && data.addresses.destinations.length > 0
      ? `${data.addresses.destinations.length + 1} stops`
      : `${(data.addresses.destinations
            && data.addresses.destinations.length + 1)
            || 0} stop`;
    const distanceValue = formatMetricsWithCommas(
      roundDecimalToMatch(data.totalDistance),
    );
    const isExpand = data.id === currentShipmentID;

    if (TabFilter === APP_CONSTANT.MY_SHIPMENT) {
      return this.myShipmentItem();
    }
    // console.log('isExpand: ', isExpand);

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.formLine,
            styles.whiteBg,
            // styles.mb10,
            styles.mt20,
            styles.pad20,
            isExpand && { backgroundColor: '#F5F5F5' },
            isExpand && { borderBottomColor: '#F5F5F5' }
          ]}
          onPress={this.callExpandItem}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={{ flex: 1 }}>
              {this.renderLowerPrice(data, languageCode)}
              <View style={[styles.flex, styles.mb10]}>
                <View style={[styles.mr15, styles.w80]}>
                  <Text style={[styles.smallSize, styles.grayText]}>
                    {I18n.t('shipment.price', { locale: languageCode })}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.smallSize,
                      styles.defaultTextColor,
                      styles.medium,
                    ]}
                    numberOfLines={2}
                  >
                    {this.loadPrice(data.customerPrice, data.customerCurrency)}
                  </Text>
                </View>
              </View>
              <View style={[styles.flex, styles.mb10]}>
                <View style={[styles.mr15, styles.w80]}>
                  <Text style={[styles.smallSize, styles.grayText]}>
                    {I18n.t('shipment.distance', { locale: languageCode })}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.smallSize,
                      styles.defaultTextColor,
                      styles.medium,
                    ]}
                    numberOfLines={2}
                  >
                    {`${distanceValue}km \u2022 ${shipmentStop}`}
                  </Text>
                </View>
              </View>
              <View style={[styles.flex]}>
                <View style={[styles.mr15, styles.w80]}>
                  <Text style={[styles.smallSize, styles.grayText]}>
                    {I18n.t('shipment.pickup', { locale: languageCode })}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.smallSize,
                      styles.defaultTextColor,
                      styles.medium,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {data.addresses.pickup && (data.addresses.pickup.shortAddress || data.addresses.pickup.address)}
                  </Text>
                  <Text style={[styles.smallSize, styles.defaultTextColor]}>
                    {data.addresses.pickup
                      && getDateString(
                        data.addresses.pickup.pickupDate,
                        countryCode,
                        languageCode,
                      )}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                { width: 80 },
                styles.flex,
                styles.alignItemsCenter,
                styles.ml10,
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.ml10, styles.mr10]}
                onPress={this.callPinItem}
              >
                <Image
                  source={
                    data.isPin ? IMAGE_CONSTANT.pinActive : IMAGE_CONSTANT.pin
                  }
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.ml10, styles.mr10]}
                onPress={this.callExpandItem}
              >
                <Image source={(isExpand && IMAGE_CONSTANT.arrowUp) || IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        {isExpand && this.renderExpandView(data, countryCode, languageCode)}
      </View>
    );
  }
}

ShipmentItem.propTypes = {
  languageCode: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      parentId: PropTypes.string,
    }),
    driver: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    code: PropTypes.number,
    referenceCode: PropTypes.string,
    title: PropTypes.string,
    transportTypeId: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.number,
      handlingUnitId: PropTypes.string,
      unitQuantity: PropTypes.number,
      length: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      weight: PropTypes.number,
      description: PropTypes.string,
      additionalServices: PropTypes.arrayOf(PropTypes.string),
      id: PropTypes.string,
      createdBy: PropTypes.string,
      createdAt: PropTypes.string,
      updatedBy: PropTypes.string,
      updatedAt: PropTypes.string
    })),
    address: PropTypes.shape({
      pickup: PropTypes.shape({
        pickupDate: PropTypes.string,
        locationTypeId: PropTypes.string,
        address: PropTypes.string,
        location: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
        }),
        placeId: PropTypes.string,
        locationServices: PropTypes.arrayOf(PropTypes.string),
        photos: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.string,
        createdBy: PropTypes.string,
        createdAt: PropTypes.string,
        updatedBy: PropTypes.string,
        updatedAt: PropTypes.string
      }),
      lastDestination: PropTypes.shape({
        location: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number,
        }),
        dateRangeType: PropTypes.number,
        earliestByDate: PropTypes.string,
        latestByDate: PropTypes.string,
        earliestBy: 1,
        latestBy: 3,
        locationTypeId: PropTypes.string,
        address: PropTypes.string,
        placeId: PropTypes.string,
        locationServices: PropTypes.arrayOf(PropTypes.string),
        photos: PropTypes.arrayOf(PropTypes.string),
        id: PropTypes.string,
        createdBy: PropTypes.string,
        createdAt: PropTypes.string,
        updatedBy: PropTypes.string,
        updatedAt: PropTypes.string
      }),
      destinations: PropTypes.arrayOf(PropTypes.shape({}))
    }),
    completeDate: PropTypes.string,
    pickupDate: PropTypes.string,
    totalDistance: PropTypes.number,
    agreedPrice: PropTypes.number,
    customerPrice: PropTypes.number,
    customerCurrency: PropTypes.string,
    paymentMethod: PropTypes.string,
    changedStatusDate: PropTypes.string,
    totalQuotes: PropTypes.number,
    totalDestination: PropTypes.number,
    itemSummary: PropTypes.string,
    totalWeight: PropTypes.number,
    isPin: PropTypes.bool,
    status: PropTypes.number,
    photos: PropTypes.arrayOf(PropTypes.string),
    isDeleted: PropTypes.bool,
    createdBy: PropTypes.string,
    createdAt: PropTypes.string,
    updatedBy: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired
};

ShipmentItem.defaultProps = {
  languageCode: 'en',
};

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  defaultLocationTypes: state.shipment.defaultLocationTypes,
  currentShipmentID: state.driver.shipmentExpandedId,
  TabFilter: state.driver.TabFilter,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      pinShipment: driverAction.setPinAction,
      selectShipment: driverAction.selectShipment,
      viewDetail: shipmentAction.setShipmentDetail,
      setQuoteDetail: shipmentAction.setQuoteDetail,
      getProgress: progressActions.getProgress,
      changeCurrentProgress: progressActions.changeCurrentProgress,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentItem);
