import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

let { width, height } = Dimensions.get('window');

const highDimension = width > height ? width : height;
const lowDimension = width > height ? height : width;

if (DeviceInfo.isTablet()) {
  width = highDimension;
  height = lowDimension;
} else {
  width = lowDimension;
  height = highDimension;
}

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = DeviceInfo.isTablet() ? 640 : 360;
const guidelineBaseHeight = DeviceInfo.isTablet() ? 360 : 640;

const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;
const deviceWidth = width;

export {
  scale,
  verticalScale,
  moderateScale,
  height,
  width,
  deviceWidth
};
