'use strict';

var Reflux = require('reflux'),
    $ = jQuery,
    _ = require('lodash');

var Actions = Reflux.createActions({
  search: {asyncResult: true}
})

Actions.search.listen(function(houseId) {
  console.log('search house '+houseId);
  getHouseItem.call(this, houseId);
});

function getHouseItem(houseId) {
  console.log('load data');
  $.ajax({
    url: '../data/data.json'
  })
    .done(function(data) {
      var house = _.find(data.houses, function(house) {
        return house.id == houseId;
      });
      this.completed(house);
    }.bind(this))
    .fail(this.failed);
};

module.exports = Actions;