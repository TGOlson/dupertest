function Request(action) {
  this.action = action;
  this.req = {};
  this.res = {};
}

Request.prototype.params = function(params) {
  this.req.params = params;
  return this;
};

Request.prototype.query = function(query) {
  this.req.query = query;
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

Request.prototype.files = function (files) {
  this.req.files = files;
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

Request.prototype.next = function (callback) {
  this.nextFn = callback;
  return this;
};

Request.prototype.errNext = function (callback) {
  this.errNextFn = callback;
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

Request.prototype.end = function (callback) {
  var _this = this,
      action = this.action,
      transformer = makeFunction(this.transformer),
      next = function (err) {
        if (err)
          return makeFunction(_this.errNextFn)(err, _this.req, _this.res);
        return makeFunction(_this.nextFn)(_this.req, _this.res);
      };

  if (!action) throw new Error('No action defined');

  transformer.call(this);

  this.res.send = function(body) {
    _this.res.body = body;
    return makeFunction(callback)(_this.res);
  }
  this.res.json = this.res.send;
  this.res.status = function(status) {
    _this.res.status = status;
    _this.res.statusCode = status;
    return _this.res;
  };
  action(this.req, this.res, next);
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
