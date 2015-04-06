'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    _ = require('lodash'),

    actions = require('../actions/actions'),
    housesStore = require('../stores/housesStore'),

    MapView = require('../components/map'),
    TopicView = require('../components/topic');

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

    console.log(this.state.house);

    var name = this.state.house.name;
    var topics = '';

    if (typeof this.state.house.topics !== 'undefined'
      && this.state.house.topics.length > 0) {
      topics = _.map(this.state.house.topics, function(topic) {
        return <TopicView topic={topic} />;
      });
    }

    return (
      <div className="house">
        <div className="row">
          <header className="col-md-12">
            <h1>{name}</h1>
          </header>
        </div>

        {topics}

        <MapView map={this.state.house.map} />
      </div>
    )
  }
});

module.exports = HouseView;