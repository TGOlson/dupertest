var db = require('./mock-db');


/*
 * Mock Model
 */

var Entity = {};

Entity.find = function(id) {
  for(var i = 0; i < db.data.length; i++) {
    var entity = db.data[i];

    if(entity.id === id) return entity;
  }
};

module.exports = Entity;
