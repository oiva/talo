'use strict';

var React = require('react'),
    _ = require('lodash');

var FilesView = React.createClass({

  render: function() {
    var files = _.map(this.props.files, function(value, key) {
      var target = '';
      if (value.substring(0, 1) !== '/') {
        target = '_blank';
      }
      return (
        <li key={key}><a href={value} target={target}>{key}</a></li>
      )
    });

    return (
      <div className="row files-view">
        <div className="col-md-12">
          <h2>Tiedostot</h2>
          <ul className="files">
            {files}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = FilesView;