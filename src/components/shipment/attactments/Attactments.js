import React from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TapUpload from './TapUpload';
import I18n from '../../../config/locales';
import IMAGE_CONSTANT from '../../../constants/images';
import LANGUAGE_DEFAULT from '../../../constants/app';

class Attactments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  resetError = () => {
    console.log('RESET ERROR');
    this.setState({ error: null });
  }

  renderLable = () => {
    const { error } = this.state;
    const { languageCode } = this.props;
    if (error) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
          <Image source={IMAGE_CONSTANT.errorIcon} style={{ marginRight: 5, marginTop: 5 }} />
          <Text style={{ fontSize: 17, color: '#f44336', fontFamily: 'Roboto-Bold', width: '80%' }}>
            {error.type === 'size'
              ? `${I18n.t('shipment.address.error.fileSize')}: ${error.file.fileName}`
              : `${I18n.t('shipment.address.error.fileType')}: ${error.file.fileName}`}
          </Text>
          <TouchableOpacity
            style={{ zIndex: 99 }}
            activeOpacity={0.9}
            onPress={this.resetError}
          >
            <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Text style={[{ fontSize: 17, color: 'rgba(68, 68, 68, 1)', fontFamily: 'Roboto-Bold' }]}>
        {I18n.t('shipment.address.addFiles', { locale: languageCode })} <Text style={[{ fontSize: 13, color: 'rgba(161, 161, 161, 1)', fontFamily: 'Roboto-Regular', }]}>({I18n.t('shipment.address.optional', { locale: languageCode })})</Text>
      </Text>
    );
  }

  handlerError = (error) => {
    console.log('Error: ', error);
    this.setState({ error });
  }

  render() {
    const { actions, session, languageCode } = this.props;
    return (
      <>
        {this.renderLable()}
        <View style={{ marginTop: 10 }}>
          <View style={[{ marginHorizontal: -10, flexDirection: 'row', alignItems: 'center' }]}>
            {session && session.photos.map((photo, index) => (
              <TapUpload photo={photo} index={index} actions={actions} key={`${index + 1}`} onError={this.handlerError} />
            ))}
          </View>
          <Text style={[{ fontSize: 15, fontFamily: 'Roboto-Regular', color: 'rgba(161, 161, 161, 1)', marginTop: 20 }]}>
            Upload up to 3 files (8 mb each)
          </Text>
        </View>
      </>
    );
  }
}

Attactments.propTypes = {
  actions: PropTypes.func,
  session: PropTypes.arrayOf(PropTypes.any),
  languageCode: PropTypes.string
};

Attactments.defaultProps = {
  actions: () => {},
  session: [],
  languageCode: LANGUAGE_DEFAULT
};

export default Attactments;
