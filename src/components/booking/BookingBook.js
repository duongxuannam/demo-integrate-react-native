import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// COMPONENTS
import Book from './list/Book';
import CardCarousel from '../common/CardCarousel';
import CardCargopedia from '../common/CardCargopedia';
// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';
import I18N from '../../config/locales';
import listingAction from '../../store/actions/listingAction';
import { formatPrice, setUnitPrice, positiveValue } from '../../helpers/regex';
// CSS
import styles from './style';

class BookingBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetPrice: false,
      targetPrice: '',
      isCreateListing: false,
    };
  }

  componentDidMount() {
    const { isEditing, shipmentDetail } = this.props;
    if (isEditing) {
      this.setState({
        targetPrice: shipmentDetail.shipmentDetail.customerPrice || '',
      });
    }
  }

  handleSetPrice = () => {
    this.setState({ showSetPrice: true });
  }

  closeSetPrice = () => {
    this.setState({ showSetPrice: false });
  }

  renderItem = (session, index) => {
    const { languageCode, countryCode, navigation } = this.props;
    if (session && session.type === 'detail') {
      return <CardCargopedia title={I18N.t('bookingContainer.bookNow.summary.detailTitle', { locale: languageCode })} source={session.source} countryCode={countryCode} />;
    }

    return (
      <CardCargopedia
        isBookNow
        isLocation
        navigation={navigation}
        title={session.source.pickup ? I18N.t('bookingContainer.bookNow.summary.pickupTitle', { locale: languageCode })
          : I18N.t('bookingContainer.bookNow.summary.destinationTitle', { locale: languageCode })}
        source={session.source}
        index={index - 1}
        countryCode={countryCode}
      />
    );
  }

  createListing = () => {
    const {
      auth, navigation: { navigate }, actions, listingItems, countryCode
    } = this.props;
    const { targetPrice } = this.state;
    this.setState({
      isCreateListing: true,
    });

    const validTargetPrice = this.checkValidationPrice(targetPrice)
      && this.checkMinTargetPrice(targetPrice);
    if (validTargetPrice === true) {
      if (auth && auth.token) {
        actions.saveListingItems(listingItems, targetPrice, setUnitPrice(countryCode));
      } else {
        navigate('LoginStack');
      }
    } else {
      console.log('false');
    }
  }

  checkValidationPrice = (targetPrice) => {
    if (!targetPrice) {
      return false;
    }

    if (targetPrice && !positiveValue(targetPrice)) {
      return false;
    }
    return true;
  }

  checkMinTargetPrice = (targetPrice) => {
    const { configs } = this.props;
    if (targetPrice >= configs.MinTargetPrice) {
      return true;
    }
    return false;
  }

  reFormatPrice = (price) => {
    const { text } = price.nativeEvent;
    const priceFormated = text.replace(/[^0-9.]+/g, '');
    this.setState({ targetPrice: priceFormated });
  }

  handleChangePrice = (price) => {
    const newPrice = price.replace(/,/g, '');
    this.setState({ targetPrice: newPrice });
  }

  render() {
    const {
      showSetPrice, targetPrice,
      isCreateListing,
    } = this.state;
    const {
      navigation, summary, countryCode, languageCode, configs, app
    } = this.props;
    return (
      <View>
        <View style={[styles.mb30, styles.bookCard]}>
          <CardCarousel
            source={summary}
            itemWidth={260}
            renderItem={this.renderItem}
            options={{
              activeSlideAlignment: 'start',
              containerCustomStyle: { paddingLeft: 20 },
              slideStyle: { marginRight: 10 },
            }}
          />
        </View>

        {!showSetPrice
          ? (
            <View style={[styles.flex, styles.alignItemsStart, styles.relative]}>
              <Book onSetPrice={this.handleSetPrice} navigation={navigation} />
            </View>
          ) : (
            <View style={[styles.yellowBg, styles.pad20]}>
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                onPress={this.closeSetPrice}
              >
                <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
              <View style={[styles.mt20, styles.Radius4, styles.boxPriceBg, styles.mb15, styles.overflowHidden]}>
                <View style={styles.pad20}>
                  <Text style={[styles.mb10, styles.defaultSize, styles.defaultTextColor]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.titleRow1', { locale: languageCode })}
                  </Text>
                  <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.titleRow2', { locale: languageCode })}
                  </Text>
                </View>
                <View style={[styles.whiteBg, styles.paddingHorizontal20, styles.paddingVertical50]}>
                  <View style={styles.mb20}>
                    {isCreateListing && this.checkValidationPrice(targetPrice)}
                    <Text style={[styles.titleSize, styles.mb10, styles.bold]}>
                      {isCreateListing && (!this.checkValidationPrice(targetPrice)) ? (
                        <Text>
                          <Image source={require('../../assets/images/common/error-icon.png')} style={{ width: 20, height: 20 }} />
                          {' '}
                          <Text style={styles.redText}>{I18N.t('bookingContainer.bookNow.marketplace.errMsg', { locale: languageCode })}</Text>
                        </Text>
                      )
                        : (!(this.checkMinTargetPrice(targetPrice)) && isCreateListing ? (
                          <Text>
                            <Image
                              source={require('../../assets/images/common/error-icon.png')}
                              style={{ width: 20, height: 20 }}
                            />
                            {' '}
                            <Text
                              style={[styles.redText, { fontSize: 19, fontFamily: 'Roboto-Regular', }]}
                            >
                              {`${I18N.t(
                                'bookingContainer.bookNow.marketplace.errMsgMinPrice',
                                { locale: languageCode }
                              )} ${setUnitPrice(
                                countryCode
                              )} ${formatPrice(configs.MinTargetPrice)}`}
                            </Text>
                          </Text>
                        )
                          : <Text>{I18N.t('bookingContainer.bookNow.marketplace.labelTargetPrice', { locale: languageCode })}</Text>)}

                    </Text>
                    <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                      <View style={[styles.flex, styles.pl15, styles.pr15, styles.alignItemsCenter, styles.justifyContentCenter, styles.silverBg, styles.h60]}>
                        <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                          {countryCode ? setUnitPrice(countryCode) : I18N.t('bookingContainer.bookNow.marketplace.unitPrice', { locale: languageCode })}
                        </Text>
                      </View>
                      <TextInput
                        style={[
                          styles.input,
                          styles.noneBorderRadius,
                          styles.flexOne,
                          isCreateListing && (!targetPrice || !positiveValue(targetPrice)) && styles.inputError,
                          targetPrice === '' ? styles.amountPlacholderStyle : { fontStyle: 'normal' },
                        ]}
                        value={formatPrice(targetPrice)}
                        keyboardType="numeric"
                        onEndEditing={this.reFormatPrice}
                        placeholder="Enter amount"
                        placeholderStyle
                        onChangeText={this.handleChangePrice}
                      />
                    </View>
                  </View>
                  <Text style={[styles.grayText, styles.smallSize, styles.mb10]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.hintText', { locale: languageCode })}
                  </Text>
                  <View style={[styles.bookGroupButton, styles.mt30]}>
                    <TouchableOpacity
                      style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                      activeOpacity={0.9}
                      onPress={this.createListing}
                    >
                      <Text style={[styles.formGroupButton, styles.formGroupButtonLarger, styles.flexOne]}>
                        {I18N.t('bookingContainer.bookNow.marketplace.createListing', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  booking: state.listing.handleUnits,
  listingItems: state.listing.dataStep1,
  summary: state.listing.summary,
  app: state.app,
  auth: state.auth,
  countryCode: state.app.countryCode,
  languageCode: state.app.languageCode,
  isEditing: state.listing.isEditing,
  shipmentDetail: state.listing.shipmentDetail,
  configs: state.app.configs,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...listingAction
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingBook);
