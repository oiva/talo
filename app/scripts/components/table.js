'use strict';

var React = require('react'),
    _ = require('lodash');

var TableView = React.createClass({
  render: function() {
    var rows = _.map(this.props.data, function(value, key) {
      var title, text;
      if (_.isObject(value) && typeof value.text !== 'undefined' && typeof value.year !== 'undefined') {
        title = value.year;
        text = value.text;
      } else {
        title = key;
        text  = value;
      }

      return (
        <tr key={key}>
          <th>{title}</th>
          <td>{text}</td>
        </tr>
      );
    });

    return (
      <div className="row">
        <div className="col-md-12">
          <h2>{this.props.title}</h2>
          <table>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = TableView;