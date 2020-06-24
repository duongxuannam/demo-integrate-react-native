import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
// import * as Sentry from '@sentry/react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import ModalFileOrImage from '../../common/ModalFileOrImage';
import I18n from '../../../config/locales';
import styles from '../style';
import {
  validateFile,
  validateFilePDF,
  IMAGE_REGEX,
  validateFileProof,
} from '../../../helpers/regex';
import IMAGE_CONSTANT from '../../../constants/images';
import PROGRESS from '../../../constants/progress';

const {width} = Dimensions.get('window');
class TapUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
      isRemove: false,
      showOption: false,
    };
  }

  componentDidMount() {
    const {photo} = this.props;
    this.setState({
      showDelete: !!(photo && photo.fileName),
    });
  }

  componentDidUpdate(prevProps) {
    const {photo, progress, proof} = this.props;
    if (photo !== prevProps.photo) {
      if (progress || proof) {
        this.setState({
          showDelete: !!(photo && photo.fileName),
        });
      }
    }
  }

  ObjectToFormData = (params = {}) => {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    return formData;
  };

  removePhoto = () => {
    const {actions, index, photo, progress, proof, shipmentID} = this.props;
    this.setState({
      showDelete: false,
      isRemove: true,
    });
    if (progress) {
      actions.deleteProgressAttachment(shipmentID, photo.fileName);
    } else if (proof) {
      actions.deleteProofPaymentMethod(shipmentID, photo.fileName, () => {
        console.log('ahihi');
      });
    } else {
      actions.setPhotoRemove(photo, index);
    }
  };

  toggleShowOption = () => {
    const {showOption} = this.state;
    this.setState({showOption: !showOption});
  };

  uploadFile = async () => {
    const {
      progress,
      proof,
      onError,
      section,
      shipmentID,
      addressId,
      actions,
      index,
      isSubmit,
      canConfirm,
    } = this.props;
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (response.uri) {
        const validFile = validateFileProof(response, 8);
        if (validFile === true) {
          this.setState({
            isRemove: false,
            showDelete: !progress || !proof,
          });
          onError(null);
          const formData = new FormData();
          const imgFileName = response.fileName || response.name;
          const imgSplit = imgFileName.split('.');
          formData.append('files', {
            uri: response.uri,
            type: response.type || `image/${imgSplit[imgSplit.length - 1]}`,
            name: imgFileName,
          });
          actions.uploadProofPaymentMethod(shipmentID, formData, () => {});
          this.setState({
            showOption: false,
          });
        } else if (onError) {
          onError(validFile);
          this.setState({
            showOption: false,
          });
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('User canceled document picker: ', err);
        this.setState({showOption: false});
      } else {
        throw err;
      }
    }
  };

  uploadImage = () => {
    const {
      section,
      index,
      onError,
      progress,
      actions,
      shipmentID,
      addressId,
      proof,
    } = this.props;
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      this.setState({
        showOption: false,
      });
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({
          showOption: false,
        });
      }
      if (response && response.uri) {
        console.log('PROOF FILE: ', response);
        const validFile = validateFile(response, progress ? 5 : 8);
        if (validFile === true) {
          this.setState({
            isRemove: false,
            showDelete: !progress || !proof,
          });
          onError(null);
          if (progress) {
            const formData = new FormData();
            const imgFileName = response.fileName;
            if (!imgFileName) {
              onError(null);
              return;
            }
            const imgSplit = imgFileName.split('.');
            formData.append('files', {
              uri: response.uri,
              type: response.type || `image/${imgSplit[imgSplit.length - 1]}`,
              name: imgFileName,
            });
            if (section === PROGRESS.SECTION.DISPATCHED) {
              actions.uploadDispatchedAttachment(shipmentID, formData);
            } else if (
              section === PROGRESS.SECTION.PICKUP ||
              section === PROGRESS.SECTION.DELIVERY
            ) {
              actions.uploadProgressAttachment(
                addressId,
                section,
                formData,
                shipmentID,
              );
            } else {
              actions.uploadProgressAttachment(
                shipmentID,
                section,
                formData,
                shipmentID,
              );
            }
          } else if (proof) {
            const formData = new FormData();
            try {
              const imgFileName = response.fileName || response.name;
              const imgSplit = imgFileName.split('.');
              formData.append('files', {
                uri: response.uri,
                type: response.type || `image/${imgSplit[imgSplit.length - 1]}`,
                name: imgFileName,
              });
              actions.uploadProofPaymentMethod(shipmentID, formData, () => {
                console.log('ahihi');
              });
            } catch (error) {
              // Sentry.captureException(`Exception Image line 210: ${error}`);
            }
          } else {
            actions.setAddressDataUpdating(
              {
                photos: response,
              },
              index,
            );
          }
        } else if (onError) {
          onError(validFile);
        }
      }
    });
  };

  uploadPDF = async () => {
    const {
      index,
      onError,
      progress,
      section,
      shipmentID,
      addressId,
      actions,
      proof,
    } = this.props;
    const {showOption} = this.state;
    try {
      if (Platform.OS === 'android') {
        this.toggleShowOption();
      }
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (response.uri) {
        const validFile = validateFilePDF(response, progress ? 5 : 8);
        if (validFile === true) {
          this.setState({
            isRemove: false,
            showDelete: !progress || !proof,
          });
          onError(null);
          if (progress) {
            const formData = new FormData();
            formData.append('files', response);
            if (section === PROGRESS.SECTION.DISPATCHED) {
              actions.uploadDispatchedAttachment(shipmentID, formData);
            } else if (
              section === PROGRESS.SECTION.PICKUP ||
              section === PROGRESS.SECTION.DELIVERY
            ) {
              actions.uploadProgressAttachment(
                addressId,
                section,
                formData,
                shipmentID,
              );
            } else {
              actions.uploadProgressAttachment(
                shipmentID,
                section,
                formData,
                shipmentID,
              );
            }
          } else if (proof) {
            const formData = new FormData();
            const imgFileName = response.fileName || response.name;
            const imgSplit = imgFileName.split('.');
            formData.append('files', {
              uri: response.uri,
              type: response.type || `image/${imgSplit[imgSplit.length - 1]}`,
              name: imgFileName,
            });
            actions.uploadProofPaymentMethod(shipmentID, formData, () => {});
          } else {
            actions.setAddressDataUpdating(
              {
                photos: response,
              },
              index,
            );
          }
          this.setState({
            showOption: false,
          });
        } else if (onError) {
          onError(validFile);
          this.setState({
            showOption: false,
          });
        }
      }
    } catch (err) {
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (DocumentPicker.isCancel(err)) {
        // alert('Canceled from single doc picker');
        console.log('Canceled from single doc picker');
      } else {
        // alert(`Unknown Error: ${JSON.stringify(err)}`);
        console.log(`DocumentPicker Unknown Error: ${JSON.stringify(err)}`);
        // throw err;
      }
    }
  };

  getPhoto = photo => photo.uri;

  renderView = () => {
    const {showDelete, isRemove} = this.state;
    const {
      photo,
      progress,
      languageCode,
      proof,
      isSubmit,
      canConfirm,
      disabled,
    } = this.props;

    if ((photo && !isRemove) || (progress && photo) || (proof && photo)) {
      return (
        <View style={[styles.alignItemsCenter, styles.flexWrapper]}>
          <View
            style={[
              styles.ml10,
              !progress && styles.mr10,
              styles.upload,
              styles.flexOne,
              styles.alignItemsCenter,
              styles.justifyContentCenter,
              {
                borderWidth: 0,
                position: 'relative',
                backgroundColor: '#dbdbdb',
              },
            ]}>
            {IMAGE_REGEX.test(photo.contentType) ||
            IMAGE_REGEX.test(photo.type) ? (
              <Image
                style={{
                  width: width / 4,
                  height: width / 4,
                  zIndex: 4444,
                }}
                source={{uri: photo.imageUrl || this.getPhoto(photo)}}
                resizeMode="contain"
              />
            ) : (
              <Image
                style={{
                  width: width / 4,
                  height: width / 4,
                  zIndex: 4444,
                }}
                source={IMAGE_CONSTANT.fileImage}
                resizeMode="contain"
              />
            )}
          </View>
          {IMAGE_REGEX.test(photo.contentType) ||
          IMAGE_REGEX.test(photo.type) ? (
            <Text />
          ) : (
            <Text
              style={{width: width / 4}}
              numberOfLines={1}
              lineBreakMode="middle">
              {photo.fullFileName || photo.name}
            </Text>
          )}
        </View>
      );
    }

    return (
      <TouchableOpacity
        disabled={(photo && showDelete) || disabled || false}
        onPress={this.toggleShowOption}>
        <View
          style={[
            styles.ml10,
            !progress && styles.mr10,
            styles.upload,
            styles.flexOne,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            isSubmit && !canConfirm && {borderColor: 'red'},
          ]}>
          <View style={styles.uploadCircle}>
            <Text style={[styles.uploadCircleText, styles.whiteText]}>+</Text>
          </View>
          <Text
            style={[styles.smallerSize, styles.grayText, styles.textCenter]}>
            {I18n.t('tap_upload', {
              locale: languageCode,
            })}
          </Text>
        </View>
        <Text style={[styles.smallerSize, styles.grayText]} />
      </TouchableOpacity>
    );
  };

  render() {
    const {showDelete, showOption} = this.state;
    const {readOnly, languageCode, disabled, photo, proof} = this.props;
    return (
      <View style={{position: 'relative'}}>
        {photo && !readOnly && showDelete && (
          <View
            style={{
              position: 'absolute',
              zIndex: 99,
              backgroundColor: 'transparent',
              width: width / 4,
              height: width / 4,
              left: 0,
              top: 5,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={disabled || false}
              onPress={this.removePhoto}>
              <View
                style={[
                  styles.photoMarkBtn,
                  styles.flex,
                  styles.alignItemsCenter,
                  {paddingLeft: 10},
                ]}>
                <Image
                  source={IMAGE_CONSTANT.deleteIconRed}
                  style={{width: 15, height: 15}}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {this.renderView()}
        <ModalFileOrImage
          showOption={showOption}
          onRequestClose={this.toggleShowOption}
          languageCode={languageCode}
          titleFile={
            proof
              ? I18n.t('progress.files', {
                  locale: languageCode,
                })
              : I18n.t('progress.file_PDF', {
                  locale: languageCode,
                })
          }
          onUploadFile={proof ? this.uploadFile : this.uploadPDF}
          onUploadImage={this.uploadImage}
        />
      </View>
    );
  }
}

export default TapUpload;
