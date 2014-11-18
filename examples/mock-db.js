/*
 * Mock Database
 */

var MockDb = {};

MockDb.create = function(data) {
  data.id = this.data.length + 1;
  this.data.push(data);
  return data;
};

MockDb.clear = function() {
  this.data = [];
};

MockDb.data = [
  {
    id: 1,
    name: 'Bob'
  },
  {
    id: 2,
    name: 'Carla'
  },
  {
    id: 3,
    name: 'Ronald'
  },
  {
    id: 4,
    name: 'Rita'
  }
];

module.exports = MockDb;
