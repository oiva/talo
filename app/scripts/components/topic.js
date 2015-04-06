'use strict';

var React = require('react'),
    _ = require('lodash');

var TopicView = React.createClass({

  render: function() {
    var previousTag, paragraphs = this.props.topic.text;
    _.each(paragraphs, function(p, i) {
      if (p.substring(0, 2) === '- ') {
        if (previousTag === 'li') {
          paragraphs[i - 1] += '\n'+p;
          paragraphs[i] = null;
        }
        previousTag = 'li';
      }
    });

    var text = _.map(paragraphs, function(p, i) {
      if (p === null) {
        return;
      }
      if (p.substring(0, 2) === '- ') {
        return <ul key={i}>{_.map(p.split('\n'), function(line, j) {
          return <li key={j}>{line.substring(2)}</li>;
        })}</ul>
      }
      return <p key={i}>{p}</p>;
    });

    return (
      <div className="row topic-view">
        <div className="col-md-12">
          <h2>{this.props.topic.title}</h2>
          {text}
        </div>
      </div>
    );
  }
});

module.exports = TopicView;