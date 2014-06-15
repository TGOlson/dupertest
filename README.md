# dupertest

A Node library for testing controller actions without having to spin up a server. Because unit testing controllers in Node should be easier.

* An acknowledged naming-spoof on [supertest](https://github.com/visionmedia/supertest) -- because super-duper-test was a little clunky.

* Note: A mock database such as [mockgoose](https://github.com/mccormicka/Mockgoose/) is also suggested when unit testing, and works great with ```dupertest```.

### Unit Test Node Controllers the Right Way

Unit testing Node controllers should be simple. Rails has it easy with RSpec, but unfortunately no test framework provides the same simplicity for unit testing controllers in Node.

Jasmine is great at testing code, but doesn't go very far with app logic. Supertest extends where Jasmine leaves off, but goes too far in spinning up a live server to send requests to. Unit tests shouldn't use live servers or even databases -- enter ```dupertest```. Test Node controllers like you want to.

## Install

To install the latest official version, use NPM:

```
npm install dupertest
```

To run the test suite, including example usage specs:

```
npm test
```

## Usage

Calling a controller action and making an assertion about the response is as simple as this:

```javascript
var request = require('dupertest').request;

request(controller.action)
  .params({id: 123})
  .expect(entity, done);
```

For a more detailed example, imagine an ```entities-controller``` with a ```show``` action that needs to be tested.

```javascript
// example controller action
exports.show = function(req, res) {
  var id = req.params.id;
  var entity = Entity.find(id);
  res.send(entity);
};
```

With ```dupertest```, testing that controller action is easy:

```javascript
var dupertest = require('dupertest'),
  request = dupertest.request
  entities = require('../controllers/entities-controller');

  // other test setup here
  // such as entity = {id: 123, ...}
  // and/or entity.save();

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

 // Examples shown using Jasmine -- dupertest will work with any test framework.
 // However, the `expect` method is only available when using Jasmine
```

It's that simple. It looks just like ```request``` or ```supertest``` syntax, but without the requirement of a server.

* Check out the [example specs](https://github.com/TGOlson/dupertest/blob/master/examples/entitiesControllerSpec.js) for more usage examples.

### So what's going on?

Under the hood, it's a lot like one might expect. ```dupertest``` takes in a controller action, and then lets you build up the request and response objects to your liking. After adding various properties to the ```req``` and ```res``` objects, such as ```params```, ```body```, or anything else you need with the flexible ```extendReq``` function, the original controller action gets called with either the shorthand ```expect``` or the longhand ```end``` method.

The result might look something like the below (using the same entity example above):

```javascript
// Building up the request and response objects
req = {
  params: {
    id: 123
  }
};

res = {
  // the assertion function here is the function passed into the `end` method
  send: assertion;
  }
};
```

And then the original action is called with the built up objects:

```javascript
entities.show(req, res);
```

Effectively passing an assertion into the controller:

```javascript
exports.show = function(req, res) {
  var id = req.params.id;
  var entity = Entity.find(id);

  // res.send(entity) is effectively replaced with the assertion
  expect(entity.id).toEqual(expectation);
};
```

Notice in the case described above, the function in ```res.send``` will be some sort of assertion statement, creating the ability to test the response.

```dupertest``` really shines in allowing users to continue using a comfortable format for request chains, without having to worry about passing assertion statements around to odd locations.

For a direct example of where a need for ```dupertest``` might be, check out [this Stackoverflow post](http://stackoverflow.com/questions/14487809/how-to-mock-request-and-response-in-nodejs-to-test-middleware-controllers), and my [response example using dupertest](http://stackoverflow.com/a/24227342/3126392).

## Available Methods

### dupertest

Methods available to the ```dupertest``` object.

* ```dupertest.setDefaults(object)``` Sets default request and response values to be used for the entire test session. A common case would be to set something like the ```req.get``` function here, before initiating the request. See the [example spec](https://github.com/TGOlson/dupertest/blob/master/examples/entitiesControllerSpec.js#L86) for an example of how this can be used.

* ```dupertest.clearDefaults()``` Clears the defaults object. Useful if defaults were previously set and are no longer required.

* ```dupertest.request(fn)``` Takes in a controller action to build the request against. This action is not called until either ```end``` or ```expect``` is called upon the request chain.

### dupertest.request

Methods available to the ```dupertest.request``` instance.

* ```Request.prototype.params (object)``` Shorthand notation to set the ```req.params``` object.

* ```Request.prototype.body (object)``` Shorthand notation to set the ```req.body``` object.

* ```Request.prototype.extendReq (object)``` Liberally extends the ```req``` object to include any passed in properties.

* ```Request.prototype.extendRes (object)``` Liberally extends the ```res``` object to include any passed in properties.

* ```Request.prototype.expect (object, fn)``` Shorthand syntax for a Jasmine expect statement. The expectation is often in the form of an object (but can be anything), and will be compared to the return value of the controller action with the Jasmine statement: ```expect(obj).toEqual(object)```. This method ends the request chain. As such, the callback function will often be ```done```.

Note: Jasmine must be the test framework for this method to work.

* ```Request.prototype.end (fn)``` Ends the request chain with a supplied callback receiving the return value from the original controller action. In almost every case the callback will want to include the expect statement.

## Todo / Known Issues

* Bring in a standard library for more robust mock request and response objects.
* Add a way to inject assertions to other ```res``` properties besides just ```send```.
* Test with other frameworks, like Mocha.
* Create a before-end method, that allows any inferred request or response properties to be built. Example: ```req.originalUrl``` is built from the ```req.baseUrl``` and ```req.params``` properties. (a more robust request and response mock would help solve this issue as well)
.
* Consider adding support for multiple ```expect``` statements, similar to ```supertest```.
* Make defaults less global. Currently once they are set by any test they will remain until the test suite finishes. May be better suited to set in a ```beforeEach``` sort of setting, and be cleared after each test.

Be sure to also check out any [issues](https://github.com/TGOlson/dupertest/issues).

## Contributing

1. Fork it
2. Create your feature branch `git checkout -b my-new-feature`
3. Commit your changes `git commit -am 'Add some feature'`
4. Push to the branch `git push origin my-new-feature`
5. Create new Pull Request
