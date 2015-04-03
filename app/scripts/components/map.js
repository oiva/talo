'use strict';

var React = require('react'),
    L = require('Leaflet');

var Map = React.createClass({

  createMap: function(element) {
    this.map = L.map(element);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      L.marker([this.props.map.lat, this.props.map.lon]).addTo(this.map);
    return this.map;
  },

  componentDidMount: function() {
    L.Icon.Default.imagePath = 'images/leaflet';
    this.createMap(this.getDOMNode());
    this.setupMap();
  },
  
  componentWillUnmount: function() {
    this.map = null;
  },

  setupMap: function () {
    if (typeof this.props.map === 'undefined') {
      return
    }
    console.log('setup map');
    this.map.setView([this.props.map.lat, this.props.map.lon], this.props.map.zoom);
  },

  render: function() {
    return (
      <div className="map"></div>
    );
  }
});

module.exports = Map;