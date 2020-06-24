import React from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Select from '../../../common/Select';

import I18n from '../../../../config/locales';

import styles from '../../style';
import IMAGE_CONSTANT from '../../../../constants/images';

class TransportSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transportTypeSelected: props.transportItemValue,
      height: 0,
    };
  }

  componentDidUpdate(prevProps) {
    const { transportItemValue, isEditing } = this.props;
    if (prevProps.transportItemValue !== transportItemValue) {
      this.setState({ transportTypeSelected: transportItemValue });
    }

    if (prevProps.isEditing !== isEditing) {
      if (isEditing) {
        this.setState({
          transportTypeSelected: transportItemValue
        });
      }
    }
  }

  selectTransportType = (type) => {
    console.log('selectTransportType', type);
    const { onSelectedTransport } = this.props;
    this.setState({ transportTypeSelected: type });
    onSelectedTransport(type);
  }

  renderViewItemSelect = (item) => {
    return (
      <View>
        <Text style={{ fontSize: 16, fontFamily: 'Roboto-Bold', color: '#000' }}>{item.name}</Text>
        <Text style={[{ fontSize: 12, fontFamily: 'Roboto-Regular', }, styles.grayText]}>{item.description}</Text>
      </View>
    );
  }

  updateHeight = () => {
    const { transportTypes } = this.props;
    const itemLength = (transportTypes && transportTypes.length) || 1;
    this.setState({ height: 50 * itemLength });
  }

  resetHeight = () => this.setState({ height: 0 });

  render() {
    const {
      transportTypeSelected,
      height,
    } = this.state;
    const {
      transportTypes,
      transportTypeError,
      languageCode,
    } = this.props;
    return (
      <View style={styles.mb30}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          {transportTypeError && <Image source={IMAGE_CONSTANT.errorIcon} style={styles.mr5} />}
          <Text style={[styles.defaultSize, styles.defaultTextColor, transportTypeError && styles.errorText, styles.bold]}>
            {I18n.t('listing.transportMode', { locale: languageCode })}
          </Text>
        </View>
        <View style={[styles.mt20, { zIndex: 100, overflow: 'visible' }]}>
          <Select
            placeholder={`${I18n.t('listing.selectTransportMode', { locale: languageCode })}`}
            source={transportTypes || []}
            selectedValue={transportTypeSelected}
            onValueChange={this.selectTransportType}
            openDropDown={this.updateHeight}
            closeDropDown={this.resetHeight}
            itemView={this.renderViewItemSelect}
            error={transportTypeError}
          />
          <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>{`(${I18n.t('listing.selectTransportDesc', { locale: languageCode })})`}</Text>
          <View style={{ height }} />
        </View>
      </View>
    );
  }
}

TransportSelector.propTypes = {
  transportTypeError: PropTypes.bool,
  onSelectedTransport: PropTypes.func.isRequired,
};

TransportSelector.defaultProps = {
  transportTypeError: false,
};

const mapStateToProps = (state) => ({
  transportTypes: state.listing.transportTypes,
  languageCode: state.app.languageCode,
  isEditing: state.listing.isEditing,
});

export default connect(
  mapStateToProps,
  {},
)(TransportSelector);
