'use strict';

var React = require('react'),
    _ = require('lodash'),
    Carousel = require('merry-go-round/Carousel');

var MAX_WIDTH = 700/*px*/;
var MARGIN = 15/*px*/;
var ANIMATION_DURATION = 250/*ms*/;

var PageView = React.createClass({
  render: function() {
    return (
      <a href={this.props.page.url}>
        <img src={this.props.page.url} />
      </a>
    );
  }
});

var CarouselView = React.createClass({
  getInitialState () {
    return {
      screenWidth: window.innerWidth,
      pageIndex: 0,
      previousPageIndex: 0
    };
  },

  updateScreenSize () {
    this.setState({
      screenWidth: window.innerWidth
    });
  },

  componentDidMount () {
    window.addEventListener('resize', this.updateScreenSize, false);
  },

  handleSwipe:function (event) {
    var pageIndex = this.state.pageIndex + event.sign;
    this.setState({ pageIndex: pageIndex });

    clearTimeout(this.animationTimer);
    this.animationTimer = setTimeout(function()  {
      this.setState({ previousPageIndex: pageIndex });
    }.bind(this), ANIMATION_DURATION);
  },

  handleNext: function(event) {
    var pageIndex = this.state.pageIndex + 1;
    this.setState({ pageIndex: pageIndex });
    event.preventDefault();
  },

  handlePrev: function(event) {
    var pageIndex = this.state.pageIndex -1;
    this.setState({ pageIndex: pageIndex });
    event.preventDefault();
  },

  render: function() {
    var pages = _.map(this.props.photos, function(photo) {
      return {url: '/images/carousel/' + photo};
    });

    var width = Math.min(this.state.screenWidth, MAX_WIDTH);
    var pageWidth = width;
    //width -= 2*MARGIN;
    var height = Math.ceil(pageWidth / 4 * 3);

    return (
      <div className="carousel row">
        <div className="col-md-12">
          <h2>Katso kuvat!</h2>
          <div className="carousel-wrapper">
            <Carousel
              pages={pages}
              pageIndex={this.state.pageIndex}
              previousPageIndex={this.state.previousPageIndex}
              width={width}
              height={height}
              embedWidth={0}
              pageView={PageView}
              pageWidth={pageWidth}
              pageHeight={height}
              onSwiped={this.handleSwipe}
              loop={true}
            />
            <a href="#" className="carousel-button prev" onClick={this.handlePrev} />
            <a href="#" className="carousel-button next" onClick={this.handleNext} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CarouselView;