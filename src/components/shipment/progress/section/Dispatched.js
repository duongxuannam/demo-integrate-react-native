import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import I18n from '../../../../config/locales';
import BaseComponent from '../../../common/BaseComponent';
import IMAGE_CONSTANT from '../../../../constants/images';
import styles from '../../style';
import PROGRESS from '../../../../constants/progress';
import MyComment from '../MyComment';
import { getTransportTypeName, getDateString } from '../../../../helpers/shipment.helper';

class Dispatched extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.collapseSection === PROGRESS.SECTION.DISPATCHED || false,
    };
  }

  componentDidUpdate(prevProps) {
    const { collapseSection } = this.props;
    if (collapseSection !== prevProps.collapseSection) {
      this.setState({
        expanded: collapseSection === PROGRESS.SECTION.DISPATCHED || false,
      });
    }
  }

  getTextLanguage = (key) => {
    const { languageCode } = this.props;
    return this.getLanguageLocation(key, languageCode);
  }

  static renderList(title, value) {
    return (
      <View style={[styles.flex, styles.mb10]}>
        <View style={[styles.mr15, { flex: 3 }]}>
          <Text style={[styles.smallSize, styles.grayText]}>
            {title}
          </Text>
        </View>
        <View style={{ flex: 4 }}>
          <Text style={[styles.smallSize, styles.defaultTextColor, styles.bold]}>
            {value}
          </Text>
        </View>
      </View>
    );
  }

  renderExpandedDefault() {
    const {
      source,
      countryCode,
      languageCode,
      actions,
      shipmentID,
      transportTypesDefault
    } = this.props;
    return (
      <>
        <View style={[styles.mt30, styles.mb10]}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <Text style={[styles.formHeader, { top: 2 }]}>
              {I18n.t('progress.driver_infomartion.title', { locale: languageCode })}
            </Text>
          </View>
          <View style={[styles.whiteBg, styles.paddingHorizontal20,
            styles.paddingVertical30, styles.mb30, styles.grayBorder]}
          >
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.truck_make', { locale: languageCode })}:`, source.truckMake || '-')}
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.model', { locale: languageCode })}:`, source.mode || '-')}
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.feature', { locale: languageCode })}:`, source.transportMode ? getTransportTypeName(transportTypesDefault, source.transportMode) : '-')}
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.license_plate', { locale: languageCode })}:`, source.licencePlate || '-')}
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.color', { locale: languageCode })}:`, source.color || '-')}
            <View style={{ height: 20 }} />
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.driver_name', { locale: languageCode })}:`, source.driverName || '-')}
            {Dispatched.renderList(`${I18n.t('progress.driver_infomartion.driver_mobile', { locale: languageCode })}:`, source.driverPhone || '-')}
          </View>
        </View>
        <MyComment
          actions={actions}
          source={source}
          section={PROGRESS.SECTION.DISPATCHED}
          languageCode={languageCode}
          countryCode={countryCode}
          shipmentID={shipmentID}
        />
      </>
    );
  }

  renderErrorUI = (error, message = null) => (error ? (
    <Image
      source={IMAGE_CONSTANT.errorIcon}
      style={{ width: 18, height: 18, marginRight: 5 }}
      resizeMode="contain"
    />
  ) : null);

  renderExpanded() {
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {this.renderExpandedDefault()}
      </>
    );
  }

  toggleCollapse = () => {
    const { collapse } = this.props;
    this.setState((prevState) => ({
      expanded: !prevState.expanded
    }), () => {
      const { expanded } = this.state;
      collapse(PROGRESS.SECTION.DISPATCHED, expanded);
    });
  }

  render() {
    const { expanded } = this.state;
    const {
      source,
      languageCode,
      countryCode,
      bookedDate
    } = this.props;
    return (
      <View
        style={[
          styles.mb20,
          styles.paddingHorizontal20,
          styles.paddingVertical10,
          source.isConfirmed ? styles.lightGreenBg : styles.whiteBg,
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.toggleCollapse}
        >
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <View
              style={[
                styles.flexOne,
                styles.flex,
                styles.alignItemsCenter,
                styles.mr5,
              ]}
            >
              <View style={styles.mr10}>
                <Image
                  source={
                    source.isConfirmed
                      ? IMAGE_CONSTANT.shipmentVehicle
                      : IMAGE_CONSTANT.shipmentVehicleUnActive
                  }
                  resizeMode="contain"
                />
              </View>
              <View style={{ width: '85%' }}>
                <Text
                  style={[
                    styles.defaultSize,
                    source.isConfirmed ? styles.mainColorText : styles.defaultTextColor,
                    source.isConfirmed && styles.bold,
                  ]}
                >
                  {this.getTextLanguage('progress.dispatch')}
                </Text>
                {source.isConfirmed ? (
                  <View>
                    <Text
                      style={[styles.smallSize, styles.defaultTextColor]}
                    >
                      {`${source.truckMake} ${source.mode} • ${source.licencePlate}`}
                    </Text>
                    <Text
                      style={[styles.smallSize, styles.defaultTextColor]}
                    >
                      {source.driverName}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text>
                      {I18n.t('progress.dispatch_on_before', { locale: languageCode })}
                      {' '}
                    </Text>
                    <Text style={[
                      styles.date,
                      styles.dateText,
                      styles.defaultTextColor,
                      styles.smallSize,
                      styles.bold,
                      styles.textCenter,
                      {
                        width: languageCode === 'vi' ? 180 : 155
                      }
                    ]}
                    >
                      {getDateString(bookedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                      {` ${I18n.t('shipment.title.to', { locale: languageCode })} `}
                      {getDateString(source.pickupDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {expanded ? (
              <Image
                source={IMAGE_CONSTANT.arrowUp}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={IMAGE_CONSTANT.arrowDown}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
        {expanded ? this.renderExpanded() : null}
      </View>
    );
  }
}

export default Dispatched;
