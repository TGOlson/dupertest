
// example of defaults
// var defaults = {
//   req: {
//     protocol: 'http',
//     baseUrl: '/api/0',
//     get: function () { return 'localhost:3001'; }
//   }
// };

var defaults;

exports.defaults = function(defaults) {
  defaults = defaults;
}

// mock requests for controller testing
exports.request = function(action) {
  return new Request(action, defaults);
};

var Request = function(action, defaults) {
  this.action = action;
  this.defaults = defaults || {};
  this.req = this.defaults.req || {};
  this.res = this.defaults.res || {};
  this.res.set = function(){};
};

Request.prototype.params = function(params) {
    this.req.originalUrl = this.req.baseUrl + '/' + params.id;
    this.req.params = params;
    this.req.params.ds = params.ds;
    return this;
};

Request.prototype.body = function (obj) {
  this.req.body = obj;
  return this;
};

Request.prototype.extendReq = function(obj) {
  for(var i in obj) {
    this.req[i] = obj[i];
  }

  return this;
};

// should this be exposed publicly?
Request.prototype.send = function(params) {
  this.req.params = params;
  return this;
};

Request.prototype.expect = function (expectation, callback) {
  var assertion = function (obj) {
      expect(obj).toEqual(expectation);
      callback();
    };

  this.end(assertion);
};

Request.prototype.end = function(callback) {
  this.res.send = callback;
  this.action(this.req, this.res);
};
