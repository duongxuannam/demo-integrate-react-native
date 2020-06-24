import React from 'react';
import I18n from '../../config/locales';

class BaseComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  getLanguageLocation = (key, languageCode) => {
    return I18n.t(key, { locale: languageCode });
  }
}

export default BaseComponent;
