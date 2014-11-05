var Request = function(action, defaults) {
  this.action = action;
  defaults = defaults || {};
  this.req = defaults.req || {};
  this.res = defaults.res || {};

  // not included by default for now
  // this.res.set = function(){};
  // consider extending the pre-set req and res objects
};

Request.prototype.params = function(params) {

  // a good example of where a more robust request object would be desirable
  // this is a one-off solution for a useful property
  this.req.originalUrl = this.req.baseUrl + '/' + params.id;

  this.req.params = params;
  return this;
};

Request.prototype.user = function(user) {
  this.req.user = user;
  return this;
};

Request.prototype.body = function (obj) {
  this.req.body = obj;
  return this;
};

Request.prototype.headers = function (obj) {
  this.req.headers = obj;
  return this;
};

Request.prototype.extendReq = function(obj) {
  for(var i in obj) {
    this.req[i] = obj[i];
  }

  return this;
};

Request.prototype.extendRes = function(obj) {
  for(var i in obj) {
    this.res[i] = obj[i];
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
      if(callback) callback();
    };

  this.end(assertion);
};

Request.prototype.end = function(callback) {
  this.res.send = callback;

  this.res.status = function(statusCode) {
    this.statusCode = statusCode;
    return this;
  };

  this.action(this.req, this.res);
};

module.exports = Request;
