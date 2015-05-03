'use strict';

var React = require('react'),
    _ = require('lodash'),
    $ = jQuery,
    Slider = require('react-slick');

var SimpleSlider = React.createClass({
  render: function () {
    var settings = {
      adaptiveHeight: true,
      autoplay: false,
      dots: true,
      draggable: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <Slider {...settings}>
        {_.map(this.props.photos, function(photo, key) {
          var url = '/images/carousel/' + photo;
          return (
            <div key={key}>
              <a className="carousel-link" href={url}>
                <img className="carousel-image" src={url} alt="" />
              </a>
            </div>
          )
        })}
      </Slider>
    );
  }
});

var CarouselView = React.createClass({
  scrollCallback: null,
  previousOffset: 0,

  componentDidMount: function() {
    var top = $(this.getDOMNode()).offset().top;

    this.scrollCallback = _.debounce(function() {
      console.log('callback 2');
      var offset = $(window).scrollTop();
      if (offset < top + 500 && this.previousOffset > top + 525) {
        // reflow when scrolling back up
        console.log('reflow');
        $(this.getDOMNode()).css('transform', 'translateZ(0)');
        window.removeEventListener('scroll', this.scrollCallback);
      }
      this.previousOffset = offset;
    }.bind(this), 250);

    window.addEventListener('scroll', this.scrollCallback);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.scrollCallback);
  },

  render: function() {
    return (
      <div className="carousel row">
        <div className="col-md-12">
          <h2>Katso kuvat!</h2>
          <SimpleSlider photos={this.props.photos} />
        </div>
      </div>
    );
  }
});

module.exports = CarouselView;