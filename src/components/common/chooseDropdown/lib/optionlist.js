import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  ViewPropTypes
} from "react-native";

export default class OptionList extends Component {
  static defaultProps = {
    onSelect: () => {}
  };
  static propTypes = {
    style: ViewPropTypes.style,
    onSelect: PropTypes.func
  };

  render() {
    const { style, children, onSelect, selectedStyle, selected } = this.props;

    const renderedItems = React.Children.map(children, (item, key) => {
      if (!item) return null
      let valueSelected = selected;

      if (selected && selected.length) {
        valueSelected = selected.find(e => e == item.props.value);
      }
      return <TouchableWithoutFeedback
        key={key}
        style={{ borderWidth: 0 }}
        onPress={() => onSelect(item.props.children, item.props.value)}
      >
        <View
          style={[
            { borderWidth: 0 },
            item.props.value === valueSelected ? selectedStyle : null
          ]}
        >
          {item}
        </View>
      </TouchableWithoutFeedback>
      });

    return (
      <View style={[styles.scrollView, style]}>
        <ScrollView automaticallyAdjustContentInsets={false} bounces={false} keyboardShouldPersistTaps='handled'>
          {renderedItems}
        </ScrollView>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  scrollView: {
    height: 120,
    width: '75.9%',
    backgroundColor: '#fff'
  }
});
