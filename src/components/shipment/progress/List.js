import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

// COMPONENTS
import Select from '../../common/Select';

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';
import Attactments from '../attactments/Attactments';

// CSS
import styles from '../style';
import PROGRESS from '../../../constants/progress';
import Booked from './section/Booked';

class ProgressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.source.expanded || false
    };
  }

  static renderList(title, value) {
    return (
      <View style={[styles.flex, styles.mb10]}>
        <View style={[styles.mr15, { flex: 2 }]}>
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

  renderIcon = (type, active) => {
    let iconStatus = '';
    switch (type) {
      case PROGRESS.SECTION.BOOKED:
        iconStatus = <Image source={IMAGE_CONSTANT.shipmentBook} />;
        break;
      case PROGRESS.SECTION.DISPATCHED:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentVehicle} /> : <Image source={IMAGE_CONSTANT.shipmentVehicleUnActive} />;
        break;
      case PROGRESS.SECTION.PICKUP:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentMove} /> : <Image source={IMAGE_CONSTANT.shipmentMoveUnActive} />;
        break;
      default:
        iconStatus = active ? <Image source={IMAGE_CONSTANT.shipmentGoods} /> : <Image source={IMAGE_CONSTANT.shipmentGoodsUnActive} />;
        break;
    }
    return iconStatus;
  }

  renderExpanded() {
    const { source: { type } } = this.props;
    return (
      <>
        <View style={[styles.mt25, styles.line]} />
        {type === PROGRESS.SECTION.DISPATCHED
          ? (
            <View style={[styles.mt30, styles.mb10]}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <Text style={[styles.formHeader, { top: 2 }]}>
                  Carrier Information
                </Text>
              </View>
              <View style={[styles.whiteBg, styles.paddingHorizontal20,
                styles.paddingVertical30, styles.mb30, styles.grayBorder]}
              >
                {ProgressList.renderList('Truck Make:', 'Mitsubishi')}
                {ProgressList.renderList('Model:', 'Fuso FJ')}
                {ProgressList.renderList('Feature:', 'Open Top')}
                {ProgressList.renderList('License Plate:', 'W 943 RD')}
                {ProgressList.renderList('Color:', 'Black')}
                <View style={{ height: 20 }} />
                {ProgressList.renderList('Driver Name:', 'Hu Guyiying')}
                {ProgressList.renderList('Driver Mobile:', '+83 2930 2930')}
              </View>
            </View>
          ) : (
            <View style={[styles.mt30, styles.mb10]}>
              <View style={[styles.flex, styles.alignItemsCenter]}>
                <Text style={[styles.formHeader, { top: 2 }]}>
                  Carrier Comments
                </Text>
              </View>
              <View style={[styles.whiteBg, styles.paddingHorizontal20,
                styles.paddingVertical30, styles.mb30, styles.grayBorder]}
              >
                <View style={styles.formGroupInput}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                    Notes
                  </Text>
                  <Text style={[styles.smallSize, styles.defaultTextColor]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </Text>
                </View>
                <View style={[styles.formGroupInput, styles.mt20]}>
                  <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                    Files
                  </Text>
                  <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
                    <Attactments
                      readOnly
                      source={[
                        {
                          id: 1, is_image: false, source: 'https://deliveree-img-stg.s3.amazonaws.com/photos/images/000/021/200/original/marvel_collection_folder_icon_by_dahlia069_dbmgqdx-250t.png?1560330374', title: 'statement-1.pdf'
                        },
                        {
                          id: 2, is_image: true, source: 'https://deliveree-img-stg.s3.amazonaws.com/photos/images/000/021/200/original/marvel_collection_folder_icon_by_dahlia069_dbmgqdx-250t.png?1560330374', title: 'statement-1.png'
                        },
                        {
                          id: 3, is_image: null, source: '', title: ''
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        <View style={styles.mb10}>
          <View style={[styles.flex, styles.alignItemsCenter]}>
            <Text style={[styles.formHeader, { top: 2 }]}>
              Your Comments
            </Text>
          </View>
          <View style={[styles.whiteBg, styles.paddingHorizontal20,
            styles.paddingVertical30, styles.mb30, styles.grayBorder]}
          >
            <View style={styles.formGroupInput}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
                Notes
              </Text>
              <TextInput
                style={styles.input}
              />
            </View>
            <View style={styles.mt30}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                Add Files
                {' '}
                <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>(optional)</Text>
              </Text>
              <View style={styles.mt10}>
                <View style={[styles.uploadList, styles.marginHorizontalMinus10, styles.flex, styles.alignItemsCenter]}>
                  <Attactments />
                </View>
                <Text style={[styles.smallSize, styles.grayText, styles.mt20]}>
                  Upload up to 3 files (5 mb each)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }

  renderView = () => {
    const { source, progress, languageCode, countryCode } = this.props;
    console.log('renderView', source);
    switch (source.type) {
      case PROGRESS.SECTION.BOOKED:
        return (
          <Booked
            source={source}
            progress={progress}
            languageCode={languageCode}
            countryCode={countryCode}
          />
        );
      default:
        break;
    }
  }

  render() {
    const { expanded } = this.state;
    const {
      source: {
        active, title, type, attr: { desc, confirm_date: confirmDate }, picked_up: pickedUp, delivered
      }
    } = this.props;
    return (
      <View style={[
        styles.mb20,
        styles.paddingHorizontal20,
        active ? styles.paddingVertical20 : styles.paddingVertical10,
        active ? styles.lightGreenBg : styles.whiteBg
      ]}
      >
        {this.renderView()}
      </View>
    );
  }
}

export default ProgressList;
