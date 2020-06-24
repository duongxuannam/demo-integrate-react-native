import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
} from 'react-native';
import I18n from '../../../config/locales';
import styles from '../style';
import Attactments from '../../booking/attactments/Attactments';
import { checkValidNote } from '../../../helpers/shipment.helper';
import IMAGE_CONSTANT from '../../../constants/images';
import PROGRESS from '../../../constants/progress';

class MyComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerPhotos: [null, null, null],
      customerNotes: '',
      validNote: false,
      submit: false,
    };
  }

  componentDidMount() {
    const { source } = this.props;
    this.initData(source);
  }

  componentDidUpdate(prevProps) {
    const { source } = this.props;
    if (source !== prevProps.source) {
      this.initData(source);
    }
  }

  onCustomerNotes = (value) => {
    this.setState({
      customerNotes: value,
    });
  }

  initData = (source) => {
    if (source.customerAttachments && source.customerAttachments.length === 0) {
      this.setState({
        customerPhotos: [null, null, null]
      });
    } else if (source.customerAttachments && source.customerAttachments.length === 1) {
      this.setState({
        customerPhotos: [source.customerAttachments[0], null, null]
      });
    } else if (source.customerAttachments && source.customerAttachments.length === 2) {
      this.setState({
        customerPhotos: [source.customerAttachments[0], source.customerAttachments[1], null]
      });
    } else {
      this.setState({
        customerPhotos: source.customerAttachments
      });
    }
    this.setState({
      customerNotes: source.customerNotes
    });
  }

  onSaveCustomerNotes = () => {
    const { customerNotes } = this.state;
    const {
      section,
      countryCode,
      actions,
      shipmentID,
      source
    } = this.props;
    this.setState({
      submit: true
    });
    const validNote = checkValidNote(customerNotes, countryCode);
    this.setState({
      validNote,
    });
    if (validNote) {
      let objData = {
        section,
        data: {
          customerNotes,
        }
      };
      if (section === PROGRESS.SECTION.PICKUP || section === PROGRESS.SECTION.DELIVERY) {
        objData = {
          ...objData,
          data: {
            ...objData.data,
            addressId: source.addressId
          }
        }
      }
      actions.updateProgress(shipmentID, objData);
    }
  }

  render() {
    const {
      countryCode,
      languageCode,
      section,
      actions,
      shipmentID,
      source,
    } = this.props;
    const {
      customerPhotos,
      customerNotes,
      validNote,
      submit,
    } = this.state;
    return (
      <View style={styles.mb10}>
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.formHeader, { top: 2 }]}>
            {I18n.t('progress.your_comments', { locale: languageCode })}
          </Text>
        </View>
        <View style={[styles.whiteBg, styles.paddingHorizontal20,
          styles.paddingVertical30, styles.mb30, styles.grayBorder]}
        >
          <View style={styles.formGroupInput}>
            {submit && !validNote ? (
              <View style={[styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <Image source={IMAGE_CONSTANT.errorIcon} width={12} height={12} />
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mb10, styles.redText, styles.bold, styles.ml5]}>
                  {I18n.t('progress.msg_invalid_notes', { locale: languageCode })}
                </Text>
              </View>
            ) : (
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                {I18n.t('progress.notes', { locale: languageCode })}
              </Text>
            )}
            <TextInput
              style={[styles.input, { height: 'auto', minHeight: 60 }]}
              placeholder="Optional"
              value={customerNotes}
              onChangeText={this.onCustomerNotes}
              onBlur={this.onSaveCustomerNotes}
              maxLength={250}
              multiline
            />
          </View>
          <View style={styles.mt30}>
            <View style={styles.mt10}>
              <Attactments
                progress
                section={section}
                actions={actions}
                languageCode={languageCode}
                countryCode={countryCode}
                shipmentID={shipmentID}
                addressId={source.addressId}
                photos={customerPhotos}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default MyComment;
