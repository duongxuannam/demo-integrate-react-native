import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { CheckBox } from 'native-base';
import I18N from '../../../../config/locales';
import UrlImage from '../../../common/Image';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';

class ModalDeleteReason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleShowModalAcceptQuotes: true,
      reasonsSelected: [],
      isValid: false,
      isSubmit: false,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getReasonRejectQuote();
  }

  onCheckBoxPress = (id) => {
    const { reasonsSelected } = this.state;
    const tmp = reasonsSelected;

    if (tmp.includes(id)) {
      tmp.splice(tmp.indexOf(id), 1);
    } else {
      tmp.push(id);
    }
    this.setState({
      reasonsSelected: tmp,
      isValid: tmp.length > 0
    });
  }

  checkSelectedReason = () => {
    const { reasonsSelected } = this.state;
    this.setState({
      isValid: reasonsSelected.length > 0,
    });
    return reasonsSelected.length > 0;
  }

  closeModal = () => {
    const { onCloseModal } = this.props;
    onCloseModal();
  };

  handleDelete = () => {
    const { actions, source, shipmentId } = this.props;
    const { reasonsSelected } = this.state;
    this.setState({
      isSubmit: true
    });
    const isValid = this.checkSelectedReason();
    if (isValid) {
      actions.rejectQuote(source.id, reasonsSelected, shipmentId, (res, err) => {
        if (res) {
          this.closeModal();
        }
      });
    }
  }

  render() {
    const { isVisibleShowModalAcceptQuotes } = this.state;
    const { reasonsSelected, isValid, isSubmit } = this.state;
    const { reasonsRejectQuote, languageCode } = this.props;
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
                flex: 4,
              }]}
            >
              <View style={styles.pad20}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('quote.modal.delete.choose_reason', { locale: languageCode })}
                </Text>
                <Text style={[styles.smallSize, styles.grayText]}>
                  {I18N.t('quote.modal.delete.multiple_selections', { locale: languageCode })}
                </Text>
              </View>
              <View style={[styles.line, styles.ml20, styles.mr20]} />
              {reasonsRejectQuote.length > 0 ? (
                <ScrollView nestedScrollEnabled>
                  <View style={[styles.marginHorizontal20, styles.mb20, styles.ml20, styles.mr20]}>
                    {(isSubmit && !isValid) && (
                      <View style={[styles.flex, styles.alignItemsCenter]}>
                        <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 15, height: 15, marginRight: 5 }} />
                        <Text style={styles.redText}>
                          {I18N.t('quote.modal.delete.least_reason', { locale: languageCode })}
                        </Text>
                      </View>
                    )}
                    <FlatList
                      data={reasonsRejectQuote}
                      renderItem={({ item }) => (
                        <View style={[styles.flex, styles.alignItemsCenter, styles.mb20, styles.mt20]}>
                          <View style={[styles.flex, styles.alignItemsCenter]}>
                            <TouchableOpacity
                              style={[styles.flex, styles.alignItemsCenter]}
                              onPress={() => this.onCheckBoxPress(item.id)}
                            >
                              <CheckBox
                                checked={!!reasonsSelected.includes(item.id)}
                                color={(isSubmit && !isValid) ? 'red' : '#3fae29'}
                                selectedColor="#3fae29"
                              />
                              <Text style={[styles.defaultSize, styles.ml20]}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      keyExtractor={(item, index) => item.id}
                    />
                    {/* {Button} */}
                    <TouchableOpacity
                      style={styles.mt30}
                      activeOpacity={0.9}
                      onPress={this.handleDelete}
                    >
                      <Text style={[styles.formGroupButton, styles.redBg]}>
                        {I18N.t('quote.modal.delete.btn_text', { locale: languageCode })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              ) : null}
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export default ModalDeleteReason;
