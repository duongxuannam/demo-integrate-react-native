import React, { PureComponent } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Radio, DatePicker } from 'native-base';

// COMPONENTS
import UrlImage from '../../common/Image'
import Select from '../../common/Select'
import Services from '../services_types/Services'
import Attactments from '../attactments/Attactments'

// CONSTANT
import IMAGE_CONSTANT from '../../../constants/images';

// CSS
import styles from '../style';

class SelectFromMap extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selected) {
    this.setState({ selected })
  }

  renderPickupDate() {
    return (
      <View style={[styles.mb20, styles.paddingHorizontal20]}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
          Pickup Date
        </Text>
        <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Image source={IMAGE_CONSTANT.calendarIcon} />
          </View>
          <DatePicker
            defaultDate={new Date(2018, 4, 4)}
            minimumDate={new Date(2018, 1, 1)}
            maximumDate={new Date(2018, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType="fade"
            androidMode="default"
            placeHolderText="Select date"
            placeHolderTextStyle={{ color: 'rgba(40, 40, 40, 1)' }}
          />
        </View>
      </View>
    )
  }

  render() {
    const { expanded, showMap } = this.state
    return (
      <>
        <View style={[styles.pt30, styles.mb20, styles.formLine]}>
          {this.renderPickupDate()}
          <View style={[styles.mb30, styles.paddingHorizontal20]}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              Pickup Location Type
            </Text>
            <View style={styles.mt10}>
              <Select
                placeholder="Select a location type"
                source={[
                  { value: 0, name: "Demo Select 1" },
                  { value: 1, name: "Demo Select 2" },
                  { value: 2, name: "Demo Select 3" },
                  { value: 3, name: "Demo Select 4" },
                  { value: 4, name: "Demo Select 5" },
                  { value: 5, name: "Demo Select 6" },
                ]}
                selectedValue={this.state.selected}
                onValueChange={this.handleChange}
              />
            </View>
          </View>
          <View style={[styles.mb30, styles.paddingHorizontal20]}>
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.flexOne]}>
                Pickup Address
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
              >
                <Text style={[styles.defaultSize, showMap ? styles.redText : styles.mainColorText]}>
                  Select on Map
                </Text>
              </TouchableOpacity>
            </View>
            {/* Render Map & Pin Location - Deliveree will provide icon marker */}
            {/* <Map /> */}
            {/* End Render Map & Pin Location - Deliveree will provide icon marker */}
            <View style={[styles.input, styles.mt10, styles.flex, styles.alignItemsCenter]}>
              <View style={styles.mr10}>
                <Image source={IMAGE_CONSTANT.pickupLocation} />
                {/*<Image source={IMAGE_CONSTANT.destinationLocation} />*/}
              </View>
              <Text style={styles.defaultSize}>
                Jakarta, Indonesia
              </Text>
            </View>
          </View>
          <View style={[styles.mb30, styles.paddingHorizontal20]}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              Notes
            </Text>
            <View style={styles.mt10}>
              <TextInput
                style={styles.input}
                value={this.state.notes}
                placeholder="optional"
              />
            </View>
          </View>
          <View style={[styles.mb30, styles.paddingHorizontal20]}>
            <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
              Add Files <Text style={[styles.smallerSize, styles.grayText, styles.normal]}>(optional)</Text>
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
          {expanded && (
            <>
              <View style={[styles.lineSilver, styles.mb30]} />
              <View style={[styles.mb10, styles.paddingHorizontal20]}>
                <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                  Location Services
                </Text>
                <View style={styles.mt20}>
                  <Services source={[
                    { id: 1, url: 'a', url_active: 'a', name: 'Liftgate Service at Collection', description: '' },
                    { id: 2, url: 'a', url_active: 'a', name: 'Indoor Collection', description: '' },
                    { id: 3, url: 'a', url_active: 'a', name: 'Pickup Appt. Required', description: '' },
                    { id: 4, url: 'a', url_active: 'a', name: 'Call before Pickup', description: '' },
                  ]} />
                </View>
              </View>
            </>
          )}
          <View style={styles.lineAction} />
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState(prevState => ({ expanded: !prevState.expanded }))}
          >
            <View style={[styles.mt10, styles.mb10, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
              {expanded
                ? <Image source={IMAGE_CONSTANT.hideExpand} />
                : <Image source={IMAGE_CONSTANT.showExpand} />
              }
              <Text style={[styles.ml10, styles.defaultSize, styles.mainColorText, styles.bold]}>
                {expanded ? 'Hide Options' : 'Options'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.mb30}>
          <TouchableOpacity
            style={[styles.flex, styles.alignItemsCenter]}
            activeOpacity={0.9}
          >
            <Text style={[styles.formGroupButton, styles.marginHorizontal20]}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }
}

export default SelectFromMap;
