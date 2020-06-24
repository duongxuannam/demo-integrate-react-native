import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ActivityIndicator,
  Animated,
  Text
} from 'react-native';
import { SvgUri } from 'react-native-svg';

class UrlImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fadeAnim: new Animated.Value(1),
    };
  }

  changeBackground() {
    const { fadeAnim } = this.state;
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 200,
      }
    ).start(() => this.setState({
      isLoading: false
    }));
  }

  render() {
    const { fadeAnim } = this.state;
    const {
      sizeWidth,
      sizeHeight,
      sizeBorderRadius,
      defaultImage,
      source,
      isFullPic
    } = this.props;
    const isSvg = String(source).search('.svg') > -1;
    if (isSvg) {
      this.changeBackground();
    }
    return (
      <View style={{
        width: sizeWidth, height: sizeHeight, borderRadius: sizeBorderRadius, backgroundColor: 'white'
      }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#dddddd',
            opacity: fadeAnim,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: sizeBorderRadius
          }}
        >
          <ActivityIndicator
            size="small"
            color="rgba(88, 175, 43, 1)"
          />
        </Animated.View>
        {!isSvg ? (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
          >
            <Image
              source={defaultImage ? source : { uri: source }}
              onLoadEnd={() => this.changeBackground()}
              style={{
                flex: 1,
                width: isFullPic ? sizeWidth : sizeWidth * 0.6,
                height: isFullPic ? sizeHeight : sizeHeight * 0.6,
              }}
              resizeMode="contain"
            />
          </View>
        )
          : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            >
              <SvgUri
                style={{ flex: 1 }}
                width={isFullPic ? '100%' : '60%'}
                height={isFullPic ? '100%' : '60%'}
                uri={source || null}
                resizeMode="contain"
              />
            </View>
          )}
      </View>
    );
  }
}

UrlImage.propTypes = {
  sizeWidth: PropTypes.number,
  sizeHeight: PropTypes.number,
  sizeBorderRadius: PropTypes.number,
  isFullPic: PropTypes.bool,
  source: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({}),
  ]),
};

UrlImage.defaultProps = {
  sizeWidth: 64,
  sizeHeight: 64,
  sizeBorderRadius: 32,
  isFullPic: true,
  source: null,
};

export default UrlImage;
