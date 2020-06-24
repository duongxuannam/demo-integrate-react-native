import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native'
import { NavigationActions } from 'react-navigation'

// COMPONENTS
import { Header } from '../../components/common/Header'
import ListView from '../../components/common/ListView'
import Popover from '../../components/common/Popover'
import Notifications from '../../components/common/Notifications'

const source = [
  { id: 1, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from', date: '05:13 am, 13-May-19' },
  { id: 2, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 3, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 4, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 5, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 6, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 7, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 8, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 9, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 10, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 11, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 12, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 13, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 14, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 15, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 16, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 17, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 18, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 19, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 20, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 21, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 22, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 23, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 24, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
]

const notification = [
  { id: 1, status: 1, title: 'New Bid', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from', date: '05:13 am, 13-May-19' },
  { id: 2, status: 2, title: 'New Photo', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 3, status: 3, title: 'New Progress', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
  { id: 4, status: 4, title: 'Shipment Complete', content: 'A new bid is availble on your shipment ', customContent: '“10 crates from Jakarta to Semarang for Client…', date: '05:13 am, 13-May-19' },
]

export default class NotificationContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.headerLeft = this.headerLeft.bind(this)
    this.headerRight = this.headerRight.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.renderLine = this.renderLine.bind(this)
    this.renderHeaderList = this.renderHeaderList.bind(this)
    this.renderEmptyList = this.renderEmptyList.bind(this)
    this.handleNavigate = this.handleNavigate.bind(this)
  }

  headerLeft() {
    const { navigation } = this.props
    return (
      <View style={{ paddingLeft: 17 }}>
        <Image source={require('../../assets/images/common/logo.png')} />
      </View>
    )
  }

  headerRight() {
    const { navigation } = this.props
    return (
      <View style={[styles.flex, styles.alignItemsCenter]}>
        <View style={{ paddingRight: 30 }}>
          <Popover ref={ref => this.popover = ref} icon={require('../../assets/images/common/menu-notification.png')}>
            <Notifications source={notification} navigateToScreen={this.handleNavigate} />
          </Popover>
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { Keyboard.dismiss(); navigation.toggleDrawer(); }}>
          <View style={{ paddingRight: 20 }}>
            <Image source={require('../../assets/images/common/menu.png')} style={{ width: 24, height: 24 }} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  handleNavigate(route) {
    this.popover.closePopover()
    this.navigateToScreen(route)
  }

  navigateToScreen(route) {
    const { navigation } = this.props
    const navigateAction = NavigationActions.navigate({
      routeName: route
    })
    navigation.dispatch(navigateAction)
  }

  renderHeaderList() {
    if (source.length === 0) return null
    return (
      <React.Fragment>
        <View style={[styles.whiteBg, styles.mt30, styles.header, styles.flex, styles.alignItemsCenter]}>
          <Image source={require('../../assets/images/common/notification.png')} style={{ width: 21, height: 24 }} />
          <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.bold]}>
            All Notifications
          </Text>
        </View>
        <View style={[styles.line, styles.marginHorizontal20]} />
      </React.Fragment>
    )
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

  renderIcon(status) {
    let iconStatus = ''
    switch (status) {
      case 1:
        iconStatus = <Image source={require('../../assets/images/notification/affordable.png')} style={{ width: 25, height: 24 }} />
        break
      case 2:
        iconStatus = <Image source={require('../../assets/images/notification/photo.png')} style={{ width: 26, height: 20 }} />
        break
      case 3:
        iconStatus = <Image source={require('../../assets/images/notification/car.png')} style={{ width: 22, height: 24 }} />
        break
      default:
        iconStatus = <Image source={require('../../assets/images/notification/box.png')} style={{ width: 24, height: 24 }} />
        break
    }
    return iconStatus
  }

  renderItem(session, index) {
    return (
      <View style={[styles.whiteBg, styles.group, styles.flex, styles.alignItemsCenter, index % 2 === 0 ? styles.silverBg : null]}>
        <View style={styles.flexOne}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => this.navigateToScreen('ShipmentDetailStack')}>
            <View style={[styles.groupIcon, styles.flex]}>
              {this.renderIcon(session.status)}
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
          <Text style={styles.groupDate}>
            {session.date}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => this.navigateToScreen('ShipmentDetailStack')}>
          <Image source={require('../../assets/images/common/arrow-right.png')} style={{ width: 7, height: 10 }} />
        </TouchableOpacity>
      </View>
    )
  }

  renderLine() {
    return <View />
  }

  render() {
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <Header
          headerLeft={this.headerLeft}
          headerRight={this.headerRight}
        />
        <ListView
          source={source}
          renderItem={this.renderItem}
          renderLine={this.renderLine}
          renderHeaderList={this.renderHeaderList}
          renderEmptyList={this.renderEmptyList}
        />
      </View>
    )
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
    fontWeight: 'bold',
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
