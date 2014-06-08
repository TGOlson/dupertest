var db = require('./mockDb');

/*
 * Mock Model
 */

var Entity = {};

Entity.find = function(id) {

  for(var i = 0; i < db.entities.length; i++) {
    var entity = db.entities[i];

    if(entity.id === id) return entity;
  }
};

module.exports = Entity;
