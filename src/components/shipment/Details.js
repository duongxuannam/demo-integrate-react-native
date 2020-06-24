import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import CardCarousel from '../common/CardCarousel';
import CardCargopedia from '../common/CardCargopedia';
import Summary from './detail/Summary';
import Photo from './detail/Photo';
import LTLShipment from './detail/LTLShipment';
import Referral from './detail/Referral';
import { formatMetricsWithCommas, getDistanceBetween2Coordinate } from '../../helpers/regex';
import IMAGE_CONSTANT from '../../constants/images';
import I18N from '../../config/locales';
import { getRegionForCoordinates } from '../../helpers/googleMaps';
import TimeLeft from './detail/TimeLeft';
import styles from './style';
import listingAction from '../../store/actions/listingAction';
import appActions from '../../store/actions/appAction';
import {
  transitFormat, IsShipmentBooked, getTransportTypeName, parseStatusToString, parseDriverStatus, SHIPMENT_STATUS, getDateString
} from '../../helpers/shipment.helper';
import PROGRESS from '../../constants/progress';
import FirebaseHelper from '../../helpers/firebaseHelper';
import communicationAction from '../../store/actions/communicationAction';

const MyCustomMarkerView = ({ type, index, isCompleted = false }) => (
  <View style={[styles.relative, { width: 55, height: 55 }]}>
    <View style={{ position: 'absolute' }}>
      <View style={{ left: 0, top: 0, width: 55, height: 55 }}>
        {type === 'pickup' ? <Image source={isCompleted ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinBlue} resizeMode="contain" style={{ width: 55, height: 55 }} />
          : <Image source={isCompleted ? IMAGE_CONSTANT.pinGreen : IMAGE_CONSTANT.pinYellow} resizeMode="contain" style={{ width: 55, height: 55 }} />}
      </View>
    </View>
    <View style={{ left: 0, top: 0, width: 55, height: 35, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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

const OverlayComponent = ({ shipmentDetail, languageCode, transportTypeDefault, countryCode }) => (
  <View style={styles.overlayComponent}>
    {IsShipmentBooked(shipmentDetail.status) ? (
      <View style={{
        display: 'flex', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', height: '100%'
      }}
      >
        <View>
          <Text style={styles.bold}>
            {formatMetricsWithCommas(shipmentDetail && shipmentDetail.shipmentDetail.totalDistance)}
            {' '}
              km
          </Text>
          <Text style={styles.bold}>
            Mode:
            {' '}
            {getTransportTypeName(transportTypeDefault, (shipmentDetail.dispatch && shipmentDetail.dispatch.transportMode) || shipmentDetail.transportTypeId) || '-'}
          </Text>
        </View>
        <View>
          <Text>
            Pickup:
            {' '}
            <Text style={styles.bold}>
              {getDateString(shipmentDetail.shipmentDetail.pickupDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
            </Text>
          </Text>
          <Text>
            {I18N.t('shipment.est_transit', { locale: languageCode })}
            {' '}
            <Text style={styles.bold}>
              {shipmentDetail.shipmentDetail.totalTransitTime}
              {' '}
              day
            </Text>
          </Text>
          <Text>
            Final Delivery:
            {' '}
            <Text style={styles.bold}>
              {getDateString(shipmentDetail.shipmentDetail.completedDate, countryCode, languageCode, languageCode === 'vi' ? 'DD-[Th]MM' : 'DD-MMM')}
            </Text>
          </Text>
        </View>
      </View>
    ) : (
        <View style={{
          display: 'flex', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', height: '100%'
        }}
        >
          <Text style={styles.bold}>
            {formatMetricsWithCommas(shipmentDetail && shipmentDetail.shipmentDetail.totalDistance)}
            {' '}
            km
          </Text>
          <Text>
            {I18N.t('shipment.est_transit', { locale: languageCode })}
            {' '}
            <Text style={styles.bold}>
              {transitFormat(shipmentDetail.shipmentDetail.totalDuration)}
            h
            </Text>
          </Text>
        </View>
      )}
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
      sectionExpaned: '',
    };

    this.handleMore = this.handleMore.bind(this);
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

  initPolylineData = () => {
    const { shipmentDetail } = this.props;
    const { destinations, pickup } = shipmentDetail.addresses;
    const coordinatesPickup = {
      latitude: pickup.location.latitude,
      longitude: pickup.location.longitude,
      address: pickup.address,
    };

    destinations.forEach((des, index) => {
      if (des.status === PROGRESS.ADDRESS_PROGRESS_STATUS.COMPLETED) {
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

      if (des.status === PROGRESS.ADDRESS_PROGRESS_STATUS.IN_PROGRESS) {
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

    const regionCoors = getRegionForCoordinates([coordinatesPickup, ...coordinatesDestinatons]);

    this.setState({
      region: { ...region, ...regionCoors }
    });
  }

  handleMore = (session, isShipmentBooked, collapseSection, indexCollapse) => {
    const { onMoreBooked } = this.props;
    if (isShipmentBooked) {
      onMoreBooked(collapseSection, indexCollapse);
    } else {
      this.setAddressData(session);
    }
  }

  setAddressData = async (session) => {
    const { actions } = this.props;
    let defaultPhoto = [];
    if (session.item.photos.length === 0) {
      defaultPhoto = [null, null, null];
    } else if (session.item.photos.length === 1) {
      defaultPhoto = [session.item.photos[0], null, null];
    } else if (session.item.photos.length === 2) {
      defaultPhoto = [session.item.photos[0], session.item.photos[1], null];
    } else {
      defaultPhoto = session.item.photos;
    }
    const addressData = {
      ...session.item,
      prevAddress: session.item.address,
      photos: defaultPhoto,
      latitude: session.item.location.latitude,
      longitude: session.item.location.longitude,
    };
    actions.updatingAddress(addressData);
    actions.openAddressModal();
  }

  renderMap = () => {
    const { polylineCompleted, region, polylineInProgress } = this.state;
    const { shipmentDetail, languageCode, transportTypeDefault, countryCode } = this.props;
    console.log('polylineCompleted: ', polylineCompleted);

    console.log('polylineInProgress: ', polylineInProgress);
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
          zoomEnabled
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
            <MyCustomMarkerView type="pickup" isCompleted={shipmentDetail.addresses.pickup.status === PROGRESS.ADDRESS_PROGRESS_STATUS.COMPLETED} />
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
              <MyCustomMarkerView type="location" index={index + 1} isCompleted={destination.status === PROGRESS.ADDRESS_PROGRESS_STATUS.COMPLETED} />
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
        <OverlayComponent shipmentDetail={shipmentDetail} languageCode={languageCode} transportTypeDefault={transportTypeDefault} countryCode={countryCode} />
      </View>
    );
  }

  renderDynamicContent = (shipmentDetail, languageCode, actions, configs) => (
    <>
      {!(IsShipmentBooked(shipmentDetail.status)) && (
        <TimeLeft languageCode={languageCode} shipmentDetail={shipmentDetail} configs={configs} />
      )}
      {(IsShipmentBooked(shipmentDetail.status) || shipmentDetail.status === SHIPMENT_STATUS.CANCELLED) && (
        <View style={[styles.flex, styles.alignItemsCenter, styles.mb20]}>
          <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
            {I18N.t('shipment.summary.status', { locale: languageCode })}
          </Text>
          <View style={[styles.ml20, styles.flexOne, styles.flex]}>
            <Text style={[styles.defaultTextColor, styles.smallSize, styles.mainColorText]}>
              {parseDriverStatus(shipmentDetail.status, shipmentDetail.addresses.pickup.status, shipmentDetail.addresses.destinations, languageCode)}
            </Text>
            <View style={styles.flexOne} />
          </View>
        </View>
      )}
      <View style={[styles.flex, styles.alignItemsCenter]}>
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
      <View style={[styles.flex, styles.alignItemsCenter, styles.mt10]}>
        <Text style={[styles.smallSize, styles.grayText, styles.w70]}>
          {I18N.t('shipment.referral', { locale: languageCode })}
        </Text>
        <Referral shipmentDetail={shipmentDetail} actions={actions} />
      </View>
    </>
  )

  renderItem = (session, index) => {
    const {
      languageCode,
      shipmentDetail,
      actions,
      configs,
    } = this.props;
    if (session && session.type === 'detail') {
      return (
        <CardCargopedia
          isCustomView
          title={I18N.t('shipment.details', { locale: languageCode })}
          renderDynamicContent={() => this.renderDynamicContent(shipmentDetail, languageCode, actions, configs)}
        />
      );
    }

    return (
      <CardCargopedia
        isLocation
        title={session.source.pickup ? I18N.t('shipment.pickup', { locale: languageCode })
          : I18N.t('shipment.destination', { locale: languageCode })}
        source={session.source}
        index={index - 1}
        collapseSection={session.source.pickup ? PROGRESS.SECTION.PICKUP : PROGRESS.SECTION.DELIVERY}
        indexCollapse={index - 2}
        isShipmentBooked={IsShipmentBooked(shipmentDetail.status)}
        onMore={this.handleMore}
      />
    );
  }

  onExpandedSection = (sectionExpaned) => {
    this.setState({
      sectionExpaned,
    });
  }

  render() {
    const {
      summaryShipment,
      shipmentDetail,
      languageCode,
      actions,
      onContactCarrier,
      countryCode,
    } = this.props;
    const { sectionExpaned } = this.state;
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
            onEdit={this.onEdit}
            onSubmit={this.onSubmit}
            shipmentDetail={shipmentDetail}
            actions={actions}
            countryCode={countryCode}
            sectionExpaned={sectionExpaned}
            onExpandedSection={this.onExpandedSection}
            onContactCarrier={() => onContactCarrier()}
          />
        </View>
        <View style={styles.mb30}>
          <Photo
            languageCode={languageCode}
            shipmentDetail={shipmentDetail}
            actions={actions}
            sectionExpaned={sectionExpaned}
            onExpandedSection={this.onExpandedSection}
          />
        </View>
        <View style={styles.mb30}>
          <LTLShipment
            shipmentDetail={shipmentDetail}
            languageCode={languageCode}
            sectionExpaned={sectionExpaned}
            onExpandedSection={this.onExpandedSection}
          />
        </View>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  summaryShipment: state.listing.summaryShipment,
  shipmentDetail: state.listing.shipmentDetail,
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  transportTypeDefault: state.listing.transportTypesDefault,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingAction, ...appActions, ...communicationAction },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Details);
