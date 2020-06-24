import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import IMAGE_CONSTANT from '../../../constants/images';
import I18N from '../../../config/locales';
import styles from '../style';
import { validateFiles, validateFilePDF, validateFile } from '../../../helpers/regex';
import { IsShipmentBooked } from '../../../helpers/shipment.helper';
import { SHIPMENT_DETAIL_SECTION } from '../../../constants/app';

const { width } = Dimensions.get('window');
export default class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      invalidImg: [],
      showErr: false,
      showOption: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { sectionExpaned } = this.props;
    if (sectionExpaned !== prevProps.sectionExpaned) {
      this.setState({
        expanded: sectionExpaned === SHIPMENT_DETAIL_SECTION.PHOTOS,
      });
    }
  }

  toggleShowOption = () => {
    const { showOption } = this.state;
    this.setState({ showOption: !showOption });
  };

  uploadImage = () => {
    const { actions, shipmentDetail } = this.props;
    this.setState({
      showOption: false,
      showErr: false,
    });
    ImagePicker.openPicker({ multiple: true }).then((images) => {
      const checkType = validateFiles(images, Platform);
      if (checkType.validImg.length) {
        const formData = new FormData();
        checkType.validImg.forEach((img) => {
          formData.append('files', img);
        });
        actions.uploadPhotoShipment(shipmentDetail.id, formData);
      }
      if (checkType.invalidImg.length) {
        this.setState({
          invalidImg: checkType.invalidImg,
          showErr: true,
        });
      }
    });
  }

  uploadPDF = async () => {
    const {
      actions,
      shipmentDetail,
    } = this.props;
    const { showOption } = this.state;
    try {
      if (Platform.OS === 'android') {
        this.toggleShowOption();
      }
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (response.uri) {
        const validFile = validateFilePDF(response, 8);
        if (validFile === true) {
          const formData = new FormData();
          formData.append('files', response);
          actions.uploadPhotoShipment(shipmentDetail.id, formData);
        } else {
          this.setState((prevState) => ({
            invalidImg: [
              ...prevState.invalidImg,
              validateFile
            ],
            showErr: true,
          }));
        }
      }
    } catch (err) {
      if (Platform.OS === 'ios' && showOption) {
        this.toggleShowOption();
      }
      if (DocumentPicker.isCancel(err)) {
        // alert('Canceled from single doc picker');
        console.log('Canceled from single doc picker');
      } else {
        // alert(`Unknown Error: ${JSON.stringify(err)}`);
        console.log(`DocumentPicker Unknown Error: ${JSON.stringify(err)}`);
        // throw err;
      }
    }
  }

  renderEmptyPhoto = () => {
    const { languageCode, shipmentDetail } = this.props;
    return (
      <>
        {!IsShipmentBooked(shipmentDetail.status) ? (
          <>
            <View style={[styles.line, styles.ml20, styles.mr20]} />
            <View style={[styles.mt20, styles.mb20, styles.pl20, styles.pr20]}>
              <View style={[styles.mt10, styles.pl20, styles.pr20]}>
                <Text style={[styles.titleSize, styles.defaultTextColor, styles.bold]}>
                  {I18N.t('shipment.photos.title', { locale: languageCode })}
                </Text>
                <View style={[styles.mb25, styles.mt25, styles.flex, styles.alignItemsCenter]}>
                  <Image source={IMAGE_CONSTANT.imageDefault} style={{ width: 70, height: 70 }} />
                  <View style={[styles.flexOne, styles.ml10]}>
                    <Text style={[styles.smallerSize, styles.grayText]}>
                      {I18N.t('shipment.photos.hint_text', { locale: languageCode })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.line, styles.ml20, styles.mr20]} />
            <View style={[styles.mt20, styles.mb20, styles.pl20, styles.pr20, styles.alignItemsCenter]}>
              <Text style={[styles.titleSize, styles.defaultTextColor, styles.bold]}>
                {I18N.t('shipment.photos.not_available', { locale: languageCode })}
              </Text>
            </View>
          </>
        )}
      </>
    );
  }

  handleDeletePhoto = (photoId) => {
    const { actions } = this.props;
    actions.deletePhotoShipment(photoId);
  }

  renderPhoto = (photos) => {
    const { shipmentDetail } = this.props;
    return (
      <>
        <View style={[styles.line, styles.ml20, styles.mr20]} />
        <ScrollView style={[styles.mt20, styles.mb20, styles.pl20]} nestedScrollEnabled horizontal>
          {photos.map((item, key) => (
            <View key={item.fileName}>
              <View style={[styles.photo, styles.mr25, { backgroundColor: '#dbdbdb', borderRadius: 8, height: width / 2 }]} key={`item-${key}`}>
                {item.contentType === 'application/pdf' ? (
                  <>
                    <TouchableOpacity activeOpacity={0.9}>
                      <Image
                        style={{
                          width: width / 2,
                          height: width / 2
                        }}
                        source={IMAGE_CONSTANT.fileImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity activeOpacity={0.9}>
                    <Image
                      style={{
                        width: width / 2,
                        height: width / 2
                      }}
                      source={{ uri: item.imageUrl }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                )}
                <View style={[styles.flex, styles.alignItemsCenter, { marginTop: -180 }]}>
                  <Text style={[styles.photoMarkOrder, styles.whiteText, styles.textCenter, styles.smallerSize, styles.mainBg, { borderTopLeftRadius: 8 }]}>
                    {key + 1}
                  </Text>
                  {!IsShipmentBooked(shipmentDetail.status) && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => this.handleDeletePhoto(item.fileName)}
                    >
                      <View style={[styles.photoMarkBtn, styles.whiteBg, styles.flex, styles.alignItemsCenter, styles.justifyContentCenter]}>
                        <Image source={IMAGE_CONSTANT.deleteIconRed} style={{ width: 15, height: 15 }} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {(item.contentType || item.type) === 'application/pdf' ? (
                <Text style={{ width: width / 2, textAlign: 'center' }} numberOfLines={1}>{item.fullFileName || item.name}</Text>
              ) : <Text>{' '}</Text>}
            </View>
          ))}
        </ScrollView>
      </>
    );
  }

  renderMsgError = () => {
    const { invalidImg } = this.state;
    const { languageCode } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, marginLeft: 10 }}>
        <FlatList
          data={invalidImg}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={IMAGE_CONSTANT.errorIcon} style={{ width: 12, height: 12 }} />
              <Text style={[styles.ml5, styles.smallSize, styles.redText, styles.bold]}>
                {item.type === 'type' ? I18N.t('shipment.summary.errors.file_extension', { locale: languageCode }) : I18N.t('shipment.summary.errors.max_size', { locale: languageCode })}
                {item.file.path.split('react-native-image-crop-picker/')[1]}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </SafeAreaView>
    );
  }

  getAllPhotos = () => {
    const { shipmentDetail } = this.props;
    if (IsShipmentBooked(shipmentDetail.status)) {
      const shipmentPhotos = shipmentDetail.photos.filter((p) => p.fileName);
      const pickupPhotos = shipmentDetail.addresses.pickup.photos.filter((p) => p.fileName);
      const deliveryHasPhotos = shipmentDetail.addresses.destinations.filter((des) => des.photos.filter((photo) => photo.fileName));
      const deliveryPhotos = [];
      deliveryHasPhotos.forEach((des) => {
        deliveryPhotos.push(...des.photos);
      });
      return [
        ...shipmentPhotos,
        ...pickupPhotos,
        ...deliveryPhotos,
      ];
    }
    return shipmentDetail.photos;
  }

  render() {
    const {
      expanded, invalidImg, showErr, showOption
    } = this.state;
    const { languageCode, shipmentDetail, onExpandedSection } = this.props;
    const photos = this.getAllPhotos();
    return (
      <View>
        <View style={styles.whiteBg}>
          <View style={styles.pad20}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState((prevState) => ({
                  expanded: !prevState.expanded,
                }), () => {
                  const { expanded: currentExpanded } = this.state;
                  if (currentExpanded) {
                    onExpandedSection(SHIPMENT_DETAIL_SECTION.PHOTOS);
                  }
                });
              }}
            >
              <View style={[styles.flex, styles.alignItemsCenter]}>
                {!showErr && <Image source={require('../../../assets/images/group/photo.png')} />}
                {showErr && invalidImg.length ? this.renderMsgError() : (
                  <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.defaultTextColor, styles.bold]}>
                    {I18N.t('shipment.photos.heading', { locale: languageCode })}
                    {' '}
                    {photos.length > 0 && (
                      `(${photos.length})`
                    )}
                  </Text>
                )}
                {showErr && (
                <TouchableOpacity onPress={() => this.setState({ showErr: false })}>
                  <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 24, height: 24, marginRight: 5 }} />
                </TouchableOpacity>
                )}
                {expanded
                  ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                  : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
              </View>
            </TouchableOpacity>
          </View>
          {expanded ? photos.length ? this.renderPhoto(photos) : this.renderEmptyPhoto() : null}
          {expanded && !IsShipmentBooked(shipmentDetail.status) && (
          <View style={[styles.pl20, styles.pr20, styles.mb20]}>
            <TouchableOpacity activeOpacity={0.9} onPress={this.toggleShowOption}>
              <Text style={[styles.formGroupButton, styles.mainBg]}>
                {I18N.t('shipment.photos.title', { locale: languageCode })}
              </Text>
            </TouchableOpacity>
          </View>
          )}
        </View>
        <View style={{ position: 'relative' }}>
          <Modal
            animationType="slide"
            transparent
            visible={showOption}
            onRequestClose={this.toggleShowOption}
          >
            <SafeAreaView
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'rgba(88, 175, 43, 1)',
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  style={[styles.alignItemsEnd, styles.mb10, styles.mr5]}
                  onPress={this.toggleShowOption}
                >
                  <Image
                    source={IMAGE_CONSTANT.closeWhite}
                    style={{ width: 16, height: 16 }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    width: '90%',
                    borderRadius: 5,
                    padding: 15,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: 15,
                      height: 60,
                      width: '100%',
                    }}
                  >
                    <TouchableOpacity
                      style={[styles.flexOne, styles.mr5]}
                      onPress={this.uploadPDF}
                    >
                      <Text style={{
                        color: 'rgba(81, 175, 43, 1)',
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        borderColor: 'rgba(81, 175, 43, 1)',
                        borderWidth: 2,
                        height: 60,
                        borderRadius: 4,
                        fontSize: 20,
                        fontFamily: 'Roboto-Bold',
                        lineHeight: 60,
                        textAlign: 'center',
                      }}
                      >
                        {I18N.t('progress.file_PDF', {
                          locale: languageCode,
                        })}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.flexOne, styles.ml5]}
                      onPress={this.uploadImage}
                    >
                      <Text style={{
                        borderRadius: 4,
                        backgroundColor: 'rgba(14, 115, 15, 1)',
                        fontSize: 20,
                        fontFamily: 'Roboto-Bold',
                        lineHeight: 60,
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 1)',
                        flex: 1,
                      }}
                      >
                        {I18N.t('progress.image', {
                          locale: languageCode,
                        })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </View>
    );
  }
}
