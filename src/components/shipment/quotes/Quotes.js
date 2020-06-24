import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Platform
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Select from '../../common/Select';
import List from './List';
import IMAGE_CONSTANT from '../../../constants/images';
import styles from '../style';
import I18n from '../../../config/locales';
import shipmentAction from '../../../store/actions/shipmentAction';
import { computeTimeLeft, roundDecimalToMatch } from '../../../helpers/shipment.helper';
import { formatMetricsWithCommas } from '../../../helpers/regex';

const sortQuoteItem = [
  {
    id: 1, sort: 'Price', name: 'Low to High', sortOrder: '0', sortOrderTitle: 'Ascending'
  },
  {
    id: 2, sort: 'Price', name: 'High to Low', sortOrder: '1', sortOrderTitle: 'Descending'
  },
  {
    id: 3, sort: 'MostRecent', name: 'Most Recent', sortOrder: '0', sortOrderTitle: 'Ascending'
  },
];

class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: sortQuoteItem[0],
      isRefresh: false
    };
  }

  componentDidUpdate(prevProps) {
    const { isListRefresh } = this.props;
    if (isListRefresh !== prevProps.isListRefresh && isListRefresh === false) {
      this.setState({ isRefresh: false });
    }
  }

  handleBid = () => {
    const { navigation } = this.props;
    navigation.navigate('ShipmentPlaceStack');
  }

  handleChange = (selected) => {
    const { currentShipmentID, actions } = this.props;
    this.setState({ selected });
    actions.setQuoteDetailSort(selected.sort, selected.sortOrder);
    actions.setQuoteDetail(currentShipmentID);
  }

  loadPrice = (price, currency) => {
    const formatPrice = roundDecimalToMatch(price, 2);
    return `${currency} ${formatMetricsWithCommas(formatPrice)}`;
  }

  loadMoreData = () => {
    const { actions, currentShipmentID } = this.props;
    actions.loadMoreAction(currentShipmentID);
  }

  render() {
    const { isRefresh, selected } = this.state;
    const {
      quoteItemsList, quoteAdvanceItem, languageCode, totalRecord, transportModeID, isQuoted
    } = this.props;
    return (
      <>
        <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
          <View style={[styles.flex, styles.alignItemsCenter, styles.whiteBg, styles.pad15, styles.Radius4, styles.grayBorder, styles.mb10]}>
            <View style={styles.flexOne}>
              <Image source={IMAGE_CONSTANT.quotesIcon} style={{ width: 36, height: 36 }} />
            </View>
            <View>
              <Text style={[styles.boxSize, styles.defaultTextColor, styles.textRight, styles.bold]}>
                {`${totalRecord} ${I18n.t('shipment.detail.quotes_1', { locale: languageCode })}`}
              </Text>
              {totalRecord !== 0 ? (
                <Text style={[styles.smallSize, styles.defaultTextColor, styles.textRight, styles.mt5]}>
                  {`${I18n.t('shipment.lowest', { locale: languageCode })} ${this.loadPrice(quoteAdvanceItem.lowestPrice, quoteAdvanceItem.currency)}`}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={[styles.flex, styles.alignItemsCenter, styles.whiteBg, styles.pad15, styles.Radius4, styles.grayBorder]}>
            <View style={styles.flexOne}>
              <Image source={IMAGE_CONSTANT.clock} />
            </View>
            <View>
              <Text style={[styles.boxSize, styles.defaultTextColor, styles.textRight, styles.bold]}>
                {computeTimeLeft(quoteAdvanceItem.approvedDate)}
              </Text>
              <Text style={[styles.smallSize, styles.defaultTextColor, styles.textRight, styles.mt5]}>
                {I18n.t('shipment.detail.time_left', { locale: languageCode })}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        {totalRecord !== 0 ? (
          <View style={[styles.marginHorizontal20, styles.mt30, styles.mb30]}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.titleSize, styles.defaultTextColor, styles.bold, { flex: 1 }]}>
                {`${totalRecord} ${I18n.t('shipment.detail.quotes_1', { locale: languageCode })}`}
              </Text>
              <View style={{ flex: 2, zIndex: 4 }}>
                <Select
                  placeholder={`${I18n.t('shipment.price', { locale: languageCode })}: Low to High`}
                  source={sortQuoteItem}
                  selectedValue={selected}
                  onValueChange={this.handleChange}
                  whiteBg
                />
              </View>
            </View>
          </View>
        ) : null}
        <FlatList
          style={Platform.OS === 'ios' && { zIndex: -1 }}
          data={quoteItemsList}
          extraData={this.state}
          renderItem={({ item, index }) => <List transportMode={transportModeID} source={item} index={index} currency={quoteAdvanceItem.currency} />}
          keyExtractor={(item) => `${item.DriverId}`}
          refreshing={isRefresh}
          onEndReached={this.loadMoreData}
          onEndReachedThreshold={0.1}
        />
        {!isQuoted && (
        <View style={[styles.paddingHorizontal20, styles.pt15, styles.pb15, styles.whiteBg]}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={this.handleBid}
          >
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr10]}>
              {I18n.t('shipment.detail.placeBid', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        )}
      </>
    );
  }
}

Quotes.defaultProps = {
  languageCode: 'en',
};

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  countryCode: state.config.countryCode,
  currentShipmentID: state.shipment.shipmentDetail.id,
  isQuoted: state.shipment.shipmentDetail.isQuoted,
  quoteItemsList: state.shipment.quoteItemsList,
  quoteAdvanceItem: state.shipment.quoteAdvanceItem,
  isListRefresh: state.shipment.isLoading,
  totalRecord: state.shipment.total,
  transportModeID: state.shipment.shipmentDetail.transportTypeId
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      setQuoteDetail: shipmentAction.setQuoteDetail,
      setQuoteDetailSort: shipmentAction.setQuoteDetailSort,
      loadMoreAction: shipmentAction.setQuoteDetailLoadMore
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Quotes);
