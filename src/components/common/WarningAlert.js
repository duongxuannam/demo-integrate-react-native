import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';
import styles from '../shipment/style';
import I18n from '../../config/locales';

class WarningAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    const {
      showWarning, titleWarning, toggleShowWarning, languageCode
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={showWarning}
        onRequestClose={toggleShowWarning}
      >
        <SafeAreaView
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{ padding: 10, backgroundColor: 'rgba(88, 175, 43, 1)', borderRadius: 5 }}
          >
            <View style={styles.flex}>
              <Text style={[styles.whiteText, styles.defaultSize, { marginBottom: 10, marginLeft: 2 }, styles.bold]}>
                {I18n.t('menu.warning', { locale: languageCode })}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                width: '90%',
                borderRadius: 5,
                padding: 15,
              }}
            >
              <View
                style={[
                  styles.flex,
                  styles.alignItemsCenter,
                  {
                    marginBottom: 10,
                    backgroundColor: 'rgba(255, 205, 0, 0.2)',
                    borderColor: 'rgba(255, 205, 0, 1)',
                    borderWidth: 2,
                    borderRadius: 5,
                    paddingVertical: 10,
                  },
                ]}
              >
                <Image source={IMAGE_CONSTANT.errorIcon} style={{ margin: 5 }} resizeMode="contain" />
                <Text
                  style={[{
                    color: 'rgba(244, 67, 54, 1)',
                    marginHorizontal: 3,
                    textAlign: 'center'
                  }, styles.defaultSize, styles.alignItemsCenter]}
                  numberOfLines={2}
                >
                  {titleWarning}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 15,
                  height: 60,
                  width: '100%',
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderColor: 'rgba(14, 115, 15, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                  }}
                  onPress={toggleShowWarning}
                >
                  <Text style={[styles.formGroupButton, {backgroundColor: 'rgba(14, 115, 15, 1)'}]}>
                    OK
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

export default WarningAlert;
