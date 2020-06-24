import React, { PureComponent } from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';
import TapUpload from '../attactments/TapUpload';
import { validateIsFilePDF } from '../../../helpers/regex';


class ProgressUpdatePhoto extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  getPhoto = (photo) => (Platform.OS === 'android' ? `file://${photo.path}` : photo.uri);

  handleRemovePhoto = (photo, index) => {
    // console.log('REMOVE PHOTO: ', photo, index);
    const { removeProgressPhoto } = this.props;
    if (removeProgressPhoto) {
      removeProgressPhoto(photo, index);
    }
  }

  handleAddPhoto = ({ photos }, index) => {
    // console.log('ADD PHOTO: ', photos, index);
    const { updateProgressPhoto } = this.props;
    if (updateProgressPhoto) {
      updateProgressPhoto(photos, index);
    }
  }

  handleDownload = (photos, index) => {
    // console.log('DOWNLOAD PHOTO: ', photos, index);
    const { downloadProgress } = this.props;
    if (downloadProgress) {
      downloadProgress(photos, index);
    }
  }

  clearErrorData = () => {
    this.setState({ error: null });
  }

  setErrorMessage = (newValue) => {
    this.setState({ error: newValue });
  }

  renderError = (error) => {
    // console.log('PHOTO ERROR: ', error);
    if (!error) {
      this.clearErrorData();
      return;
    }
    const isFilePDF = validateIsFilePDF(error.file);
    const { onErrorPhoto } = this.props;
    const errorObject = isFilePDF
      ? {
        type: error.type,
        fileName: error.file.name,
        fileSize: error.file.size,
      }
      : {
        type: error.type,
        fileName: error.file.fileName,
        fileSize: error.file.fileSize,
      };
    onErrorPhoto(errorObject);
  }

  showErrorMessage() {
    const { error } = this.state;
    const {
      customErrorView,
      errorViewStyle,
      errorTextStyle,
    } = this.props;

    if (customErrorView) {
      return customErrorView(error);
    }

    return (
      <View style={[errorViewStyle]}>
        <Text style={[errorTextStyle]}>{error}</Text>
      </View>
    );
  }

  render() {
    const { error } = this.state;
    const { canEdit, photos, type, canDownload } = this.props;
    return (
      <View style={{ position: 'relative' }}>
        {
          error && this.showErrorMessage()
        }
        <ScrollView
          contentContainerStyle={{ flexDirection: 'row' }}
          horizontal
        >
          {
            photos.map((photo, index) => (
              <View key={`${type}-${index + 1}`}>
                <TapUpload
                  index={index}
                  photo={photo}
                  editable={canEdit}
                  onRemoveImage={this.handleRemovePhoto}
                  onAddedImage={this.handleAddPhoto}
                  onError={this.renderError}
                  canDownload={canDownload}
                  onDownload={this.handleDownload}
                />
              </View>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

ProgressUpdatePhoto.propTypes = {
  type: PropTypes.string,
  photos: PropTypes.arrayOf(PropTypes.any),
  canEdit: PropTypes.bool,
  customErrorView: PropTypes.func,
  updateProgressPhoto: PropTypes.func,
  removeProgressPhoto: PropTypes.func,
  onErrorPhoto: PropTypes.func,
  downloadProgress: PropTypes.func,
  canDownload: PropTypes.bool,
};

ProgressUpdatePhoto.defaultProps = {
  type: '',
  photos: [],
  canEdit: true,
  customErrorView: () => { },
  updateProgressPhoto: () => { },
  removeProgressPhoto: () => { },
  onErrorPhoto: () => { },
  downloadProgress: () => { },
  canDownload: false,
};

// eslint-disable-next-line react/jsx-props-no-spreading
export default React.forwardRef((props, ref) => <ProgressUpdatePhoto ref={ref} {...props} />);
