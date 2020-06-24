import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Modal,
  SafeAreaView,
  PermissionsAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ModalFileOrImage from '../../common/ModalFileOrImage';

// REDUX

// CSS
import styles from '../style';
import {
  validateFile, validateFilePDF, validateIsFilePDF, validateIsFileImage
} from '../../../helpers/regex';
import IMAGE_CONSTANT from '../../../constants/images';
import I18n from '../../../config/locales';

const { width } = Dimensions.get('window');
class TapUpload extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      showDelete: false,
      isRemove: false,
      showOption: false,
    };
  }

  componentDidMount() {
    const { photo } = this.props;
    this.setState({
      showDelete: !!(photo && photo.fileName),
    });
  }

  ObjectToFormData = (params = {}) => {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });
    return formData;
  };

  removePhoto = () => {
    const { onRemoveImage, index, photo } = this.props;
    this.setState({
      showDelete: false,
      isRemove: true,
    });
    onRemoveImage(photo, index);
  };

  toggleShowOption = () => {
    this.setState({ showOption: !this.state.showOption });
  };

  downloadData = async () => {
    const { onDownload, index, photo } = this.props;
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: I18n.t('write_storage_permission'),
          message: I18n.t('write_storage_message'),
          buttonNegative: I18n.t('not_allow'),
          buttonPositive: I18n.t('allow')
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        onDownload(photo, index);
      } else {
        console.log('Write external storage permission is denied.');
      }
    } else {
      onDownload(photo, index);
    }
  }

  getImage = () => {
    const { onAddedImage, index, onError } = this.props;
    const { showOption } = this.state;
    const options = {
      noData: true,
      mediaType: 'photo',
      quality: Platform.OS === 'ios' ? 0.75 : 1
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({
          showOption: false,
        });
      }
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (response.uri) {
        const validFile = validateFile(response);
        if (validFile === true) {
          this.setState({
            error: {},
            isRemove: false,
            showDelete: true,
          });
          onError(null);
          onAddedImage({
            photos: response,
          }, index);
        } else if (onError) {
          onError(validFile);
        }
      }
    });
  }

  uploadImage = () => {
    if (Platform.OS === 'android') {
      this.toggleShowOption();
    }
    this.getImage();
  };

  getPhoto = (photo) => (Platform.OS === 'android' ? `file://${photo.path}` : photo.uri);

  renderView = () => {
    const { error, isRemove } = this.state;
    const { photo, languageCode } = this.props;
    const isFilePDF = validateIsFilePDF(photo);
    const isFileImage = validateIsFileImage(photo);
    if (error.type) {
      return (
        <View
          style={[
            styles.ml10,
            styles.mr10,
            styles.upload,
            styles.flexOne,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
          ]}
        >
          <Text style={[styles.redText]}>
            {error.type === 'size'
              ? `File must be less than 8MB: ${error.file.fileName}`
              : `Invalid file extension: ${error.file.fileName}`}
          </Text>
        </View>
      );
    }

    if (photo && photo.imageUrl) {
      // console.log('render');
      return (
        <View
          style={[
            styles.ml10,
            styles.mr10,
            styles.upload,
            styles.flexOne,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            { borderWidth: 1, position: 'relative' },
            { backgroundColor: 'rgba(219, 219, 219, 1)' },
          ]}
        >
          <Image
            style={{
              width: width / 4,
              height: width / 4,
              zIndex: 1,
            }}
            // eslint-disable-next-line no-nested-ternary
            source={isFilePDF
              ? IMAGE_CONSTANT.filePDFIcon
              : (isFileImage ? { uri: photo.imageUrl || this.getPhoto(photo) } : IMAGE_CONSTANT.fileAttachIcon)}
            resizeMode="contain"
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.ml10,
          styles.mr10,
          styles.upload,
          styles.flexOne,
          styles.alignItemsCenter,
          styles.justifyContentCenter,
        ]}
      >
        <View
          style={[
            { flexDirection: 'column' },
            styles.uploadCircle,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
          ]}
        >
          <Text
            style={[
              {
                fontSize: 17,
                color: '#fff',
                flex: 1,
                fontFamily: 'Roboto-Bold',
              },
            ]}
          >
            {'\u002B'}
          </Text>
        </View>
        <Text style={[styles.smallerSize, styles.grayText]}>
          {I18n.t('shipment.progress.tap_to_upload', {
            locale: languageCode,
          })}
        </Text>
      </View>
    );
  };

  uploadPDF = async () => {
    const { onAddedImage, index, onError } = this.props;
    const { showOption } = this.state;

    try {
      if (Platform.OS === 'android') {
        this.toggleShowOption();
      }
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (res.uri) {
        const validFile = validateFilePDF(res);
        if (validFile === true) {
          this.setState({
            error: {},
            isRemove: false,
            showDelete: true,
          });
          onError(null);
          onAddedImage(
            {
              photos: res,
            },
            index,
          );
        } else if (onError) {
          onError(validFile);
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
  }

  render() {
    const { showDelete, showOption } = this.state;
    const {
      editable, photo, languageCode, canDownload
    } = this.props;
    return (
      <View style={{ position: 'relative' }}>
        <TouchableOpacity
          onPress={this.toggleShowOption}
        >
          {this.renderView()}
        </TouchableOpacity>
        {photo && photo.fullFileName && (
          <View style={[styles.ml10, { width: width / 4 }, styles.mt5]}>
            <Text style={[styles.smallerSize, styles.grayText]} numberOfLines={1} ellipsizeMode="middle">
              {photo.fullFileName}
            </Text>
          </View>
        )}
        {photo.imageUrl && (
          <View
            style={{
              position: 'absolute',
              zIndex: 99,
              backgroundColor: 'transparent',
              width: width / 4,
              height: width / 4,
              left: 0,
              top: 5,
            }}
          >
            {editable ? (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={editable && this.removePhoto}
              >
                <View
                  style={[
                    styles.photoMarkBtn,
                    styles.flex,
                    styles.alignItemsCenter,
                    { paddingLeft: 15 },
                  ]}
                >
                  <Image
                    source={IMAGE_CONSTANT.deleteIconRed}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              canDownload && (
              <TouchableOpacity
                onPress={this.downloadData}
              >
                <View
                  style={[
                    styles.flex,
                    styles.alignItemsCenter,
                    { justifyContent: 'flex-end' },
                  ]}
                >
                  <Icon name="download" color="rgba(81, 175, 43, 1)" size={24} />
                </View>
              </TouchableOpacity>
              )
            )}
          </View>
        )}
        <ModalFileOrImage
          showOption={showOption}
          onRequestClose={this.toggleShowOption}
          languageCode={languageCode}
          titleFile={I18n.t('shipment.progress.file_PDF', {locale: languageCode})}
          onUploadFile={this.uploadPDF}
          onUploadImage={this.uploadImage}
        />
      </View>
    );
  }
}

TapUpload.propTypes = {
  photo: PropTypes.objectOf(PropTypes.any),
  index: PropTypes.number,
  onError: PropTypes.func,
  onAddedImage: PropTypes.func,
  onRemoveImage: PropTypes.func,
  editable: PropTypes.bool,
  canDownload: PropTypes.bool,
  onDownload: PropTypes.func,
};

TapUpload.defaultProps = {
  photo: {},
  index: 0,
  onError: () => { },
  onAddedImage: () => { },
  onRemoveImage: () => { },
  editable: false,
  canDownload: false,
  onDownload: () => { },
};

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
});

export default connect(
  mapStateToProps,
  null,
)(TapUpload);
