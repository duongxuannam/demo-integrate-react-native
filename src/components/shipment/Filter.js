import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView as RNScrollView,
} from 'react-native';
import { CheckBox, StyleProvider  } from 'native-base';
import IMAGE_CONSTANT from '../../constants/images';
import FilterAddress from './filterAddress';
import I18n from '../../config/locales';
import { formatMetricsWithCommas } from '../../helpers/regex';
import getTheme from '../../constants/theme/components';
import variables from '../../constants/theme/variables/commonColor';
import styles from './style';
import APP_CONSTANT from '../../helpers/constant.helper';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      weight: '',
      endWeight: false,
      allUnitSelected: false,
      allLocationTypesSelected: false,
      toggleLocationsRoute: false,
      // locationTypesData: [{ locationServiceId: 'all', totalShipment: 'results', name: 'All Types'}],
      locationTypesSelected: [],
      // handleUnitsData: [{ id: 'all', totalShipment: 'results', name: 'All Units' }],
      handleUnitsSelected: [],
    };
  }

  setLocationTypeSelected = (id) => {
    // if (id === 'all') {
    //   this.setState((prevState) => ({
    //     ...prevState,
    //     allLocationTypesSelected: !prevState.allLocationTypesSelected,
    //   }), () => {
    //     const { allLocationTypesSelected } = this.state;
    //     if (allLocationTypesSelected) {
    //       this.handleAllLocationType();
    //     } else {
    //       this.setState({
    //         locationTypesSelected: [],
    //       });
    //     }
    //   });
    // } else {
    const { allLocationTypesSelected, locationTypesSelected } = this.state;
    const tmp = locationTypesSelected;
    if (allLocationTypesSelected) {
      tmp.splice(tmp.indexOf('all'), 1);
      this.setState({ allLocationTypesSelected: false });
    }
    if (tmp.includes(id)) {
      tmp.splice(tmp.indexOf(id), 1);
    } else {
      tmp.push(id);
    }
    this.setState({
      locationTypesSelected: tmp,
    }, () => {
      const {
        locationTypesSelected: newLocationTypesSelected,
      } = this.state;
      const { actions } = this.props;
      actions.setFieldQuery({
        locationTypeIdFilter: newLocationTypesSelected,
      });
    });
    // }
  }

  // handleAllUnit = () => {
  //   const { handleUnits } = this.props;
  //   const res = ['all'];
  //   handleUnits.forEach((unit) => {
  //     res.push(unit.id);
  //   });
  //   this.setState({
  //     handleUnitsSelected: res,
  //   });
  // }

  // handleAllLocationType = () => {
  //   const { locationTypes } = this.props;
  //   const res = ['all'];
  //   locationTypes.forEach((unit) => {
  //     res.push(unit.locationServiceId);
  //   });
  //   this.setState({
  //     locationTypesSelected: res,
  //   });
  // }

  setHandleUnitSelected= (id) => {
    // if (id === 'all') {
    //   this.setState((prevState) => ({
    //     allUnitSelected: !prevState.allUnitSelected,
    //   }), () => {
    //     const { allUnitSelected } = this.state;
    //     if (allUnitSelected) {
    //       this.handleAllUnit();
    //     } else {
    //       this.setState({
    //         handleUnitsSelected: [],
    //       });
    //     }
    //   });
    // } else {
    const { handleUnitsSelected, allUnitSelected } = this.state;
    const tmp = handleUnitsSelected;
    if (allUnitSelected) {
      tmp.splice(tmp.indexOf('all'), 1);
      this.setState({ allUnitSelected: false });
    }
    if (tmp.includes(id)) {
      tmp.splice(tmp.indexOf(id), 1);
    } else {
      tmp.push(id);
    }
    this.setState({
      handleUnitsSelected: tmp,
    }, () => {
      const {
        handleUnitsSelected: newhandleUnitsSelected,
      } = this.state;
      const { actions } = this.props;
      actions.setFieldQuery({
        handlingUnitIdFilter: newhandleUnitsSelected,
      });
    });
    // }
  }

  handleFilterAddress =(resultList, node) => {
    const { onGetResultAddress } = this.props;
    if (onGetResultAddress) {
      onGetResultAddress(resultList, node);
    }
  }

  formatLength = (text, isEnd = false) => {
    const lastCharacter = String(text).charAt(text.length - 1);
    if (String(text - 0) !== 'NaN') {
      if (lastCharacter === '.' && (String(text).match(/\./g) || []).length === 1) {
        return String(text);
      }
      if (text === '') {
        return text;
      }
      return (isEnd && formatMetricsWithCommas(String((text - 0).toFixed(2)))) || String(text);
    }
    return String(text);
  }

  handleEndWeight = () => this.setState({ endWeight: true })

  changeValueWeight = (text) => {
    const { actions } = this.props;
    actions.setFieldQuery({
      maxWeight: text,
    });
    const value = text.replace(/,/g, '');
    const lastCharacter = String(value).charAt(text.length - 1);
    if (lastCharacter === '.' && (String(value).match(/\./g) || []).length === 1) {
      this.setState({ weight: value, endWeight: false });
      return;
    }

    if (value === '') {
      this.setState({ weight: null, endWeight: false });
      return;
    }

    if (String(value - 0) !== 'NaN') {
      this.setState({ weight: value - 0, endWeight: false });
    }
  }

  decreaseWeight = () => {
    const { weight } = this.state;
    if ((weight - 0) > 0) {
      this.setState({ weight: (weight - 0) - 1 }, () => {
        const { weight: newWeight } = this.state;
        const { actions } = this.props;
        actions.setFieldQuery({
          maxWeight: newWeight,
        });
      });
    }
  }

  increaseWeight = () => {
    const { weight } = this.state;
    this.setState({ weight: (weight - 0) + 1 }, () => {
      const { weight: newWeight } = this.state;
      const { actions } = this.props;
      actions.setFieldQuery({
        maxWeight: newWeight,
      });
    });
  }

  setModeSearch = (mode, isToggleLocationsRoute) => {
    const { actions } = this.props;
    this.setState({
      toggleLocationsRoute: isToggleLocationsRoute,
    });
    actions.setFieldQuery({
      modeSearch: mode
    });
  }

  handleUnit() {
    const { handleUnitsSelected } = this.state;
    const { handleUnits, languageCode } = this.props;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.flexOne, styles.medium]}>
            {I18n.t('filter.handling_units', { locale: languageCode })}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <Text style={[styles.smallSize, styles.grayText]}>
              {I18n.t('filter.all_units', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.mb30, styles.mt30, styles.ml20]}>
          <RNScrollView horizontal>
            {handleUnits.map((item) => (
              <View key={item.id}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.mr15, styles.flex, styles.boxFilter]}
                  onPress={() => this.setHandleUnitSelected(item.id)}
                >
                  <View style={styles.mt5}>
                    <StyleProvider style={getTheme(variables)}>
                      <CheckBox
                        onPress={() => this.setHandleUnitSelected(item.id)}
                        checked={handleUnitsSelected.indexOf(item.id) > -1}
                        color="#3fae29"
                        selectedColor="#3fae29"
                      />
                    </StyleProvider>
                  </View>
                  <View style={styles.ml20}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.smallSize, styles.grayText]}>
                      {item.totalShipment}
                      {' '}
                      {item.totalShipment > 1
                        ? I18n.t('filter.results', { locale: languageCode })
                        : I18n.t('filter.result', { locale: languageCode })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </RNScrollView>
        </View>
      </>
    );
  }

  toggleLocationsRoute() {
    const { toggleLocationsRoute } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={[styles.mt30, styles.mb30, styles.ml20, styles.mr20, styles.flex, styles.alignItemsCenter]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.setModeSearch(APP_CONSTANT.MODE_SEARCH.LOCATION, false)}
          style={[
            !toggleLocationsRoute && styles.darkGreenBg,
            styles.toggleLocationLeft,
            styles.toggleLocation,
            styles.flex,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            styles.flexOne,
          ]}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={toggleLocationsRoute ? IMAGE_CONSTANT.route : IMAGE_CONSTANT.routeActive}
            resizeMode="contain"
          />
          <Text style={[styles.ml10, styles.defaultSize, !toggleLocationsRoute ? styles.whiteText : styles.notificationText, !toggleLocationsRoute && styles.bold]}>
            {I18n.t('filter.location', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.setModeSearch(APP_CONSTANT.MODE_SEARCH.ALONG_ROUTE, true)}
          style={[
            toggleLocationsRoute && styles.darkGreenBg,
            styles.toggleLocationRight,
            styles.toggleLocation,
            styles.flex,
            styles.alignItemsCenter,
            styles.justifyContentCenter,
            styles.flexOne,
          ]}
        >
          <Image
            style={{ width: 30, height: 30 }}
            source={toggleLocationsRoute ? IMAGE_CONSTANT.routesActive : IMAGE_CONSTANT.routes}
            resizeMode="contain"
          />
          <Text style={[styles.ml10, styles.defaultSize, toggleLocationsRoute ? styles.whiteText : styles.notificationText, toggleLocationsRoute && styles.bold]}>
            {I18n.t('filter.along_route', { locale: languageCode })}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderWeight() {
    const { weight, endWeight } = this.state;
    const { languageCode } = this.props;
    const weightInput = this.formatLength(weight || (weight === 0 && '0') || '', endWeight);
    return (
      <View style={[styles.mb30, styles.ml20, styles.mr20]}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.medium]}>
          {I18n.t('filter.weight', { locale: languageCode })}
        </Text>
        <View style={styles.mt10}>
          <View style={[styles.relative, styles.formGroupInputGroup, styles.flex, styles.alignItemsCenter]}>
            <TextInput
              style={[styles.input, styles.noneBorderRadius, styles.flexOne]}
              placeholder="Enter max weight"
              onChangeText={this.changeValueWeight}
              onEndEditing={this.handleEndWeight}
              keyboardType="numeric"
              value={weightInput}
              defaultValue={weightInput}
            />
            <TouchableOpacity
              style={[styles.buttonAction, styles.buttonActionSilver, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
              activeOpacity={0.9}
              onPress={this.decreaseWeight}
            >
              <Text style={[styles.actionSize, styles.defaultTextColor]}>
                -
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonAction, styles.alignItemsCenter, styles.flex, styles.justifyContentCenter]}
              activeOpacity={0.9}
              onPress={this.increaseWeight}
            >
              <Text style={[styles.actionSize, styles.whiteText]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderLocationType() {
    const { locationTypesSelected } = this.state;
    const { locationTypes, languageCode } = this.props;
    return (
      <>
        <View style={[styles.ml20, styles.mr20, styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.defaultSize, styles.defaultTextColor, styles.flexOne, styles.medium]}>
            {I18n.t('filter.location_type', { locale: languageCode })}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <Text style={[styles.smallSize, styles.grayText]}>
              {I18n.t('filter.all_types', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.mb30, styles.mt30, styles.ml20]}>
          <RNScrollView horizontal>
            {locationTypes.map((item) => (
              <View key={item.locationServiceId}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.mr15, styles.flex, styles.boxFilter]}
                  onPress={() => this.setLocationTypeSelected(item.locationServiceId)}
                >
                  <View style={styles.mt5}>
                    <StyleProvider style={getTheme(variables)}>
                      <CheckBox
                        onPress={() => this.setLocationTypeSelected(item.locationServiceId)}
                        checked={locationTypesSelected.indexOf(item.locationServiceId) > -1}
                        color="#3fae29"
                        selectedColor="#3fae29"
                      />
                    </StyleProvider>
                  </View>
                  <View style={styles.ml20}>
                    <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.smallSize, styles.grayText]}>
                      {item.totalShipment}
                      {' '}
                      {item.totalShipment > 1
                        ? I18n.t('filter.results', { locale: languageCode })
                        : I18n.t('filter.result', { locale: languageCode })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </RNScrollView>
        </View>
      </>
    );
  }

  renderFilterExpanded() {
    const {
      actions,
      rootPickup,
      anotherPickup,
      anotherDelivery,
      rootDelivery,
      languageCode,
      countryCode,
      dataConfig,
      scrollRef
    } = this.props;
    const { expanded } = this.state;
    return (
      <View style={[{ width: '100%'}, expanded ? { height: 'auto' } : { height: 0, overflow: 'hidden' }]}>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        {expanded && this.toggleLocationsRoute()}
        <FilterAddress
          actions={actions}
          rootPickup={rootPickup}
          anotherPickup={anotherPickup}
          anotherDelivery={anotherDelivery}
          rootDelivery={rootDelivery}
          countryCode={countryCode}
          languageCode={languageCode}
          dataConfig={dataConfig}
          scrollRef={scrollRef}
          onGetResultAddress={this.handleFilterAddress}
        />
        {this.handleUnit()}
        {this.renderWeight()}
        {this.renderLocationType()}
        <View style={[styles.lineSilver, { zIndex: -1 }]} />
        <TouchableOpacity
          style={{ zIndex: -1 }}
          activeOpacity={0.9}
          onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
        >
          <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
            <Image source={IMAGE_CONSTANT.hideExpand} />
            <Text style={[styles.ml10, styles.bold, styles.defaultSize, styles.mainColorText]}>
              {I18n.t('filter.hide_filters', { locale: languageCode })}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { expanded } = this.state;
    const { languageCode } = this.props;
    return (
      <View style={[styles.filter, styles.whiteBg, styles.mt30]}>
        <View style={styles.pad20}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.flexOne, styles.defaultSize, styles.defaultTextColor, styles.medium]}>
                {I18n.t('filter.title', { locale: languageCode })}
              </Text>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} resizeMode="contain" />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} resizeMode="contain" />}
            </View>
          </TouchableOpacity>
        </View>
        {this.renderFilterExpanded()}
      </View>
    );
  }
}

export default Filter;
