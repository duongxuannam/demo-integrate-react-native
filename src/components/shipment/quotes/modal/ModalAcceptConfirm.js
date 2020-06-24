import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import I18N from '../../../../config/locales';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';

class ModalAcceptConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleShowModalAcceptQuotes: true,
      countDown: 0,
    };
  }

  componentDidMount() {
    const { countDown } = this.props;
    this.interval = setInterval(() => this.countDownAction(this.interval), 1000);
    this.setState({
      countDown,
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  countDownAction = (eventInterval) => {
    const { countDown } = this.state;
    this.setState((state) => ({
      countDown: state.countDown - 1
    }));

    if (countDown === 1) {
      clearInterval(eventInterval);
      this.closeModal();
    }
  }

  closeModal = () => {
    const { onCloseModal } = this.props;
    onCloseModal(true);
  }

  render() {
    const { isVisibleShowModalAcceptQuotes, countDown } = this.state;
    const { languageCode, index } = this.props;
    return (
      <>
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleShowModalAcceptQuotes}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: 20,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.closeModal()}
              >
                <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.whiteBg, {
                flex: 2,
              }]}
            >
              <View style={styles.pad20}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('quote.modal.confirm.title', { locale: languageCode })}
                </Text>
              </View>
              <ScrollView nestedScrollEnabled>
                <View style={[styles.marginHorizontal20, styles.mt20, styles.mb20, styles.ml20, styles.mr20]}>
                  <View style={styles.mb10}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                      {I18N.t('quote.modal.confirm.congratulation', { locale: languageCode })}
                      {' '}
                      {index + 1}
                    </Text>
                  </View>
                  <View style={[styles.mt10, styles.mb20]}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor]}>
                      {I18N.t('quote.modal.confirm.note', { locale: languageCode })}
                    </Text>
                  </View>
                  {/* {Button} */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.closeModal()}
                  >
                    <Text style={[styles.formGroupButton, styles.darkGreenBg]}>
                      {I18N.t('quote.modal.confirm.manage_shipment', { locale: languageCode })}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.mt20}>
                    <Text style={[styles.smallSize, styles.grayText, styles.textCenter]}>
                      {I18N.t('quote.modal.confirm.close_msg', { locale: languageCode })}
                      {' '}
                      <Text style={styles.redText}>
                        {countDown}
                        s.
                      </Text>
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalAcceptConfirm;
