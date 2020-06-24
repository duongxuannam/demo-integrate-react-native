import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, Use } from 'react-native-svg';
import PropTypes from 'prop-types';

class ArrowDownIcon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { width, height, color } = this.props;
    return (
      <View>
        <Svg
          width={width}
          height={height}
          viewBox="0 0 10 6"
        >
          <Defs>
            <Path id="a" d="M195.451 7l-4.725 5.754L186 7z" />
          </Defs>
          <Use fill={color} fillRule="evenodd" transform="translate(-186 -7)" xlinkHref="#a" />
        </Svg>
      </View>
    );
  }
}

ArrowDownIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

ArrowDownIcon.defaultProps = {
  width: 24,
  height: 24,
  color: '#51af2b'
};

export default ArrowDownIcon;
