'use strict';

var React = require('react'),
    L = require('leaflet'),
    _ = require('lodash'),
    $ = jQuery;

var MapView = React.createClass({
  layers: {},
  houseIcon: null,

  createMap: function(element) {
    this.houseIcon = new L.Icon({
      
        shadowUrl: 'images/leaflet/house-shadow.png',
        iconUrl: 'images/leaflet/house-2x.png',
        iconSize:     [25, 40],
        shadowSize:   [39, 24],
        iconAnchor:   [12, 40],
        shadowAnchor: [10, 24],
        popupAnchor:  [0, 0]
    });

    this.map = L.map(element);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      L.marker([this.props.map.lat, this.props.map.lon], {icon: this.houseIcon}).addTo(this.map);
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
      if (typeof service.lat === 'undefined' || typeof service.lon === 'undefined') {
        return;
      }
      var popup = this.getPopup(service, serviceType);
      var marker = L.marker([service.lat, service.lon]).bindPopup(popup);
      group.addLayer(marker);
    }.bind(this));
    return group;
  },

  getPopup: function(service, type) {
    var html = `<strong>${service.name}</strong><p>`;
    if (type === 'bus' || type === 'train') {
      _.each(service.lines, function(value, key) {
        html += `${key} → ${value}<br/>`
      });
      html += `</p><p><a href="${service.url}" target="_blank">Aikataulut</a></p>`;
    } else {
      _.each(service.description, function(value, key) {
        html += `${key}: ${value}<br/>`
      });
      html += '</p>';
      if (typeof service.url !== 'undefined') {
        html += `<p><a href="${service.url}" target="_blank">Kotisivu</a></p>`;
      }
    }

    html += '<p>Etäisyys ' + this.getDistance(service) + 'm</p>';
    
    return html;
  },

  getDistance: function(service) {
    if (typeof service.lat === 'undefined' || typeof service.lon === 'undefined') {
      return 0;
    }
    var a = L.latLng(this.props.map.lat, this.props.map.lon);
    var b = L.latLng(service.lat, service.lon);
    return Math.round(a.distanceTo(b) * 0.1) * 10;
  },

  render: function() {
    return (<div className='map'></div>);
  }
});

var MapControls = React.createClass({
  serviceNames: {
    'bus': 'Bussit',
    'train': 'Juna',
    'shops': 'Ruokakaupat',
    'daycare': 'Päiväkodit',
    'primary-schools': 'Alakoulut',
    'middle-schools': 'Yläkoulut',
    'health': 'Terveys- ja sosiaalipalvelut',
    'pizza': 'Pizzeriat',
    'sport': 'Urheilu'
  },

  showService: function(event) {
    var service = $(event.target).data('key');
    this.refs.map.showLayer(service);
    event.preventDefault();
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

    return (
      <div className="row">
        <div className="col-md-12 col-sm-12 map-container">
          <h2>Talo kartalla</h2>
          <MapView map={this.props.map} ref='map' />

          <h3>Lähialueen palvelut</h3>
          <ul>{serviceTypes}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MapControls;