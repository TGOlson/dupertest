var Entity = require('./entity');


/*
 * Mock Controller
 */

exports.show = function(req, res) {
  var id = req.params.id,
      entity = Entity.find(id);

  if(entity) {
    res.send(entity);
  } else {
    res.send(404);
  }

};

exports.somethingMoreComplex = function(req, res) {

  // build a request url from more obscure properties
  var builtUrl = req.protocol + '://' + req.get('host') + req.originalUrl,
      entity = req.body.entity;

  // set headers
  res.set('Access-Control-Allow-Origin', '*');

  entity.urlForSomeReason = builtUrl;

  res.send(entity);
};

