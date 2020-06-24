import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IMAGE_CONSTANT from '../../constants/images';
import Popover from './Popover';
import Credit from './Credit';
import I18n from '../../config/locales';
import notificationActions from '../../store/actions/notificationAction';

const HEIGHT_HEADER = 60;
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(98, 193, 48, 1)',
    height: HEIGHT_HEADER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexIndex: {
    flex: 1,
  },
  relative: {
    position: 'relative',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  credit: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(90, 180, 43, 1)',
    borderWidth: 1,
    borderColor: 'rgba(71, 143, 27, 1)',
  },
  creditIcon: {
    marginRight: 6,
  },
  creditText: {
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
    color: 'rgb(255, 219, 0)',
  },
  ml10: {
    marginLeft: 10,
  },
});

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigationBack = () => {
    const { onBackAction } = this.props;
    if (onBackAction) { onBackAction(); }
  }

  componentDidMount() {
    const {actions, token} = this.props;
    if (token) {
      actions.getTotalUnread();
    } 
  }

  render() {
    const {
      onPressButton,
      hideRightButton,
      showBackButton,
      languageCode,
      getNotification,
      actions,
      totalUnread,
      token,
    } = this.props;
    return (
      <View style={[styles.container, styles.row]}>
        {showBackButton && (
          <TouchableOpacity
            style={{ paddingLeft: 17 }}
            onPress={this.navigationBack}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Roboto-Bold' }}>
              {I18n.t('back', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={[
            styles.flexIndex,
            { justifyContent: 'center', alignItems: 'flex-start' },
          ]}
        >
          <View style={{ paddingLeft: 17, marginRight: 20 }}>
            <Image source={IMAGE_CONSTANT.logo} />
          </View>
        </View>
        <View>
          <Popover
            ref={(ref) => (this.popover = ref)}
            icon={(
              <View style={[styles.credit, styles.row]}>
                <View style={styles.creditIcon}>
                  <Image
                    source={IMAGE_CONSTANT.boxActive}
                    style={{ width: 20, height: 20 }}
                  />
                </View>
                <Text style={styles.creditText}>4005</Text>
              </View>
            )}
            customHeight={height / 1.5}
            addLeftPosition={10}
          >
            <Credit />
          </Popover>
        </View>

        <View style={styles.ml10}>
          <Popover
            customHeight={height / 1.5}
            addLeftPosition={-1}
            actions={actions}
            notificationType
            totalUnread={totalUnread}
            token={token}
          />
        </View>

        <View
          style={{
            width: 70,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {!hideRightButton && (
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  Keyboard.dismiss();
                  onPressButton();
                }}
              >
                <View style={{ paddingRight: 20 }}>
                  <Image
                    source={IMAGE_CONSTANT.menu}
                    style={{ width: 24, height: 24 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  onPressButton: PropTypes.func.isRequired,
  hideRightButton: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  languageCode: state.config.languageCode,
  totalUnread: state.notification.totalUnread,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getNotification: notificationActions.getNotification,
      getTotalUnread: notificationActions.getTotalUnreadNotification,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
