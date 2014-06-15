# dupertest

A node library for creating and testing actions upon controllers without having to spin up a live server. Because unit testing controllers in node should be easier.

(and an acknowledged spoof on supertest)

Note: a mock database such as [mockgoose](https://github.com/mccormicka/Mockgoose/) is also suggested when unit testing.

## Unit Test Node Controllers the Right Way

Unit testing node controllers should be simple. Rails has it easy with Rspec, but unfortunately nothing has come to save the day for Node, yet.

Jasmine is great at testing code, but doesn't go very far with app logic. Supertest extends where Jasmine leaves off, but goes too far in spinning up a server to test. Unit tests shouldn't use live servers or even databases -- enter ```dupertest```. Tests node controllers like you want to.

## Example Usage

Imagine an ```entities-controller``` with a ```show``` action that needs to be tested.

```javascript
exports.show = function(req, res) {
  var entity = // some interesting way of finding an entity
  res.send(entity);
};
```

With ```dupertest``` Testing is easy:


```javascript
var dupertest = require('dupertest'),
  request = dupertest.request
  entities = require('../controllers/entities-controller');

  // other test setup here
  // such as entity = {id: 123, ...}

  describe('entities.show', function () {
    it('should return an error when an entity does not exist', function (done) {
      request(entities.show)
        .params({id: 1})
        .expect(404, done);
    });

    it('should return an entity when one does exist', function (done) {
      request(entities.show)
        .params({id: 123})
        .end(function(response) {
          expect(response.id).toEqual(entity.id);
          done();
        });
    });
  });
```

It's that simple.

## So what's going on?

It's a lot like you might expect. Under the hood, ```dupertest``` let's you build up a request object, starting with taking in a controller action. After adding various properties to the ```req``` and ```res``` objects, such as ```params```, ```body```, or anything else you can dream of with the flexible ```extendReq``` function, the original controller action gets called with either the shorthand ```expect``` or the longhand ```end``` method.

The end result might look something like the below (using the same entity example above):

```javascript
req = {
  params: {
    id: 123
  }
};

res = {
  send: assertion;
  }
};

// the assertion function is the callback passed into the end method
```

And then the origin action is called with the build up objects:

```javascript
entities.show(req, res);
```

Notice in the case described above, the function in ```res.send``` will be some sort of assertion statement, creating the ability to test the response.

```dupertest``` really shines in allowing users to continue using a comfortable format for request chains, without having to worry about passing assertion statements around to odd locations.

## Available methods

```dupertest.setDefaults(object)``` Sets defaults to use for the request object. A common case would be to set something like the ```req.get``` function here, before initiating the request. See the [example spec](https://github.com/TGOlson/dupertest/blob/master/examples/entitiesControllerSpec.js) for a sample of how this can be used.

```dupertest.request(action)``` Takes in a controller action to build the request against. This action is not called until either ```end``` or ```expect``` is called on the request chain.

### dupertest.request methods

```Request.prototype.params (object)``` Sets the ```req.params``` object.

```Request.prototype.extendReq (object)``` Liberally extends the ```req``` object to include any passed in properties.

```Request.prototype.body (object)``` Sets the ```req.body``` object.

```Request.prototype.expect (object, fn)``` Shorthand syntax for a Jasmine expect statement. The expectation is often in the form of an object, and will be compared to the return value of the controller action with the Jasmine statement: ```expect(obj).toEqual(object);``` This method ends the request chain. As such, the callback will often be ```done```.

Note: Jasmine must be the test framework for this method to work.

```Request.prototype.end (fn)``` Ends the request chain with a supplied callback receiving the return value from the original controller action. In almost every case the callback will want to be the expect statement.

## TODO

* Bring in a library for more robust mock request and response objects.
