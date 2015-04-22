'use strict';

var React = require('react'),
    _ = require('lodash');

var FilesView = React.createClass({

  render: function() {
    
    return (
      <div className="row files-view">
        <div className="col-md-12">
          <h2>Tiedostot</h2>
          <ul className="files">
          {_.map(this.props.files, function(value, key) {
            return (
              <li><a href={value}>{key}</a></li>
            )
          })}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = FilesView;