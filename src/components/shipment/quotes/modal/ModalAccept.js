import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import I18N from '../../../../config/locales';
import UrlImage from '../../../common/Image';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';
import { formatPrice } from '../../../../helpers/regex';

class ModalAccept extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleShowModalAcceptQuotes: true
    };
  }

  openWebBrowser = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }

  closeModal = () => {
    const { onCloseModal } = this.props;
    onCloseModal();
  }

  render() {
    const { isVisibleShowModalAcceptQuotes } = this.state;
    const {
      source,
      index,
      quoteDetail,
      selected,
      acceptedQuote,
      configs,
      languageCode
    } = this.props;
    return (
      <>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleShowModalAcceptQuotes}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.closeModal()}
              >
                <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.whiteBg, {
                flex: 4,
              }]}
            >
              <View style={styles.pad20}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('quote.modal.accept.title', { locale: languageCode })}
                </Text>
              </View>
              <ScrollView nestedScrollEnabled>
                <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20, styles.ml20, styles.mr20]}>
                  {source && (
                    <View style={styles.flex}>
                      <UrlImage
                        sizeWidth={88}
                        sizeHeight={88}
                        sizeBorderRadius={20}
                        source={source.avatarSquare || IMAGE_CONSTANT.imageDefault}
                        defaultImage={!source.avatarSquare}
                      />
                      <View style={[styles.flexOne, styles.ml10]}>
                        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                          {I18N.t('quote.modal.accept.qualified_shipper', { locale: languageCode })}
                          {' '}
                          #
                          {index + 1}
                        </Text>
                        <View style={[styles.flex, styles.alignItemsCenter, styles.mt10, styles.mb10]}>
                          <Image source={IMAGE_CONSTANT.certificate} />
                          <Text style={[styles.smallSize, styles.grayText, styles.bold, styles.ml5]}>
                            {source.certificate || I18N.t('quote.modal.accept.not_available', { locale: languageCode })}
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
                            {source.ratingCount > 1 ? (
                              `${source.ratingCount} ${I18N.t('quote.modal.accept.reviews', { locale: languageCode })}`
                            ) : (
                              `${source.ratingCount} ${I18N.t('quote.modal.accept.review', { locale: languageCode })}`
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                  <View style={[styles.lightSilver, styles.Radius4, styles.paddingVertical15, styles.mt30, styles.alignItemsCenter, styles.justifyContentCenter]}>
                    <Text style={[styles.smallSize, styles.defaultTextColor]}>
                      {quoteDetail.advanceItem.currency}
                      {' '}
                      <Text style={[styles.fs23, styles.bold]}>
                        {formatPrice(source.price)}
                      </Text>
                    </Text>
                    <View style={[styles.mt10, styles.flex, styles.alignItemsCenter]}>
                      {selected.value === 0 && (
                        <Image source={IMAGE_CONSTANT.bpAccount} style={{ width: 22, height: 15 }} />
                      )}
                      <Text style={[styles.defaultSize, styles.defaultTextColor, styles.pl10, styles.bold]}>
                        {selected.name}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.mt20, styles.mb20]}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.textCenter]}>
                      {I18N.t('quote.modal.accept.confirm', { locale: languageCode })}
                    </Text>
                  </View>
                  {/* {Button} */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => acceptedQuote()}
                  >
                    <Text style={[styles.formGroupButton, styles.darkGreenBg]}>
                      {I18N.t('quote.modal.accept.btn_text', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.mt20}>
                    <Text style={[styles.smallSize, styles.grayText, styles.textCenter]}>
                      {I18N.t('quote.modal.accept.term_text', { locale: languageCode })}
                      {' '}
                      <Text style={styles.mainColorText} onPress={() => this.openWebBrowser(configs.TermConditionsURL)}>
                        {I18N.t('quote.modal.accept.term_link', { locale: languageCode })}
                      </Text>
                      {languageCode === 'vi' && (
                        <Text>
                          {I18N.t('quote.modal.accept.term_text_2', { locale: languageCode })}
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalAccept;
