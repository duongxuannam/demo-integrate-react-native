import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import BaseComponent from '../../../common/BaseComponent';
import IMAGE_CONSTANT from '../../../../constants/images';
import I18n from '../../../../config/locales';
import styles from '../../style';
import Attactments from '../../../booking/attactments/Attactments';
import PROGRESS from '../../../../constants/progress';
import { getDateString } from '../../../../helpers/shipment.helper';
import MyComment from '../MyComment';

class Delivery extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.collapseSection === PROGRESS.SECTION.DELIVERY && props.index === props.indexCollapse,
    };
  }

  componentDidUpdate(prevProps) {
    const { collapseSection, indexCollapse, index } = this.props;
    if (indexCollapse !== prevProps.indexCollapse) {
      this.setState({
        expanded: collapseSection === PROGRESS.SECTION.DELIVERY && index === indexCollapse,
      });
    }
  }

  getTextLanguage = (key) => {
    const { languageCode } = this.props;
    return this.getLanguageLocation(key, languageCode);
  };

  renderExpandedDefault = () => {
    const {
      source,
      actions,
      languageCode,
      countryCode,
      shipmentID,
    } = this.props;
    return (
      <View>
        <View style={[styles.mt30, styles.mb10]}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <Text style={[styles.formHeader, { top: 2 }]}>
              {this.getTextLanguage('progress.driver_comments')}
            </Text>
          </View>
          <View style={[styles.whiteBg, styles.paddingHorizontal20,
            styles.paddingVertical30, styles.mb30, styles.grayBorder]}
          >
            <View style={styles.formGroupInput}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                {this.getTextLanguage('progress.notes')}
              </Text>
              <Text style={[styles.smallSize, styles.defaultTextColor]}>
                {source.driverNotes || ''}
              </Text>
            </View>
            <View style={[styles.formGroupInput, styles.mt20]}>
              {source.driverAttachments.length > 0 ? (
                <Attactments
                  readOnly
                  progress
                  languageCode={languageCode}
                  photos={source.driverAttachments}
                />
              ) : null}
            </View>
          </View>
        </View>
        <MyComment
          actions={actions}
          section={PROGRESS.SECTION.DELIVERY}
          languageCode={languageCode}
          countryCode={countryCode}
          source={source}
          shipmentID={shipmentID}
        />
      </View>
    );
  }

  toggleCollapse = () => {
    const { index, collapse } = this.props;
    this.setState((prevState) => ({
      expanded: !prevState.expanded
    }), () => {
      const { expanded } = this.state;
      collapse(PROGRESS.SECTION.DELIVERY, expanded, index);
    });
  }

  renderExpanded() {
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {this.renderExpandedDefault()}
      </>
    );
  }

  render() {
    const { expanded } = this.state;
    const {
      languageCode,
      source,
      countryCode,
      numberDestination,
      currentPosition,
      indexCollapse,
      collapseSection,
      index,
    } = this.props;
    const active = source.status === PROGRESS.ADDRESS_PROGRESS_STATUS.COMPLETED;
    return (
      <View
        style={[
          styles.mb20,
          styles.paddingHorizontal20,
          styles.paddingVertical10,
          active ? styles.lightGreenBg : styles.whiteBg,
        ]}
        onLayout={({ nativeEvent }) => {
          if (collapseSection === PROGRESS.SECTION.DELIVERY && indexCollapse === index) {
            currentPosition(nativeEvent);
          }
        }}
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
                    active
                      ? IMAGE_CONSTANT.shipmentGoods
                      : IMAGE_CONSTANT.shipmentGoodsUnActive
                  }
                />
              </View>
              <View style={{ width: '85%' }}>
                <Text
                  style={[
                    styles.defaultSize,
                    active ? styles.mainColorText : styles.defaultTextColor,
                    active && styles.bold,
                  ]}
                >
                  {this.getTextLanguage('progress.delivery')}
                  {' '}
                  {numberDestination}
                </Text>
                <View>
                  <Text
                    style={[styles.smallSize, styles.defaultTextColor]}
                  >
                    {source.shortAddress}
                  </Text>
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Text
                      style={[
                        styles.mr10,
                        styles.smallSize,
                        styles.defaultTextColor,
                      ]}
                    >
                      {this.getTextLanguage('progress.delivery_on')}
                    </Text>
                    <Text
                      style={[
                        styles.date,
                        styles.dateText,
                        active ? styles.dateActive : styles.defaultTextColor,
                        styles.smallSize,
                        styles.bold,
                      ]}
                    >
                      {getDateString(source.deliveryDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
                    </Text>
                  </View>
                </View>
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

export default Delivery;
