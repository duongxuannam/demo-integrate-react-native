import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  getTransportTypeName, getDateString, getExpiredString, IsShipmentBooked, SHIPMENT_STATUS, parseDriverStatus
} from '../../../helpers/shipment.helper';
import Referral from './Referral';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';
import { SHIPMENT_DETAIL_SECTION, DATE_TIME_FORMAT_VN, DATE_TIME_FORMAT } from '../../../constants/app';

class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  componentDidUpdate(prevProps) {
    const { sectionExpaned } = this.props;
    if (sectionExpaned !== prevProps.sectionExpaned) {
      this.setState({
        expanded: sectionExpaned === SHIPMENT_DETAIL_SECTION.SUMMARY,
      });
    }

  }

  renderSummary() {
    const {
      languageCode,
      shipmentDetail,
      transportType,
      actions,
      countryCode,
      onContactCarrier,
    } = this.props;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={styles.pad20}>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.title', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {shipmentDetail.title}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.ref', { locale: languageCode })}
              </Text>
            </View>
            <Referral shipmentDetail={shipmentDetail} actions={actions} />
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.deliveree_id', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                DL-LTL-
                {shipmentDetail.code}
              </Text>
            </View>
          </View>
          <View style={[styles.form, styles.flex, styles.mb20]}>
            <View style={[styles.formLeft, styles.w120, styles.mr20]}>
              <Text style={[styles.grayText, styles.smallSize]}>
                {I18N.t('shipment.summary.transport_mode', { locale: languageCode })}
              </Text>
            </View>
            <View style={[styles.formRight, styles.flexOne]}>
              <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                {getTransportTypeName(transportType, shipmentDetail.transportTypeId) || '-'}
              </Text>
            </View>
          </View>
          {IsShipmentBooked(shipmentDetail.status) || shipmentDetail.status === SHIPMENT_STATUS.CANCELLED ? (
            <>
              <View style={[styles.form, styles.flex, styles.mb20]}>
                <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                  <Text style={[styles.grayText, styles.smallSize]}>
                    {I18N.t('shipment.summary.status', { locale: languageCode })}
                    :
                  </Text>
                </View>
                <View style={[styles.formRight, styles.flexOne]}>
                  <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                    {parseDriverStatus(shipmentDetail.status, shipmentDetail.addresses.pickup.status, shipmentDetail.addresses.destinations, languageCode)}
                  </Text>
                </View>
              </View>
              <View style={[styles.flex, styles.alignItemsStart, styles.mb20]}>
                <Image
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 4,
                  }}
                  source={{ uri: shipmentDetail.driver && shipmentDetail.driver.avatarSquare }}
                />
                <View style={[styles.flexOne, styles.ml20]}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {(shipmentDetail.driver && shipmentDetail.driver.name) || '-'}
                  </Text>
                  <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                    <Image source={IMAGE_CONSTANT.certificate} />
                    <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                      {(shipmentDetail.driver && shipmentDetail.driver.certificate) || I18N.t('quote.not_available', { locale: languageCode })}
                    </Text>
                  </View>
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <View>
                      <View style={[styles.rating, styles.flex, styles.alignItemsCenter]}>
                        <Image source={IMAGE_CONSTANT.star} />
                        <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, styles.ml5]}>
                          {(shipmentDetail.driver && shipmentDetail.driver.rating) || 0}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.flexOne, styles.smallSize, styles.grayText, styles.bold, styles.ml10]}>
                      {(shipmentDetail.driver && shipmentDetail.driver.ratingCount) || 0}
                      {' '}
                      {shipmentDetail.driver && shipmentDetail.driver.ratingCount > 1 ? I18N.t('quote.ratings', { locale: languageCode })
                        : I18N.t('quote.rating', { locale: languageCode })}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.form, styles.flex, styles.mb20]}>
                <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                  <Text style={[styles.grayText, styles.smallSize]}>
                    {I18N.t('shipment.summary.selected', { locale: languageCode })}
                    :
                  </Text>
                </View>
                <View style={[styles.formRight, styles.flexOne]}>
                  <Text style={[styles.smallSize, styles.bold]}>
                    {getDateString(shipmentDetail.shipmentDetail.bookedDate, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT)}
                  </Text>
                </View>
              </View>
              <View style={[styles.pl20, styles.pr20, styles.mb20]}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => onContactCarrier()}>
                  <Text style={[styles.formGroupButton, styles.mainBg]}>
                    {I18N.t('shipment.summary.contact_carrier', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.form, styles.flex, styles.mb20]}>
                <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                  <Text style={[styles.grayText, styles.smallSize]}>
                    {I18N.t('shipment.summary.listing_started', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.formRight, styles.flexOne]}>
                  <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                    {shipmentDetail.shipmentDetail.changedStatusDate
                      ? getDateString(shipmentDetail.shipmentDetail.changedStatusDate, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT)
                      : '-'}
                  </Text>
                </View>
              </View>
              <View style={[styles.form, styles.flex, styles.mb20]}>
                <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                  <Text style={[styles.grayText, styles.smallSize]}>
                    {I18N.t('shipment.summary.listing_ends', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.formRight, styles.flexOne]}>
                  <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
                    {shipmentDetail.shipmentDetail.changedStatusDate
                      ? getExpiredString(shipmentDetail.shipmentDetail.changedStatusDate, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT)
                      : '-'}
                  </Text>
                </View>
              </View>
              <View style={[styles.form, styles.flex, styles.mb20]}>
                <View style={[styles.formLeft, styles.w120, styles.mr20]}>
                  <Text style={[styles.grayText, styles.smallSize]}>
                    {I18N.t('shipment.summary.quotes', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.formRight, styles.flexOne]}>
                  <Text style={[styles.mainColorText, styles.smallSize, styles.bold]}>
                    {shipmentDetail.quotes.length || '-'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const { languageCode, onExpandedSection } = this.props;
    return (
      <View style={styles.whiteBg}>
        <View style={styles.pad20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState((prevState) => ({
                expanded: !prevState.expanded,
              }), () => {
                const { expanded: currentExpanded } = this.state;
                if (currentExpanded) {
                  onExpandedSection(SHIPMENT_DETAIL_SECTION.SUMMARY);
                }
              });
            }}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Image source={require('../../../assets/images/group/docs.png')} />
              <Text style={[styles.bold, styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, { fontWeight: 'bold' }]}>
                {I18N.t('shipment.summary.heading', { locale: languageCode })}
              </Text>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
        </View>
        {expanded ? this.renderSummary() : null}
      </View>
    );
  }
}

const mapStatetoProps = (state) => ({
  transportType: state.listing.transportTypesDefault,
  languageCode: state.app.languageCode,
});

export default connect(mapStatetoProps, null)(Summary);
