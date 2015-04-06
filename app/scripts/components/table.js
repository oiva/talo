'use strict';

var React = require('react'),
    _ = require('lodash');

var TableView = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h2>{this.props.title}</h2>
          <table>
            <tbody>
              {_.map(this.props.data, function(value, key) {
                return (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

module.exports = TableView;