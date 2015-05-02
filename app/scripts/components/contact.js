'use strict';

var React = require('react'),
    _ = require('lodash');

var ContactView = React.createClass({
  onCall: function() {
    this.reportAction('call');
  },

  onEmail: function() {
    this.reportAction('email');
  },

  reportAction: function(method) {
    if (typeof ga !== 'undefined') {
      ga('send', 'event', 'contact', method);
    }
  },

  render: function() {
    var methods = _.map(this.props.contact.methods, function(method, key) {
      var text = '';
      var methodName = '';

      if (key === 'call') {
        text = <span>{method[0]}: <a onClick={this.onCall} href={method[2]}>{method[1]}</a></span>;
        methodName = 'Soita';
      } else if (key === 'email') {
        text = <span><a onClick={this.onEmail} href={method[1]}>{method[0]}</a></span>;
        methodName = 'Sähköposti';
      }
      return (
        <li key={key}><strong>{methodName}</strong>: {text}</li>
      );
    }.bind(this));

    return (
      <div className="row contact-view">
        <div className="col-md-12">
          <h2>{this.props.contact.title}</h2>
          <p>{this.props.contact.text}</p>
          <ul>
            {methods}
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = ContactView;