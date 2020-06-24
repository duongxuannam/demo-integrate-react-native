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

class FromDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: '',
    };
  }

  componentDidUpdate(prevProps) {
    const {
      resetFilter,
    } = this.props;
    if (resetFilter !== prevProps.resetFilter) {
      this.setState({
        fromDate: '',
      });
    }
  }

  clearDateFilter = () => {
    const { actions } = this.props;
    this.setState({
      fromDate: '',
    });
    actions.setFieldQuery({
      fromDate: '',
    });
  }

  changeDate(dateStr, date) {
    const { actions } = this.props;
    const dateUtc = moment(date).utc().toISOString();
    this.setState({
      fromDate: date,
    });
    actions.setFieldQuery({
      fromDate: moment(dateUtc).startOf('day').utc().toISOString(),
    });
  }

  render() {
    const {
      languageCode,
      countryCode,
      toDate,
    } = this.props;
    const { fromDate } = this.state;
    return (
      <View style={[styles.paddingHorizontal20]}>
        <Text style={[styles.defaultSize, styles.defaultTextColor, styles.mb10, styles.bold]}>
          {I18n.t('filter.fromDate', { locale: languageCode })}
        </Text>
        <View style={[styles.input, styles.whiteBg, styles.flex, styles.alignItemsCenter]}>
          <View style={styles.mr10}>
            <Image source={IMAGE_CONSTANT.calendarIcon} style={{ width: 22, height: 22 }} />
          </View>
          {toDate.length > 0 ? (
            <>
              <DatePicker
                date={fromDate}
                mode="date"
                locale={countryCode}
                maxDate={new Date(toDate)}
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
              {fromDate ? (
                <TouchableOpacity style={{ justifyContent: 'center', paddingRight: 10 }} onPress={this.clearDateFilter}>
                  <Image source={IMAGE_CONSTANT.circleClose} style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
              ) : null}
            </>
          ) : (
            <>
              <DatePicker
                date={fromDate}
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
              {fromDate ? (
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
  toDate: state.listing.toDate,
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
)(FromDate);
