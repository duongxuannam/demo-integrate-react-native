import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-navigation';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import WarningAlert from './WarningAlert';
import ModalFileOrImage from './ModalFileOrImage';
import AttachmentSvg from '../common/svg/AttachmentSvg';
import SendSvg from '../common/svg/SendSvg';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';
import { TYPE_CHAT } from '../../constants/app';
import FirebaseHelper from '../../helpers/firebaseHelper';
import { formatDateChat, dateClientWithFormat } from '../../helpers/date.helper';
import {
  validateFileProof,
  decodedData,
  IMAGE_REGEX,
  validateFile,
} from '../../helpers/regex';
import I18n from '../../config/locales';

const { width } = Dimensions.get('window');

export const HEIGHT_HEADER = 60;

const MessageType = {
  MESSAGE: 'Message',
  FILE: 'File'
};

class Chat extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      chatInputText: '',
      showWarningFile: false,
      showWarningSize: false,
      showOption: false,
    };
  }

  setRefFlatList = (ref) => {
    this.refFlatList = ref;
  };

  pushMessageContent = () => {
    const {
      me, groupType, shipmentId, newMessage,
    } = this.props;
    const { chatInputText } = this.state;
    if (chatInputText === '') {
      return;
    }
    const pushMessageContent = {
      userID: me.id,
      userName: me.name,
      userRole: 'Customer',
      messageType: 'Message',
      messageContent: chatInputText,
      isRead: [me.id],
      sendAt: moment()
        .utc()
        .toISOString(),
      shipmentId,
    };
    FirebaseHelper().sendDataChat(
      `/${groupType}`,
      { ...pushMessageContent },
      this.sendSuccessMessage,
      this.sendMessageFailed,
    );
    if (Object.keys(newMessage).length > 0) {
      FirebaseHelper().markMessageRead(
        `/${groupType}`,
        newMessage.itemsUnRead,
        me.id
      );
    }
  };

  sendSuccessMessage = () => {
    const { actions, groupType, shipmentId } = this.props;
    this.setState({ chatInputText: '' });
    actions.updateShipmentChat(shipmentId, groupType);
  };

  sendMessageFailed = (error) => {
    console.log('ERROR: ', error);
    alert('Message send failed');
  };

  onChatInputChanged = (message) => {
    this.setState({ chatInputText: message });
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
      <Image
        source={IMAGE_CONSTANT.emptyChat}
        style={{ width: 36, height: 36, marginBottom: 10 }}
      />
      <Text
        style={[
          { fontSize: 14, color: 'rgba(161, 161, 161, 1)' },
          styles.normal,
        ]}
      >
        {I18n.t('communication.talk_to_us', { locale: languageCode })}
      </Text>
    </View>
  );

  renderToolbarChat = () => {
    const { languageCode } = this.props;
    const { chatInputText } = this.state;
    return (
      <View
        style={[
          styles.flex,
          styles.alignItemsCenter,
          {
            height: HEIGHT_HEADER,
            marginBottom: 20,
            marginLeft: 20,
            marginRight: 20,
            borderWidth: 1,
            borderColor: 'rgba(219, 219, 219, 1)',
            borderRadius: 4,
          },
        ]}
      >
        <View style={{ marginRight: 15, flex: 1 }}>
          <TextInput
            // ref={this.getChatInputRef}
            style={[
              styles.defaultSize,
              styles.flexOne,
              styles.medium,
              // { color: 'rgba(161, 161, 161, 1)', marginLeft: 13 }
              styles.defaultTextColor,
              { marginLeft: 13 },
            ]}
            placeholder={`${I18n.t('communication.type_here', {
              locale: languageCode,
            })}...`}
            value={chatInputText}
            onChangeText={this.onChatInputChanged}
            onSubmitEditing={this.pushMessageContent}
          />
        </View>
        <TouchableOpacity
          style={{
            marginRight: 15,
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={Platform.OS === 'android' ? this.uploadFile : this.toggleShowOption}
        >
          {/* <Image
            source={IMAGE_CONSTANT.attachmentChat}
            style={{ width: 20, height: 24 }}
          /> */}
          <AttachmentSvg />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginRight: 20,
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
          onPress={this.pushMessageContent}
        >
          {/* <Image
            source={IMAGE_CONSTANT.sendChat}
            style={{ width: 24, height: 24 }}
          /> */}
          <SendSvg />
        </TouchableOpacity>
      </View>
    );
  };

  handleDownload = (item) => {
    const { actions, languageCode } = this.props;
    actions.downloadData(
      item,
      String(
        I18n.t('communication.file_saved_to_this_device', {
          locale: languageCode,
        }).replace('[file_name]', item.fullFileName)
      )
    );
  };

  renderChatItem = ({ item, index }) => {
    // console.log('ITEM DATA: ', item);
    const {
      me, newMessage, languageCode, countryCode, groupType
    } = this.props;
    const meChat = item.userID === me.id;
    const newMessage99 = newMessage.count > 99;
    let detectBg;
    switch (item.userRole) {
      case 'Carrier':
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
          {Object.keys(newMessage).length > 0 && index === newMessage.index ? (
            <View
              style={[
                styles.flex,
                styles.alignItemsCenter,
                {
                  // marginHorizontal: 20,
                  marginTop: 5,
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
              <Text style={[styles.grayText, { fontSize: 14 }, styles.normal]}>
                {newMessage.count > 1
                  ? I18n.t('communication.new_messages', {
                    locale: languageCode,
                  })
                  : I18n.t('communication.new_message', {
                    locale: languageCode,
                  })}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              backgroundColor: detectBg,
              borderColor: meChat
                ? 'rgba(219, 219, 219, 1)'
                : 'rgba(229, 229, 234, 1)',
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 20,
              paddingVertical: 15,
              marginTop: index === newMessage.index ? 10 : 20,
            }}
          >
            {this.renderMessageType(item, meChat)}
            <Text
              style={[
                styles.smallSize,
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
                groupType
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderMessageType = (item, meChat) => {
    if (item.messageType === MessageType.FILE) {
      return (
        <View
          style={{
            flexDirection: item.userRole === 'Carrier' ? 'row' : 'row-reverse',
          }}
        >
          <View
            style={[
              styles.upload,
              styles.flexOne,
              styles.alignItemsCenter,
              styles.justifyContentCenter,
              {
                backgroundColor: 'rgba(219, 219, 219, 1)',
                position: 'relative',
                padding: 5,
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
                  : IMAGE_CONSTANT.fileImage
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
              onPress={() => this.handleDownload(item)}
            >
              <Icon name="download" color="rgba(81, 175, 43, 1)" size={24} />
            </TouchableOpacity>
          </View>

          <View style={{ width: width / 4, marginHorizontal: 10 }}>
            <Text
              style={[styles.smallSize, styles.defaultTextColor]}
              numberOfLines={4}
              ellipsizeMode="middle"
            >
              {item.fullFileName}
            </Text>
            <Text style={[styles.smallSize, styles.grayText]}>
              {decodedData(item.fileSize)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Text
        style={[
          styles.defaultTextColor,
          styles.normal,
          styles.defaultSize,
          { textAlign: meChat ? 'right' : 'left' },
        ]}
      >
        {item.messageContent}
      </Text>
    );
  };

  renderDateChat = (date, languageCode, countryCode, userRole, activeTab) => {
    let titleToday = '';
    let howChat = '';
    titleToday = formatDateChat(date, countryCode, languageCode);
    if (activeTab.split('-')[1] === TYPE_CHAT.GROUP_TYPE3) {
      switch (userRole) {
        case 'Carrier':
          howChat = 'Carrier • ';
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
      groupType, shipmentId, actions, newMessage,
    } = this.props;
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (Platform.OS === 'ios') {
        this.setState({ showOption: false });
      }
      if (response.uri) {
        const validFile = validateFileProof(response, 5);
        if (validFile === true) {
          const formData = new FormData();
          const imgFileName = response.name;
          const imgSplit = imgFileName.split('.');
          formData.append('files', {
            uri: response.uri,
            type: response.type || `image/${imgSplit[imgSplit.length - 1]}`,
            name: imgFileName,
          });
          actions.sendChatAttachment(
            formData,
            `/${groupType}`,
            shipmentId,
            response.size,
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

  toggleShowOption = () => {
    const { showOption } = this.state;
    this.setState({ showOption: !showOption });
  };

  uploadImage = () => {
    const {
      groupType, shipmentId, actions, newMessage,
    } = this.props;
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
          const formData = new FormData();
          const imgFileName = response.fileName || response.name;
          const imgSplit = imgFileName.split('.');
          formData.append('files', {
            uri: response.uri,
            type:
                response.type
                || `image/${imgSplit[imgSplit.length - 1]}`,
            name: imgFileName,
          });
          actions.sendChatAttachment(
            formData,
            `/${groupType}`,
            shipmentId,
            response.size || response.fileSize,
            newMessage
          );
        } else if (validFile.type === 'size') {
          this.toggleShowWarningSize();
        } else {
          this.toggleShowWarningFile();
        }
      }
    });
  };

  render() {
    const {
      groupType,
      isActiveGroup,
      me,
      user,
      contentChat,
      languageCode,
    } = this.props;
    const { showWarningSize, showWarningFile, showOption } = this.state;
    return (
      <View
        style={[
          isActiveGroup ? styles.flexOne : { height: 0 },
          styles.flexColumn,
        ]}
      >
        <FlatList
          ref={this.setRefFlatList}
          style={{ height: isActiveGroup ? 'auto' : 0, marginBottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: 19 }}
          data={(me && contentChat) || []}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={this.renderChatItem}
          ListEmptyComponent={this.renderEmptyResult(languageCode)}
          extraData={(me && contentChat) || []}
          nestedScrollEnabled
          onContentSizeChange={() => this.refFlatList.scrollToEnd({ animated: true })}
          removeClippedSubviews
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={25}
          initialNumToRender={16}
          windowSize={10}
        />
        {isActiveGroup && this.renderToolbarChat()}
        <WarningAlert
          showWarning={showWarningSize}
          titleWarning={I18n.t('communication.photoErrorSize', {
            locale: languageCode,
          })}
          languageCode={languageCode}
          toggleShowWarning={this.toggleShowWarningSize}
        />
        <WarningAlert
          showWarning={showWarningFile}
          titleWarning={I18n.t('communication.fileErrorUnknown', {
            locale: languageCode,
          })}
          languageCode={languageCode}
          toggleShowWarning={this.toggleShowWarningFile}
        />

        <ModalFileOrImage
          showOption={showOption}
          onRequestClose={this.toggleShowOption}
          languageCode={languageCode}
          titleFile={I18n.t('progress.files', { locale: languageCode })}
          onUploadFile={this.uploadFile}
          onUploadImage={this.uploadImage}
        />
      </View>
    );
  }
}

Chat.propTypes = {
  groupType: PropTypes.string.isRequired,
  isActiveGroup: PropTypes.bool.isRequired,
  me: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.arrayOf(PropTypes.any),
  contentChat: PropTypes.arrayOf(PropTypes.any),
  languageCode: PropTypes.string
};

Chat.defaultProps = {
  user: [],
  me: null,
  contentChat: [],
  languageCode: 'en'
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
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
  smallSize: {
    fontSize: 13,
  },
  defaultSize: {
    fontSize: 15,
  },
  titleSize: {
    fontSize: 17,
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  grayText: {
    color: 'rgba(161, 161, 161, 1)',
  },
  ml10: {
    marginLeft: 10
  },
  mr10: {
    marginRight: 10
  },
  upload: {
    width: width / 4,
    height: width / 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 1)',
    borderStyle: 'dashed',
  },
});

export default Chat;
