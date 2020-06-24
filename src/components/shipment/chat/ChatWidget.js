import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// COMPONENTS
import Chat from '../../common/Chat';
import chatActions from '../../../store/actions/chatAction';
import firebaseHelper from '../../../helpers/firebaseHelper';
import paymentActions from '../../../store/actions/paymentAction';
import I18n from '../../../config/locales';
// CSS
import styles from '../style';
import { TYPE_CHAT } from '../../../constants/app';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      source: [],
      newMessage: {},

      customerOnline: false,
    };
  }

  componentDidMount() {
    const { customerInfo } = this.props;
    if (customerInfo) {
      firebaseHelper().firebaseGetStatusInfo(customerInfo.id, (value) => {
        if (value.length > 0) {
          this.setState({ customerOnline: true });
        } else {
          this.setState({ customerOnline: false });
        }
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  componentDidUpdate(prevProps) {
    const {
      sourceType2,
      sourceType3,
      sourceType4,
      newMessageType2,
      newMessageType3,
      newMessageType4,
    } = this.props;
    const { tab, source, newMessage } = this.state;
    if (prevProps.sourceType2 !== sourceType2) {
      this.setState({
        source: tab === 1 ? sourceType2 : source,
        newMessage: tab === 1 ? newMessageType2 : newMessage,
      });
    }
    if (prevProps.sourceType3 !== sourceType3) {
      this.setState({
        source: tab === 2 ? sourceType3 : source,
        newMessage: tab === 2 ? newMessageType3 : newMessage,
      });
    }
    if (prevProps.sourceType4 !== sourceType4) {
      this.setState({
        source: tab === 0 ? sourceType4 : source,
        newMessage: tab === 0 ? newMessageType4 : newMessage,
      });
    }
  }

  handleChangeTab = (tabInput) => {
    const { tab } = this.state;
    if (tab === tabInput) {
      return;
    }
    this.setState({ tab: tabInput });
  };

  render() {
    const {
      account,
      shipmentCode,
      languageCode,
      countryCode,
      actions,
      shipmentId,
      sourceType2,
      sourceType3,
      sourceType4,
      newMessageType2,
      newMessageType3,
      newMessageType4,
    } = this.props;
    const { tab, customerOnline } = this.state;
    return (
      <View
        style={[
          styles.whiteBg,
          styles.flexColumn,
          // { height: 427 },
          { height: 500 },
          styles.mb30,
        ]}
      >
        <Chat
          tabs={[
            {
              id: 1,
              group: false,
              title: I18n.t('shipment.communication.customer', {
                locale: languageCode,
              }),
              online: customerOnline,
            },
            {
              id: 2,
              group: false,
              title: 'Deliveree',
              online: true,
            },
            {
              id: 3,
              group: true,
              title: I18n.t('shipment.communication.group', {
                locale: languageCode,
              }),
              online: customerOnline || true,
            },
          ]}
          activeTab={tab}
          onChangeTab={this.handleChangeTab}
          account={account}
          shipmentCode={shipmentCode}
          languageCode={languageCode}
          countryCode={countryCode}
          actions={actions}
          shipmentId={shipmentId}
          sourceType2={sourceType2}
          sourceType3={sourceType3}
          sourceType4={sourceType4}
          newMessageType2={newMessageType2}
          newMessageType3={newMessageType3}
          newMessageType4={newMessageType4}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  account: state.auth.account,
  shipmentCode: state.shipment.shipmentDetail.code,
  shipmentId: state.shipment.shipmentDetail.id,
  shipmentStatus: state.shipment.shipmentDetail.status,
  sourceType2: state.chat.sourceType2,
  sourceType3: state.chat.sourceType3,
  sourceType4: state.chat.sourceType4,
  newMessageType2: state.chat.newMessageType2,
  newMessageType3: state.chat.newMessageType3,
  newMessageType4: state.chat.newMessageType4,
  customerInfo: state.chat.customerInfo,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      sendChatAttachment: chatActions.sendChatAttachment,
      downloadData: paymentActions.downloadData,
      updateShipmentChat: chatActions.updateShipmentChat,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatWidget);
