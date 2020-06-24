import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import moment from 'moment';
import I18N from '../../../config/locales';
import UrlImage from '../../common/Image';
import Price from './box/Price';
import Transit from './box/Transit';
import Details from './box/Details';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';
import { formatMetricsWithCommas } from '../../../helpers/regex';
import { dateClientWithISOString } from '../../../helpers/date.helper';
import { getDateString } from '../../../helpers/shipment.helper';
import { DATE_TIME_FORMAT_VN, DATE_TIME_FORMAT } from '../../../constants/app';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedPrice: false,
      expandedTransit: false,
      expandedDetails: false,
      isNewQuote: false,
    };
  }

  componentDidMount() {
    const { source } = this.props;
    this.checkIsNewQuote(source.submittedDate);
  }

  componentDidUpdate(prevProps) {
    const { source, idQuoteExpanded } = this.props;
    if (idQuoteExpanded !== prevProps.idQuoteExpanded) {
      if (source.id !== idQuoteExpanded) {
        this.setState({
          expandedTransit: false,
          expandedPrice: false,
          expandedDetails: false,
        });
      }
    }
  }

  checkIsNewQuote = (date) => {
    const dateUtc = dateClientWithISOString(date);
    const now = moment(new Date()).utc().toISOString();
    const hours = moment(now).diff(dateUtc, 'h');
    this.setState(({
      isNewQuote: hours < 1,
    }));
  }

  handleExpand = (type, id) => {
    const { quoteExpanded } = this.props;
    quoteExpanded(id);
    switch (type) {
      case 'transit':
        this.setState((prevState) => ({
          expandedTransit: !prevState.expandedTransit,
          expandedPrice: false,
          expandedDetails: false,
        }));
        break;
      case 'detail':
        this.setState((prevState) => ({
          expandedDetails: !prevState.expandedDetails,
          expandedPrice: false,
          expandedTransit: false,
        }));
        break;
      case 'price':
        this.setState((prevState) => ({
          expandedPrice: !prevState.expandedPrice,
          expandedDetails: false,
          expandedTransit: false,
        }));
        break;
      case 'seeTransitTimes':
        this.setState({
          expandedPrice: false,
          expandedTransit: true,
        });
        break;
      default:
        break;
    }
  }

  renderDetails = (source, expandedDetails, shipmentDetail, transportTypesDefault, languageCode) => (
    <View style={{
      borderWidth: 1,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'rgb(219, 219, 219)',
      borderBottomColor: 'rgb(219, 219, 219)',
      marginBottom: 20,
    }}
    >
      <View style={[styles.marginHorizontal20, styles.mt15, styles.mb15]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.handleExpand('detail', source.id)}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('quote.details', { locale: languageCode })}
              </Text>
            </View>
            {expandedDetails
              ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
              : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
          </View>
        </TouchableOpacity>
      </View>
      {expandedDetails ? <Details source={shipmentDetail} transportTypesDefault={transportTypesDefault} languageCode={languageCode} /> : null}
    </View>
  )

  renderTransit = (source, expandedTransit, locationServicesDefault, countryCode, languageCode) => (
    <View style={{
      borderWidth: 1,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'rgb(219, 219, 219)',
      borderBottomColor: 'rgb(219, 219, 219)',
      marginBottom: 20,
    }}
    >
      <View style={[styles.marginHorizontal20, styles.mt15, styles.mb15]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.handleExpand('transit', source.id)}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('quote.transit_times', { locale: languageCode })}
              </Text>
            </View>
            {expandedTransit
              ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
              : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
          </View>
        </TouchableOpacity>
      </View>
      {expandedTransit ? <Transit source={source} locationServicesDefault={locationServicesDefault} countryCode={countryCode} languageCode={languageCode} /> : null}
    </View>
  )

  renderPrice = (
    source,
    expandedPrice,
    isNewQuote,
    shipmentDetail,
    countryCode,
    languageCode,
    accountSelect,
    index,
    quoteDetail,
    navigation,
    actions,
    reasonsRejectQuote,
    countDown,
    configs,
  ) => (
    <View style={{
      borderWidth: 1,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: 'rgb(219, 219, 219)',
      borderBottomColor: 'rgb(219, 219, 219)',
      marginBottom: 20,
    }}
    >
      <View style={[styles.marginHorizontal20, styles.mt15, styles.mb15]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.handleExpand('price', source.id)}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                <Text style={styles.bold, styles.textCapitalize}>
                  {I18N.t('quote.quote', { locale: languageCode })}
                  {' '}
                  •
                  {' '}
                </Text>
                {quoteDetail.advanceItem.currency}
                <Text style={styles.bold}>{` ${formatMetricsWithCommas(source.price)}`}</Text>
              </Text>
              {isNewQuote && (
                <View style={[styles.ml10, {
                  borderRadius: 4,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: 'rgb(81, 175, 43)',
                }]}
                >
                  <Text style={[styles.whiteText, styles.listSmallSize, styles.textUppercase]}>
                    {I18N.t('quote.new', { locale: languageCode })}
                  </Text>
                </View>
              )}
              {source.isLowestPrice && (
                <View style={[styles.ml10, {
                  borderRadius: 4,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                  backgroundColor: 'rgb(81, 175, 43)',
                }]}
                >
                  <Text style={[styles.whiteText, styles.listSmallSize, styles.textUppercase]}>
                    {I18N.t('quote.lowest', { locale: languageCode })}
                  </Text>
                </View>
              )}
            </View>
            {expandedPrice
              ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
              : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
          </View>
        </TouchableOpacity>
      </View>
      {expandedPrice ? (
        <Price
          source={source}
          shipmentDetail={shipmentDetail}
          countryCode={countryCode}
          languageCode={languageCode}
          accountSelect={accountSelect}
          index={index}
          actions={actions}
          navigation={navigation}
          quoteDetail={quoteDetail}
          countDown={countDown}
          configs={configs}
          reasonsRejectQuote={reasonsRejectQuote}
          onClickSeeTransitTimes={() => this.handleExpand('seeTransitTimes', source.id)}
        />
      ) : null}
    </View>
  )

  render() {
    const {
      expandedPrice,
      expandedDetails,
      expandedTransit,
      isNewQuote,
    } = this.state;
    const {
      source,
      index,
      shipmentDetail,
      countryCode,
      languageCode,
      accountSelect,
      transportTypesDefault,
      quoteDetail,
      locationServicesDefault,
      navigation,
      actions,
      reasonsRejectQuote,
      countDown,
      configs,
    } = this.props;

    return (
      <View style={[styles.mt30]}>
        <View style={[styles.whiteBg, styles.formLine, styles.mb30]}>
          <View style={[styles.flex, { marginTop: -31 }]}>
            <Text style={[styles.formHeader, styles.defaultTextColor, styles.defaultSize, styles.textCapitalize, styles.bold]}>
              {I18N.t('quote.quote', { locale: languageCode })}
              {' '}
              {index + 1}
            </Text>
            <View style={styles.flexOne} />
          </View>
          {source && (
            <View style={[styles.flex, styles.mt30, styles.mb30, styles.marginHorizontal20]}>
              <UrlImage
                sizeWidth={88}
                sizeHeight={88}
                sizeBorderRadius={20}
                source={source.avatarSquare || IMAGE_CONSTANT.imageDefault}
                defaultImage={!source.avatarSquare}
              />
              <View style={[styles.flexOne, styles.ml10]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('quote.qualified_shipper', { locale: languageCode })}
                  {' '}
                  #
                  {index + 1}
                </Text>
                <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                  <Image source={IMAGE_CONSTANT.certificate} />
                  <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                    {source.certificate || I18N.t('quote.not_available', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.flex, styles.alignItemsCenter]}>
                  <View>
                    <View style={[styles.rating, styles.flex, styles.alignItemsCenter]}>
                      <Image source={IMAGE_CONSTANT.star} />
                      <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold, styles.ml5]}>
                        {source.rating}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.flexOne, styles.smallSize, styles.grayText, styles.bold, styles.ml10]}>
                    {source.ratingCount}
                    {' '}
                    {source.ratingCount > 1 ? I18N.t('quote.ratings', { locale: languageCode })
                      : I18N.t('quote.rating', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.flex, styles.alignItemsStart, styles.mt10]}>
                  <Image source={IMAGE_CONSTANT.quoteSubmitted} style={styles.mt5} />
                  <View>
                    <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                      {I18N.t('quote.quote_submited', { locale: languageCode })}
                    </Text>
                    <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                      {getDateString(source.submittedDate, countryCode, languageCode, languageCode === 'vi' ? DATE_TIME_FORMAT_VN : DATE_TIME_FORMAT)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {this.renderPrice(
            source,
            expandedPrice,
            isNewQuote,
            shipmentDetail,
            countryCode,
            languageCode,
            accountSelect,
            index,
            quoteDetail,
            navigation,
            actions,
            reasonsRejectQuote,
            countDown,
            configs,
          )}
          {this.renderTransit(source, expandedTransit, locationServicesDefault, countryCode, languageCode)}
          {this.renderDetails(source, expandedDetails, shipmentDetail, transportTypesDefault, languageCode)}
        </View>
      </View>
    );
  }
}

export default List;
