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
import styles from '../shipment/style';
import I18n from '../../config/locales';

class ConfirmAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      showWarning, titleConfirm, onRequestClose, languageCode, onConfirmOk,
    } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent
        visible={showWarning}
        onRequestClose={onRequestClose}
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
            <Text style={[styles.whiteText, styles.defaultSize, { marginBottom: 10, marginLeft: 2 }, styles.bold]}>
              {I18n.t('menu.warning', { locale: languageCode })}
            </Text>
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
                  styles.justifyContentCenter,
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
                <Text
                  style={{
                    color: 'rgba(244, 67, 54, 1)',
                    fontFamily: 'Roboto-Bold',
                    fontSize: 17,
                    marginHorizontal: 3,
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  numberOfLines={2}
                >
                  {titleConfirm}
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
                    marginRight: 8,
                  }}
                  onPress={onConfirmOk}
                >
                  <Text style={[styles.formGroupButton, {color: 'rgba(14, 115, 15, 1)'}]}>
                    {I18n.t('menu.ok', { locale: languageCode })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: 8,
                  }}
                  onPress={onRequestClose}
                >
                  <Text style={styles.formGroupButtonModal}>
                    {I18n.t('menu.cancel', { locale: languageCode })}
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

export default ConfirmAlert;
