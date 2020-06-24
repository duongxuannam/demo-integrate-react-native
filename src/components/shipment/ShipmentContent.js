import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import IMAGE_CONSTANT from '../../constants/images';
import I18n from '../../config/locales';
import styles from './style';
import DropdownList from '../common/DropdownList';
import FormInput from '../common/FormInput';
import driverAction from '../../store/actions/driverAction';
import appActions from '../../store/actions/appAction';
import { LIST_VIEW_TYPE } from '../../constants/app';
import APP_CONSTANT from '../../helpers/constant.helper';

class ShipmentContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleListMode: false,
      pickupDate: null,
      isSortAsc: true,
      hideTextDate: true,
    };
  }

  getDateFormatByCountry = (countryCode, languageCode = 'en') => {
    if (countryCode === 'vn') {
      return languageCode === 'en' ? 'DD-MMM-YYYY' : 'DD-[Th]MM YYYY';
    }
    return 'DD-MMM-YYYY';
  };

  renderCustomIcon = (languageCode, sortFieldSelected, isMyShipmentTab) => (
    <View style={[styles.flex, styles.alignItemsCenter, styles.h32]}>
      <Text
        style={[
          styles.defaultSize,
          styles.defaultCustomColor,
          styles.medium,
          styles.mr5,
          { width: isMyShipmentTab ? 140 : 103 },
        ]}
        numberOfLines={1}
      >
        {I18n.t('sort', { locale: languageCode })}
        :
        {/* {sortFieldSelected.title} */}
        {I18n.t(`shipment.${sortFieldSelected.title}`, { locale: languageCode })}
      </Text>
      <Image source={IMAGE_CONSTANT.arrowDownGreen} />
    </View>
  );

  handleToggleSort = () => {
    const { isSortAsc } = this.state;
    this.setState(
      {
        isSortAsc: !isSortAsc,
      },
      () => {
        const { isSortAsc: newIsSortAsc } = this.state;
        const { actions } = this.props;
        actions.setFieldQuery({
          sortFilterOrder: newIsSortAsc ? 0 : 1,
        });
      },
    );
  };

  showDropdown = () => {
    const { actions } = this.props;
    this.touchable.measure((fx, fy, width, height, px, py) => {
      actions.showDropdown({ x: px, y: py, w: width });
    });
  };

  showDropdownFilter = () => {
    const { actions } = this.props;
    actions.getTotalShipmentStatusFilter();
    this.touchable.measure((fx, fy, width, height, px, py) => {
      actions.showDropdownFilter({ x: px, y: py, w: width });
    });
  };

  changeDate = (dateStr, pickupDate) => {
    const { actions } = this.props;
    const pickupDateUtc = moment(pickupDate)
      .utc()
      .toISOString();
    this.setState({
      pickupDate,
    });
    actions.setFieldQuery({
      pickupStartDateFilter: moment(pickupDateUtc)
        .startOf('day')
        .utc()
        .toISOString(),
      pickupEndDateFilter: moment(pickupDateUtc)
        .endOf('day')
        .utc()
        .toISOString(),
    });
    this.setState({ hideTextDate: false });
  };

  filterDropdownStatus = () => {
    const { filterStatusSelected, languageCode, shipmentTotal } = this.props;
    const statusFilter = `${I18n.t(`shipment.${filterStatusSelected.status}`, {
      locale: languageCode,
    })} (${shipmentTotal})`;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        ref={(ref) => (this.touchable = ref)}
        onPress={() => this.showDropdownFilter()}
      >
        <View
          style={[
            styles.flex,
            styles.alignItemsCenter,
            styles.h32,
            styles.input,
            styles.whiteBg,
            { justifyContent: 'space-between' },
          ]}
        >
          <Text
            style={[
              styles.defaultSize,
              styles.defaultTextColor,
              styles.bold,
              styles.mr5,
            ]}
            numberOfLines={1}
          >
            {statusFilter}
          </Text>
          <Image source={IMAGE_CONSTANT.arrowDownGreen} />
        </View>
      </TouchableOpacity>
    );
  };

  getTextInputSearchRef = (ref) => {
    this.keywordSearchRef = ref;
  };

  endEditSearch = () => {
    const { actions } = this.props;
    const keywordSearch = this.keywordSearchRef.getValueInput();
    actions.setFieldQuery({ TextFilter: keywordSearch });
  };

  onRemoveText = () => {
    const { actions } = this.props;
    actions.setFieldQuery({ TextFilter: '' });
  };

  clearFilterDatePicker = () => {
    const { actions } = this.props;
    actions.setFieldQuery({
      pickupStartDateFilter: '',
      pickupEndDateFilter: '',
    });
    this.setState({ hideTextDate: true });
  };

  render() {
    const {
      toggleListMode, pickupDate, isSortAsc, hideTextDate
    } = this.state;
    const {
      languageCode,
      shipmentTotal,
      countryCode,
      sortFieldSelected,
      actions,
      listViewType,
      TabFilter,
      TextFilter,
    } = this.props;
    const isMyShipmentTab = TabFilter === APP_CONSTANT.MY_SHIPMENT;
    return (
      <>
        <View>
          <View
            style={[
              styles.flex,
              isMyShipmentTab ? styles.mb20 : styles.mb30,
              styles.mt30,
              styles.ml20,
              styles.mr20,
            ]}
          >
            <View style={styles.flexOne}>
              <Text
                style={[
                  styles.titleSize,
                  styles.defaultCustomColor,
                  styles.medium,
                  styles.h32,
                ]}
              >
                {shipmentTotal || 0}
                {' '}
                {I18n.t('results', { locale: languageCode })}
              </Text>
              <View style={styles.mt20}>
                {isMyShipmentTab ? (
                  this.filterDropdownStatus()
                ) : (
                  <View
                    style={[
                      styles.input,
                      styles.whiteBg,
                      styles.flex,
                      styles.alignItemsCenter,
                    ]}
                  >
                    <View style={styles.mr10}>
                      <Image source={IMAGE_CONSTANT.calendarIcon} />
                    </View>
                    <DatePicker
                      mode="date"
                      date={pickupDate}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      androidMode="default"
                      showIcon={false}
                      hideText={hideTextDate}
                      style={{ flex: 1 }}
                      onDateChange={this.changeDate}
                      format={this.getDateFormatByCountry(
                        countryCode,
                        languageCode,
                      )}
                      customStyles={{
                        dateInput: {
                          paddingLeft: 0,
                          marginLeft: 0,
                          borderWidth: 0,
                          alignItems: 'flex-start',
                          textAlign: 'left',
                        },
                      }}
                    />
                    {!hideTextDate && (
                      <TouchableOpacity
                        onPress={this.clearFilterDatePicker}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={IMAGE_CONSTANT.close}
                          style={{ width: 16, height: 16 }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
            <View style={styles.ml20}>
              <View
                style={[
                  styles.flex,
                  styles.alignItemsCenter,
                  Platform.OS === 'ios' && { zIndex: 3 },
                ]}
              >
                {/* <DropdownList
                icon={this.renderCustomIcon(languageCode, sortFieldSelected)}
                source={sortFieldValue}
                onChange={(e) => this.handleChangeSortField(e)}
                positionTop={40}
                positionRight={18}
                width={200}
              /> */}
                <View>
                  <TouchableOpacity
                    style={[
                      styles.flex,
                      styles.justifyContentEnd,
                      styles.alignItemsCenter,
                    ]}
                    activeOpacity={0.9}
                    ref={(ref) => (this.touchable = ref)}
                    onPress={() => this.showDropdown()}
                  >
                    {this.renderCustomIcon(
                      languageCode,
                      sortFieldSelected,
                      isMyShipmentTab,
                    )}
                  </TouchableOpacity>
                </View>
                {!isMyShipmentTab ? (
                  <View style={[styles.ml15]}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={this.handleToggleSort}
                    >
                      {isSortAsc ? (
                        <Image source={IMAGE_CONSTANT.sortAsc} />
                      ) : (
                        <Image source={IMAGE_CONSTANT.sortDsc} />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <View
                style={[
                  styles.mt20,
                  styles.flex,
                  styles.alignItemsCenter,
                  { zIndex: -1 },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => actions.changeListViewType(LIST_VIEW_TYPE.LIST)}
                  style={[
                    listViewType === LIST_VIEW_TYPE.LIST
                      ? styles.greenBg
                      : styles.whiteBg,
                    styles.toggleLocationLeft,
                    styles.toggleLocation,
                    styles.toggleLocationGrayBorder,
                    styles.flex,
                    styles.alignItemsCenter,
                    styles.justifyContentCenter,
                    styles.flexOne,
                  ]}
                >
                  <Image
                    source={
                      listViewType === LIST_VIEW_TYPE.LIST
                        ? IMAGE_CONSTANT.listViewActive
                        : IMAGE_CONSTANT.listView
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => actions.changeListViewType(LIST_VIEW_TYPE.MAP)}
                  style={[
                    listViewType === LIST_VIEW_TYPE.MAP
                      ? styles.greenBg
                      : styles.whiteBg,
                    styles.toggleLocationRight,
                    styles.toggleLocation,
                    styles.toggleLocationGrayBorder,
                    styles.flex,
                    styles.alignItemsCenter,
                    styles.justifyContentCenter,
                    styles.flexOne,
                  ]}
                >
                  <Image
                    source={
                      listViewType === LIST_VIEW_TYPE.MAP
                        ? IMAGE_CONSTANT.mapViewActive
                        : IMAGE_CONSTANT.mapView
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {isMyShipmentTab && (
            <View style={[styles.flex, styles.mb30, styles.ml20, styles.mr20]}>
              <FormInput
                ref={this.getTextInputSearchRef}
                viewInputStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 60,
                  borderWidth: 1,
                  borderColor: 'rgba(219, 219, 219, 1)',
                  borderRadius: 4,
                  paddingHorizontal: 15,
                }}
                inputStyle={[
                  {
                    flex: 1,
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    height: 60,
                    // borderColor: 'red',
                    // borderWidth: 1,
                    marginLeft: 10,
                  },
                ]}
                viewStyle={[styles.flexOne, styles.whiteBg, { borderRadius: 4 }]}
                iconName="search"
                // iconStyle={}
                iconSize={24}
                iconColor="rgba(81, 175, 43, 1)"
                placeHolder="ID, Customer, Reference"
                onEndEditing={this.endEditSearch}
                defaultText={TextFilter}
                iconRemoveText
                onRemoveText={this.onRemoveText}
              />
            </View>
          )}
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  shipmentTotal: state.driver.total,
  sortFieldSelected: state.driver.dropdownSelected,
  filterStatusSelected: state.driver.dropdownFilterSelected,
  listViewType: state.driver.listViewType,
  TabFilter: state.driver.TabFilter,
  TextFilter: state.driver.TextFilter,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      setFieldQuery: driverAction.setFieldQuery,
      showDropdown: appActions.toggleDropDown,
      changeListViewType: driverAction.changeListViewType,
      showDropdownFilter: appActions.toggleDropDownFilter,
      getTotalShipmentStatusFilter: driverAction.getTotalStatusFilter,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShipmentContent);
