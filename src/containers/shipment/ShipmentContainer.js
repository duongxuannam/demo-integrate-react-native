import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
// import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

// COMPONENTS
// import Notification from '../../components/shipment/Notification';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../../components/shipment/Header';
import TabsMenu from '../../components/shipment/TabsMenu';
import Filter from '../../components/shipment/Filter';
import ShipmentContent from '../../components/shipment/ShipmentContent';
import ShipmentItem from '../../components/shipment/ShipmentItem';
import GoogleMap from '../../components/shipment/googleMap';
import I18n from '../../config/locales';
import IMAGE_CONSTANT from '../../constants/images';
import { LIST_VIEW_TYPE, MAP_POINT_TYPE } from '../../constants/app';
import shipmentAction from '../../store/actions/shipmentAction';
import driverAction from '../../store/actions/driverAction';
import appAction from '../../store/actions/appAction';
import notificationAction from '../../store/actions/notificationAction';
import styles from '../style';
import authAction from '../../store/actions/authAction';
import APP_CONSTANT, { STATUS_FILTER, SORT_FILTER } from '../../helpers/constant.helper';
import { width, height } from '../../helpers/scaling.helpers';

export const SHIPMENT_TAB = {
  SEARCH: 0,
  WATCH: 1,
  SHIPMENT: 2,
  MAP: 3,
};

class ShipmentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleShowModal: false,
      dropDownPos: null,
      tabIndexActive: 0,
      isRefresh: false,
    };

    this.navigateToScreen = this.navigateToScreen.bind(this);
    this.resultList = [];
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getHandleUnit();
    actions.getLocationType();
    // const pickupDateUtc = moment(new Date()).utc().toISOString();
    // actions.setFieldQuery({
    //   pickupStartDateFilter: moment(pickupDateUtc).startOf('day').utc().toISOString(),
    //   pickupEndDateFilter: moment(pickupDateUtc).endOf('day').utc().toISOString(),
    // });
    actions.setFieldQuery({ TabFilter: APP_CONSTANT.SEARCH });
  }

  componentDidUpdate(prevProps) {
    const { isListRefresh, token } = this.props;
    if (isListRefresh !== prevProps.isListRefresh && isListRefresh === false) {
      this.setState({ isRefresh: false });
    }
    if (token !== prevProps.token && token === null) {
      this.navigateToScreen({ id: 0, title: 'Loads', route: 'SearchStack' });
    }
  }

  handleGetAddressResult = (resultList, node) => {
    console.log('Address List: ', resultList, node);
    if (node) {
      const { actions } = this.props;
      this.resultList = resultList;
      node.ref.measureInWindow((x, y, w, h) => {
        actions.getDataAddressDropdown(resultList, {
          x,
          y,
          w,
          h,
          type: node.type,
          radius: node.radius,
          index: node.index,
          anotherPickup: node.anotherPickup || null
        });
      });
    }
  }

  getFlatListRef = (ref) => { this.flatListRef = ref; }

  moveToLogin = () => {
    const { navigation, token, actions } = this.props;
    if (token) {
      actions.callLogout();
      actions.changeNumberUnRead(0);
      this.setState({ tabIndexActive: SHIPMENT_TAB.SEARCH });
    } else {
      navigation.navigate('Login');
    }
  }

  loadMoreData = () => {
    const { actions } = this.props;
    actions.loadMoreAction();
  }

  callRefresh = () => {
    const { actions } = this.props;
    this.setState({ isRefresh: true });
    actions.getHandleUnit();
    actions.getLocationType();
    actions.setFieldQuery({});
  }

  closeModal = () => {
    this.setState({
      isVisibleShowModal: false,
      dropDownPos: null,
    });
    this.resultList = [];
  }

  navigateToScreen(route) {
    console.log('ROUTE: ', route);
    const { navigation, token } = this.props;
    this.setState({ tabIndexActive: route.id });

    if ((route.id === 1 || route.id === 2) && !token) {
      navigation.navigate('Login');
      return;
    }

    const { actions } = this.props;
    if (route.id === 1) {
      // actions.setFieldQuery({ IsWatchingTab: true, IsMyShipmentTab: false });
      actions.setFieldQuery({ TabFilter: APP_CONSTANT.WATCHING });
    } else if (route.id === 2) {
      // actions.setFieldQuery({ IsWatchingTab: false, pickupStartDateFilter: '', pickupEndDateFilter: '', IsMyShipmentTab: true, sortFilter: 'Price' });
      actions.setFieldQuery({
        TabFilter: APP_CONSTANT.MY_SHIPMENT, pickupStartDateFilter: '', pickupEndDateFilter: '', sortFilter: 'Price'
      });
      actions.selectSortItem({
        id: 4,
        icon: null,
        title: SORT_FILTER.LOW_TO_HIGH,
        value: SORT_FILTER.PRICE,
        isActive: true,
      });
    } else {
      // actions.setFieldQuery({ IsWatchingTab: false, IsMyShipmentTab: false });
      actions.setFieldQuery({ TabFilter: APP_CONSTANT.SEARCH });
    }
    // actions.setFieldQuery(route.id === 1 ? { IsWatchingTab: true } : { IsWatchingTab: false });
    // const { navigation } = this.props;
    // const navigateAction = NavigationActions.navigate({
    //   routeName: route
    // });
    // navigation.dispatch(navigateAction);
  }

  renderModal() {
    const { dropDownPos } = this.state;
    return (
      <View style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      >
        <TouchableWithoutFeedback onPress={this.closeModal}>
          <View style={{
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            flex: 1,
            width,
          }}
          >
            {dropDownPos && this.renderDropDown(dropDownPos)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderDropDown = (dropdownPos) => {
    const left = dropdownPos.x;
    return (
      <View style={{
        position: 'absolute',
        left: left >= 0 ? left : 1,
        top: (dropdownPos.y + 100),
        backgroundColor: '#fff',
        borderRadius: 4,
        width: dropdownPos.w,
        height: 200
      }}
      >
        <View style={[styles.dropdownArrow, { borderBottomColor: 'rgba(81, 175, 43, 1)' }]} />
        <View style={[styles.dropdownGroup, { borderColor: 'rgba(81, 175, 43, 1)', borderWidth: 1 }]}>
          {this.resultList.map((address, key) => (
            <TouchableOpacity
              key={`address-${address.id}`}
              style={[styles.flex, styles.alignItemsCenter, this.resultList.length - 1 === key ? null : { marginBottom: 15 }]}
              activeOpacity={0.9}
            >
              <Text style={[{ fontSize: 17, marginLeft: 10, fontFamily: 'Roboto-Regular', }]}>
                address
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  renderContent() {
    const { tabIndexActive } = this.state;
    const { languageCode, countryCode, actions } = this.props;
    switch (tabIndexActive) {
      case SHIPMENT_TAB.SHIPMENT:
        return <ShipmentContent languageCode={languageCode} countryCode={countryCode} actions={actions} />;
      case SHIPMENT_TAB.WATCH:
        return <ShipmentContent languageCode={languageCode} countryCode={countryCode} actions={actions} />;
      default:
        return <ShipmentContent languageCode={languageCode} countryCode={countryCode} actions={actions} />;
    }
  }

  renderEmptyResult = () => {
    const { languageCode } = this.props;
    return (
      <View style={{
        height: 100, alignItems: 'center', justifyContent: 'center', zIndex: -2
      }}
      >
        <Text style={[styles.defaultSize, styles.defaultTextColor]}>{I18n.t('noResult', { locale: languageCode })}</Text>
      </View>
    );
  }

  renderHeaderFlatList = () => {
    const { tabIndexActive } = this.state;
    const {
      actions,
      handleUnits,
      locationTypes,
      rootPickup,
      rootDelivery,
      anotherPickup,
      anotherDelivery,
      languageCode,
      countryCode,
      token,
      dataConfig,
    } = this.props;
    return (
      <View>
        <Header requestLogin={this.moveToLogin} token={token} languageCode={languageCode} />
        <TabsMenu
          source={[
            // { id: 0, title: I18n.t('tab_menu.search', { locale: languageCode }), route: 'SearchStack' },
            // { id: 1, title: I18n.t('tab_menu.watching', { locale: languageCode }), route: 'WatchingStack' },
            // { id: 2, title: I18n.t('tab_menu.my_shipments', { locale: languageCode }), route: 'MyShipmentsStack' },
            { id: 0, title: I18n.t('tab_menu.loads', { locale: languageCode }), route: 'SearchStack' },
            { id: 1, title: I18n.t('tab_menu.watchlist', { locale: languageCode }), route: 'WatchingStack' },
            { id: 2, title: I18n.t('tab_menu.won', { locale: languageCode }), route: 'MyShipmentsStack' },
          ]}
          activeTab={tabIndexActive}
          navigateToScreen={this.navigateToScreen}
        />

        {tabIndexActive === SHIPMENT_TAB.SHIPMENT ? null : (
          <Filter
            actions={actions}
            handleUnits={handleUnits}
            locationTypes={locationTypes}
            rootPickup={rootPickup}
            anotherPickup={anotherPickup}
            rootDelivery={rootDelivery}
            anotherDelivery={anotherDelivery}
            languageCode={languageCode}
            countryCode={countryCode}
            dataConfig={dataConfig}
            scrollRef={this.flatListRef}
            onGetResultAddress={this.handleGetAddressResult}
          />
        )}
        {this.renderContent()}
      </View>
    );
  }

  renderShipmentItem = ({ item }) => {
    const {
      languageCode, listViewType, shipmentDataList, navigation
    } = this.props;
    if (listViewType === LIST_VIEW_TYPE.LIST) {
      return (
        <ShipmentItem
          data={{ ...item }}
          languageCode={languageCode}
        />
      );
    }

    return (
      <GoogleMap listPoint={shipmentDataList.map((itemShipment) => itemShipment.addresses.pickup.location)} />
    );
  }

  render() {
    const { isVisibleShowModal, isRefresh } = this.state;
    const { shipmentDataList, listViewType } = this.props;
    return (
      <View style={[styles.container]}>
        <KeyboardAwareFlatList
          innerRef={this.getFlatListRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          // enableOnAndroid={Platform.OS === 'android'}
          // extraHeight={Platform.OS === 'android' ? 300 : 300}
          // extraScrollHeight={height * (Platform.OS === 'android' ? 0.25 : 0.3)}
          enableAutomaticScroll={Platform.OS === 'android'}
          ListEmptyComponent={this.renderEmptyResult}
          ListHeaderComponent={this.renderHeaderFlatList}
          data={listViewType === LIST_VIEW_TYPE.LIST ? shipmentDataList : [1]}
          extraData={shipmentDataList}
          refreshing={isRefresh}
          onRefresh={this.callRefresh}
          keyExtractor={(item) => `${item.id}`}
          renderItem={this.renderShipmentItem}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={100}
          windowSize={10}
          removeClippedSubviews
          keyboardShouldPersistTaps="handled"
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  handleUnits: state.shipment.handleUnits,
  locationTypes: state.shipment.locationTypes,
  shipmentDataList: state.driver.shipmentDataList,
  rootPickup: state.driver.rootPickup,
  rootDelivery: state.driver.rootDelivery,
  anotherPickup: state.driver.anotherPickup,
  anotherDelivery: state.driver.anotherDelivery,
  listViewType: state.driver.listViewType,
  listShipmentMapView: state.driver.listShipmentMapView,
  isListRefresh: state.driver.isLoading,
  token: state.auth.token,
  dataConfig: state.config.dataConfig,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...appAction,
      ...shipmentAction,
      ...driverAction,
      callLogout: authAction.signOut,
      changeNumberUnRead: notificationAction.changeTotalUnreadNotification,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentContainer);
