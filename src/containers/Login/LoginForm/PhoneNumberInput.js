import React from 'react';
import {
  View,
  TextInput,
  Text,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import CountryPicker from 'react-native-country-picker-modal';
import FormInput from './FormInput';
import { validatePhoneNumberWithCountry } from '../../../helpers/regex';
import I18n from '../../../config/locales';

class PhoneNumberInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      visible: false,
      country: {
        cca2: 'VN',
        callingCode: ['84']
      },
      error: null,
    };
  }

  // componentDidUpdate(prevProps) {
  //   const { errorMessage } = this.props;
  //   if (prevProps.errorMessage !== errorMessage) {
  //     this.setState({ error: errorMessage });
  //   }
  // }

  validateValue = () => {
    const { inputText, country } = this.state;
    const { conditionRegexArray, languageCode } = this.props;
    let isValid = true;
    if (Array.isArray(conditionRegexArray) && conditionRegexArray.length > 0) {
      conditionRegexArray.forEach((reg) => {
        if (reg instanceof RegExp) {
          isValid = reg.test(inputText);
        }
      });
    }

    if (!inputText) {
      this.setState({ error: I18n.t('loginForm.phoneRequired', { locale: languageCode }) });
      isValid = false;
    } else if (!validatePhoneNumberWithCountry(inputText, country.cca2)) {
      this.setState({ error: I18n.t('loginForm.phoneInvalid', { locale: languageCode }) });
      isValid = false;
    }

    return isValid;
  }

  getValueInput = () => {
    const { inputText, country } = this.state;
    return {
      phone: inputText,
      country
    };
  };

  openModal = () => this.setState({ visible: true });

  closeModal = () => this.setState({ visible: false });

  handleSelectCountryCode = (c) => this.setState({ country: c, visible: false });

  onChangeText = (text) => this.setState({ inputText: text, error: null });

  showErrorMessage = () => {
    const { error } = this.state;
    const {
      customErrorView,
      errorViewStyle,
      errorTextStyle,
    } = this.props;

    if (customErrorView) {
      return customErrorView(error);
    }

    return (
      <View style={[errorViewStyle]}>
        <Text style={[errorTextStyle]}>{error}</Text>
      </View>
    );
  }

  render() {
    const {
      visible,
      country,
      error,
    } = this.state;
    const {
      label,
      viewStyle,
      viewLabelStyle,
      labelStyle,
      errorPos,
      viewInputStyle,
      inputStyle,
      placeHolder,
      defaultText,
      inputText,
      onEndEditing,
    } = this.props;
    return (
      <View style={[viewStyle]}>
        {error && errorPos === FormInput.errorViewPosition.TOP && this.showErrorMessage()}
        {label && (
          <View style={[viewLabelStyle]}>
            <Text style={[labelStyle]}>{label}</Text>
          </View>
        )}
        {error && errorPos === FormInput.errorViewPosition.MIDDLE && this.showErrorMessage()}
        <View style={[viewInputStyle, error && {
          borderWidth: 2,
          borderColor: '#f44336',
        },
        { flexDirection: 'row', overflow: 'hidden' }
        ]}
        >
          <View style={{
            width: 60,
            backgroundColor: 'rgba(219, 219, 219, 1)',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }}
          >
            <CountryPicker
              countryCode={country ? country.cca2 : 'ID'}
              countryCodes={['VN', 'PH', 'ID', 'TH']}
              withCallingCode
              withCallingCodeButton
              withFlagButton={false}
              withAlphaFilter
              withFilter={false}
              withFlag={false}
              withModal
              visible={visible}
              onSelect={this.handleSelectCountryCode}
              containerButtonStyle={{
                textAlign: 'center',
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontFamily: 'Roboto-Regular',
              }}
              onOpen={this.openModal}
              onClose={this.closeModal}
            />
          </View>
          <TextInput
            style={[inputStyle]}
            placeholder={placeHolder}
            defaultValue={defaultText}
            value={inputText}
            keyboardType="number-pad"
            onChangeText={this.onChangeText}
            onEndEditing={() => onEndEditing()}
          />
        </View>
        {error && errorPos === FormInput.errorViewPosition.BOTTOM && this.showErrorMessage()}
      </View>
    );
  }
}

FormInput.errorViewPosition = {
  BOTTOM: 'BOTTOM',
  MIDDLE: 'MIDDLE',
  TOP: 'TOP',
  HIDDEN: 'HIDDEN',
};

PhoneNumberInput.propTypes = {
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  viewStyle: ViewPropTypes.style,
  viewLabelStyle: ViewPropTypes.style,
  viewInputStyle: ViewPropTypes.style,
  errorViewStyle: ViewPropTypes.style,
  errorTextStyle: Text.propTypes.style,
  labelStyle: Text.propTypes.style,
  defaultText: PropTypes.string,
  inputStyle: TextInput.propTypes.style,
  autoValidate: PropTypes.bool,
  errorPos: PropTypes.oneOf(Object.keys(FormInput.errorViewPosition)),
  customErrorView: PropTypes.func,
  conditionRegexArray: PropTypes.arrayOf(PropTypes.instanceOf(RegExp)),
  onEndEditing: PropTypes.func,
  languageCode: PropTypes.string,
};

PhoneNumberInput.defaultProps = {
  label: null,
  errorMessage: null,
  placeHolder: '',
  defaultText: '',
  viewStyle: {},
  viewLabelStyle: {},
  viewInputStyle: {},
  labelStyle: {},
  inputStyle: {},
  errorViewStyle: {},
  errorTextStyle: {},
  autoValidate: false,
  errorPos: FormInput.errorViewPosition.BOTTOM,
  customErrorView: () => {},
  conditionRegexArray: [],
  onEndEditing: () => { },
  languageCode: 'en'
};

// eslint-disable-next-line react/jsx-props-no-spreading
export default React.forwardRef((props, ref) => <PhoneNumberInput ref={ref} {...props} />);
