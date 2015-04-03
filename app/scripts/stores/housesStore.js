'use strict';

var Reflux = require('reflux'),
    Actions = require('../actions/actions');

var housesStore = Reflux.createStore({
  init: function() {
    this.listenTo(Actions.search.completed, this.onSearchCompleted);
  },

  getDefaultData: function() {
    return {};
  },

  onSearchCompleted: function(data) {
    console.log('onSearchCompleted', data);
    this.trigger(data);
  }
});

module.exports = housesStore;