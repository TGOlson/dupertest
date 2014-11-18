# dupertest

A Node library for unit testing controller actions without having to spin up a server. Because unit testing controllers in Node should be easier.

* An acknowledged naming-spoof on [supertest](https://github.com/visionmedia/supertest) -- because super-duper-test was a little clunky.

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
var request = require('dupertest');

request(controller.action)
  .params({id: 123})
  .expect(entity, done);
```

For a more detailed example, imagine an ```entities-controller``` with a ```show``` action that needs to be tested.

```javascript
// example controller action
exports.show = function(req, res) {
  var id = req.params.id,
      entity = Entity.find(id);

  res.send(entity);
};
```

With ```dupertest```, testing that controller action is easy:

```javascript
var request = require('dupertest'),
    entities = require('../controllers/entities-controller');

  // create mock entity and other test setup here
  var entity = {
    id: 123,
    name: 'Cool Entity'
  };

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
          expect(response).toEqual(entity);
          done();
        });
    });
  });

 // Examples shown using Jasmine -- dupertest will work with any test framework.
 // However, the `expect` method is only available when using Jasmine
```

It's that simple. It looks just like ```request``` or ```supertest``` syntax, but without the requirement of a server.

* Check out the [example specs](https://github.com/TGOlson/dupertest/blob/master/examples/entities-controller_spec.js) for more usage examples.

### So what's going on?

Under the hood, it's a lot like one might expect. ```dupertest``` takes in a controller action, and then lets you build up the request and response objects to your liking. After adding various properties to the ```req``` and ```res``` objects, such as ```params```, ```body```, or anything else you need with the flexible ```extendReq``` function, the original controller action gets called with either the shorthand ```expect``` or the longhand ```end``` method.

```dupertest``` really shines in allowing users to continue using a comfortable format for request chains, without having to worry about passing assertion statements around.

For a direct example of where a need for ```dupertest``` might be, check out [this Stackoverflow post](http://stackoverflow.com/questions/14487809/how-to-mock-request-and-response-in-nodejs-to-test-middleware-controllers), and my [response example using dupertest](http://stackoverflow.com/a/24227342/3126392) (note, syntax in response may be outdated).

## Documentation

Requiring `dupertest` into a file returns a single method to be invoked with the desired controller action to test. Invoking this method returns an instance of the `Request` class.

```js
var request = require('dupertest');
request(<action-to-test>);
// => '[object Request]'
```

### Request

Methods available to the ```Request``` instance.

* ```Request.prototype.params (object)``` Shorthand notation to set the ```req.params``` object.

* ```Request.prototype.body (object)``` Shorthand notation to set the ```req.body``` object.

* ```Request.prototype.extendReq (object)``` Liberally extends the ```req``` object to include any passed in properties. Use this to add any properties or functions that are not covered in the shorthand methods. See [example specs](https://github.com/TGOlson/dupertest/blob/master/examples/entities-controller_spec.js#L59) for usage.

* ```Request.prototype.extendRes (object)``` Liberally extends the ```res``` object to include any passed in properties. Use this to add any properties or functions that are not covered in the shorthand methods. See [example specs](https://github.com/TGOlson/dupertest/blob/master/examples/entities-controller_spec.js#L69) for usage.

* ```Request.prototype.beforeSend (fn)``` Allows the `req` or `res` objects to be dynamically modified before the response is sent. The provided function will be invoked in the context of the `Request` instance. See [example specs](https://github.com/TGOlson/dupertest/blob/master/examples/entities-controller_spec.js#L69) for usage.


* ```Request.prototype.expect (object, fn)``` Shorthand syntax for a Jasmine expect statement. The expectation is often in the form of an object (but can be anything), and will be compared to the return value of the controller action with the Jasmine statement: ```expect(obj).toEqual(object)```. This method ends the request chain. As such, the callback function will often be ```done```. Note: Jasmine must be the test framework for this method to work.

* ```Request.prototype.end (fn)``` Ends the request chain with a supplied callback receiving the return value from the original controller action. In almost every case the callback will want to include the expect statement.

## Todo / Known Issues

* Bring in a standard library for more robust mock request and response objects.
* Add a way to inject assertions to other ```res``` properties besides just ```send```.
* Test with other frameworks, like Mocha.

Be sure to also check out any [issues](https://github.com/TGOlson/dupertest/issues).

## Contributing

1. Fork it
2. Create your feature branch `git checkout -b my-new-feature`
3. Commit your changes `git commit -am 'Add some feature'`
4. Push to the branch `git push origin my-new-feature`
5. Create new Pull Request
