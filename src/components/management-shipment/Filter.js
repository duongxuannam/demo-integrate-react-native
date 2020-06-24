import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

import IMAGE_CONSTANT from '../../constants/images';
import styles from '../shipment/style';
import FromDate from './FromDate';
import ToDate from './ToDate';
import I18n from '../../config/locales';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      keyword: ''
    };
  }

  componentDidUpdate(prevProps) {
    const {
      resetFilter,
    } = this.props;
    if (resetFilter !== prevProps.resetFilter) {
      this.setState({
        keyword: '',
      });
    }
  }

  onFilterText = () => {
    const { keyword } = this.state;
    const { actions } = this.props;
    actions.setFieldQuery({
      textFilter: keyword
    });
  }

  renderFilter = (keyword, languageCode, tabFilter, total) => (
    <>
      <View style={[styles.ml20, styles.mr20, styles.line]} />
      <View style={[styles.paddingHorizontal20, styles.mt20]}>
        <Text style={[styles.bold, styles.defaultSize, styles.defaultTextColor, styles.mb10, { fontWeight: 'bold' }]}>
          {I18n.t(`management_shipment.result.${tabFilter.toLowerCase()}`, { locale: languageCode })}
          {' '}
          (
          {total}
)
        </Text>
      </View>
      <FromDate />
      <ToDate />
      <View style={[styles.paddingHorizontal20, styles.mb20]}>
        <Text style={[styles.bold, styles.defaultSize, styles.defaultTextColor, styles.mb10]}>
          {I18n.t('filter.keyword', { locale: languageCode })}
        </Text>
        <View style={[styles.input, styles.whiteBg, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
            >
              <Defs>
                <Path d="M1.92877034,1.92877034 C4.50046414,-0.642923448 8.67946655,-0.642923448 11.2511603,1.92877034 C13.5817578,4.25936784 13.8228541,7.79544681 12.0548146,10.3671406 L15.671259,13.983585 C16.7160096,15.0283356 15.0283356,16.7160096 13.983585,15.671259 L10.3671406,12.0548146 C7.79544681,13.8228541 4.25936784,13.5817578 1.92877034,11.2511603 C-0.642923448,8.67946655 -0.642923448,4.50046414 1.92877034,1.92877034 Z M3.3753481,3.3753481 C1.60730862,5.14338758 1.60730862,8.0365431 3.3753481,9.80458258 C5.14338758,11.5726221 8.0365431,11.5726221 9.80458258,9.80458258 C11.5726221,8.0365431 11.5726221,5.14338758 9.80458258,3.3753481 C8.0365431,1.60730862 5.14338758,1.60730862 3.3753481,3.3753481 Z" id="path-1" />
              </Defs>
              <G id="vittles" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <G id="vittles-3a" transform="translate(-15.000000, -118.000000)">
                  <G id="Group" transform="translate(0.000000, 104.000000)">
                    <G id="Group-4">
                      <G id="icon/search" transform="translate(15.000000, 14.000000)">
                        <G id="color/primary/black-copy-3">
                          <Mask id="mask-2" fill="white">
                            <Use xlinkHref="#path-1" />
                          </Mask>
                          <Use id="Mask" fill="#282828" xlinkHref="#path-1" />
                          <G id="color/primary/green" mask="url(#mask-2)" fill="#40AE29">
                            <G transform="translate(-14.000000, -14.000000)" id="Rectangle">
                              <Rect x="0" y="0" width="44" height="44" rx="5" />
                            </G>
                          </G>
                        </G>
                      </G>
                    </G>
                  </G>
                </G>
              </G>
            </Svg>
          </View>
          <TextInput
            style={[styles.flexOne]}
            placeholder="Id, Shipper, Your Reference"
            value={keyword}
            onChangeText={(value) => this.setState({ keyword: value })}
            onEndEditing={this.onFilterText}
          />
        </View>
      </View>
    </>
  )

  render() {
    const {
      expanded,
      keyword
    } = this.state;
    const { app, tabFilter, total } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.whiteBg}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState((prevState) => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.pad20, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.flexOne}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  {I18n.t('filter.title', { locale: app.languageCode })}
                </Text>
              </View>
              {expanded
                ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
            </View>
          </TouchableOpacity>
          {expanded ? this.renderFilter(keyword, app.languageCode, tabFilter, total) : null}
        </View>
      </View>
    );
  }
}

export default Filter;
