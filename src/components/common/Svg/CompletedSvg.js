import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, {
  Path, G
} from 'react-native-svg';

class CompletedSvg extends Component {
  render() {
    const { width, height } = this.props;
    return (
      <View>
        <Svg xmlns="http://www.w3.org/2000/svg" width={`${width}`} height={`${height}`} viewBox="0 0 98 98">
          <Path fill="#51AF2B" stroke="#51AF2B" strokeWidth="3" d="M49.1 2c5 0 9.9.8 14.6 2.4 1.1.3 1.7 1.4 1.4 2.5-.3 1.1-1.5 1.6-2.5 1.3h-.1 0C39.7.7 15.2 13.1 7.8 35.8 6.4 40.1 5.6 44.5 5.6 49c.2 23.9 19.8 43.1 43.7 42.9 21.1-.2 38.9-15.6 42.3-36.4.2-1.1 1.2-1.9 2.3-1.7 1.05.192 1.827 1.111 1.722 2.151l-.021.15C92.1 78.9 72 96 48.9 96c-26-.1-47-21.1-46.9-47.1.1-26 21.1-47 47.1-46.9zm42.3 16.4c.8.7.9 2 .1 2.8l-.1.1L48.5 64c-.4.4-.9.6-1.4.6-.5 0-1-.2-1.4-.6L26.2 44.6c-.8-.8-.8-2 0-2.8.8-.8 2-.8 2.8 0l18.1 18 41.5-41.3c.7-.8 2-.9 2.8-.1z" />
        </Svg>
      </View>
    );
  }
}

export { CompletedSvg };

export default CompletedSvg;
