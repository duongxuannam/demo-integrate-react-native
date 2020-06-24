import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Linking,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import listingAction from '../../../store/actions/listingAction';
import I18N from '../../../config/locales';
import MsgErrorApi from '../../common/MsgErrorApi';
// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';

// CSS
import styles from '../style';

class Book extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  handleBookNow = () => {
    const {
      auth, navigation: { navigate }, actions, configQuote
    } = this.props;
    if (auth && auth.token) {
      actions.requestBookNow(configQuote.quote.id);
    } else {
      navigate('LoginStack');
    }
  }

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  render() {
    const {
      onSetPrice, advert, configQuote, languageCode, errorMessage
    } = this.props;
    return (
      <>
        <View style={[styles.flex, styles.alignItemsStart, styles.relative]}>
          <View style={[styles.bookOverlay, styles.bookOverlayLeft, styles.yellowBg, styles.zIndex1]} />
          <View style={[styles.bookOverlay, styles.bookOverlayRight, styles.mainBg, styles.zIndex1]} />
          <View style={[styles.zIndex2, styles.flexOne, styles.bookGroup, styles.yellowBg, styles.pad15]}>
            <View style={[styles.bookGroupImage, styles.mb20, styles.alignItemsCenter, styles.mt15]}>
              <Image
                source={{ uri: advert.iconUrl }}
                style={styles.bookGroupImage}
              />
            </View>
            <View style={[styles.bookGroupTitle, styles.h70]}>
              <Text style={[styles.darkGreenText, styles.fs21, styles.textCenter, styles.bold]}>
                {advert.title}
              </Text>
            </View>
            <View style={styles.bookGroupDescription}>
              <Text style={[styles.smallSize, styles.textCenter]}>
                {advert.description}
              </Text>
            </View>
            <SafeAreaView>
              <FlatList
                numColumns={2}
                data={advert && advert.items && advert.items.filter((item) => item.advertisementIconType === 0)}
                renderItem={({ item }) => (
                  <View style={[styles.bookGroupList, styles.alignItemsCenter, styles.mt15]}>
                    <Image
                      style={{ width: 18, height: 14, resizeMode: 'contain' }}
                      source={{ uri: item.iconUrl }}
                    />
                    <Text style={[styles.listSmallSize, styles.mt5, styles.textCenter, styles.pl10, styles.pr10]}>
                      {item.iconDescription}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
            <View style={[styles.bookGroupButton, styles.mt30]}>
              <TouchableOpacity
                style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                activeOpacity={0.9}
                onPress={() => onSetPrice()}
              >
                <Text style={[styles.formGroupButton, styles.formGroupButtonCustom, styles.flexOne, styles.mr15, styles.ml10]}>
                  {I18N.t('bookingContainer.bookNow.advert.chooseMarketplace', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.mt30, styles.mb30]}>
              <TouchableOpacity
                style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                activeOpacity={0.9}
                onPress={() => this.openWebBrowser(advert.externalLinkUrl)}
              >
                <Text style={[styles.flexOne, styles.defaultSize, styles.darkGreenText, styles.textCenter, styles.bold]}>
                  {advert.externalLinkTitle}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage
            ? (
              <View style={[styles.zIndex2, styles.flexOne, styles.bookGroup, styles.mainBg, styles.pad15]}>
                <MsgErrorApi errorMsg={I18N.t(errorMessage)} styleProp={{ backgroundColor: 'transparent' }} />
              </View>
            ) : (
              <View style={[styles.zIndex2, styles.flexOne, styles.bookGroup, styles.mainBg, styles.pad15]}>
                <View style={[styles.bookGroupImage, styles.mb20, styles.alignItemsCenter, styles.mt15]}>
                  <Image source={{ uri: configQuote.vehicle_type.mobile_icon_url }} style={{ width: 120, height: 75 }} resizeMode="contain" />
                  <Text style={[styles.bookGroupImageText, styles.darkGreenText, styles.titleSize, styles.textCenter, styles.bold]}>
                    {configQuote.vehicle_type.name}
                  </Text>
                  <View style={[styles.flex, styles.flexOne, styles.alignItemsCenter]}>
                    <View style={[styles.bookStar, styles.mr10, styles.flex, styles.alignItemsCenter, styles.pl10, styles.pr10]}>
                      <Image source={IMAGE_CONSTANT.starGreen} />
                      <Text style={[styles.smallerSize, styles.darkGreenText, styles.bold, styles.ml5]}>
                        {configQuote.vehicle_type.rating}
                      </Text>
                    </View>
                    <Text style={[styles.smallerSize, styles.darkGreenText, styles.bold]}>
                      (
                      {configQuote.vehicle_type.review}
                      {' '}
                      {I18N.t('bookingContainer.bookNow.advert.reviews', { locale: languageCode })}
                      )
                    </Text>
                  </View>
                </View>
                <View style={[styles.bookGroupTitle, styles.h70, styles.mb5]}>
                  <Text style={[styles.yellowText, styles.fs21, styles.textCenter, styles.bold]}>
                    {I18N.t('bookingContainer.bookNow.advert.bookWithFTL', { locale: languageCode })}
                  </Text>
                </View>
                <View style={styles.bookGroupDescription}>
                  <Text style={[styles.smallSize, styles.whiteText, styles.textCenter]}>
                    {I18N.t('bookingContainer.bookNow.advert.bookWithFTLDescription', { locale: languageCode })}
                  </Text>
                </View>
                <FlatList
                  numColumns={2}
                  data={advert && advert.items && advert.items.filter((item) => item.advertisementIconType === 1)}
                  renderItem={({ item }) => (
                    <View style={[styles.bookGroupList, styles.alignItemsCenter, styles.mt15]}>
                      <Image
                        style={{ width: 18, height: 14, resizeMode: 'contain' }}
                        source={{ uri: item.iconUrl }}
                      />
                      <Text style={[styles.listSmallSize, styles.mt5, styles.textCenter, styles.pl10, styles.pr10]}>
                        {item.iconDescription}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
                <View style={[styles.bookGroupButton, styles.mt30]}>
                  <TouchableOpacity
                    style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                    activeOpacity={0.9}
                    onPress={this.handleBookNow}
                  >
                    <Text style={[styles.formGroupButton, styles.formGroupButtonYellow, styles.formGroupButtonCustom, styles.formGroupButtonColor, styles.flexOne, styles.mr15, styles.ml10]}>
                      {configQuote.quote.currency.toString()}
                      {' '}
                      {configQuote.quote.total_fees}
                      {'\n'}
                      {I18N.t('bookingContainer.bookNow.advert.bookNow', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.mt30, styles.mb30]}>
                  <TouchableOpacity
                    style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.flexOne, styles.defaultSize, styles.yellowText, styles.textCenter, styles.bold]}>
                      {I18N.t('bookingContainer.bookNow.advert.howItWorks', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  advert: state.listing.advertInfo,
  configQuote: state.listing.configQuote,
  languageCode: state.app.languageCode,
  errorMessage: state.app.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      requestBookNow: listingAction.requestBookNow,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Book);
