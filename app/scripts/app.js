'use strict';

var React = window.React = require('react'),
    attachFastClick = require('fastclick'),
    House = require('./views/house'),
    mountNode = document.getElementById('app');

var HouseApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  componentDidMount: function() {},
  render: function() {
    return (
      <House id='1' />
    );
  }
});

React.render(<HouseApp />, mountNode);

attachFastClick(document.body);