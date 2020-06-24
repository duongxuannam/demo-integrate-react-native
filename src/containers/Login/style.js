import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row'
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  justifyContentCenter: {
    justifyContent: 'center'
  },
  formHeader: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
    zIndex: 1,
  },
  whiteBg: {
    backgroundColor: '#fff',
  },
  padHorizontal20: {
    paddingHorizontal: 20,
  },
  padVertical30: {
    paddingVertical: 30,
  },
});

export default styles;
