import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

class DuplicateIcon extends PureComponent {
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
          viewBox="0 0 14 14"
        >
          <Path fill={color} fill-rule="nonzero" d="M0 13.264c0 .407.33.736.736.736h8.107c.407 0 .736-.33.736-.736V5.157a.736.736 0 0 0-.736-.736H.736A.736.736 0 0 0 0 5.157v8.107zM5.157 0a.734.734 0 0 0-.736.737v2.947h4.524c1.37 0 1.37 1.105 1.37 1.105v4.79h2.948c.407 0 .737-.33.737-.736V.736A.736.736 0 0 0 13.264 0H5.157z" />
        </Svg>
      </View>
    );
  }
}

DuplicateIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

DuplicateIcon.defaultProps = {
  width: 24,
  height: 24,
  color: '#51AF2B'
};

export default DuplicateIcon;
