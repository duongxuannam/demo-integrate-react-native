import React from 'react';
import {View, Text, Image, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import PropTypes, {object} from 'prop-types';

// REDUX
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// ACTION
import appActions from '../../../store/actions/appAction';

import {getRegionForCoordinates} from '../../../helpers/googleMap.helper';
import {GOOGLE_MAPS_APIKEY, MODAL_STATUS} from '../../../constants/app';
import IMAGE_CONSTANT from '../../../constants/images';
// import { GOOGLE_API_KEY } from '../../../config/system';

const countries = {
  id: {
    center: {
      latitude: -5.1069045,
      longitude: 109.3206082,
    },
    zoom: 6,
  },
  ph: {
    center: {
      latitude: 11.7501514,
      longitude: 119.4477298,
    },
    zoom: 6,
  },
  th: {
    center: {
      latitude: 13.7251088,
      longitude: 100.3529072,
    },
    zoom: 6,
  },
  vn: {
    center: {
      latitude: 15.6833988,
      longitude: 108.5819973,
    },
    zoom: 6,
  },
};
class GoogleMap extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMarkerDirection = (item, idx) => (
    <Marker
      key={`pickup${idx.toString()}`}
      coordinate={item}
      label={idx + 1}
      type={item.type}>
      <Image
        style={styles.imageSize}
        source={IMAGE_CONSTANT.googleMapTo}
        resizeMode="contain"
      />
      <View style={[styles.textTo, styles.imageSize]}>
        <Text>{idx}</Text>
      </View>
    </Marker>
  );

  renderMarkerPoint = (item, idx, noPress = false) => (
    <Marker
      key={`pickup${idx.toString()}`}
      coordinate={item}
      label={idx + 1}
      type={item.type}
      onPress={!noPress ? () => this.viewMapDetail(idx) : null}
      anchor={{x: 0.5, y: 0.5}}>
      <View
        style={[
          Platform.OS === 'ios' ? styles.textTo : styles.overViewAndroid,
          Platform.OS === 'ios' ? styles.imagePoint : styles.imagePointAndroid,
          {height: 70, top: 0},
        ]}>
        <Image
          style={
            Platform.OS === 'ios' ? styles.imagePoint : styles.imagePointAndroid
          }
          source={IMAGE_CONSTANT.googleMapFrom}
          resizeMode="contain"
        />
        <Image
          style={
            Platform.OS === 'ios' ? styles.imageGoods : styles.imageGoodsAndroid
          }
          source={IMAGE_CONSTANT.googleMapGoods}
          resizeMode="contain"
        />
      </View>
    </Marker>
  );

  viewMapDetail(idx) {
    const {actions} = this.props;
    actions.openModal(MODAL_STATUS.GOOGLEMAP_SHIPMENT_DETAIL, idx);
  }

  render() {
    const {listPoint, directions, countryCode} = this.props;
    const regionCheck = [...listPoint, ...directions];

    if (regionCheck.length > 0) {
      const region = getRegionForCoordinates(regionCheck);
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={region}
          showsUserLocation
          zoomControlEnabled>
          {listPoint &&
            listPoint.length > 0 &&
            listPoint.map((item, idx) => this.renderMarkerPoint(item, idx))}
          {directions &&
            directions.length > 0 &&
            directions.map((item, idx) =>
              idx > 0
                ? this.renderMarkerDirection(item, idx)
                : this.renderMarkerPoint(item, idx, true),
            )}
          {directions && directions.length > 0 && (
            <MapViewDirections
              origin={directions[0]}
              destination={directions[directions.length - 1]}
              waypoints={directions.length > 1 ? directions.slice(1, -1) : null}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="green"
            />
          )}
        </MapView>
      );
    }
    const country = countryCode || 'vn';
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapView}
        initialRegion={{
          latitude: countries[country].center.latitude,
          longitude: countries[country].center.longitude,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        showsUserLocation
        zoomControlEnabled
      />
    );
  }
}

GoogleMap.propTypes = {
  listPoint: PropTypes.arrayOf(PropTypes.any),
  directions: PropTypes.arrayOf(PropTypes.any),
};

GoogleMap.defaultProps = {
  listPoint: [],
  directions: [],
};

const mapStateToProps = state => ({
  countryCode: state.config.countryCode,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({...appActions}, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GoogleMap);

const styles = {
  mapView: {
    flex: 1,
    height: 500,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageSize: {
    width: 40,
    height: 40,
  },
  textTo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: -5,
  },
  imagePoint: {
    width: 70,
    height: 70,
  },
  imageGoods: {
    width: 20,
    height: 40,
    position: 'absolute',
  },
  imagePointAndroid: {
    width: 30,
    height: 30,
  },
  imageGoodsAndroid: {
    width: 10,
    height: 20,
    position: 'absolute',
    top: 5,
  },
  overViewAndroid: {
    position: 'absolute',
    alignItems: 'center',
  },
};
