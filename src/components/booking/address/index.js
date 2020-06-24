/* eslint-disable react/no-deprecated */
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// ACTION
import authActions from '../../../store/actions/authAction';

// COMPONENTS
import AddNewBooking from '../add_new/AddNewBooking';
import Addresses from '../list/Addresses';
import SelectFromMap from '../map/SelectFromMap';
import MessageError from '../../common/MessageError';

// CONSTANT
import IMAGE_CONSTANT from '../../constants/images';

//
import I18n from '../../config/locales';

// CSS
import styles from './style';

const { width } = Dimensions.get('window');

class BookingAddresses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isVisibleShowMap: false,
      bookings: [
        {
          id: 1,
          name: 'Pickup',
          time: '2019-12-21T13:18:46+07:00',
          locations_type: [
            { value: 0, name: 'Demo Select 1' },
            { value: 1, name: 'Demo Select 2' },
            { value: 2, name: 'Demo Select 3' },
            { value: 3, name: 'Demo Select 4' },
            { value: 4, name: 'Demo Select 5' },
            { value: 5, name: 'Demo Select 6' },
          ],
          location: {
            lat: 10.797176,
            lng: 106.659230,
            address: 'Jakarta, Indonesia',
            description: '',
          },
          locations_services: [
            {
              id: 1, url: 'a', url_active: 'a', name: 'Liftgate Service at Collection', description: ''
            },
            {
              id: 2, url: 'a', url_active: 'a', name: 'Indoor Collection', description: ''
            },
            {
              id: 3, url: 'a', url_active: 'a', name: 'Pickup Appt. Required', description: ''
            },
            {
              id: 4, url: 'a', url_active: 'a', name: 'Call before Pickup', description: ''
            },
          ],
          attactments: [],
        },
        {
          id: 2,
          name: 'Destination 1',
          time: '',
          locations_type: [
            { value: 0, name: 'Demo Select 1' },
            { value: 1, name: 'Demo Select 2' },
            { value: 2, name: 'Demo Select 3' },
            { value: 3, name: 'Demo Select 4' },
            { value: 4, name: 'Demo Select 5' },
            { value: 5, name: 'Demo Select 6' },
          ],
          location: {
            lat: 10.768016,
            lng: 106.69634399999995,
            address: 'Sumatra, Indonesia',
            description: '',
          },
          locations_services: [
            {
              id: 1, url: 'a', url_active: 'a', name: 'Liftgate Service at Collection', description: ''
            },
            {
              id: 2, url: 'a', url_active: 'a', name: 'Indoor Collection', description: ''
            },
            {
              id: 3, url: 'a', url_active: 'a', name: 'Pickup Appt. Required', description: ''
            },
            {
              id: 4, url: 'a', url_active: 'a', name: 'Call before Pickup', description: ''
            },
          ],
          attactments: [],
        },
      ]
    };

    this.showModal = this.showModal.bind(this);
    this.showSelectFromMap = this.showSelectFromMap.bind(this);
  }

  handleAddNew = () => {
    this.setState({
      bookings: [
        ...this.state.bookings,
        {
          id: this.state.bookings.length + 1,
          name: `Destination ${this.state.bookings.length + 1}`,
          time: '',
          locations_type: [
            { value: 0, name: 'Demo Select 1' },
            { value: 1, name: 'Demo Select 2' },
            { value: 2, name: 'Demo Select 3' },
            { value: 3, name: 'Demo Select 4' },
            { value: 4, name: 'Demo Select 5' },
            { value: 5, name: 'Demo Select 6' },
          ],
          location: {
            lat: 10.768016,
            lng: 106.69634399999995,
            address: 'Sumatra, Indonesia',
            description: '',
          },
          locations_services: [
            {
              id: 1, url: 'a', url_active: 'a', name: 'Liftgate Service at Collection', description: ''
            },
            {
              id: 2, url: 'a', url_active: 'a', name: 'Indoor Collection', description: ''
            },
            {
              id: 3, url: 'a', url_active: 'a', name: 'Pickup Appt. Required', description: ''
            },
            {
              id: 4, url: 'a', url_active: 'a', name: 'Call before Pickup', description: ''
            },
          ],
          attactments: [],
        },
      ]
    });
  }

  componentWillMount() {
    const { listing } = this.props;
    listing.initAddressData();
  }

  showModal(booking) {
    this.setState({
      isVisible: true,
      bookingOnHandle: booking,
    });
  }

  closeModal() {
    this.setState({
      isVisible: false,
      isVisibleShowMap: false,
      bookingOnHandle: undefined,
    });
  }

  showSelectFromMap(booking) {
    this.setState({
      isVisibleShowMap: true,
      bookingOnHandle: booking,
    });
  }

  render() {
    const {
      bookings, bookingOnHandle, isVisible, isVisibleShowMap
    } = this.state;
    return (
      <View>
        {bookings.map((booking, key) => (
          <View key={`booking-${booking.id}`} style={{ zIndex: 999 - key }}>
            <Addresses
              booking={booking}
              isFirstLocation={key === 0}
              onDelete={this.showModal}
              onSelectFromMap={this.showSelectFromMap}
            />
          </View>
        ))}
        <AddNewBooking addNew={this.handleAddNew} />

        {/* Modal Delete Booking */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisible}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
              }}
              onPress={() => this.closeModal()}
            />
            <View
              style={[styles.whiteBg, styles.pad20, {
                height: 255,
              }]}
            >
              <Text style={[styles.defaultSize, styles.bold]}>
                Delete item
              </Text>
              <View style={[styles.mt20, styles.lineSilver]} />
              <View style={[styles.mt30, styles.mb30, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                <Text style={[styles.defaultSize, styles.textCenter, { width: width / 1.5 }]}>
                  {`Are you sure you want to delete ${bookingOnHandle && bookingOnHandle.name}?`}
                </Text>
              </View>
              <View style={styles.flex}>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                  onPress={() => this.closeModal()}
                >
                  <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.mr10]}>
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.formGroupButton, styles.formGroupButtonRed, styles.flexOne, styles.ml10]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal Select From Map */}
        <Modal
          animationType="slide"
          transparent
          visible={isVisibleShowMap}
          onRequestClose={() => this.closeModal()}
        >
          <View style={{ flex: 1 }}>
            <View
              activeOpacity={1}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                flex: 1,
              }}
            />
            <View
              style={[styles.whiteBg, {
                flex: 4,
              }]}
            >
              <View>
                <View style={[styles.flex, { marginTop: -31 }]}>
                  <Text style={styles.formHeader}>
                    Pickup Address
                  </Text>
                  <View style={styles.flexOne} />
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    marginTop: -76,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  onPress={() => this.closeModal()}
                >
                  <Image source={IMAGE_CONSTANT.circleCloseWhite} style={{ width: 36, height: 36 }} />
                </TouchableOpacity>
              </View>
              <ScrollView
                nestedScrollEnabled
              >
                <SelectFromMap />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default BookingAddresses;
