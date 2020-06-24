import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

class CardCarousel extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeSlide: 0,
    }

    this._renderItem = this._renderItem.bind(this)
  }

  _renderItem ({item, index}) {
    const { renderItem } = this.props
    return renderItem && renderItem(item, index);
  }

  _pagination () {
    const { source } = this.props
    const { activeSlide } = this.state
    return (
      <Pagination
        dotsLength={source.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          paddingTop: 10,
          paddingBottom: 0,
        }}
        dotStyle={{
          width: 18,
          height: 4,
          borderRadius: 1,
          marginHorizontal: -5,
        }}
        dotColor="rgba(81, 175, 43, 1)"
        inactiveDotColor="rgba(255, 255, 255, 1)"
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    )
  }


  render() {
    const { source, itemWidth, options } = this.props

    return (
      <>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={source}
          renderItem={this._renderItem}
          sliderWidth={viewportWidth}
          itemWidth={itemWidth}
          onSnapToItem={(index) => this.setState({ activeSlide: index }) }
          {...options}
        />
        {this._pagination()}
      </>
    );
  }
}

CardCarousel.propTypes = {
  source: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.array
  ]).isRequired,
  renderItem: PropTypes.func.isRequired,
  options: PropTypes.shape({}),
  itemWidth: PropTypes.number,
};

CardCarousel.defaultProps = {
  options: {},
  itemWidth: (viewportWidth / 2),
};

export default CardCarousel;
