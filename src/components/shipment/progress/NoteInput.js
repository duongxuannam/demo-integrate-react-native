import React from 'react';
import {
  Text,
  View,
  ViewPropTypes,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types';

class NoteInput extends React.PureComponent {
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

  setErrorMessage = (newValue) => {
    this.setState({ error: newValue });
  }

  validateValue = () => {
    const { inputText } = this.state;
    const { conditionRegexArray, defaultText } = this.props;
    let isValid = true;
    const value = ((inputText === '' || inputText.length >= 0) && inputText) || defaultText;

    if (!value) {
      return false;
    }

    if (Array.isArray(conditionRegexArray) && conditionRegexArray.length > 0) {
      for (let index = 0; index < conditionRegexArray.length; index += 1) {
        const conditionItem = conditionRegexArray[index];
        if (conditionItem instanceof RegExp) {
          isValid = conditionItem.test(value);
          if (isValid) {
            return isValid;
          }
        }
      }
    }

    return isValid;
  }

  getValueInput = () => {
    const { inputText } = this.state;
    const { defaultText } = this.props;
    return inputText || defaultText;
  };

  onChangeText = (text) => this.setState({ inputText: text, error: null });

  handleEndEditing = () => {
    const { onEndEditing } = this.props;
    if (onEndEditing) {
      onEndEditing();
    }
  }

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

  render() {
    const {
      viewStyle,
      viewInputStyle,
      inputStyle,
      placeHolder,
      defaultText,
      inputText,
      maxLength,
      editable,
    } = this.props;

    const { error } = this.state;

    return (
      <View style={[viewStyle]}>
        <View
          style={[
            viewInputStyle,
            error && {
              borderWidth: 2,
              borderColor: '#f44336',
            },
          ]}>
          <TextInput
            style={[inputStyle]}
            multiline
            placeholder={placeHolder}
            defaultValue={defaultText}
            value={inputText}
            autoCorrect={false}
            onChangeText={this.onChangeText}
            onEndEditing={this.handleEndEditing}
            maxLength={maxLength || undefined}
            editable={editable}
          />
        </View>
        {error && this.showErrorMessage()}
      </View>
    );
  }
}

NoteInput.propTypes = {
  errorMessage: PropTypes.string,
  placeHolder: PropTypes.string,
  viewStyle: ViewPropTypes.style,
  viewInputStyle: ViewPropTypes.style,
  errorViewStyle: ViewPropTypes.style,
  errorTextStyle: Text.propTypes.style,
  defaultText: PropTypes.string,
  inputStyle: TextInput.propTypes.style,
  autoValidate: PropTypes.bool,
  customErrorView: PropTypes.func,
  conditionRegexArray: PropTypes.arrayOf(PropTypes.instanceOf(RegExp)),
  onEndEditing: PropTypes.func,
  maxLength: PropTypes.number,
  editable: PropTypes.bool,
};

NoteInput.defaultProps = {
  errorMessage: null,
  placeHolder: '',
  defaultText: '',
  viewStyle: {},
  viewInputStyle: {},
  inputStyle: {},
  errorViewStyle: {},
  errorTextStyle: {},
  autoValidate: false,
  customErrorView: () => {},
  conditionRegexArray: [],
  onEndEditing: () => {},
  maxLength: null,
  editable: true,
};

// eslint-disable-next-line react/jsx-props-no-spreading
export default React.forwardRef((props, ref) => <NoteInput ref={ref} {...props} />);
