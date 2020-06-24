import React from 'react'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
  },
  titleSize: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
  },
  defaultSize: {
    fontSize: 17,
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
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
  errorText: {
    color: '#f44336',
  },
  redText: {
    color: 'rgba(244, 67, 54, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between'
  },
  flexOneSubstract: {
    flex: 0.9
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyContentCenter: {
    justifyContent: 'center',
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
  pad20: {
    padding: 20,
  },

  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  paddingVertical30: {
    paddingVertical: 30,
  },
  pl20: {
    paddingLeft: 20,
  },
  pr20: {
    paddingRight: 20,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  mt20: {
    marginTop: 20,
  },
  mt10: {
    marginTop: 10,
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
  mr10: {
    marginRight: 10,
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
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
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
  formGroupInput: {
    position: 'relative',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 4,
    paddingHorizontal: 15,
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },

  noneBorderRadius: {
    borderRadius: 0
  },

  inputError: {
    borderWidth: 2,
    borderColor: '#f44336',
    backgroundColor: '#fef5f5',
  },
  showPasswordInput: {
    paddingRight: 60,
  },
  showPassword: {
    position: 'absolute',
    right: 15,
    height: 60,
    justifyContent: 'center',
  },
  formGroupInputFormatPhone: {
    width: 72,
    backgroundColor: 'rgba(219, 219, 219, 1)',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  formGroupInputFormatPhoneText: {
    lineHeight: 60,
  },
  formGroupNote: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(161, 161, 161, 1)',
  },
  policy: {
    paddingHorizontal: 20,
  },
  policyText: {
    color: 'rgba(161, 161, 161, 1)',
  },
  resetPasswordAlert: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgba(255, 205, 0, 1)',
    backgroundColor: 'rgba(255, 205, 0, 0.1)',
  },
  borderBoxColorErrApi: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'rgb(255, 205, 0)',
    backgroundColor: 'rgba(253, 236, 234, 0.8)',
  },
  resetPasswordAlertTop: {
    color: 'rgba(68, 68, 68, 1)',
  },
  resetPasswordAlertBottom: {
    color: 'rgba(68, 68, 68, 1)',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 245, 205, 1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 205, 0, 1)',
  },
  resetPasswordExpired: {
    backgroundColor: 'rgba(253, 236, 234, 1)',
    borderColor: 'rgba(244, 67, 54, 1)',
  },
  resetPasswordExpiredTop: {
    color: 'rgba(68, 68, 68, 1)',
  },
  resetPasswordExpiredBottom: {
    color: 'rgba(68, 68, 68, 1)',
    backgroundColor: 'rgba(251, 218, 215, 1)',
    borderTopColor: 'rgba(244, 67, 54, 1)',
  },
  verifyCodeNumber: {
    width: 64,
    height: 64,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 219, 219, 1)',
    marginHorizontal: 10,
  },
  verifyCodeNumberError: {
    backgroundColor: 'rgba(254, 245, 245, 1)',
    borderColor: 'rgba(244, 67, 54, 1)',
  },
  verifyCodeNumberText: {
    fontSize: 40,
    fontFamily: 'Roboto-Regular',
    lineHeight: 44,
    color: 'rgba(161, 161, 161, 1)',
  },
  verifyCodeNumberInput: {
    fontSize: 30,
    fontFamily: 'Roboto-Regular',
    lineHeight: 64,
    color: 'rgba(74, 74, 74, 1)',
  },
  verifyCodeInput: {
    backgroundColor: 'red',
    position: 'absolute',
    left: 0,
    right: 0,
    height: 64,
    opacity: 0,
  },
  switchAccount: {
    backgroundColor: 'rgba(0, 117, 0, 1)',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 98, 0, 1)',
  },
  switchAccountTitle: {
    lineHeight: 44,
  },
  user: {
    padding: 15,
    backgroundColor: 'rgba(86, 86, 86, 1)',
  },
  userActive: {
    backgroundColor: 'rgba(68, 68, 68, 1)',
  },
  lineBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(158, 158, 159, 1)',
  },
  lineBorderLast: {
    borderBottomWidth: 0,
  },
  photoDelete: {
    width: 24,
    height: 24,
    borderTopLeftRadius: 8,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
  },
  msgError: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginLeft: 5
  },
  visibilityIcon: {
    width: 30,
    height: 30
  },
  rowMsg: {
    flexDirection: 'row'
  },
  flexWrapper: {
    flexWrap: 'wrap'
  }
})

export default styles