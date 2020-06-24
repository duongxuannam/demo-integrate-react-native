import React from 'react';
import {
  View,
  Image,
  Text,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GOOGLE_API_KEY } from '../../../config/system';
import styles from '../style';
import APP from '../../../constants/app';
import { getPlaceDetail } from '../../../services/map.services';
import IMAGE_CONSTANT from '../../../constants/images';

const MyCustomMarkerView = ({ isPickup }) => (
  <View style={[styles.relative, { width: 55, height: 55 }]}>
    <View style={{ position: 'absolute' }}>
      <View style={{
        left: 0,
        top: 0,
        width: 55,
        height: 55
      }}
      >
        {isPickup ? <Image source={IMAGE_CONSTANT.pinBlue} resizeMode="contain" style={{ width: 55, height: 55 }} />
          : <Image source={IMAGE_CONSTANT.pinYellow} resizeMode="contain" style={{ width: 55, height: 55 }} />}
      </View>
    </View>
    <View style={{
      left: 0, top: 0, width: 55, height: 35, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}
    >
      {isPickup
        ? (
          <Text style={[styles.whiteText, styles.smallSize, styles.bold]}>
            FR
          </Text>
        )
        : (
          <Text style={[styles.defaultTextColor, styles.smallSize, styles.bold]}>
            TO
          </Text>
        )}
    </View>
  </View>
);

class CargopediaMap extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);

    this.state = {
      mapReady: false,
      longitude: null,
      latitude: null,
      ...props.initData,
      // marker: null,
    };
    Geocoder.init(GOOGLE_API_KEY);
  }

  componentDidMount() {
    const { apps } = this.props;
    this.setState({
      longitude: apps.longitude,
      latitude: apps.latitude,
    });
  }

  onPress({ nativeEvent }) {
    const { coordinate } = nativeEvent;
    const { updateAddress } = this.props;
    Geocoder.from(coordinate.latitude, coordinate.longitude).then(async (json) => {
      // return address to parent
      const data = await getPlaceDetail(json.results[0].place_id);
      const address = data.result.formatted_address;
      const shortAddress = data.result.name;
      updateAddress(address, coordinate.longitude, coordinate.latitude, shortAddress);
    }).catch((error) => console.warn(error));
  }

  onMapLayout = () => {
    this.setState({ mapReady: true });
  }

  render() {
    const {
      isPolyline,
      polylineDatas,
      showMap,
      marker,
      isUpdate,
      session,
      isPickup,
    } = this.props;
    if (!isUpdate) {
      let {
        latitude,
        longitude,
        mapReady,
      } = this.state;
      latitude = marker.latitude || latitude || 10.8033169;
      longitude = marker.longitude || longitude || 106.6409313;
      return (latitude && showMap && (
        <View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[
              {
                flex: 1,
                height: 250,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }
            ]}
            region={{
              latitude: latitude || 37.78825,
              longitude: longitude || -122.4324,
              latitudeDelta: APP.LATITUDE_DELTA,
              longitudeDelta: APP.LONGITUDE_DELTA,
            }}
            showsUserLocation={!marker.address}
            onPress={!isPolyline && this.onPress}
            onLayout={this.onMapLayout}
          >
            { marker && marker.latitude && mapReady
              ? (
                <Marker
                  draggable
                  coordinate={{
                    latitude,
                    longitude
                  }}
                  onDragEnd={this.onPress}
                >
                  <MyCustomMarkerView isPickup={isPickup} />
                </Marker>
              )
              : null}
            {
              isPolyline && polylineDatas && mapReady
              && (
              <Polyline
                coordinates={polylineDatas}
                lineJoin="bevel"
                geodesic={false}
                strokeWidth={polylineDatas.length}
              />
              )
            }
          </MapView>
        </View>
      ));
    }
    let {
      latitude,
      longitude,
    } = this.state;
    latitude = session.location.latitude || latitude || 10.8033169;
    longitude = session.location.longitude || longitude || 106.6409313;
    const { mapReady } = this.state;
    if (latitude && longitude && showMap) {
      return (
        <View style={[styles.flex, styles.pt30, styles.mb20]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[
              {
                flex: 1,
                height: 250,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }
            ]}
            region={{
              latitude,
              longitude,
              latitudeDelta: APP.LATITUDE_DELTA,
              longitudeDelta: APP.LONGITUDE_DELTA,
            }}
            showsUserLocation={!session.address}
            onPress={!isPolyline && this.onPress}
            onLayout={this.onMapLayout}
          >
            {session && session.location.latitude && mapReady
              ? (
                <Marker
                  draggable
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  onDragEnd={this.onPress}
                >
                  <MyCustomMarkerView isPickup={isPickup} />
                </Marker>
              )
              : null}
          </MapView>
        </View>
      );
    }
    return null;
  }
}

CargopediaMap.propTypes = {
  showMap: PropTypes.bool,
  updateAddress: PropTypes.func,
  // isPolyline mean just show the map, can not update the location
  isPolyline: PropTypes.bool,
  polylineDatas: PropTypes.arrayOf(Object),
};

CargopediaMap.defaultProps = {
  showMap: true,
  updateAddress: null,
  isPolyline: false,
  polylineDatas: [{
    longitude: -122.43240773677826,
    latitude: 37.788019117823794
  },
  {
    latitude: 37.79226979819359,
    longitude: -122.44136262685059
  },
  {
    longitude: -122.43174958974123,
    latitude: 37.79455334828845
  }]
};

const mapStateToProps = (state) => ({
  apps: state.app,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    // { ...listingActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CargopediaMap);
