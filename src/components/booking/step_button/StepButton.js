import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import I18n from '../../../config/locales';

// CSS
import styles from '../style';

class StepButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveDraft = () => {
    const { saveDraft, isEditing, discard } = this.props;
    if (isEditing) {
      discard();
    } else {
      saveDraft();
    }
  }

  getQuote = () => {
    const { getQuote } = this.props;
    getQuote();
  }

  render() {
    const { step, languageCode, isEditing } = this.props;

    if (step === 3) return null;
    return (
      <View style={[styles.whiteBg, styles.paddingVertical15, styles.formLine]}>
        <View style={styles.flex}>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={this.saveDraft}
          >
            <Text style={[styles.formGroupButton, styles.buttonGreenBorder, styles.flexOne, styles.ml15, styles.mr10]}>
              {isEditing ? I18n.t('listing.discard', { locale: languageCode }) : I18n.t('listing.saveDraft', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.alignItemsCenter, styles.flexOne, styles.flex]}
            activeOpacity={0.9}
            onPress={this.getQuote}
          >
            <Text style={[styles.formGroupButton, styles.flexOne, styles.mr15, styles.ml10]}>
              {I18n.t('listing.getQuote', { locale: languageCode })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default StepButton;
