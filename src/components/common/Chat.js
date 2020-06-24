import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import FirebaseHelper from '../../helpers/firebaseHelper';
import { formatDateChat } from '../../helpers/date.helper';
import ModalFileOrImage from './ModalFileOrImage';

import I18n from '../../config/locales';
import { SendSvg, AttachmentSvg, EmptyChatSvg } from './Svg';
import {
  validateFileAttachment,
  IMAGE_REGEX,
  decodedData,
  validateFile,
} from '../../helpers/regex';
import FormInput from './FormInput';
import WarningAlert from './WarningAlert';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';
import { TYPE_CHAT } from '../../constants/app';

import styles from '../shipment/style';

const { width } = Dimensions.get('window');

export const HEIGHT_HEADER = 60;

class Chat extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showWarningFile: false,
      showWarningSize: false,
      showOption: false,
    };
  }

  setRefFlatList = (ref) => {
    this.refFlatList = ref;
  };

  getTextInputChatRef = (ref) => {
    this.keywordChatRef = ref;
  };

  renderEmptyResult = (languageCode) => (
    <View
      style={[
        styles.flexColumn,
        styles.alignItemsCenter,
        styles.justifyContentCenter,
        { height: 285 },
      ]}
    >
      <EmptyChatSvg />
      <Text
        style={[
          { fontSize: 14, color: 'rgba(161, 161, 161, 1)' },
          styles.normal,
        ]}
      >
        {I18n.t('shipment.communication.talk_to_us', {
          locale: languageCode,
        })}
      </Text>
    </View>
  );

  handleScrollDown = () => {
    this.refFlatList.scrollToEnd({ animated: true });
  }

  sendText = () => {
    const {
      account,
      shipmentCode,
      activeTab,
      onChangeTab,
      shipmentId,
    } = this.props;
    const newMessage = this.selectNewMessage(activeTab);
    const messageInput = this.keywordChatRef.getValueInput();
    if (activeTab === undefined) {
      onChangeTab(0);
    }
    if (messageInput !== '') {
      const payload = {
        userID: account.id,
        userName: account.name,
        userRole: 'Carrier',
        messageType: 'Message',
        messageContent: messageInput,
        isRead: [account.id],
        sendAt: moment()
          .utc()
          .toISOString(),
        shipmentId,
      };
      FirebaseHelper().sendDataChat(
        shipmentCode,
        this.tabActive(activeTab),
        payload,
        this.sendSuccess,
        this.sendFailed,
      );
      if (Object.keys(newMessage).length > 0) {
        FirebaseHelper().markMessageRead(
          shipmentCode,
          this.tabActive(activeTab),
          newMessage.itemsUnRead,
          account.id,
        );
      }
    }
  };

  sendSuccess = (success) => {
    const { actions, shipmentId, activeTab } = this.props;
    this.keywordChatRef.onChangeText('');
    actions.updateShipmentChat(shipmentId, this.tabActive(activeTab));
  };

  sendFailed = (err) => {
    console.log('Send err: ', err);
  };

  tabActive = (activeTab) => {
    if (activeTab === 0) {
      return TYPE_CHAT.DRIVER_CUSTOMER_TYPE4;
    }
    if (activeTab === 1) {
      return TYPE_CHAT.DRIVER_ADMIN_TYPE2;
    }
    return TYPE_CHAT.GROUP_Type3;
  };

  renderToolbarChat = (languageCode) => (
    <View
      style={[
        styles.flex,
        styles.alignItemsCenter,
        styles.marginHorizontal20,
        styles.mb20,
        styles.mt10,
        {
          height: HEIGHT_HEADER,
          borderWidth: 1,
          borderColor: 'rgba(219, 219, 219, 1)',
          borderRadius: 4,
        },
      ]}
    >
      <View style={[styles.flexOne, styles.ml10, styles.mr10]}>
        <FormInput
          ref={this.getTextInputChatRef}
          viewInputStyle={[styles.justifyContentCenter]}
          inputStyle={[styles.smallSize, styles.defaultTextColor, styles.medium]}
          // defaultText=""
          placeHolder={`${I18n.t('shipment.communication.type_here', {
            locale: languageCode,
          })}...`}
          inputType="OTHER"
          onSubmitEditing={this.sendText}
        />
      </View>
      <TouchableOpacity
        style={{ marginRight: 15 }}
        // onPress={this.uploadFile}
        onPress={Platform.OS === 'android' ? this.uploadFile : this.toggleShowOption}
      >
        <AttachmentSvg />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mr15} onPress={this.sendText}>
        <SendSvg />
      </TouchableOpacity>
    </View>
  );

  handleDownload = (item) => () => {
    const { actions, languageCode } = this.props;
    actions.downloadData(
      item,
      String(
        I18n.t('shipment.payment.file_saved_to_this_device', {
          locale: languageCode,
        }).replace('[file_name]', item.fullFileName),
      ),
      true,
    );
  };

  renderChatItem = ({ item, index }) => {
    const {
      account,
      languageCode,
      countryCode,
      activeTab,
    } = this.props;
    const meChat = item.userID === account.id;
    const newMessage = this.selectNewMessage(activeTab);
    const newMessage99 = newMessage.count > 99;
    let detectBg;
    switch (item.userRole) {
      case 'Customer':
        detectBg = 'rgba(81, 175, 43, 0.1)';
        break;
      case 'Admin':
        detectBg = 'rgba(244, 67, 54, 0.1)';
        break;
      default:
        detectBg = 'rgba(249, 249, 249, 1)';
        break;
    }
    return (
      <View
        style={[
          styles.flex,
          meChat ? styles.justifyContentEnd : styles.justifyContentStart,
        ]}
      >
        <View style={{ width: '75%' }}>
          {Object.keys(newMessage).length > 0
            && index === newMessage.index ? (
              <View
                style={[
                  styles.flex,
                  styles.alignItemsCenter,
                  {
                    marginHorizontal: 20,
                  },
                ]}
              >
                <View style={[
                  {
                    width: newMessage99 ? 26 : 20,
                    height: newMessage99 ? 26 : 20,
                    borderRadius: newMessage99 ? 26 : 20,
                    backgroundColor: 'rgba(81, 175, 43, 1)',
                    marginRight: 5,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }]}
                >
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 12,
                      },
                      styles.medium,
                    ]}
                  >
                    {newMessage99 ? '99+' : newMessage.count}
                  </Text>
                </View>
                <Text
                  style={[styles.grayText, { fontSize: 14 }, styles.normal]}
                >
                  {newMessage.count > 1
                    ? I18n.t('shipment.communication.new_messages', {
                      locale: languageCode,
                    })
                    : I18n.t('shipment.communication.new_message', {
                      locale: languageCode,
                    })}
                </Text>
              </View>
            ) : null}
          <View
            style={{
              borderColor: meChat
                ? 'rgba(219, 219, 219, 1)'
                : 'rgba(229, 229, 234, 1)',
              borderWidth: 1,
              backgroundColor: detectBg,
              borderRadius: 4,
              marginHorizontal: 20,
              marginVertical: 10,
              paddingHorizontal: 20,
              paddingVertical: 13,
            }}
          >
            {item.messageType === 'Message' ? (
              <Text
                style={[
                  // styles.defaultSize,
                  styles.smallSize,
                  // styles.defaultColor,
                  styles.defaultTextColor,
                  { textAlign: meChat ? 'right' : 'left' },
                  styles.normal,
                ]}
              >
                {item.messageContent}
              </Text>
            ) : (
              <View
                style={{
                  flexDirection:
                    item.userRole === 'Carrier' ? 'row' : 'row-reverse',
                }}
              >
                <View
                  style={[
                    // styles.ml10,
                    // styles.mr10,
                    styles.upload,
                    styles.flexOne,
                    styles.alignItemsCenter,
                    styles.justifyContentCenter,
                    {
                      backgroundColor: 'rgba(219, 219, 219, 1)',
                      position: 'relative',
                    },
                  ]}
                >
                  <Image
                    style={{
                      width: width / 4.2,
                      height: width / 4.2,
                      zIndex: 1,
                    }}
                    // eslint-disable-next-line no-nested-ternary
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      IMAGE_REGEX.test(item.contentType)
                        ? { uri: item.messageContent }
                        : IMAGE_CONSTANT.fileAttachIcon
                    }
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      zIndex: 99,
                      right: 5,
                      top: 5,
                    }}
                    onPress={this.handleDownload(item)}
                  >
                    <Icon
                      name="download"
                      color="rgba(81, 175, 43, 1)"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ width: width / 4, marginHorizontal: 10 }}>
                  <Text
                    style={[styles.smallerSize, styles.defaultTextColor]}
                    numberOfLines={4}
                    ellipsizeMode="middle"
                  >
                    {item.fullFileName}
                  </Text>
                  <Text style={[styles.smallerSize, styles.grayText]}>
                    {decodedData(item.fileSize)}
                  </Text>
                </View>
              </View>
            )}
            <Text
              style={[
                // styles.smallSize,
                styles.smallerSize,
                {
                  color: 'rgba(142, 142, 147, 1)',
                  textAlign: meChat ? 'right' : 'left',
                  marginTop: 5,
                },
                styles.medium,
              ]}
            >
              {this.renderDateChat(
                item.sendAt,
                languageCode,
                countryCode,
                item.userRole,
                activeTab,
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderDateChat = (date, languageCode, countryCode, userRole, activeTab) => {
    let titleToday = '';
    let howChat = '';
    titleToday = formatDateChat(
      date,
      countryCode,
      languageCode
    );
    if (activeTab === 2) {
      switch (userRole) {
        case 'Customer':
          howChat = 'Customer • ';
          break;
        case 'Admin':
          howChat = 'Admin • ';
          break;
        default:
          howChat = '';
          break;
      }
    }
    return `${howChat}${titleToday}`;
  };

  toggleShowWarningSize = () => this.setState({ showWarningSize: !this.state.showWarningSize });

  toggleShowWarningFile = () => this.setState({ showWarningFile: !this.state.showWarningFile });

  uploadFile = async () => {
    const {
      actions,
      activeTab,
      shipmentId,
    } = this.props;
    const newMessage = this.selectNewMessage(activeTab);
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (Platform.OS === 'ios') {
        this.setState({ showOption: false });
      }
      if (response.uri) {
        const validFile = validateFileAttachment(response, 5);
        if (validFile === true) {
          actions.sendChatAttachment(
            response,
            this.tabActive(activeTab),
            shipmentId,
            newMessage,
          );
        } else if (validFile.type === 'size') {
          this.toggleShowWarningSize();
        } else {
          this.toggleShowWarningFile();
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('User canceled document picker: ', err);
        this.setState({ showOption: false });
      } else {
        throw err;
      }
    }
  };

  selectNewMessage = (activeTab) => {
    const { newMessageType4, newMessageType3, newMessageType2 } = this.props;
    let newMessage = {};
    switch (activeTab) {
      case 0:
        newMessage = newMessageType4;
        break;
      case 1:
        newMessage = newMessageType2;
        break;
      case 2:
        newMessage = newMessageType3;
        break;
      default:
        break;
    }
    return newMessage;
  }

  uploadImage = () => {
    const {
      activeTab, shipmentId, actions,
    } = this.props;
    const newMessage = this.selectNewMessage(activeTab);
    const options = {
      noData: true,
      mediaType: 'photo',
      quality: Platform.OS === 'ios' ? 0.75 : 1,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
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
        const validFile = validateFile(response, 5);
        if (validFile === true) {
          actions.sendChatAttachment(
            response,
            this.tabActive(activeTab),
            shipmentId,
            newMessage,
          );
        } else if (validFile.type === 'size') {
          this.toggleShowWarningSize();
        } else {
          this.toggleShowWarningFile();
        }
      }
    });
  };

  toggleShowOption = () => {
    const { showOption } = this.state;
    this.setState({ showOption: !showOption });
  };

  render() {
    const {
      tabs,
      activeTab,
      onChangeTab,
      languageCode,
      sourceType2,
      sourceType3,
      sourceType4
    } = this.props;
    let source = [];
    switch (activeTab) {
      case 0:
        source = sourceType4;
        break;
      case 1:
        source = sourceType2;
        break;
      case 2:
        source = sourceType3;
        break;
      default:
        break;
    }
    const { showWarningSize, showWarningFile, showOption } = this.state;
    console.log('SOURCE RENDER: ', source);
    return (
      <>
        <View
          style={[
            styles.flex,
            { borderTopWidth: 1, borderTopColor: 'rgba(200, 200, 200, 1)' },
          ]}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={1}
              style={[
                styles.flexOne,
                styles.alignItemsCenter,
                styles.justifyContentCenter,
                {
                  height: HEIGHT_HEADER,
                  borderLeftWidth: 1,
                  borderLeftColor: 'rgba(255, 255, 255, 1)',
                  backgroundColor:
                    index === activeTab
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(232, 232, 232, 1)',
                },
              ]}
              onPress={() => onChangeTab(index)}
            >
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: tab.online
                      ? 'rgba(76, 217, 100, 1)'
                      : 'rgba(255, 59, 48, 1)',
                    marginRight: 10,
                  }}
                />
                <Text
                  style={[
                    // styles.titleSize,
                    // styles.defaultColor,
                    styles.defaultSize,
                    styles.defaultTextColor,
                    styles.medium,
                  ]}
                >
                  {tab.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.flexOne]}>
          <FlatList
            ref={this.setRefFlatList}
            data={source}
            extraData={source}
            keyExtractor={(item) => `${item.id}`}
            renderItem={this.renderChatItem}
            ListEmptyComponent={this.renderEmptyResult(languageCode)}
            nestedScrollEnabled
            onContentSizeChange={this.handleScrollDown}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={25}
            initialNumToRender={16}
            windowSize={10}
          />
        </View>
        {this.renderToolbarChat(languageCode)}
        <ModalFileOrImage
          showOption={showOption}
          onRequestClose={this.toggleShowOption}
          languageCode={languageCode}
          titleFile={I18n.t('files', { locale: languageCode })}
          onUploadFile={this.uploadFile}
          onUploadImage={this.uploadImage}
        />
        <WarningAlert
          showWarning={showWarningSize}
          titleWarning={I18n.t('photoErrorSize', { locale: languageCode })}
          languageCode={languageCode}
          toggleShowWarning={this.toggleShowWarningSize}
        />
        <WarningAlert
          showWarning={showWarningFile}
          titleWarning={I18n.t('shipment.communication.fileErrorUnknown', {
            locale: languageCode,
          })}
          languageCode={languageCode}
          toggleShowWarning={this.toggleShowWarningFile}
        />
      </>
    );
  }
}

Chat.propTypes = {

};

Chat.defaultProps = {

};

export default Chat;
