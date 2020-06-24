import React from 'react';
import {
  View,
  Image
} from 'react-native';
// MATERIAL
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import {
  DatePicker,
} from '@material-ui/pickers';
import IMAGE_CONSTANT from '../../constants/images';

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#00855d',
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: '#00855d !important',
      },
      current: {
        color: '#00855d',
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#00855d',
      },
    },
    MuiButton: {
      label: {
        color: 'black',
        fontWeight: 'bold'
      }
    },
    MuiInput: {
     underline: {
       MozBorderBottomColors: 'red'
     }
    }
  },
});

class DatePickerWeb extends React.Component {
  constructor(props) {
    super(props);
    this.state= {}
  }

  changeDate = (date) => {
    const { onChangeDate } = this.props;
    onChangeDate(date);
  }
  
  render() {
    const { value, languageCode } = this.props;
    return (
      <View style={{ width: '100%'}}>
        <ThemeProvider theme={materialTheme}>
            <DatePicker
            value={value}
            onChange={this.changeDate}
            format={languageCode === 'vi' ? 'DD [Th]MM YYYY' : 'DD-MMM-YYYY'}
            InputProps={{
              startAdornment: (
                <Image
                  style={{ width: 15, height: 15, marginRight: 5 }}
                  resizeMethod="auto"
                  source={IMAGE_CONSTANT.calendarIcon}
                />
              ),
              disableUnderline: true
            }}
          />
          </ThemeProvider>
      </View>
    )
  }
}

export default DatePickerWeb;