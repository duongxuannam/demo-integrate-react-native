import React from 'react'
import PropTypes from 'prop-types'
import {
  FlatList,
} from 'react-native'

class ListView extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}

    this._keyExtractor = this._keyExtractor.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this._renderSeparator = this._renderSeparator.bind(this)
    this._listHeaderComponent = this._listHeaderComponent.bind(this)
    this._listEmptyComponent = this._listEmptyComponent.bind(this)
  }

  _keyExtractor(item, index) {
    return index.toString()
  }

  _renderItem({ item, index }) {
    const { renderItem } = this.props
    return renderItem && renderItem(item, index)
  }

  _renderSeparator() {
    const { renderLine } = this.props
    return renderLine && renderLine()
  }

  _listHeaderComponent() {
    const { renderHeaderList } = this.props
    return renderHeaderList && renderHeaderList()
  }

  _listEmptyComponent() {
    const { renderEmptyList } = this.props
    return renderEmptyList && renderEmptyList()
  }

  render() {
    const { source } = this.props

    return (
      <FlatList
        data={source}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderSeparator}
        ListHeaderComponent={this._listHeaderComponent}
        ListEmptyComponent={this._listEmptyComponent}
      />
    )
  }
}

ListView.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  renderItem: PropTypes.func.isRequired,
  renderEmptyList: PropTypes.func.isRequired,
  renderLine: PropTypes.func,
  renderHeaderList: PropTypes.func,
}

ListView.defaultProps = {
  renderLine: undefined,
  renderHeaderList: undefined,
}

export default ListView
