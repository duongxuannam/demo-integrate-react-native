import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, {
  Path, G
} from 'react-native-svg';

const AttachmentSvg = () => (
  <View>
    <Svg width="20" height="24" viewBox="0 0 14 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <G id="LTL-Customer-Web" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <Path d="M2.95,13.9 C0.214,13.9 -2,11.6815 -2,8.95 C-2,6.2185 0.214,4 2.95,4 L12.4,4 C14.389,4 16,5.611 16,7.6 C16,9.589 14.389,11.2 12.4,11.2 L4.75,11.2 C3.508,11.2 2.5,10.192 2.5,8.95 C2.5,7.708 3.508,6.7 4.75,6.7 L11.5,6.7 L11.5,8.05 L4.75,8.05 C4.255,8.05 3.85,8.4505 3.85,8.95 C3.85,9.4495 4.255,9.85 4.75,9.85 L12.4,9.85 C13.642,9.85 14.65,8.842 14.65,7.6 C14.65,6.358 13.642,5.35 12.4,5.35 L2.95,5.35 C0.961,5.35 -0.65,6.961 -0.65,8.95 C-0.65,10.939 0.961,12.55 2.95,12.55 L11.5,12.55 L11.5,13.9 L2.95,13.9 Z" id="Path" fill="#C0C0C0" fillRule="nonzero" transform="translate(7.000000, 8.950000) rotate(-60.000000) translate(-7.000000, -8.950000) " />
      </G>
    </Svg>
  </View>
);

export { AttachmentSvg };

export default AttachmentSvg;
