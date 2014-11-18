function Request(action) {
  this.action = action;
  this.req = {};
  this.res = {};
}

Request.prototype.params = function(params) {
  this.req.params = params;
  return this;
};

Request.prototype.body = function (body) {
  this.req.body = body;
  return this;
};

Request.prototype.headers = function (headers) {
  this.req.headers = headers;
  return this;
};

Request.prototype.extendReq = function(data) {
  extend(this.req, data);
  return this;
};

Request.prototype.extendRes = function(data) {
  extend(this.res, data);
  return this;
};

Request.prototype.beforeSend = function(transformer) {
  this.transformer = transformer;
  return this;
};

Request.prototype.expect = function (expectation, callback) {
  function assertion (obj) {
    expect(obj).toEqual(expectation);
    makeFunction(callback)();
  }

  this.end(assertion);
};

Request.prototype.end = function(callback) {
  var action = this.action,
      transformer = makeFunction(this.transformer);

  if(!action) throw new Error('No action defined');

  transformer(this);

  this.res.send = makeFunction(callback);
  action(this.req, this.res);
};

function makeFunction(fn) {
  return fn || noop;
}

function extend(target, data) {
  for(var i in data) {
    target[i] = data[i];
  }
}

function noop() {}

module.exports = Request;
