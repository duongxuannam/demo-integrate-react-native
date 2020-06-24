import React from 'react';
import {
  View, Text, Image, TouchableOpacity
} from 'react-native';
import TapUpload from './TapUpload';
import I18n from '../../../config/locales';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../../shipment/style';

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

  renderLabel = () => {
    const { error } = this.state;
    const {
      languageCode,
      progress,
      readOnly,
      proof,
      isSubmit,
      canConfirm,
    } = this.props;

    if (error) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
          <Image source={IMAGE_CONSTANT.errorIcon} style={{ marginRight: 5, marginTop: 5 }} />
          <Text style={{
            fontSize: 17, color: '#f44336', fontFamily: 'Roboto-Bold', width: '80%'
          }}
          >
            {error.type === 'size'
              ? `${I18n.t('shipment.address.error.fileSize', {
                locale: languageCode,
                n: progress ? 5 : 8
              })}: ${error.file.name || error.file.fileName}`
              : `${I18n.t('shipment.address.error.fileType', { locale: languageCode })}: ${error.file.name}`}
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

    if (progress && readOnly) {
      return (
        <View style={{ width: '100%', flexWrap: 'wrap' }}>
          <Text style={[{
            fontSize: 17, color: 'rgba(68, 68, 68, 1)', fontFamily: 'Roboto-Bold',
          }]}
          >
            {I18n.t('progress.files', { locale: languageCode })}
          </Text>
        </View>
      );
    }

    return (
      <Text style={[{ fontSize: 17, color: (isSubmit && !canConfirm) ? 'red' : 'rgba(68, 68, 68, 1)', fontFamily: 'Roboto-Bold', }]}>
        {proof ? (
          <>
            {(isSubmit && !canConfirm) && <Image source={IMAGE_CONSTANT.errorIcon} />}
            <Text style={styles.ml20}>
              {I18n.t('payment.section.instructions.upload_proof', { locale: languageCode })}
            </Text>
          </>
        )
          : I18n.t('shipment.address.addFiles', { locale: languageCode })}
        {' '}
        {proof ? null : (
          <Text style={[{ fontSize: 13, color: 'rgba(161, 161, 161, 1)', fontFamily: 'Roboto-Regular', }]}>
               (
            {I18n.t('shipment.address.optional', { locale: languageCode })}
               )
          </Text>
        )}
      </Text>
    );
  }

  handlerError = (error) => {
    console.log('Error: ', error);
    this.setState({ error });
  }

  renderTapUpLoad = () => {
    const {
      progress,
      proof,
      photos,
      actions,
      readOnly,
      shipmentID,
      section,
      languageCode,
      addressId,
      session,
      proofPhotos,
      isSubmit,
      canConfirm,
      disabled,
    } = this.props;
    if (progress) {
      return (
        photos.map((photo, index) => (
          <TapUpload
            photo={photo}
            index={index}
            actions={actions}
            key={`${index + 1}`}
            onError={this.handlerError}
            readOnly={readOnly}
            progress
            shipmentID={shipmentID}
            section={section}
            languageCode={languageCode}
            addressId={addressId}
          />
        ))
      );
    }

    if (proof) {
      return (
        proofPhotos.map((photo, index) => (
          <TapUpload
            proof
            disabled={disabled}
            photo={photo}
            isSubmit={isSubmit}
            canConfirm={canConfirm}
            index={index}
            actions={actions}
            key={`${index + 1}`}
            onError={this.handlerError}
            shipmentID={shipmentID}
            languageCode={languageCode}
          />
        ))
      );
    }

    return (
      session && session.photos.map((photo, index) => (
        <TapUpload
          photo={photo}
          index={index}
          actions={actions}
          languageCode={languageCode}
          key={`${index + 1}`}
          onError={this.handlerError}
        />
      ))
    );
  }

  render() {
    const {
      progress,
      proof,
      readOnly,
      languageCode,
    } = this.props;
    return (
      <>
        {this.renderLabel()}
        <View style={{ marginTop: 10 }}>
          <View style={[{ marginHorizontal: -10, flexDirection: 'row', alignItems: 'center' }]}>
            {this.renderTapUpLoad()}
          </View>
          {readOnly ? null : (
            <Text style={[{
              fontSize: 15, color: 'rgba(161, 161, 161, 1)', marginTop: proof ? 0 : 20, fontFamily: 'Roboto-Regular',
            }]}
            >
              {I18n.t('description_upload', {
                locale: languageCode,
                n: progress ? 5 : 8
              })}
            </Text>
          )}
        </View>
      </>
    );
  }
}

export default Attactments;
