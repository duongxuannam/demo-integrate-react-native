import React, { Component } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

class EyeIC extends Component {
  constructor(props) {
    super(props);
    this.state = {
   
    };
  }

  render() {
    const { width, height, show } = this.props;
    return (
      <View>
        <Svg
          width={width} height={height}
          viewBox="0 0 24 24"
        >
          <Path d="M0 0h24v24H0z" fill="none" />
          <Path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            fill={show ? 'gray' : 'green'}
          />
        </Svg>
      </View>
    );
  }
}

EyeIC.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
}

EyeIC.defaultProps = {
    width: 24,
    height: 24,
}

export default EyeIC;
