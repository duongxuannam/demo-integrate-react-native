import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
// CONSTANT
import styles from '../booking/style';
import I18n from '../../config/locales';

import IMAGE_CONSTANT from '../../constants/images';

class ModalFileOrImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      showOption,
      onRequestClose,
      languageCode,
      titleFile,
      onUploadFile,
      onUploadImage,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={showOption}
        onRequestClose={onRequestClose}
      >
        <SafeAreaView
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              padding: 10,
              backgroundColor: "rgba(88, 175, 43, 1)",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity
              style={[styles.alignItemsEnd, styles.mb10, styles.mr5]}
              onPress={onRequestClose}
            >
              <Image
                source={IMAGE_CONSTANT.closeWhite}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                width: "90%",
                borderRadius: 5,
                padding: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 15,
                  height: 60,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[styles.flexOne, styles.mr5]}
                  //   onPress={proof ? this.uploadFile : this.uploadPDF}
                  onPress={onUploadFile}
                >
                  <Text style={styles.formGroupButtonModal}>
                    {/* {proof
                      ? I18n.t('progress.files', {
                        locale: languageCode,
                      })
                      : I18n.t('progress.file_PDF', {
                        locale: languageCode,
                      })} */}
                    {titleFile}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.flexOne, styles.ml5]}
                  onPress={onUploadImage}
                >
                  <Text style={styles.formGroupButton}>
                    {I18n.t("progress.image", {
                      locale: languageCode,
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default ModalFileOrImage;
