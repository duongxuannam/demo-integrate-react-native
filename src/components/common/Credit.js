import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, NavigationActions } from 'react-navigation'

// COMPONENTS
import ListView from '../../components/common/ListView'

const source = [
  { id: 1, status: 1, title: '+30', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from', date: '05:13 am, 13-May-19' },
  { id: 2, status: 2, title: '+10', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 3, status: 3, title: '-1000', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 4, status: 4, title: '+30000', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
]

export default class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.renderItem = this.renderItem.bind(this)
    this.renderEmptyList = this.renderEmptyList.bind(this)
  }

  renderEmptyList(containerHeight) {
    // if listview onLayout hasn't updated container height, don't bother
    if (containerHeight === 0) {
      return null;
    } // TODO: different fix
    // otherwise render fallback cta with a valid and centerable height
    return (
      <View />
    )
  }

  renderItem(session, index) {
    const { navigateToScreen } = this.props

    return (
      <View style={[styles.whiteBg, styles.group, styles.flex, styles.alignItemsCenter, index % 2 === 0 ? styles.silverBg : null]}>
        <View style={styles.flexOne}>
          <TouchableOpacity activeOpacity={0.9}>
            <View style={[styles.groupIcon, styles.flex, { alignItems: 'center' }]}>
              <Image source={require('../../assets/images/common/credits.png')} style={{ width: 24, height: 24 }} />
              <Text style={[styles.flexOne, styles.ml10, styles.statusTitle, styles.bold]}>
                {session.title}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.groupContent, styles.mt10]}>
            <Text>
              <Text>{session.content}</Text>
              <Text style={styles.bold}>{session.customContent}</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.9}>
          <Image source={require('../../assets/images/common/arrow-right.png')} style={{ width: 7, height: 10 }} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { navigateToScreen } = this.props

    return (
      <>
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontFamily: 'Roboto-Regular', }}>Your Credits</Text>
        </View>
        <ListView
          source={source}
          renderItem={this.renderItem}
          renderHeaderList={() => <View />}
          renderLine={() => <View />}
          renderEmptyList={this.renderEmptyList}
        />
        <TouchableOpacity activeOpacity={0.9}>
          <Text style={{ backgroundColor: '#fff', color: 'rgba(81, 175, 43, 1)', fontFamily: 'Roboto-Bold', fontSize: 12, textAlign: 'center', padding: 10 }}>
            All transactions
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8D8D8',
  },
  defaultSize: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
  },
  defaultTextColor: {
    color: 'rgba(68, 68, 68, 1)',
  },
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  silverBg: {
    backgroundColor: 'rgba(249, 249, 249, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'Roboto-Bold',
  },
  mt30: {
    marginTop: 30,
  },
  ml10: {
    marginLeft: 10,
  },
  mt10: {
    marginTop: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  header: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(219, 219, 219, 1)',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(161, 161, 161, 1)',
  },
  group: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 1)',
  },
  statusTitle: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(81, 175, 43)',
  },
  groupDate: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: 'rgb(161, 161, 161)',
    marginTop: 3,
    fontStyle: 'italic',
  }
})
