import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  actionSize: {
    fontSize: 34,
    fontFamily: 'Roboto-Regular',
  },
  font27: {
    fontSize: 27,
    fontFamily: 'Roboto-Regular',
  },
  w70: {
    width: 70,
  },
  w120: {
    width: 120,
  },
  boxSize: {
    fontSize: 23,
    fontFamily: 'Roboto-Regular',
  },
  titleSize: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
  },
  font18: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  notificationSize: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  smallSize: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
  },
  smallerSize: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  defaultColor: {
    color: 'rgba(40, 40, 40, 1)',
  },
  defaultCustomColor: {
    color: 'rgba(74, 74, 74, 1)',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  greenBg: {
    backgroundColor: 'rgba(81, 175, 43, 1)',
  },
  darkGreenBg: {
    backgroundColor: 'rgba(51, 115, 25, 1)',
  },
  lightGreenBg: {
    backgroundColor: 'rgba(216, 226, 212, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  yellowBg: {
    backgroundColor: 'rgba(255, 219, 0, 1)',
  },
  redBg: {
    backgroundColor: 'rgba(244, 67, 54, 1)',
  },
  mainColorText: {
    color: 'rgba(81, 175, 43, 1)',
  },
  grayText: {
    color: 'rgba(161, 161, 161, 1)',
  },
  whiteText: {
    color: 'rgba(255, 255, 255, 1)',
  },
  italic: {
    fontStyle: 'italic',
  },
  errorText: {
    color: '#f44336',
  },
  redText: {
    color: 'rgba(244, 67, 54, 1)',
  },
  notificationText: {
    color: 'rgba(40, 40, 40, 1)',
  },
  grayBorder: {
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
  },
  circleGrayBorder: {
    borderWidth: 1,
    borderColor: 'rgba(161, 161, 161, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  flexOneSubstract: {
    flex: 0.9,
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  alignContentCenter: {
    alignContent: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  justifyContentSpaceAround: {
    justifyContent: 'space-around',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  },
  normal: {
    fontFamily: 'Roboto-Regular',
  },
  zIndex1: {
    zIndex: 1,
  },
  zIndex2: {
    zIndex: 2,
  },
  pad15: {
    padding: 15,
  },
  pad20: {
    padding: 20,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  paddingVertical30: {
    paddingVertical: 30,
  },
  paddingVertical20: {
    paddingVertical: 20,
  },
  paddingVertical15: {
    paddingVertical: 15,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  pl20: {
    paddingLeft: 20,
  },
  pl10: {
    paddingLeft: 10,
  },
  pr20: {
    paddingRight: 20,
  },
  pr10: {
    paddingRight: 10,
  },
  pt15: {
    paddingTop: 15,
  },
  pt10: {
    paddingTop: 10,
  },
  pb15: {
    paddingBottom: 15,
  },
  pb20: {
    paddingBottom: 20,
  },
  pb10: {
    paddingBottom: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  marginHorizontalMinus10: {
    marginHorizontal: -10,
  },
  mt30: {
    marginTop: 30,
  },
  mt25: {
    marginTop: 25,
  },
  mt20: {
    marginTop: 20,
  },
  mt15: {
    marginTop: 15,
  },
  mt10: {
    marginTop: 10,
  },
  mt5: {
    marginTop: 5,
  },
  ml30: {
    marginLeft: 30,
  },
  ml20: {
    marginLeft: 20,
  },
  mr20: {
    marginRight: 20,
  },
  mr25: {
    marginRight: 25,
  },
  mr15: {
    marginRight: 15,
  },
  mr10: {
    marginRight: 10,
  },
  mr5: {
    marginRight: 5,
  },
  mb0: {
    marginBottom: 0,
  },
  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb15: {
    marginBottom: 15,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  ml15: {
    marginLeft: 15,
  },
  ml10: {
    marginLeft: 10,
  },
  ml5: {
    marginLeft: 5,
  },
  title: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(161, 161, 161, 1)',
  },
  lineSilver: {
    height: 1,
    backgroundColor: 'rgba(232, 232, 232, 1)',
  },
  formHeader: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    lineHeight: 30,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(219, 219, 219, 1)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(219, 219, 219, 1)',
    top: 1,
    zIndex: 2,
  },
  borderBottom: {
    borderBottomColor: 'rgba(232, 232, 232, 1)',
    borderBottomWidth: 1.2,
  },
  formLine: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 1)',
    zIndex: 1,
  },
  noneBorderRadius: {
    borderRadius: 0,
  },
  flexWrapper: {
    flexWrap: 'wrap',
  },
  formGroupButton: {
    borderRadius: 4,
    backgroundColor: 'rgba(14, 115, 15, 1)',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    lineHeight: 60,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    flex: 1,
  },
  buttonGreenBorder: {
    color: 'rgba(81, 175, 43, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(81, 175, 43, 1)',
  },
  formLineBg: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
  },
  formGroupInputGroup: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(68, 68, 68, 1)',
  },
  inputProgress: {
    height: 60,
    // borderWidth: 1,
    // borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
    // paddingHorizontal: 15,
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(68, 68, 68, 1)',
  },
  inputResetPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    padding: 0,
  },
  inputIcon: {
    position: 'absolute',
    width: 50,
    zIndex: 1,
    top: 0,
    bottom: 0,
  },
  inputIconLeft: {
    left: 0,
  },
  inputIconRight: {
    right: 0,
  },
  inputIconPadding: {
    paddingHorizontal: 55,
  },
  inputIconPaddingLeft: {
    paddingLeft: 55,
  },
  inputIconPaddingRight: {
    paddingRight: 55,
  },
  inputError: {
    borderWidth: 2,
    borderColor: '#f44336',
    backgroundColor: '#fef5f5',
  },
  inputErrorBorder: {
    borderWidth: 1,
    borderColor: '#f44336',
  },
  buttonAction: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(81, 175, 43, 1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 1)',
  },
  buttonActionSilver: {
    backgroundColor: 'rgba(219, 219, 219, 1)',
  },
  w110: {
    width: 110,
  },
  w80: {
    width: 80,
  },
  w60: {
    width: 60,
  },
  w50: {
    width: 50,
  },
  h50: {
    height: 50,
  },
  h32: {
    height: 32,
  },
  Radius4: {
    borderRadius: 4,
  },

  // Custom
  notificationBox: {
    paddingVertical: 13,
    paddingHorizontal: 19,
  },
  tabs: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 1)',
  },
  tab: {
    height: 54,
    borderRightWidth: 1,
    borderRightColor: 'rgba(219, 219, 219, 1)',
  },
  tabLast: {
    borderRightWidth: 0,
  },
  toggleLocation: {
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(51, 115, 25, 1)',
  },
  toggleLocationGrayBorder: {
    borderColor: 'rgba(219, 219, 219, 1)',
  },
  toggleLocationLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  toggleLocationRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  circleGreen: {
    width: 21,
    height: 21,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: 'rgba(51, 115, 25, 0.2)',
  },
  boxFilter: {
    backgroundColor: 'rgba(249, 249, 249, 1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 232, 232, 1)',
    paddingVertical: 15,
    paddingRight: 15,
    paddingLeft: 5,
    maxWidth: 260,
  },
  boxFilterResetPadding: {
    paddingVertical: 5,
    paddingRight: 5,
  },
  pin: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    lineHeight: 36,
    textAlign: 'center',
  },
  linePin: {
    width: 1,
    backgroundColor: 'rgba(219, 219, 219, 1)',
    position: 'absolute',
  },
  quoteStatus: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  additionalGreen: {
    backgroundColor: 'rgba(63, 174, 41, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(63, 174, 41, 1)',
  },
  additionalError: {
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 1)',
  },
  date: {
    borderWidth: 1,
    borderColor: 'rgba(187, 187, 187, 1)',
    backgroundColor: 'rgba(249, 249, 249, 1)',
    borderRadius: 4,
    marginTop: 3,
  },
  dateText: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  w100per: {
    width: '100%',
  },
  h100per: {
    height: '100%',
  },
  lightSilver: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
  },
  shipmentTime: {
    backgroundColor: 'rgba(255, 205, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 205, 0, 1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(40, 40, 40, 1)',
  },
  shipmentID: {
    borderWidth: 1,
    borderColor: 'rgba(187, 187, 187, 1)',
    backgroundColor: 'rgba(249, 249, 249, 1)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  shipmentRef: {
    paddingVertical: 4,
  },
  photoMark: {
    marginTop: -165,
  },
  photoMarkOrder: {
    width: 24,
    height: 24,
    lineHeight: 24,
    borderTopLeftRadius: 8,
  },
  photoMarkBtn: {
    width: 24,
    height: 24,
  },
  shipmentTitle: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 20,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(219, 219, 219, 1)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(219, 219, 219, 1)',
    top: 1,
    left: 0,
    zIndex: 2,
  },
  shipmentForm: {
    borderRadius: 4,
    borderTopLeftRadius: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
  },
  circleOr: {
    width: 24,
  },
  circleOrLine: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  circleOrText: {
    position: 'absolute',
    top: 18,
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  upload: {
    width: width / 4,
    height: width / 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 124, 124, 1)',
    borderStyle: 'dashed',
  },
  uploadCircle: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(124, 124, 124, 1)',
    borderRadius: 12,
  },
  uploadCircleText: {
    lineHeight: 24,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
  },
  overlayComponent: {
    height: 50,
    width: '70%',
    backgroundColor: 'rgba(243, 244, 245, 0.9)',
    opacity: 0.9,
    borderWidth: 1,
    borderColor: 'rgb(139, 218, 238)',
    borderRadius: 5,
    position: 'absolute',
    bottom: 10,
    translateX: 50,
  },
  viewInput: {
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
    paddingHorizontal: 15,
  },
  formGroupButtonModal: {
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
  },
});

export default styles;
