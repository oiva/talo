'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    _ = require('lodash'),

    actions = require('../actions/actions'),
    housesStore = require('../stores/housesStore'),

    FilesView = require('../components/files'),
    MapView = require('../components/map'),
    TableView = require('../components/table'),
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

    var name = this.state.house.name;
    var slogan = this.state.house.slogan;
    var address = this.state.house.address;
    var tables = '';
    var topics = '';

    if (typeof this.state.house.tables !== 'undefined'
      && this.state.house.tables.length > 0) {
      tables = _.map(this.state.house.tables, function(table, i) {
        return <TableView key={i} title={table.title} data={table.data} />;
      });
    }

    if (typeof this.state.house.topics !== 'undefined'
      && this.state.house.topics.length > 0) {
      topics = _.map(this.state.house.topics, function(topic, i) {
        return <TopicView key={i} topic={topic} />;
      });
    }

    return (
      <div className="house">
        <div className="row">
          <header className="jumbotron">
            <h1>{name}</h1>
            <p>{slogan}</p>
          </header>
        </div>

        {tables}

        {topics}

        <MapView map={this.state.house.map} />

        <FilesView files={this.state.house.files} />
      </div>
    )
  }
});

module.exports = HouseView;