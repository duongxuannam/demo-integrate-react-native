import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import I18n from '../../config/locales';
import TabsMenuWithoutIcon from '../../components/common/TabsMenuWithoutIcon';
import Filter from '../../components/management-shipment/Filter';
import List from '../../components/management-shipment/List';
import EmptyShipment from '../../components/management-shipment/EmptyShipment';
import listingAction from '../../store/actions/listingAction';
import { QUERY } from '../../constants/app';

class ManagementShipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      isRefresh: false,
    };
  }

  componentDidMount() {
    const {
      tabFilter, toDate, fromDate, actions, textFilter
    } = this.props;
    actions.setFieldQuery({
      tabFilter,
      toDate,
      fromDate,
      textFilter,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      isListRefresh,
      actions,
      resetFilter,
    } = this.props;
    if (isListRefresh !== prevProps.isListRefresh && isListRefresh === false) {
      this.setState({ isRefresh: false });
    }

    if (resetFilter !== prevProps.resetFilter) {
      if (resetFilter) {
        this.setState({
          currentTab: QUERY.TAB_FILTER.PENDING,
          activeTab: 0,
        });
        actions.setFieldQuery({
          tabFilter: QUERY.TAB_FILTER.PENDING,
          toDate: '',
          fromDate: '',
          textFilter: '',
        });
      }
    }
  }

  onSwitchTab = (tab, id) => {
    const { currentTab } = this.state;
    const { actions } = this.props;
    if (currentTab !== tab) {
      this.setState({
        currentTab: tab,
        activeTab: id,
      });
      actions.setFieldQuery({
        tabFilter: tab,
      });
    }
  }

  renderHeaderFlatList = () => {
    const { activeTab } = this.state;
    const {
      languageCode,
      actions,
      total,
      tabFilter,
      resetFilter,
    } = this.props;
    return (
      <View style={[styles.mt30, Platform === 'ios' && { zIndex: 2 }]}>
        <TabsMenuWithoutIcon
          source={[
            {
              id: 0,
              title: I18n.t('shipment.management.pending', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.PENDING,
            },
            {
              id: 1,
              title: I18n.t('shipment.management.draft', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.DRAFT,
            },
            {
              id: 2,
              title: I18n.t('shipment.management.past', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.PAST,
            },
          ]}
          activeTab={activeTab}
          switchTab={this.onSwitchTab}
        />
        <View style={[styles.mt30, styles.mb30]}>
          <Filter actions={actions} tabFilter={tabFilter} total={total} resetFilter={resetFilter} />
        </View>
      </View>
    );
  }

  renderEmptyResult = () => {
    const { languageCode, tabFilter, navigation } = this.props;
    return (
      <View style={{ width: '100%', justifyContent: 'center' }}>
        <EmptyShipment tabFilter={tabFilter} navigation={navigation} languageCode={languageCode} />
      </View>
    );
  }

  callRefresh = () => {
    this.setState({ isRefresh: true });
    const {
      actions,
      tabFilter,
      fromDate,
      toDate,
      textFilter,
    } = this.props;
    const query = {
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter
      },
      Limit: 10,
      Page: 1
    };
    actions.getListShipments(query);
  }

  renderHeaderFlatList = () => {
    const { activeTab } = this.state;
    const {
      languageCode,
      app,
      actions,
      tabFilter,
      total,
      resetFilter,
    } = this.props;
    return (
      <View style={[styles.mt30, Platform === 'ios' && { zIndex: 2 }]}>
        <TabsMenuWithoutIcon
          source={[
            {
              id: 0,
              title: I18n.t('shipment.management.pending', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.PENDING,
            },
            {
              id: 1,
              title: I18n.t('shipment.management.draft', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.DRAFT,
            },
            {
              id: 2,
              title: I18n.t('shipment.management.past', { locale: languageCode }),
              tab: QUERY.TAB_FILTER.PAST,
            },
          ]}
          activeTab={activeTab}
          switchTab={this.onSwitchTab}
        />
        <View style={[styles.mt30, styles.mb30]}>
          <Filter app={app} actions={actions} tabFilter={tabFilter} total={total} resetFilter={resetFilter}/>
        </View>
      </View>
    );
  }

  getListShipmentWithCurrentFilter = () => {
    const { actions } = this.props;
    const {
      tabFilter,
      fromDate,
      toDate,
      textFilter,
    } = this.props;
    const query = {
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter
      },
      Limit: 10,
      Page: 1
    };
    actions.getListShipments(query);
  }

  loadMoreData = () => {
    const {
      actions,
      tabFilter,
      fromDate,
      toDate,
      textFilter,
      limit,
      page
    } = this.props;
    const query = {
      Query: {
        TabFilter: tabFilter,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter
      },
      Limit: limit,
      Page: page
    };
    actions.loadMoreAction(query);
  }

  onCancel = () => {
    const { actions } = this.props;
    const {
      fromDate,
      toDate,
      textFilter,
    } = this.props;
    const query = {
      Query: {
        TabFilter: QUERY.TAB_FILTER.PAST,
        FromDate: fromDate,
        ToDate: toDate,
        TextFilter: textFilter
      },
      Limit: 10,
      Page: 1
    };
    actions.getListShipments(query);
  }

  renderShipmentItem = ({ item }) => {
    const {
      languageCode,
      actions,
      navigation,
      tabFilter,
      countryCode,
      cancelReasons,
    } = this.props;
    return (
      <List
        countryCode={countryCode}
        source={{ ...item }}
        actions={actions}
        navigation={navigation}
        languageCode={languageCode}
        cancelReasons={cancelReasons}
        updateShipment={this.getListShipmentWithCurrentFilter}
        // onCancel={this.onCancel}
        onCancel={this.callRefresh}
        tabFilter={tabFilter}
      />
    );
  }

  render() {
    const { shipments } = this.props;
    const { isRefresh } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          ListEmptyComponent={this.renderEmptyResult}
          ListHeaderComponent={this.renderHeaderFlatList}
          data={shipments}
          extraData={shipments}
          refreshing={isRefresh}
          onRefresh={this.callRefresh}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={this.renderShipmentItem}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={80}
          windowSize={7}
          removeClippedSubviews
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  shipments: state.listing.shipments,
  isListRefresh: state.listing.isLoading,
  app: state.app,
  tabFilter: state.listing.tabFilter,
  fromDate: state.listing.fromDate,
  toDate: state.listing.toDate,
  textFilter: state.listing.textFilter,
  page: state.listing.page,
  limit: state.listing.limit,
  resetFilter: state.listing.resetFilter,
  total: state.listing.total,
  cancelReasons: state.listing.cancelReasons,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction },
    dispatch,
  ),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManagementShipment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
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
  pad20: {
    padding: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mt20: {
    marginTop: 20,
  },
  mr20: {
    marginRight: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
});
