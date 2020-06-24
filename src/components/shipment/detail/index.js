import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import CardCarousel from '../../common/CardCarousel';
import CardCargopedia from '../../common/CardCargopedia';
import Summary from './Summary';
import Photo from './Photo';
import LTLShipment from './LTLShipment';
import TimeLeft from './TimeLeft';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import { getRegionForCoordinates } from '../../../helpers/googleMaps';
import styles from '../style';
import { isBookedShipment, roundDecimalToMatch, roundToMatch, parseDriverStatus } from '../../../helpers/shipment.helper';
import { ADDRESS_STATUS } from '../../../constants/app';
import { getDistanceBetween2Coordinate } from '../../../helpers/regex';
import { SHIPMENT_STATUS } from '../../../helpers/constant.helper';

const MyCustomMarkerView = ({ type, index, isCompleted = false }) => (
  <View style={[styles.relative, { width: 55, height: 55 }]}>
    <View style={{ position: 'absolute' }}>
      <View style={{
        left: 0, top: 0, width: 55, height: 55
      }}
      >
        {type === 'pickup' ? <Image source={isCompleted ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinBlue} resizeMode="contain" style={{ width: 55, height: 55 }} />
          : <Image source={isCompleted ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinYellow} resizeMode="contain" style={{ width: 55, height: 55 }} />}
      </View>
    </View>
    <View style={{
      left: 0, top: 0, width: 55, height: 35, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}
    >
      {type === 'pickup'
        ? (
          <Text style={[styles.whiteText, styles.smallSize, styles.bold]}>
            FR
          </Text>
        )
        : (
          <Text style={[isCompleted ? styles.whiteText : styles.defaultTextColor, styles.smallSize, styles.bold]}>
            {index}
          </Text>
        )}
    </View>
  </View>
);

const OverlayComponent = ({ shipmentDetail, totalDuration, languageCode }) => (
  <View style={styles.overlayComponent}>
    <View style={[styles.flex, styles.alignItemsCenter, styles.justifyContentSpaceAround, styles.h100per]}>
      <Text style={styles.bold}>
        {shipmentDetail.shipmentDetail.totalDistance ? roundToMatch(shipmentDetail.shipmentDetail.totalDistance, 1) : 0 }
        {' '}
        km
      </Text>
      <View style={styles.flexWrapper}>
        <Text>
          {I18N.t('shipment.totalWeight', { locale: languageCode })}
          {' '}
          <Text style={styles.bold}>
            {roundDecimalToMatch(shipmentDetail.itemsDetail.totalWeight, 1)}
            {' '}
            {shipmentDetail.itemsDetail.totalWeight > 1
              ? I18N.t('shipment.kgs', { locale: languageCode })
              : I18N.t('shipment.kg', { locale: languageCode })}
          </Text>
        </Text>
        <Text>
          {I18N.t('shipment.totalItems', { locale: languageCode })}
          {' '}
          <Text style={styles.bold}>{shipmentDetail.itemsDetail.items.length}</Text>
        </Text>
      </View>
    </View>
  </View>
);

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      polylineDatas: [],
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      polylineCompleted: [],
      polylineInProgress: [],
    };

    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.initPolylineData();
    this.initRegion();
  }

  componentDidUpdate(prevProps) {
    const { shipmentDetail } = this.props;
    if (prevProps.shipmentDetail !== shipmentDetail) {
      this.setState({
        polylineCompleted: [],
        polylineInProgress: [],
      }, () => {
        this.initPolylineData();
      });
      this.initRegion();
    }
  }

  getView = (e) => {
    const { y } = e.nativeEvent.layout;
    const { onGotoView } = this.props;
    console.log('GET VIEW: ', y);
    if (onGotoView) {
      onGotoView(y);
    }
  }

  initPolylineData = () => {
    const { shipmentDetail } = this.props;
    const { destinations, pickup } = shipmentDetail.addresses;
    const coordinatesPickup = {
      latitude: pickup.location.latitude,
      longitude: pickup.location.longitude,
      address: pickup.address,
    };

    destinations.forEach((des, index) => {
      if (des.status === ADDRESS_STATUS.COMPLETED) {
        if (index === 0) {
          this.setState((prevState) => ({
            ...prevState,
            polylineCompleted: [...prevState.polylineCompleted, [coordinatesPickup, {
              latitude: des.location.latitude,
              longitude: des.location.longitude,
            }]]
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            polylineCompleted: [...prevState.polylineCompleted, [{
              latitude: destinations[index - 1].location.latitude,
              longitude: destinations[index - 1].location.longitude,
            }, {
              latitude: des.location.latitude,
              longitude: des.location.longitude,
            }]]
          }));
        }
      }

      if (des.status === ADDRESS_STATUS.IN_PROGRESS) {
        if (index === 0) {
          this.setState((prevState) => ({
            ...prevState,
            polylineInProgress: [...prevState.polylineInProgress, [coordinatesPickup, {
              latitude: des.location.latitude,
              longitude: des.location.longitude,
            }]]
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            polylineInProgress: [...prevState.polylineInProgress, [{
              latitude: destinations[index - 1].location.latitude,
              longitude: destinations[index - 1].location.longitude,
            }, {
              latitude: des.location.latitude,
              longitude: des.location.longitude,
            }]]
          }));
        }
      }
    });
  }

  initRegion = () => {
    const { shipmentDetail } = this.props;
    const region = {
      latitude: null,
      longitude: null,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    const coordinatesPickup = {
      latitude: shipmentDetail.addresses.pickup.location.latitude,
      longitude: shipmentDetail.addresses.pickup.location.longitude,
    };

    const coordinatesDestinatons = [];
    shipmentDetail.addresses.destinations.forEach((des) => {
      coordinatesDestinatons.push({
        latitude: des.location.latitude,
        longitude: des.location.longitude,
      });
    });

    const aaaa = getRegionForCoordinates([coordinatesPickup, ...coordinatesDestinatons]);

    this.setState({
      region: { ...region, ...aaaa }
    });
  }

  renderDynamicContent = (shipmentDetail, languageCode) => (
    <>
      {!(isBookedShipment(shipmentDetail.status)) && (
        <TimeLeft languageCode={languageCode} shipmentDetail={shipmentDetail} />
      )}
      {(isBookedShipment(shipmentDetail.status) || shipmentDetail.status === SHIPMENT_STATUS.CANCELLED) && (
        <View style={[styles.flex, styles.alignItemsCenter, styles.mb20]}>
          <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
            {I18N.t('shipment.summary.latest', { locale: languageCode })}
          </Text>
          <View style={[styles.ml20, styles.flexOne, styles.flex]}>
            <Text style={[styles.defaultTextColor, styles.smallSize, styles.mainColorText]}>
              {parseDriverStatus(shipmentDetail.status, shipmentDetail.addresses.pickup.status, shipmentDetail.addresses.destinations, languageCode)}
            </Text>
            <View style={styles.flexOne} />
          </View>
        </View>
      )}
      <View style={[styles.flex, styles.alignItemsCenter, styles.mb20]}>
        <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
          ID
        </Text>
        <View style={[styles.ml20, styles.flexOne, styles.flex]}>
          <Text style={[styles.shipmentID, styles.defaultTextColor, styles.smallSize]}>
            DL-LTL-
            {shipmentDetail && shipmentDetail.code}
          </Text>
          <View style={styles.flexOne} />
        </View>
      </View>
      {!(isBookedShipment(shipmentDetail.status)) && (
        <View style={[styles.flex, styles.alignItemsCenter]}>
          <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
            {I18N.t('shipment.detail.views', { locale: languageCode })}
          </Text>
          <View style={[styles.ml20, styles.flexOne, styles.flexColumn]}>
            <Text style={[styles.defaultTextColor, styles.smallSize]}>
              {shipmentDetail.shipmentDetail.totalView}
              {' '}
              {
                shipmentDetail.shipmentDetail.totalView > 1
                  ? I18N.t('shipment.detail.viewers', { locale: languageCode })
                  : I18N.t('shipment.detail.viewer', { locale: languageCode })
              }
            </Text>
            <Text style={[styles.defaultTextColor, styles.smallSize]}>
              {shipmentDetail.shipmentDetail.totalWatching}
              {' '}
              {I18N.t('shipment.detail.watching', { locale: languageCode })}
            </Text>
            <View style={styles.flexOne} />
          </View>
        </View>
      )}
    </>
  )

  handleBid = () => {
    const { navigation } = this.props;
    navigation.navigate('ShipmentPlaceStack');
  }

  renderItem(session, index) {
    const {
      languageCode, shipmentDetail, actions, countryCode
    } = this.props;
    if (session && session.type === 'detail') {
      return (
        <CardCargopedia
          source={session.source}
          isCustomView
          languageCode={languageCode}
          countryCode={countryCode}
          title={I18N.t('shipment.detail.info', { locale: languageCode })}
          renderDynamicContent={() => this.renderDynamicContent(shipmentDetail, languageCode, actions)}
        />
      );
    }

    return (
      <CardCargopedia
        isLocation
        languageCode={languageCode}
        countryCode={countryCode}
        title={session.source.pickup ? I18N.t('shipment.pickup', { locale: languageCode })
          : I18N.t('shipment.destination', { locale: languageCode })}
        source={session.source}
        index={index - 1}
      />
    );
  }

  renderMap() {
    const { polylineCompleted, region, polylineInProgress } = this.state;
    const { shipmentDetail, totalDuration, languageCode } = this.props;
    return (
      <View style={{ height: 350, backgroundColor: '#777', position: 'relative' }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={[
            {
              flex: 1,
              height: 200,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }
          ]}
          scrollEnabled={false}
          rotateEnabled={false}
          initialRegion={region}
          region={region}
        >
          <Marker
            coordinate={{
              latitude: shipmentDetail.addresses.pickup.location.latitude,
              longitude: shipmentDetail.addresses.pickup.location.longitude,
            }}
            title={shipmentDetail.addresses.pickup.address}
          >
            <MyCustomMarkerView type="pickup" isCompleted={shipmentDetail.addresses.pickup.status === ADDRESS_STATUS.COMPLETED} />
          </Marker>

          {shipmentDetail.addresses.destinations.map((destination, index) => (
            <Marker
              key={`D ${index}`}
              coordinate={{
                latitude: destination.location.latitude,
                longitude: destination.location.longitude,
              }}
              title={destination.address}
            >
              <MyCustomMarkerView type="location" index={index + 1} isCompleted={destination.status === ADDRESS_STATUS.COMPLETED} />
            </Marker>
          ))}
          {/* Completed */}
          {polylineCompleted.map((polyline, index) => (
            <Polyline
              key={`P ${index}`}
              coordinates={polyline}
              strokeColor="#0e730f"
              geodesic
              strokeWidth={3}
            />
          ))}
          {/* IN PROGRESS */}
          {polylineInProgress.map((polyline, index) => {
            let distance = 0;
            if (Platform.OS === 'ios') {
              distance = getDistanceBetween2Coordinate({
                latitude: polyline[0].latitude, longitude: polyline[0].longitude
              }, {
                latitude: polyline[1].latitude, longitude: polyline[1].longitude
              });
            }
            return (
              <Polyline
                key={`P ${index}`}
                coordinates={polyline}
                strokeColor="#51af2b"
                lineCap="square"
                lineJoin="miter"
                miterLimit={11}
                lineDashPattern={Platform.OS === 'android' ? [50, 50] : [(distance * 0.1), (distance * 0.1)]}
                geodesic
                strokeWidth={3}
              />
            );
          })}
        </MapView>
        <OverlayComponent shipmentDetail={shipmentDetail} totalDuration={totalDuration} languageCode={languageCode} />
      </View>
    );
  }

  render() {
    const {
      summaryShipment,
      shipmentDetail,
      languageCode,
      defaultTransportTypes,
      defaultHandleUnits,
      defaultLocationServices,
      defaultAdditionalServices,
      countryCode,
      driver,
    } = this.props;

    return (
      <>
        <View style={[styles.mb30, styles.mt30, { zIndex: 1 }]}>
          <CardCarousel
            source={summaryShipment}
            itemWidth={260}
            renderItem={this.renderItem}
            options={{
              activeSlideAlignment: 'start',
              containerCustomStyle: { paddingLeft: 20 },
              slideStyle: { marginRight: 10 },
            }}
          />
        </View>
        <View>
          {this.renderMap()}
        </View>
        <View style={styles.mb30}>
          <Summary
            defaultTransportTypes={defaultTransportTypes}
            shipmentDetail={shipmentDetail}
            languageCode={languageCode}
            countryCode={countryCode}
          />
        </View>
        <View style={styles.mb30}>
          <Photo
            languageCode={languageCode}
            shipmentDetail={shipmentDetail}
            driver={driver}
          />
        </View>
        <View style={styles.mb30} onLayout={this.getView}>
          <LTLShipment
            defaultTransportTypes={defaultTransportTypes}
            defaultHandleUnits={defaultHandleUnits}
            defaultLocationServices={defaultLocationServices}
            defaultAdditionalServices={defaultAdditionalServices}
            shipmentDetail={shipmentDetail}
            languageCode={languageCode}
          />
        </View>
        {
          (!shipmentDetail.isQuoted && (
            <View style={[styles.paddingHorizontal20, styles.pt15, styles.pb15, styles.whiteBg, { justifyContent: 'center' }]}>
              <TouchableOpacity
                style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
                activeOpacity={0.9}
                onPress={this.handleBid}
              >
                <Text style={[styles.formGroupButton, styles.flexOne]}>
                  {I18N.t('shipment.detail.placeBid', { locale: languageCode })}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </>
    );
  }
}

export default Details;
