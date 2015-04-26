'use strict';

var React = require('react'),
    _ = require('lodash'),
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