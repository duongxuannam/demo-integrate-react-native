import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { CheckBox } from 'native-base';
import I18N from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  actionSize: {
    fontSize: 34,
    fontFamily: 'Roboto-Regular',
  },
  fs23: {
    fontSize: 23,
    fontFamily: 'Roboto-Regular',
  },
  titleSize: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  fs14: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  smallerSize: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  listSmallSize: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  boxSize: {
    fontSize: 28,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  lightSilver: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
  },
  silverBg: {
    backgroundColor: 'rgba(219, 219, 219, 1)',
  },
  yellowBg: {
    backgroundColor: 'rgba(255, 205, 0, 1)',
  },
  mainBg: {
    backgroundColor: 'rgba(81, 175, 43, 1)',
  },
  darkGreenBg: {
    backgroundColor: 'rgba(51, 115, 25, 1)',
  },
  lightGreenBg: {
    backgroundColor: 'rgba(216, 226, 212, 1)',
  },
  redBg: {
    backgroundColor: 'rgba(244, 67, 54, 1)',
  },
  mainColorText: {
    color: 'rgba(81, 175, 43, 1)',
  },
  dateActive: {
    color: 'rgba(14,115,15,1)'
  },
  darkGreenText: {
    color: 'rgba(14, 115, 15, 1)',
  },
  yellowText: {
    color: 'rgba(255, 205, 0, 1)',
  },
  grayText: {
    color: 'rgba(161, 161, 161, 1)',
  },
  whiteText: {
    color: 'rgba(255, 255, 255, 1)',
  },
  errorText: {
    color: '#f44336',
  },
  redText: {
    color: 'rgba(244, 67, 54, 1)',
  },
  notificationText: {
    color: 'rgba(40, 40, 40, 1)',
  },
  grayBorder: {
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
  },
  mainBorder: {
    borderWidth: 1,
    borderColor: 'rgba(81, 175, 43, 1)',
  },
  circleGrayBorder: {
    borderWidth: 1,
    borderColor: 'rgba(161, 161, 161, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },
  flexThree: {
    flex: 3,
  },
  flexTwo: {
    flex: 2,
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  normal: {
    fontFamily: 'Roboto-Regular',
  },
  zIndex1: {
    zIndex: 1,
  },
  zIndex2: {
    zIndex: 2,
  },
  Radius4: {
    borderRadius: 4,
  },
  pad20: {
    padding: 20,
  },
  pad15: {
    padding: 15,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  paddingVertical50: {
    paddingVertical: 50,
  },
  paddingVertical30: {
    paddingVertical: 30,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  paddingVertical15: {
    paddingVertical: 15,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  pt30: {
    paddingTop: 30,
  },
  pl20: {
    paddingLeft: 20,
  },
  pl15: {
    paddingLeft: 15,
  },
  pl10: {
    paddingLeft: 10,
  },
  pr20: {
    paddingRight: 20,
  },
  pr15: {
    paddingRight: 15,
  },
  pr10: {
    paddingRight: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  marginHorizontalMinus10: {
    marginHorizontal: -10,
  },
  mt30: {
    marginTop: 30,
  },
  mt25: {
    marginTop: 25,
  },
  mt20: {
    marginTop: 20,
  },
  mt15: {
    marginTop: 15,
  },
  mt10: {
    marginTop: 10,
  },
  mt5: {
    marginTop: 5,
  },
  ml20: {
    marginLeft: 20,
  },
  ml15: {
    marginLeft: 15,
  },
  mr20: {
    marginRight: 20,
  },
  mr15: {
    marginRight: 15,
  },
  mr25: {
    marginRight: 25,
  },
  mr10: {
    marginRight: 10,
  },
  mr5: {
    marginRight: 5,
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb15: {
    marginBottom: 15,
  },
  mb20: {
    marginBottom: 20,
  },
  mb25: {
    marginBottom: 25,
  },
  mb30: {
    marginBottom: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  ml5: {
    marginLeft: 5,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(161, 161, 161, 1)',
  },
  formGroupButton: {
    borderRadius: 4,
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    lineHeight: 60,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
});

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

  onCheckBoxPress = (id) => {

  }

  checkSelectedReason = () => {

  }

  closeModal = () => {

  };

  handleDelete = () => {

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
                flex: 8,
              }]}
            >
              <View style={[styles.pad15, styles.lightSilver, styles.Radius4]}>
                <View style={[styles.mb15, styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.csBanner} style={{ width: 72, height: 72 }} />
                  <View style={[styles.flexOne, styles.ml15]}>
                    <Text style={[styles.smallerSize, styles.defaultTextColor]}>
                      We are sorry to see you cancel this shipment. If there is an issue, get in touch with the Deliveree Customer Support and we will be sure to sort it out.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.9}>
                  <Text style={[styles.formGroupButton, styles.mainBg, { height: 48, lineHeight: 48 }]}>
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pad20}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  If you still want to cancel, please provide your reason for cancelling.
                </Text>
                <Text style={[styles.smallSize, styles.grayText]}>
                  Multiple selections allowed
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
                        <View style={[styles.flex, styles.alignItemsCenter, styles.mb10, styles.mt15, { marginLeft: -10 }]}>
                          <View style={[styles.flex, styles.alignItemsCenter]}>
                            <TouchableOpacity
                              style={[styles.flex, styles.alignItemsCenter]}
                              onPress={() => this.onCheckBoxPress(item.id)}
                            >
                              <CheckBox
                                checked={!!reasonsSelected.includes(item.id)}
                                color="#747474"
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
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.mt10}
                      activeOpacity={0.9}
                      onPress={this.handleDelete}
                    >
                      <Text style={[styles.formGroupButton, styles.mainColorText, styles.mainBorder]}>
                        Back
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.mt30}>
                      <Text style={[styles.mb30, styles.flexOne, styles.flex, styles.textCenter, styles.policy, styles.flexWrapper]}>
                        <Text style={[styles.smallSize, styles.policyText]}>
                          {`By cancelling this shipment you agree to Deliveree's `}
                        </Text>
                        <Text style={[styles.mainColorText, styles.smallSize, styles.bold]}>
                          Cancellation Policy.
                        </Text>
                      </Text>
                    </View>
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

ModalDeleteReason.defaultProps = {
  reasonsRejectQuote: [
    { id: 1, name: 'Reason Number 1' },
    { id: 2, name: 'Reason Number 2' },
    { id: 3, name: 'Reason Number 3' },
    { id: 4, name: 'Reason Number 4' },
    { id: 5, name: 'Reason Number 5' },
    { id: 6, name: 'Reason Number 6' },
    { id: 7, name: 'Reason Number 7' },
    { id: 8, name: 'Reason Number 8' },
  ]
};

export default ModalDeleteReason;
