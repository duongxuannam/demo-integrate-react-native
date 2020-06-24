import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HideDriverInfoCommunication, IsShipmentBooked } from '../../../helpers/shipment.helper';
import firebaseHelper from '../../../helpers/firebaseHelper';
import communicationActions from '../../../store/actions/communicationAction';
import {SHIPMENT_STATUS} from '../../../helpers/shipment.helper';
// COMPONENTS
import Chat from '../../common/Chat';
import I18n from '../../../config/locales';

// CSS
import styles from '../style';

class ChatWidget extends Component {
  constructor(props) {
    super(props);
    const { shipmentStatus } = this.props;
    this.state = {
      // tab: (shipmentStatus && HideDriverInfoCommunication(shipmentStatus) && 1) || 0,
      tab: (shipmentStatus && (shipmentStatus !== SHIPMENT_STATUS.DRAFT) && 1) || 0,
      source: [],
      newMessage: {},
      isLoading: false,

      driverOnline: false,
    };
  }

  componentDidMount() {
    const { driverInfo } = this.props;
    if (driverInfo) {
      firebaseHelper().firebaseGetStatusInfo(driverInfo.Id, (value) => {
        if (value.length > 0) {
          this.setState({ driverOnline: true });
        } else {
          this.setState({ driverOnline: false });
        }
      });
    }
  }

  onChangeTab = (tabIndex) => () => this.setState({ tab: tabIndex })

  renderTabView = (tabs, tabActive) => (
    <View style={[styles.flex, { borderTopWidth: 1, borderTopColor: 'rgba(200, 200, 200, 1)' }]}>
      {
        tabs.map((tab, index) => tab.canShow && (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={1}
            style={[
              styles.flexOne,
              styles.alignItemsCenter,
              styles.justifyContentCenter,
              {
                // height: 60,
                minHeight: 60,
                borderLeftWidth: 1,
                borderLeftColor: 'rgba(255, 255, 255, 1)',
                backgroundColor: index === tabActive ? 'rgba(255, 255, 255, 1)' : 'rgba(232, 232, 232, 1)'
              }
            ]}
            onPress={this.onChangeTab(tab.id)}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: tab.online ? 'rgba(76, 217, 100, 1)' : 'rgba(255, 59, 48, 1)',
                  marginRight: 10,
                }}
              />
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.medium, { width: 80 }]}>
                {tab.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      }
    </View>
  )

  render() {
    const { tab, driverOnline } = this.state;
    const {
      userInfo, chatType1, chatType3, chatType4, countryCode,
      shipmentCode, shipmentStatus, languageCode, shipmentId, driverInfo,
      newMessageType1, newMessageType3, newMessageType4, actions, listActive,
    } = this.props;
    return (
      <View style={[styles.whiteBg, styles.flexColumn, { height: 500 }, styles.mb30]}>
        {this.renderTabView([
          {
            id: 0, group: false, title: I18n.t('communication.carrier', { locale: languageCode }), online: driverOnline, canShow: IsShipmentBooked(shipmentStatus)
          },
          {
            id: 1, group: false, title: 'Deliveree', online: true, canShow: true
          },
          {
            id: 2, group: true, title: I18n.t('communication.group', { locale: languageCode }), online: driverOnline || true, canShow: IsShipmentBooked(shipmentStatus)
          },
        ], tab)}
        <Chat
          groupType={`${shipmentCode}-Type4`}
          isActiveGroup={tab === 0}
          me={userInfo}
          contentChat={chatType4}
          languageCode={languageCode}
          shipmentId={shipmentId}
          newMessage={newMessageType4}
          countryCode={countryCode}
          actions={actions}
        />
        <Chat
          groupType={`${shipmentCode}-Type1`}
          isActiveGroup={tab === 1}
          me={userInfo}
          contentChat={chatType1}
          languageCode={languageCode}
          shipmentId={shipmentId}
          newMessage={newMessageType1}
          countryCode={countryCode}
          actions={actions}
        />
        <Chat
          groupType={`${shipmentCode}-Type3`}
          isActiveGroup={(tab === 2)}
          me={userInfo}
          contentChat={chatType3}
          languageCode={languageCode}
          shipmentId={shipmentId}
          newMessage={newMessageType3}
          countryCode={countryCode}
          actions={actions}
        />
        {/* <Chat
          tabs={[
            { id: 1, group: false, title: 'Carrier', online: false, },
            { id: 2, group: false, title: 'Deliveree', online: true, },
            { id: 3, group: true, title: 'Group', online: true, },
          ]}
          activeTab={tab}
          source={source}
          newMessage={newMessage}
          isLoading={isLoading}
          onChangeTab={this.handleChangeTab}
          onChangeMessage={this.handleChangeMessage}
        /> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  driverInfo: state.listing.shipmentDetail.driver || null,
  chatType1: state.communication.chatDataType1 || [],
  chatType3: state.communication.chatDataType3 || [],
  chatType4: state.communication.chatDataType4 || [],
  shipmentCode: state.listing.shipmentDetail.code || null,
  shipmentStatus: state.listing.shipmentDetail.status || null,
  shipmentId: state.listing.shipmentDetail.id || null,
  countryCode: state.app.countryCode || 'vn',
  languageCode: state.app.languageCode || 'en',
  userInfo: state.auth.accountSelect || null,
  newMessageType1: state.communication.newMessageType1 || {},
  newMessageType3: state.communication.newMessageType3 || {},
  newMessageType4: state.communication.newMessageType4 || {},
  listActive: state.communication.listActive,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      sendChatAttachment: communicationActions.sendChatAttachment,
      downloadData: communicationActions.downloadData,
      updateShipmentChat: communicationActions.updateShipmentChat,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatWidget);
