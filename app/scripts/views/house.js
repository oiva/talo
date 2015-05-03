'use strict';

var React = require('react'),
    Reflux = require('reflux'),
    _ = require('lodash'),
    $ = jQuery,

    actions = require('../actions/actions'),
    housesStore = require('../stores/housesStore'),
    markdown = require('markdown').markdown,

    CarouselView = require('../components/carousel'),
    ContactView = require('../components/contact'),
    FilesView = require('../components/files'),
    MapView = require('../components/map'),
    TableView = require('../components/table'),
    TopicView = require('../components/topic');

var HouseView = React.createClass({
  scrollTimeout: null,

  mixins: [
    Reflux.listenTo(housesStore, 'onStoreUpdate')
  ],

  getInitialState: function() {
    actions.search(+this.props.id || 1);
    var house = {};
    if (typeof window.preload !== 'undefined' && typeof window.preload[this.props.id] !== 'undefined') {
      house = window.preload[this.props.id];
    }
    return {
      house: house
    };
  },

  onStoreUpdate: function(house) {
    this.setState({
      house: house
    });
    this.renderMeta();
  },

  renderMeta: function() {
    var meta = '';
    _.each(this.state.house.meta, function(value, key) {
      meta += '<meta property="'+key+'" content="'+value+'" />\n';
    });
    $('head').append($.parseHTML(meta));

    // preload data for next time
    var json = JSON.stringify(this.state.house);
    json = json.replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f");
    $('body').append("<script>var preload = {"+this.state.house.id+": "+json+"};</script>");
  },

  render: function() {
    if (typeof this.state.house.name === 'undefined') {
      return <div></div>;
    }

    var name = this.state.house.name;
    var slogan = this.state.house.slogan;
    //var address = this.state.house.address;
    var contact = this.state.house.contact;
    var description = markdown.toHTML(this.state.house.description);
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

        <div className="row description">
          <div className="col-md-12">
            <div dangerouslySetInnerHTML={{__html: description}} />
          </div>
        </div>

        <CarouselView photos={this.state.house.photos} />

        {tables}

        {topics}

        <MapView map={this.state.house.map} />

        <FilesView files={this.state.house.files} />

        <ContactView contact={contact} />
      </div>
    )
  }
});

module.exports = HouseView;