var Entity = require('./entityModel');

/*
 * Mock Controller
 */

exports.show = function(req, res) {
  var id = req.params.id;

  var entity = Entity.find(id);

  if(entity) {
    res.send(entity);
  } else {
    res.send(404);
  }

};

exports.somethingMoreComplex = function(req, res) {
  // set headers
  res.set('Access-Control-Allow-Origin', '*');

  // build a request url from more obscure properties
  var builtUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  var entity = req.body.entity;

  entity.urlForSomeReason = builtUrl;

  res.send(entity);
};

