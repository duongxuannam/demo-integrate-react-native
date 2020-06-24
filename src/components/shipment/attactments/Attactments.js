import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import UrlImage from '../../common/Image';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';

const { width } = Dimensions.get('window');

class Attactments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { source, readOnly } = this.props;
    if (readOnly) {
      return (
        <>
          {source.map((session) => (
            <View key={session.id} style={[styles.ml10, styles.mr10, styles.flexOne]}>
              <View style={[session.source ? styles.upload : null, styles.flex, styles.justifyContentCenter, styles.alignItemsCenter]}>
                {session.source ? (
                  !session.is_image ? (
                    <Image source={IMAGE_CONSTANT.shipmentBook} />
                  ) : (
                    <UrlImage
                      sizeWidth={width / 4 - 2}
                      sizeHeight={width / 4 - 2}
                      sizeBorderRadius={0}
                      source={session.source}
                    />
                  )
                ) : null}
              </View>
              <Text style={[styles.grayText, styles.smallerSize, styles.mt5, styles.textCenter]}>
                {!session.is_image ? session.title : null}
              </Text>
            </View>
          ))}
        </>
      );
    }

    return (
      <>
        <View style={[styles.ml10, styles.mr10, styles.upload, styles.flexOne, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <View style={styles.uploadCircle}>
            <Text style={[styles.uploadCircleText, styles.whiteText]}>
              +
            </Text>
          </View>
          <Text style={[styles.smallerSize, styles.grayText, styles.textCenter]}>
            Tap to upload
          </Text>
        </View>
        <View style={[styles.ml10, styles.mr10, styles.upload, styles.flexOne, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <View style={styles.uploadCircle}>
            <Text style={[styles.uploadCircleText, styles.whiteText]}>
              +
            </Text>
          </View>
          <Text style={[styles.smallerSize, styles.grayText, styles.textCenter]}>
            Tap to upload
          </Text>
        </View>
        <View style={[styles.ml10, styles.mr10, styles.upload, styles.flexOne, styles.alignItemsCenter, styles.justifyContentCenter]}>
          <View style={styles.uploadCircle}>
            <Text style={[styles.uploadCircleText, styles.whiteText]}>
              +
            </Text>
          </View>
          <Text style={[styles.smallerSize, styles.grayText, styles.textCenter]}>
            Tap to upload
          </Text>
        </View>
      </>
    );
  }
}

export default Attactments;
