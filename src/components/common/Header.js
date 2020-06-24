import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Text
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IMAGE_CONSTANT from '../../constants/images';
import notificationActions from '../../store/actions/notificationAction';
import Popover from './Popover';
import I18n from '../../config/locales';

export const HEIGHT_HEADER = 60;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(88, 175, 43, 1)',
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
  flex: {
    flexDirection: 'row'
  }
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
    const { actions, token } = this.props;
    if (token) {
      actions.getTotalUnread();
    }
  }

  render() {
    const {
      onPressButton,
      hideRightButton,
      actions,
      getNotification,
      token,
      totalUnread,
      showBackButton,
      languageCode,
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
          <View style={{ paddingLeft: 17 }}>
            <Image source={IMAGE_CONSTANT.logo} />
          </View>
        </View>
        <View
          style={{
            width: 100,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {!hideRightButton && (
            <View style={[styles.flex, styles.alignItemsCenter]}>
              <View style={{ marginRight: 20 }}>
                <Popover
                  notificationType
                  actions={actions}
                  getNotification={getNotification}
                  token={token}
                  addLeftPosition={1}
                  totalUnread={totalUnread}
                />
              </View>
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
  totalUnread: state.notification.totalUnread,
  token: state.auth.token,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getNotification: notificationActions.getNotification,
      getTotalUnread: notificationActions.getTotalUnreadNotification,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
