import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Select from '../../common/Select';
import List from './List';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import {
  formatMetricsWithCommas, formatPrice, positiveValue, setUnitPrice
} from '../../../helpers/regex';
import styles from '../style';
import { SHIPMENT_STATUS } from '../../../helpers/shipment.helper';
import TimeLeft from '../detail/TimeLeft';
import { UPDATE_PRICE_FAIL } from '../../../constants/app';

class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        value: 0,
        name: I18N.t('quote.sort.low_to_high', { locale: props.languageCode })
      },
      isEditTargetPrice: false,
      isUpdatedTargetPrice: false,
      idQuoteExpanded: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setTargetPrice();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isEditTargetPrice } = this.state;
    if (prevState.isEditTargetPrice !== isEditTargetPrice) {
      this.setTargetPrice();
    }
  }

  onCloseModal() {
    const { showModalTargetPrice } = this.props;
    if (showModalTargetPrice) {
      showModalTargetPrice(false);
    }

    this.setState({
      isEditTargetPrice: false,
      isUpdatedTargetPrice: false,
    });
  }

  setTargetPrice = () => {
    const { shipmentDetail } = this.props;
    this.setState({
      targetPrice: shipmentDetail.shipmentDetail.customerPrice,
    });
  }

  handleChangePrice = (price) => {
    const newPrice = price.replace(/,/g, '');
    this.setState({ targetPrice: newPrice });
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
    const { minTargetPrice } = this.props;
    if (targetPrice >= minTargetPrice) {
      return true;
    }
    return false;
  }

  createListing = () => {
    const {
      actions,
      shipmentDetail,
      countryCode,
      languageCode,
    } = this.props;
    const { targetPrice } = this.state;
    this.setState({
      isUpdatedTargetPrice: true,
    });

    const validTargetPrice = this.checkValidationPrice(targetPrice)
      && this.checkMinTargetPrice(targetPrice);
    if (validTargetPrice === true) {
      actions.updateBasicShipment(shipmentDetail.id, {
        customerPrice: targetPrice,
        countryCode,
      }, (res, error) => {
        if (res) {
          this.setState({
            isUpdatedTargetPrice: false,
            isEditTargetPrice: false,
          });
        } else {
          let errorMsg = '';
          switch (error) {
            case UPDATE_PRICE_FAIL.SHIPMENT_CANNOT_EDIT_TARGET_PRICE:
              errorMsg = I18N.t('update_price_fail.driverBided', { locale: languageCode });
              break;
            default:
              errorMsg = I18N.t('update_price_fail.another', { locale: languageCode });
              break;
          }
          Alert.alert(
            'Notice',
            errorMsg,
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('Accept Bid Failed');
                }
              },
            ],
            { cancelable: false }
          );
        }
      });
    } else {
      console.log('false');
    }
  }

  openEditTargetPrice = () => {
    const { showModalTargetPrice } = this.props;
    if (showModalTargetPrice) {
      showModalTargetPrice(true);
    }

    this.setState({
      isEditTargetPrice: true
    });
  }

  handleChange(selected) {
    const { actions, shipmentDetail } = this.props;
    this.setState({ selected });
    const queryGetQuotes = {
      ShipmentId: shipmentDetail.id,
      Page: 0,
      Limit: 20,
      Sort: selected.text,
      SortOrder: selected.value,
    };
    actions.getQuoteDetail(queryGetQuotes);
  }

  render() {
    const {
      selected,
      isEditTargetPrice,
      isUpdatedTargetPrice,
      targetPrice,
      idQuoteExpanded,
    } = this.state;
    const {
      shipmentDetail,
      languageCode,
      quoteDetail,
      countryCode,
      accountSelect,
      transportTypesDefault,
      minTargetPrice,
      locationServicesDefault,
      navigation,
      actions,
      reasonsRejectQuote,
      countDown,
      configs,
    } = this.props;
    return (
      <>
        <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
          <View style={[styles.flex, styles.alignItemsCenter, styles.whiteBg, styles.pad15, styles.Radius4, styles.grayBorder, styles.mb10]}>
            <View style={styles.flexOne}>
              <Image source={IMAGE_CONSTANT.quotesIcon} style={{ width: 36, height: 36 }} />
            </View>
            <View>
              <Text style={[styles.boxSize, styles.defaultTextColor, styles.textRight, styles.bold]}>
                <Text style={[styles.defaultSize, styles.normal]}>
                  {shipmentDetail.shipmentDetail.customerCurrency}
                </Text>
                {' '}
                {formatMetricsWithCommas(shipmentDetail.shipmentDetail.customerPrice)}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.openEditTargetPrice}
                disabled={shipmentDetail.quotes.length > 0 || (quoteDetail && quoteDetail.items && quoteDetail.items.length > 0)}
              >
                <Text
                  style={[styles.defaultSize, styles.textRight, styles.mt5, shipmentDetail.quotes.length > 0 || (quoteDetail && quoteDetail.items && quoteDetail.items.length > 0) ? styles.grayText : styles.mainColorText, styles.bold]}
                >
                  {I18N.t('quote.edit_target_price', {
                    locale: languageCode,
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.flex, styles.alignItemsCenter, styles.whiteBg, styles.pad15, styles.Radius4, styles.grayBorder, styles.mb10]}>
            <View style={styles.flexOne}>
              <Image source={IMAGE_CONSTANT.quotesIcon} style={{ width: 36, height: 36 }} />
            </View>
            <View>
              <Text style={[styles.boxSize, styles.defaultTextColor, styles.textRight, styles.bold]}>
                {quoteDetail.items.length}
                {' '}
                {quoteDetail.items.length > 1
                  ? I18N.t('quote.quotes', {
                    locale: languageCode,
                  })
                  : I18N.t('quote.quote', {
                    locale: languageCode,
                  })}
              </Text>
              {quoteDetail.items.length ? (
                <>
                  <Text style={[styles.smallSize, styles.defaultTextColor, styles.textRight, styles.mt5]}>
                    {I18N.t('quote.lowest_upper', { locale: languageCode })}
                    {' '}
                    {quoteDetail.advanceItem.currency}
                    {' '}
                    {formatMetricsWithCommas(quoteDetail.advanceItem.lowestPrice)}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
          <View style={[styles.flex, styles.alignItemsCenter, styles.whiteBg, styles.pad15, styles.Radius4, styles.grayBorder]}>
            <View style={styles.flexOne}>
              <Image source={IMAGE_CONSTANT.clock} />
            </View>
            <View>
              <TimeLeft languageCode={languageCode} shipmentDetail={shipmentDetail} configs={configs} noStyle />
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.textRight, styles.mt5]}>
                {I18N.t('quote.time_left', { locale: languageCode })}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        {
      quoteDetail.items.length ? (
        <View>
          <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.titleSize, styles.defaultTextColor, styles.bold, { flex: 1 }]}>
                {quoteDetail.items.length}
                {' '}
                {quoteDetail.items.length > 1
                  ? I18N.t('quote.quotes', {
                    locale: languageCode,
                  })
                  : I18N.t('quote.quote', {
                    locale: languageCode,
                  })}
              </Text>
              <View style={{ flex: 2 }}>
                <Select
                  source={[
                    { value: 0, name: I18N.t('quote.sort.low_to_high', { locale: languageCode }), text: 'Price' },
                    { value: 1, name: I18N.t('quote.sort.high_to_low', { locale: languageCode }), text: 'Price' },
                    { value: 2, name: I18N.t('quote.sort.most_recent', { locale: languageCode }), text: 'MostRecent' },
                  ]}
                  selectedValue={selected}
                  onValueChange={this.handleChange}
                  whiteBg
                />
              </View>
            </View>
          </View>
          <FlatList
            style={ Platform.OS === 'ios' && { zIndex: -1 }}
            data={quoteDetail.items}
            renderItem={({ item, index }) => (
              <List
                source={item}
                index={index}
                quoteDetail={quoteDetail}
                shipmentDetail={shipmentDetail}
                languageCode={languageCode}
                countryCode={countryCode}
                accountSelect={accountSelect}
                transportTypesDefault={transportTypesDefault}
                locationServicesDefault={locationServicesDefault}
                navigation={navigation}
                actions={actions}
                countDown={countDown}
                configs={configs}
                idQuoteExpanded={idQuoteExpanded}
                quoteExpanded={(id) => this.setState({ idQuoteExpanded: id })}
                reasonsRejectQuote={reasonsRejectQuote}
              />
            )}
            keyExtractor={(item) => `${item.driverId}`}
            refreshing={false}
            onEndReachedThreshold={0.1}
          />
        </View>
      ) : null
    }
        <Modal
          animationType="slide"
          transparent
          visible={isEditTargetPrice}
          onRequestClose={() => this.onCloseModal()}
        >
          <SafeAreaView style={{
            width: '100%',
            height: '100%',
          }}
          >
            <KeyboardAwareScrollView
              scrollEnabled={false}
              nestedScrollEnabled
              extraScrollHeight={20}
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                width: '100%',
                height: '100%',
                position: 'relative'
              }}
            >
              {/* X button */}
              <View style={{
                height: '20%',
                justifyContent: 'flex-end',
                paddingBottom: 30
              }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.onCloseModal()}
                >
                  <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
                </TouchableOpacity>
              </View>
              {/* Content */}
              <ScrollView style={[
                styles.whiteBg,
                styles.paddingHorizontal20,
                styles.paddingVertical50,
                {
                  height: '80%',
                  width: '100%',
                }
              ]}
              >
                <View style={{
                  marginBottom: 50
                }}
                >
                  <Text style={[styles.mb10, styles.defaultSize, styles.defaultTextColor]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.titleRow1', { locale: languageCode })}
                  </Text>
                  <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.titleRow2', { locale: languageCode })}
                  </Text>
                </View>
                <View style={styles.mb20}>
                  {isUpdatedTargetPrice && this.checkValidationPrice(targetPrice)}
                  <Text style={[styles.titleSize, styles.mb10, styles.bold]}>
                    {isUpdatedTargetPrice && (!this.checkValidationPrice(targetPrice)) ? (
                      <Text>
                        <Image source={require('../../../assets/images/common/error-icon.png')} style={{ width: 20, height: 20 }} />
                        {' '}
                        <Text style={styles.redText}>{I18N.t('bookingContainer.bookNow.marketplace.errMsg', { locale: languageCode })}</Text>
                      </Text>
                    )
                      : (!(this.checkMinTargetPrice(targetPrice)) && isUpdatedTargetPrice ? (
                        <Text>
                          <Image
                            source={require('../../../assets/images/common/error-icon.png')}
                            style={{ width: 20, height: 20 }}
                          />
                          {' '}
                          <Text
                            style={styles.redText}
                          >
                            {`${I18N.t(
                              'bookingContainer.bookNow.marketplace.errMsgMinPrice',
                              { locale: languageCode }
                            )} ${setUnitPrice(
                              countryCode
                            )} ${formatPrice(minTargetPrice)}`}
                          </Text>
                        </Text>
                      ) : <Text>{I18N.t('bookingContainer.bookNow.marketplace.labelTargetPrice', { locale: languageCode })}</Text>)}
                  </Text>
                  <View style={[styles.formGroupInput, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
                    <View style={[styles.flex, styles.pl15, styles.pr15, styles.alignItemsCenter, styles.justifyContentCenter, styles.silverBg, styles.h60]}>
                      <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                        {shipmentDetail.shipmentDetail.customerCurrency}
                      </Text>
                    </View>
                    <TextInput
                      style={[
                        styles.input,
                        styles.noneBorderRadius,
                        styles.flexOne,
                        isUpdatedTargetPrice && (!targetPrice || !positiveValue(targetPrice)) && styles.inputError,
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
                <Text style={[styles.grayText, styles.smallSize, styles.mb25]}>
                  {I18N.t('bookingContainer.bookNow.marketplace.hintText', { locale: languageCode })}
                </Text>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex, styles.bookGroupButton]}
                  activeOpacity={0.9}
                  onPress={this.createListing}
                >
                  <Text style={[styles.formGroupButton, styles.formGroupButtonLarger, styles.flexOne]}>
                    {I18N.t('bookingContainer.bookNow.marketplace.updatePrice', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      </>
    );
  }
}

export default Quotes;
