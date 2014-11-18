var Request = require('./request');

module.exports = function(action) {
  return new Request(action);
};
