import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, {
  Path, G
} from 'react-native-svg';

class MethodSvg extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <Svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25">
          <G fill="none" stroke="#000">
            <Path fill="#FFBC53" d="M.95 10.92l1.3-1.515c.5-.581 1.25-.935 2-.935h8.475l-.55 2.779c-.15.707.65 1.213 1.225.783l7.075-5.305c.425-.303.425-.96 0-1.263L13.4.158c-.575-.43-1.375.076-1.225.784l.55 2.753h-8.65C1.875 3.695.1 5.49.1 7.712v2.88c0 .455.55.682.85.328z" transform="translate(1 1)" />
            <Path fill="#C7EAFF" d="M19.99 12.733l-.023-.008c-.248-.098-.499-.032-.686.186l-1.203 1.419c-.446.515-1.085.804-1.778.804H8.518l.116-.596.352-1.803c.08-.373-.078-.749-.41-.967-.321-.21-.717-.197-1.025.032L.886 16.82c-.247.196-.386.463-.386.745 0 .306.132.572.375.736l6.664 4.994c.17.12.37.187.561.187.161 0 .337-.052.475-.146.333-.218.492-.594.41-.977l-.467-2.39h7.932c2.173 0 3.925-1.77 3.925-3.97v-2.705c.014-.251-.143-.48-.385-.56z" transform="translate(1 1)" />
          </G>
        </Svg>
      </View>
    );
  }
}

export default MethodSvg;
