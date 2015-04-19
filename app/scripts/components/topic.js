'use strict';

var React = require('react'),
    markdown = require('markdown').markdown;

var TopicView = React.createClass({

  render: function() {
    var html = markdown.toHTML(this.props.topic.text);
    
    return (
      <div className="row topic-view">
        <div className="col-md-12">
          <h2>{this.props.topic.title}</h2>
          <div dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </div>
    );
  }
});

module.exports = TopicView;