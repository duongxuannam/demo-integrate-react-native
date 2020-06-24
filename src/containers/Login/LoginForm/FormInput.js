import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';
import I18n from '../../../config/locales';

class FormInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      error: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { errorMessage } = this.props;
    if (prevProps.errorMessage !== errorMessage) {
      this.setState({ error: errorMessage });
    }
  }


  validateValue = () => {
    const { inputText, error } = this.state;
    const { conditionRegexArray, type, languageCode } = this.props;
    let isValid = true;
    if (!inputText) {
      this.setState({ error: I18n.t('loginForm.passwordRequired', { locale: languageCode }) });
      return false;
    }

    if (Array.isArray(conditionRegexArray) && conditionRegexArray.length > 0) {
      conditionRegexArray.forEach((reg) => {
        if (reg instanceof RegExp) {
          isValid = reg.test(inputText);
        }
      });
    }

    return isValid;
  }

  getValueInput = () => {
    const { inputText } = this.state;
    return inputText;
  };

  onChangeText = (text) => this.setState({ inputText: text, error: null });

  showErrorMessage() {
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

  renderInputType = (type) => {
    const {
      inputStyle,
      defaultText,
      placeHolder,
      isSecure,
      autoValidate,
      onEndEditing,
      customSecureIcon
    } = this.props;

    const { inputText, error } = this.state;

    switch (type) {
      case FormInput.inputType.EMAIL:

        return (
          <TextInput
            style={[inputStyle, error && {
              borderWidth: 2,
              borderColor: '#f44336',
            }]}
            placeholder={placeHolder}
            defaultValue={defaultText}
            value={inputText}
            keyboardType="email-address"
            onChangeText={this.onChangeText}
            onEndEditing={() => onEndEditing()}
          />
        );
      case FormInput.inputType.PASSWORD:
        return (
          <TextInput
            style={[inputStyle, error && !customSecureIcon && {
              borderWidth: 2,
              borderColor: '#f44336',
            }]}
            placeholder={placeHolder}
            defaultValue={defaultText}
            value={inputText}
            secureTextEntry={isSecure}
            onChangeText={this.onChangeText}
            onEndEditing={() => onEndEditing()}
          />
        );
      default:
        return (
          <TextInput
            style={[inputStyle, error && {
              borderWidth: 2,
              borderColor: '#f44336',
            }]}
            placeholder={placeHolder}
            defaultValue={defaultText}
            value={inputText}
            onChangeText={this.onChangeText}
            onEndEditing={() => onEndEditing()}
          />
        );
    }
  }

  render() {
    const {
      label,
      viewStyle,
      viewLabelStyle,
      viewInputStyle,
      labelStyle,
      type,
      errorPos,
      customSecureIcon,
    } = this.props;

    const { error } = this.state;

    return (
      <View style={[viewStyle]}>
        {error && errorPos === FormInput.errorViewPosition.TOP && this.showErrorMessage()}
        {label && (
          <View style={[viewLabelStyle]}>
            <Text style={[labelStyle]}>{label}</Text>
          </View>
        )}
        {error && errorPos === FormInput.errorViewPosition.MIDDLE && this.showErrorMessage()}
        <View style={[viewInputStyle, error && customSecureIcon && {
          borderWidth: 2,
          borderColor: '#f44336',
        }]}
        >
          {this.renderInputType(type)}
          {customSecureIcon}
        </View>
        {error && errorPos === FormInput.errorViewPosition.BOTTOM && this.showErrorMessage()}
      </View>
    );
  }
}

FormInput.inputType = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  OTHER: 'OTHER',
};

FormInput.errorViewPosition = {
  BOTTOM: 'BOTTOM',
  MIDDLE: 'MIDDLE',
  TOP: 'TOP',
  HIDDEN: 'HIDDEN',
};

FormInput.propTypes = {
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
  type: PropTypes.oneOf(Object.keys(FormInput.inputType)),
  errorPos: PropTypes.oneOf(Object.keys(FormInput.errorViewPosition)),
  isSecure: PropTypes.bool,
  customErrorView: PropTypes.func,
  customSecureIcon: PropTypes.element,
  conditionRegexArray: PropTypes.arrayOf(PropTypes.instanceOf(RegExp)),
  onEndEditing: PropTypes.func,
  languageCode: PropTypes.string,
};

FormInput.defaultProps = {
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
  type: FormInput.inputType.OTHER,
  errorPos: FormInput.errorViewPosition.BOTTOM,
  isSecure: false,
  customErrorView: () => {},
  customSecureIcon: null,
  conditionRegexArray: [],
  onEndEditing: () => { },
  languageCode: 'en'
};

// eslint-disable-next-line react/jsx-props-no-spreading
export default React.forwardRef((props, ref) => <FormInput ref={ref} {...props} />);
