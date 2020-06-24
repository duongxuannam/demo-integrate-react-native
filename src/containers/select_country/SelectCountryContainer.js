/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// REDUX
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// ACTION
import authActions from '../../store/actions/authAction';
import appActions from '../../store/actions/appAction';

import I18n from '../../config/locales/index';
import { LANGUAGES } from '../../constants/hardData';
import IMAGE_CONSTANT from '../../constants/images';

class SelectCountryContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectCountry: '',
    };

    this.nextPage = 'BookingStack';
  }

  componentDidMount() {
    const { app, auth } = this.props;
    if (auth && auth.token) { this.nextPage = 'SwitchAccountStack'; }
    if (auth && Object.keys(auth.accountSelect).length > 0) { this.nextPage = 'BookingStack'; }
    if (app.countryCode && app.languageCode) {
      this.navigateToScreen(this.nextPage);
    }
  }

  navigateToScreen(routeName) {
    const { navigation } = this.props;
    const navigateAction = NavigationActions.navigate({
      routeName,
    });
    navigation.dispatch(navigateAction);
  }

  handleSelectCountry(code) {
    const { selectCountry } = this.state;
    this.setState({
      selectCountry: selectCountry === code ? '' : code,
    });
  }

  changeLanguage(countryCode, languageCode, index, callingCode) {
    const { actions } = this.props;
    actions.updateLanguage(countryCode, languageCode, index, callingCode);
    I18n.switchLanguage(languageCode);
    this.navigateToScreen(this.nextPage);
  }

  renderLanguage = (countryCode, languages, locateIndex, callingCode, languageCode) => (
    <View>
      <View style={[styles.line, styles.mt20]} />
      <View>
        {languages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.flex, styles.alignItemsCenter, styles.list, languages.length - 1 === index ? styles.listLast : null]}
            onPress={() => this.changeLanguage(countryCode, item.lang, locateIndex, callingCode)}
          >
            <Text style={[styles.defaultSize, styles.flexOne]}>
              {I18n.t(item.text, { locale: languageCode })}
            </Text>
            <Image source={IMAGE_CONSTANT.arrowRight} style={{ width: 7, height: 10 }} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  render() {
    const { selectCountry } = this.state;
    const { languageCode } = this.props;
    return (
      <View forceInset={{ top: 'always', horizontal: 'never' }} style={styles.container}>
        <ScrollView>
          <Text style={styles.titleCountry}>
            {I18n.t('select_country', { locale: languageCode })}
          </Text>
          {
            LANGUAGES.map((item, index) => (
              <View
                key={index}
                style={[styles.group, styles.whiteBg, styles.mb20, selectCountry === index ? styles.activeGroup : styles.pb17]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.handleSelectCountry(index)}
                >
                  <View style={[styles.flex, styles.alignItemsCenter]}>
                    <Image source={item.icon} style={{ width: 24, height: 24 }} />
                    <Text style={[styles.flexOne, styles.ml10, styles.defaultSize, styles.bold]}>
                      { I18n.t(item.name, { locale: languageCode }) }
                    </Text>
                    {selectCountry === index
                      ? <Image source={IMAGE_CONSTANT.arrowUp} style={{ width: 24, height: 24 }} />
                      : <Image source={IMAGE_CONSTANT.arrowDown} style={{ width: 24, height: 24 }} />}
                  </View>
                </TouchableOpacity>
                {selectCountry === index && this.renderLanguage(item.countryCode, item.language, index, item.callingCode, languageCode)}
              </View>
            ))
          }
        </ScrollView>
      </View>
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
  whiteBg: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  flex: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  alignItemsCenter: {
    alignItems: 'center',
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
  mt20: {
    marginTop: 20,
  },
  mb20: {
    marginBottom: 20,
  },
  ml10: {
    marginLeft: 10,
  },
  titleCountry: {
    fontSize: 21,
    fontFamily: 'Roboto-Regular',
    padding: 20,
    color: 'rgba(40, 40, 40, 1)',
  },
  group: {
    paddingHorizontal: 20,
    paddingTop: 17,
  },
  pb17: {
    paddingBottom: 17,
  },
  line: {
    height: 1,
    backgroundColor: 'rgba(161, 161, 161, 1)',
  },
  list: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 232, 232, 1)',
  },
  listLast: {
    borderBottomWidth: 0,
  },
});

const mapStateToProps = (state) => ({
  app: state.app,
  auth: state.auth,
  languageCode: state.app.languageCode,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      ...authActions,
      updateLanguage: appActions.updateLanguage
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectCountryContainer);
