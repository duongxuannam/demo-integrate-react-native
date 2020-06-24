import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import I18n from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';
import styles from '../shipment/style';
import { parseStatusToString, SHIPMENT_STATUS } from '../../helpers/shipment.helper';
import ModalCancelShipment from '../common/ModalCancelShipment';
import { dateClientWithFormat } from '../../helpers/date.helper';
import { formatPrice, roundDecimalToMatch } from '../../helpers/regex';
import { DATE_TIME_FORMAT, QUERY } from '../../constants/app';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCancel: false,
      expanded: props.tabFilter === QUERY.TAB_FILTER.DRAFT,
      isVisible: true,
      currentShipmentId: null,
    };
  }

  onViewDetail = (shipmentId) => {
    const { actions, countryCode } = this.props;
    actions.getShipmentDetails(shipmentId, true, countryCode);
    const queryGetQuotes = {
      ShipmentId: shipmentId,
      Page: 0,
      Limit: 20,
      Sort: 'Price',
      SortOrder: 0,
    };
    actions.getQuoteDetail(queryGetQuotes, () => {
    });
  }

  onUpdateShipment = (shipmentId, currenStatus) => {
    const { actions } = this.props;
    if (currenStatus === SHIPMENT_STATUS.BOOKED) {
      this.setState({
        isCancel: true,
        currentShipmentId: shipmentId,
      });
    } else {
      actions.bookAgainShipment(shipmentId);
    }
  }

  callPinItem = () => {
    const { actions, source } = this.props;
    actions.setPinAction(source.id, source.isPined);
  }

  renderColorStatus = (status) => {
    switch (status) {
      case SHIPMENT_STATUS.CANCELLED:
        return 'rgba(255, 59, 48, 1)';
      case SHIPMENT_STATUS.DRAFT:
        return 'rgba(102, 102, 102, 1)';
      case SHIPMENT_STATUS.WAITING_APPROVAL:
      case SHIPMENT_STATUS.APPROVED:
        return 'rgba(255, 205, 0, 0.1)';
      case SHIPMENT_STATUS.HOLD:
        return 'rgb(255, 205, 0)';
      default:
        return 'rgba(51, 115, 25, 1)';
    }
  }

  onCloseModal = () => {
    this.setState({
      isCancel: false,
    });
  }

  render() {
    const {
      expanded,
      isVisible,
      isCancel,
      currentShipmentId
    } = this.state;
    const {
      key,
      source,
      languageCode,
      tabFilter,
      actions,
      countryCode,
      cancelReasons,
      onCancel,
    } = this.props;
    const {
      id,
      status,
      isPined,
      driver,
      code,
      vehicles,
      requested,
      pickupDate,
      completedDate,
      totalDestination,
      totalDistance,
      targetPrice,
      customerCurrency,
      paymentMethod,
      jobNumber,
      acceptedPrice,
    } = source;
    return (
      <>
        <View key={key} style={styles.mb30}>
          <View style={[expanded ? styles.lightSilver : styles.whiteBg, expanded ? styles.mainBorder : null]}>
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {code}
                </Text>
                <View style={[styles.ml10, {
                  borderRadius: 4,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: this.renderColorStatus(status),
                },
                (status === SHIPMENT_STATUS.WAITING_APPROVAL || status === SHIPMENT_STATUS.APPROVED) && {
                  borderColor: 'rgb(255, 205, 0)',
                  borderWidth: 1,
                }
                ]}
                >
                  <Text style={[
                    (status === SHIPMENT_STATUS.WAITING_APPROVAL || status === SHIPMENT_STATUS.APPROVED) ? styles.defaultTextColor : styles.whiteText,
                    styles.listSmallSize,
                  ]}
                  >
                    {parseStatusToString(status, languageCode)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={1} onPress={this.callPinItem}>
                <View>
                  {isPined
                    ? <Image source={IMAGE_CONSTANT.pinActive} style={{ width: 26, height: 26 }} />
                    : <Image source={IMAGE_CONSTANT.pin} style={{ width: 26, height: 26 }} />}
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.ml20, styles.mr20, styles.lineSilver]} />
            <View style={styles.pad20}>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.verhicle', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {vehicles || '-'}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.requested', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {dateClientWithFormat(requested, DATE_TIME_FORMAT)}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.pickup_time', { locale: languageCode })}
  :

                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {pickupDate ? dateClientWithFormat(pickupDate, DATE_TIME_FORMAT) : '-'}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.completed', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {completedDate ? dateClientWithFormat(completedDate, DATE_TIME_FORMAT) : '-'}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.destination', { locale: languageCode })}
                  /
                  {I18n.t('management_shipment.distance', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {totalDestination}
                  /
                  {totalDistance ? roundDecimalToMatch(totalDistance, 1) : 0}
                  {' '}
                  km
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.price', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {customerCurrency}
                  {' '}
                  {acceptedPrice ? formatPrice(acceptedPrice) : targetPrice ? formatPrice(targetPrice) : '-'}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.payment', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {paymentMethod || '-'}
                </Text>
              </View>
              <View style={[styles.flex, styles.alignItemsCenter, styles.mb10]}>
                <Text style={[styles.smallSize, styles.defaultTextColor, { width: 170 }]}>
                  {I18n.t('management_shipment.job_number', { locale: languageCode })}
  :
                </Text>
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, { flexWrap: 'wrap', flex: 1 }]}>
                  {jobNumber || '-'}
                </Text>
              </View>
              {expanded && (
              <View style={[tabFilter !== QUERY.TAB_FILTER.DRAFT && styles.mb30]}>
                <View style={[styles.flex, styles.alignItemsStar]}>
                  {(status === SHIPMENT_STATUS.BOOKED || status === SHIPMENT_STATUS.CANCELLED) && (
                    <View style={[styles.flexOne, styles.mr10]}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.onUpdateShipment(id, status)}
                        disabled={!(status === SHIPMENT_STATUS.BOOKED || status === SHIPMENT_STATUS.CANCELLED)}
                      >
                        <Text style={[styles.formGroupButton,
                          status === SHIPMENT_STATUS.BOOKED ? styles.formGroupButtonRed
                            : styles.mainBg,
                          styles.defaultSize]}
                        >
                          {status === SHIPMENT_STATUS.BOOKED
                            ? I18n.t('management_shipment.cancel_booking', { locale: languageCode })
                            : I18n.t('management_shipment.book_again', { locale: languageCode })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View style={[styles.flexOne]}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        tabFilter === QUERY.TAB_FILTER.DRAFT ? actions.getShipmentDetails(id, false, countryCode, true) : this.onViewDetail(id);
                      }}
                    >
                      <Text style={[styles.formGroupButton, styles.mainBg, styles.defaultSize]}>
                        {tabFilter === QUERY.TAB_FILTER.DRAFT ? I18n.t('management_shipment.continue_editing', { locale: languageCode }) : I18n.t('management_shipment.view_detail', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {driver && (
                  <>
                    <View style={styles.mt20}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.setState((prevState) => ({
                          isVisible: !prevState.isVisible
                        }))}
                      >
                        <View style={[styles.mainBg, styles.flex, styles.alignItemsCenter, { borderRadius: 4 }]}>
                          <Text style={[styles.formGroupButton, styles.flexOne, styles.textCenter]}>
                            {I18n.t('management_shipment.booking_info', { locale: languageCode })}
                          </Text>
                          <Svg
                            width="24"
                            height="24"
                            viewBox="0 0 18 18"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: 20,
                              transform: [{ rotate: isVisible ? '0deg' : '180deg' }],
                              marginTop: -12,
                            }}
                          >
                            <Path fill="#FFF" fill-rule="evenodd" d="M18 9c0-4.964-4.036-9-9-9S0 4.036 0 9s4.036 9 9 9 9-4.036 9-9zm-9.606 3.107L4.926 8.621c-.17-.17-.246-.379-.246-.606 0-.228.076-.436.246-.607.322-.322.872-.322 1.194 0l2.88 2.9 2.88-2.88c.322-.323.872-.323 1.194 0 .322.321.322.87 0 1.193l-3.468 3.486c-.151.152-.379.247-.606.247-.227 0-.436-.095-.606-.247z" />
                          </Svg>
                        </View>
                      </TouchableOpacity>
                    </View>
                    {isVisible && (
                    <View style={[styles.flex, styles.alignItemsStart, styles.mt20]}>
                      <Image
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: 4,
                        }}
                        source={{ uri: driver.avatarSquare }}
                      />
                      <View style={[styles.flexOne, styles.ml20]}>
                        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                          {driver.name || '-'}
                        </Text>
                        <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                          <Image source={IMAGE_CONSTANT.certificate} />
                          <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                            {driver.certificate || I18n.t('quote.not_available', { locale: languageCode })}
                          </Text>
                        </View>
                        <View style={[styles.flex, styles.alignItemsCenter]}>
                          <View>
                            <View style={[styles.rating, styles.flex, styles.alignItemsCenter]}>
                              <Image source={IMAGE_CONSTANT.star} />
                              <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, styles.ml5]}>
                                {driver.rating}
                              </Text>
                            </View>
                          </View>
                          <Text style={[styles.flexOne, styles.smallSize, styles.grayText, styles.bold, styles.ml10]}>
                            {driver.ratingCount}
                            {' '}
                            {driver.ratingCount > 1 ? I18n.t('quote.ratings', { locale: languageCode })
                              : I18n.t('quote.rating', { locale: languageCode })}
                          </Text>
                        </View>
                      </View>
                    </View>
                    )}
                  </>
                )}
              </View>
              )}
            </View>
            {tabFilter !== QUERY.TAB_FILTER.DRAFT ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
              >
                <View style={[expanded ? styles.mainBg : styles.lightSilver, styles.paddingVertical10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                  {expanded ? <Image source={IMAGE_CONSTANT.arrowUpWhite} /> : <Image source={IMAGE_CONSTANT.arrowDownGreen} />}
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        {isCancel && (
          <ModalCancelShipment
            reasons={cancelReasons}
            onCloseModal={this.onCloseModal}
            actions={actions}
            shipmentId={currentShipmentId}
            languageCode={languageCode}
            onCancel={onCancel}
          />
        )}
      </>
    );
  }
}

export default List;
