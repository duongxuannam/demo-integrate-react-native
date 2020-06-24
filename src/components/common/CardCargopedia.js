import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { formatDate, dateClientWithFormat } from '../../helpers/date.helper';
import I18N from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';
import { roundDecimalToMatch } from '../../helpers/shipment.helper';
import { ADDRESS_STATUS } from '../../constants/app';

class CardCargopedia extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? 'DD-MMM' : 'DD-[Th]MM';
    }
    return 'DD-MMM';
  }

  render() {
    const {
      source, title, isLocation, isCustomView, index,
      renderDynamicContent, onMore,
      languageCode, countryCode,
    } = this.props;
    const { titleShort, totalWeight } = this.props;

    if (isCustomView) {
      return typeof renderDynamicContent !== 'undefined' && (
        <View style={styles.group}>
          <View style={styles.flex}>
            <Text style={[styles.title, styles.defaultTextColor]}>
              {title}
            </Text>
            <View style={styles.flexOne} />
          </View>
          <View style={styles.box}>
            {renderDynamicContent()}
          </View>
        </View>
      );
    }

    if (!isLocation) {
      return (
        <View style={styles.group}>
          <View style={styles.flex}>
            <Text style={[styles.title, styles.defaultTextColor]}>
              {title}
            </Text>
            <View style={styles.flexOne} />
          </View>
          <View style={[styles.box, { height: 180 }]}>
            <Text style={styles.boxTitle}>{titleShort}</Text>
            <Text style={styles.boxDescription}>
              {I18N.t('bookingContainer.bookNow.total_weight', { locale: languageCode })}
              {' '}
              {roundDecimalToMatch(totalWeight, 1)}
              {' '}
              Kgs
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.group}>
        <View style={styles.flex}>
          <Text style={styles.title}>
            {title}
          </Text>
          <View style={styles.flexOne} />
        </View>
        <View style={[styles.box, styles.flex]}>
          <View style={styles.relative}>
            {source.pickup ? <Image source={source.item.status === ADDRESS_STATUS.COMPLETED ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinBlue} resizeMode="contain" style={{ width: 55, height: 55 }} />
              : <Image source={source.item.status === ADDRESS_STATUS.COMPLETED ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinYellow} resizeMode="contain" style={{ width: 55, height: 55 }} />}
            {source.pickup
              ? (
                <Text style={[styles.whiteText, styles.smallSize, styles.pin, styles.bold, { lineHeight: 35 }]}>
                  FR
                </Text>
              )
              : (
                <Text style={[source.item.status === ADDRESS_STATUS.COMPLETED ? styles.whiteText : styles.defaultTextColor, styles.smallSize, styles.pin, styles.bold, { lineHeight: 35 }]}>
                  {index}
                </Text>
              )}
          </View>
          <View style={[styles.flexOne, styles.ml10]}>
            {source.item ? <Text style={[styles.defaultTextColor, styles.smallSize]} numberOfLines={3}>{source.item.address}</Text> : null}
            {source.item ? (
              <Text style={[styles.grayText, styles.smallSize, styles.italic]}>
                {source.item.locationServices.length > 0
                  ? `${source.item.locationServices.length} ${I18N.t('shipment.detail.services_selected', { locale: languageCode })}` : I18N.t('shipment.detail.no_services_selected', { locale: languageCode })}
              </Text>
            ) : null}
            <Text style={[styles.defaultTextColor, styles.smallSize]}>{source.pickup ? I18N.t('shipment.detail.pickup_on', { locale: languageCode }) : I18N.t('shipment.detail.delivery_between', { locale: languageCode })}</Text>
            {source.item ? (
              <View style={styles.flex}>
                <View style={styles.date}>
                  <Text style={[styles.dateText, styles.defaultTextColor, styles.dateSize, styles.bold]}>
                    {source.pickup ? dateClientWithFormat(source.item.pickupDate, this.getDateFormatByCountry(countryCode, languageCode))
                      : `${dateClientWithFormat(source.item.earliestByDate, this.getDateFormatByCountry(countryCode, languageCode))} ${I18N.t('shipment.detail.to', { locale: languageCode })} ${formatDate(source.item.latestByDate, countryCode, languageCode)}`}
                  </Text>
                </View>
                <View style={styles.flexOne} />
              </View>
            ) : null}
            {source.note_for_driver ? <Text style={[styles.defaultTextColor, styles.smallSize]}>{source.note_for_driver}</Text> : null}
            {typeof onMore !== 'undefined'
              ? (
                <TouchableOpacity activeOpacity={0.9} onPress={() => onMore(source)}>
                  <Text style={[styles.greenText, styles.defaultSize, styles.bold, styles.mt5]}>
                    {I18N.t('shipment.more', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              )
              : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  flex: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  grayText: {
    color: 'rgba(161, 161, 161, 1)',
  },
  greenText: {
    color: 'rgba(81, 175, 43, 1)',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  dateSize: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  italic: {
    fontStyle: 'italic',
  },
  mt5: {
    marginTop: 5,
  },
  ml10: {
    marginLeft: 10,
  },
  title: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(219, 219, 219, 1)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(219, 219, 219, 1)',
    top: 1,
    left: 0,
    zIndex: 2,
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  boxTitle: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(68, 68, 68, 1)',
  },
  boxDescription: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(161, 161, 161, 1)',
    marginTop: 10,
  },
  date: {
    borderWidth: 1,
    borderColor: 'rgba(187, 187, 187, 1)',
    backgroundColor: 'rgba(249, 249, 249, 1)',
    borderRadius: 4,
    marginTop: 3,
  },
  dateText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  whiteText: {
    color: 'rgba(255, 255, 255, 1)',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  pin: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    lineHeight: 36,
    textAlign: 'center',
  },
});

CardCargopedia.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]),
  title: PropTypes.string,
  // locations: PropTypes.number,
  isLocation: PropTypes.bool,
  isCustomView: PropTypes.bool,
  index: PropTypes.number,
  onMore: PropTypes.func,
};

CardCargopedia.defaultProps = {
  source: {},
  title: '',
  // locations: 0,
  isLocation: false,
  isCustomView: false,
  index: undefined,
  onMore: undefined,
};


export default CardCargopedia;
