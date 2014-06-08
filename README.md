# mockrr

A node library for creating and testing actions upon controllers.

* Note: this module is still heavily under development. The implementation has been verified, but needs testing before released into the wild.

## Unit test controllers the right way

You're developing a node application, and you want to test a controller. Should be simple, right? Unfortunately, not.

I've seen too many guides prescribing one to start a test server, make requests to that server, and test the response. That has a time and a place, but isn't unit testing. With ```mockrr``` you can tests node controllers like you want to.

Imagine you have an ```entities-controller``` with a ```show``` action that you want to test. For example:

```javascript
exports.show = function(req, res) {
  // interesting things here
};
```

With ```mockrr``` Testing that is easy:


```javascript
var mockrr = require('mockrr'),
  request = mockrr.request
  entities = require('../../controllers/entities-controller');

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

Under the hood, ```mockrr``` let's you build up a request object, starting with taking in a controller action. After adding various properties to the ```req``` and ```res``` objects, such as ```params```, ```body```, or anything else you can dream of with the flexible ```extendReq``` function, the function gets called with either the shorthand ```expect``` or the longhand ```end``` method.

## Available methods

```mockrr.setDefaults(object)``` Sets defaults to use for the request object. A common case would be to set something like the ```req.get``` function here, before initiating the request.

```mockrr.request(action)``` Takes in a controller actions to build the request against. This action is not called until either ```end``` or ```expect``` is called on the request chain.

### mockrr.request methods

```Request.prototype.params (object)``` Sets the ```req.params``` object.

```Request.prototype.extendReq (object)``` Liberally extends the ```req``` object to include any passed in properties.

```Request.prototype.body (object)``` Sets the ```req.body``` object.

```Request.prototype.expect (object, fn)``` Shorthand syntax for a Jasmine expect statement. The expectation is often in the form of an object, and will be compared to the return value of the controller action with the Jasmine statement: ```expect(obj).toEqual(object);``` This method ends the request chain. As such, the callback will often be ```done```.

Note: Jasmine must be the test framework for this method to work.

```Request.prototype.end (fn) ``` Ends the request chain with a supplied callback receiving the return value from the original controller action. In almost every case the callback will want to be the expect statement.
