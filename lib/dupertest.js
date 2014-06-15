var Request = require('./request'),
  defaults;

function dupertest() {
  // consider taking in options here
}

// may be a good place to use mock robust request and response objects
defaults = {
  req: {},
  res: {}
};

dupertest.clearDefaults = function() {
	defaults = {};
};

dupertest.setDefaults = function(options) {
  defaults = options;
};

dupertest.request = function(action) {
  return new Request(action, defaults);
};

module.exports = dupertest;
