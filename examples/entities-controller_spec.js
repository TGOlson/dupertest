var request = require('../lib/dupertest'),
    entities = require('./entities-controller'),
    Entity = require('./entity'),
    db = require('./mock-db');

describe('mockController', function() {
  var entity;

  beforeEach(function() {

    // clear database before each test
    db.clear();

    // create new entity to test against
    entity = db.create({name: 'New Cool Entity'});
  });

  describe('Basic examples using expect', function() {
    it('should return an error if the entity does not exist', function(done) {
      request(entities.show)
        .params({id: 1000})
        .expect(404, done);
    });

    it('should return an entity if one exists', function(done) {
      request(entities.show)
        .params({id: entity.id})
        .expect(entity, done);
    });
  });

  describe('Basic examples using end', function() {
    it('should return an error if the entity does not exist', function(done) {
      request(entities.show)
        .params({id: 1000})
        .end(function(response) {
          expect(response).toBe(404);
          done();
        });
    });

    it('should return an entity if one exists', function(done) {
      request(entities.show)
        .params({id: entity.id})
        .end(function(response) {
          expect(response).toEqual(entity);
          done();
        });
    });
  });

  describe('More complex example building up the request object', function() {
    it('should return an entity with the original request url', function(done) {
      entities.urlForSomeReason = 'http://localhost:3000/entities';

      request(entities.somethingMoreComplex)
        .body({entity: entity})
        .extendReq({
          protocol: 'http',
          originalUrl: '/entities',

          // very mocked out - we know it will only be used in the context of req.get('host')
          get: function() {
            return 'localhost:3000';
          }
        })
        .extendRes({
          set: function() {}
        })
        .end(function(response) {
          expect(response).toEqual(entity);
          done();
        });
    });
  });

  describe('Transforming the request before it is sent', function() {
    it('should allow the request to be dynamically modified', function(done) {
      function action(req, res) {
        var incrementedId = req.params.incrementedId;
        res.send(incrementedId);
      }

      request(action)
        .params({id: entity.id})
        .beforeSend(function(context) {
          var params = context.req.params;
          params.incrementedId = params.id + 1;
        })
        .end(function(response) {
          expect(response).toBe(entity.id + 1);
          done();
        });
    });
  });
});
