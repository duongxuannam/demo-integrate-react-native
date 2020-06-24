import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';
import { width } from '../../../helpers/scaling.helpers';
import { QUOTE_STATUS, BLUR_RADIUS } from '../../../helpers/constant.helper';

export default class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  renderEmptyPhoto = () => {
    const { languageCode } = this.props;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={[styles.mt20, styles.mb20, styles.pl20, styles.alignItemsCenter]}>
          <Text style={[styles.titleSize, styles.defaultTextColor, styles.bold]}>
            {I18N.t('shipment.detail.images.empty', { locale: languageCode })}
          </Text>
        </View>
      </>
    );
  }

  showImages = () => {
    const { driver, shipmentDetail: { quotes } } = this.props;
    let res = {};
    if (quotes.length > 0) {
      res = quotes.find((quote) => String(quote.driverId) === String(driver.id) && quote.status === QUOTE_STATUS.ACCEPTED);
    }
    return (res && res.driverId) ? BLUR_RADIUS.MIN : BLUR_RADIUS.MAX;
  }

  renderPhoto() {
    const { shipmentDetail, languageCode } = this.props;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <View style={{ position: 'relative' }}>
          {this.showImages() === BLUR_RADIUS.MAX && (
            <View style={{
              position: 'absolute',
              left: width * 0.1,
              top: 30,
              zIndex: 2,
              backgroundColor: 'rgba(1, 1, 1, 0.8)',
              width: width * 0.8,
              height: 100,
              padding: 20,
              borderRadius: 10,
              alignContent: 'center',
              justifyContent: 'center'
            }}
            >
              <Text style={[styles.whiteText, styles.textCenter, styles.defaultSize]}>{I18N.t('shipment.detail.images.hint_text', { locale: languageCode })}</Text>
            </View>
          )}
          <ScrollView
            style={[styles.mt20, styles.mb20, styles.pl20]}
            nestedScrollEnabled
            horizontal
            scrollEnabled={this.showImages() === BLUR_RADIUS.MIN}
          >
            {shipmentDetail.photos.map((item, key) => (
              <View style={[styles.photo, styles.mr25, styles.h165, { backgroundColor: '#dbdbdb', borderRadius: 8 }]} key={`item-${key}`}>
                <TouchableOpacity activeOpacity={0.9}>
                  <Image
                    style={{
                      width: width / 2,
                      height: width / 2,
                      flex: 1,
                    }}
                    source={{ uri: item.imageUrl }}
                    blurRadius={this.showImages()}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const { shipmentDetail, languageCode } = this.props;
    return (
      <View style={styles.whiteBg}>
        <View style={styles.pad20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Image source={require('../../../assets/images/group/photo.png')} />
              <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('shipment.detail.images.heading', { locale: languageCode })}
                {' '}
                {shipmentDetail.photos.length > 0 && (
                  `(${shipmentDetail.photos.length})`
                )}
              </Text>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
        </View>
        {expanded ? shipmentDetail.photos.length ? this.renderPhoto() : this.renderEmptyPhoto() : null}
      </View>
    );
  }
}
