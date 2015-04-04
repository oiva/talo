'use strict';

var React = require('react'),
    L = require('Leaflet'),
    _ = require('lodash'),
    $ = jQuery;

var MapView = React.createClass({
  layers: {},

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
    this.prepareLayers();
  },
  
  componentWillUnmount: function() {
    this.map = null;
  },

  setupMap: function () {
    if (typeof this.props.map === 'undefined') {
      return;
    }
    console.log('setup map');
    this.map.setView([this.props.map.lat, this.props.map.lon], this.props.map.zoom);
  },

  showLayer: function(serviceType) {
    /* clear old layers */
    _.each(this.layers, function(layer) {
      this.map.removeLayer(layer);
    }.bind(this));

    var serviceLayer = this.layers[serviceType];
    serviceLayer.addTo(this.map);

    /* calculate new bounds for map */
    var points = _.map(serviceLayer.getLayers(), function(layer) {
      return layer.getLatLng();
    });
    points.push(L.latLng(this.props.map.lat, this.props.map.lon));
    var bounds = new L.LatLngBounds(points);
    this.map.fitBounds(bounds);
  },

  /**
   * Gather all service types and create a layer for each. Store layers in 
   * `this.layers`
   **/
  prepareLayers: function() {
    var layer;
    _.each(this.props.map.services, function(value, key) {
      layer = this.getLayer(key);
      this.layers[key] = layer;
    }.bind(this));
  },

  getLayer: function(serviceType) {
    var services = this.props.map.services[serviceType];
    var group = new L.layerGroup();

    _.each(services, function(service) {
      var marker = L.marker([service.lat, service.lon]).bindPopup(service.name);
      group.addLayer(marker);
    });
    return group;
  },

  render: function() {
    return (<div className='map'></div>);
  }
});

var MapControls = React.createClass({
  serviceNames: {
    'bus': 'Bussit'
  },

  showService: function(event) {
    var service = $(event.target).data('key');
    this.refs.map.showLayer(service);
  },

  render: function() {
    var serviceTypes = _.map(this.props.map.services, function(v, k) {
      var name = k;
      if (typeof this.serviceNames[k] !== 'undefined') {
        name = this.serviceNames[k];
      }
      return (
        <li key={k}><a data-key={k} href='#' onClick={this.showService}>{name}</a></li>
      );
    }.bind(this));
    console.log('serviceTypes', serviceTypes);

    return (
      <div>
        <h2>Talo kartalla</h2>
        <MapView map={this.props.map} ref='map' />

        <h3>Lähialueen palvelut</h3>
        <ul>{serviceTypes}</ul>
      </div>
    );
  }
});

module.exports = MapControls;