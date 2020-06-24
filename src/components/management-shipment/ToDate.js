import React from 'react';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import listingActions from '../../store/actions/listingAction';
import appActions from '../../store/actions/appAction';
import IMAGE_CONSTANT from '../../constants/images';
import styles from '../booking/style';
import I18n from '../../config/locales';
import { getDateFormatByCountry } from '../../helpers/date.helper';

class ToDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toDate: '',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      resetFilter,
    } = this.props;
    if (resetFilter !== prevProps.resetFilter) {
      this.setState({
        toDate: '',
      });
    }
  }

  clearDateFilter = () => {
    const { actions } = this.props;
    this.setState({
      toDate: '',
    });
    actions.setFieldQuery({
      toDate: '',
    });
  }

  changeDate(dateStr, date) {
    const { actions } = this.props;
    const dateUtc = moment(date).utc().toISOString();
    this.setState({
      toDate: date,
    });
    actions.setFieldQuery({
      toDate: moment(dateUtc).endOf('day').utc().toISOString(),
    });
  }

  render() {
    const {
      languageCode,
      countryCode,
      fromDate,
    } = this.props;
    const { toDate } = this.state;
    return (
      <View style={[styles.paddingHorizontal20, styles.mt20, styles.mb20]}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.bold, styles.mb10]}>
          {I18n.t('filter.toDate', { locale: languageCode })}
        </Text>
        <View style={[styles.input, styles.whiteBg, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Image source={IMAGE_CONSTANT.calendarIcon} style={{ width: 22, height: 22 }} />
          </View>
          {fromDate.length > 0 ? (
            <>
              <DatePicker
                date={toDate}
                minDate={new Date(fromDate)}
                mode="date"
                locale={countryCode}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                format={getDateFormatByCountry(countryCode, languageCode)}
                androidMode="default"
                onDateChange={(dateStr, date) => this.changeDate(dateStr, date)}
                showIcon={false}
                style={{ flex: 1 }}
                customStyles={{
                  dateInput: {
                    paddingLeft: 0,
                    marginLeft: 0,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                    textAlign: 'left'
                  },
                }}
                placeholder=" "
              />
              {toDate ? (
                <View style={{
                  justifyContent: 'center',
                  paddingRight: 10
                }}
                >
                  <TouchableOpacity onPress={this.clearDateFilter}>
                    <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 18, height: 18 }} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : (
            <>
              <DatePicker
                date={toDate}
                mode="date"
                locale={countryCode}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                format={getDateFormatByCountry(countryCode, languageCode)}
                androidMode="default"
                onDateChange={(dateStr, date) => this.changeDate(dateStr, date)}
                showIcon={false}
                style={{ flex: 1 }}
                customStyles={{
                  dateInput: {
                    paddingLeft: 0,
                    marginLeft: 0,
                    borderWidth: 0,
                    alignItems: 'flex-start',
                    textAlign: 'left'
                  },
                }}
                placeholder=" "
              />
              {toDate ? (
                <View style={{
                  justifyContent: 'center',
                  paddingRight: 10
                }}
                >
                  <TouchableOpacity onPress={this.clearDateFilter}>
                    <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 18, height: 18 }} />
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  languageCode: state.app.languageCode,
  countryCode: state.app.countryCode,
  fromDate: state.listing.fromDate,
  resetFilter: state.listing.resetFilter,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { ...listingActions, ...appActions },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null, {
    forwardRef: true
  }
)(ToDate);
