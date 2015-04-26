'use strict';

var Reflux = require('reflux'),
    $ = jQuery,
    _ = require('lodash');


var Actions = Reflux.createActions({
  search: {asyncResult: true}
});

function getHouseItem(houseId, context) {
  if (typeof window.preload !== 'undefined' && typeof window.preload[houseId] !== 'undefined') {
    var data = preload[houseId];
    return context.completed(data);
  }
  $.ajax({
    url: 'scripts/json/data.json'
  })
    .done(function(data) {
      var house = _.find(data.houses, function(house) {
        return house.id === houseId;
      });
      this.completed(house);
    }.bind(context))
    .fail(context.failed);
}

Actions.search.listen(function(houseId) {
  getHouseItem(houseId, this);
});

module.exports = Actions;