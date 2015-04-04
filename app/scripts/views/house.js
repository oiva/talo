'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    actions = require('../actions/actions'),
    housesStore = require('../stores/housesStore'),

    MapView = require('../components/map');

var HouseView = React.createClass({

  mixins: [
    Reflux.listenTo(housesStore, 'onStoreUpdate')
  ],

  getInitialState: function() {
    actions.search(+this.props.id || 1);
    return {
      house: housesStore.getDefaultData()
    };
  },

  onStoreUpdate: function(house) {
    this.setState({
      house: house
    });
  },

  render: function() {
    if (typeof this.state.house.name === 'undefined') {
      return <div></div>;
    }

    var name = this.state.house.name;

    return (
      <div className="house row">
        <header className="header col-md-12">
          <h1>{ name }</h1>
        </header>

        <MapView map={this.state.house.map} />
      </div>
    )
  }
});

module.exports = HouseView;