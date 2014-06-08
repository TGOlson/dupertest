# mockrr

A node library for creating and testing actions upon controllers.

### Unit test controllers the right way

You're developing a node application, and you want to test a controller. Should be simple, right? Unfortunately, not.

I've seen too many guides prescribing one to start a test server, make requests to that server, and test the response. That has a time and a place, but isn't unit testing. With ```mockrr``` you can tests node controllers like you want to.

Imagine you have an ```entities-controller``` with a ```create``` action that you want to test. For example:

```javascript
exports.create = function(req, res) {
  // interesting things here
};
```

Testing that is easy:


```javascript
var request = require('request'),
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

### So what's going on?

Under the hood, ```mockrr``` let's you build up a request object, starting with taking in a controller action. After adding various properties to the ```req``` and ```res``` objects, such as ```params```, ```body```, or anything else you can dream of with the flexible ```extendReq``` function, the function gets called with either the shorthand ```expect``` or the longhand ```end``` method.

### Available methods


```javascript
Request.prototype.params (object)
```
Sets the ```req.params``` object.

```javascript
Request.prototype.extendReq (object)
```
Liberally extends the ```req``` object to include any passed in properties.

```javascript
Request.prototype.body (object)
```
Sets the ```req.body``` object.

```javascript
Request.prototype.expect (object, fn)
```
Shorthand syntax for a Jasmine expect statement. The expectation is often in the form of an object, and will be compared to the return value of the controller action in the fashion:

```javascript
expect(obj).toEqual(object);
```
This method ends the request chain. As such, the callback will often be ```done```.

Note: Jasmine must be the test framework for this method to work.


```javascript
Request.prototype.end (fn)
```

Ends the request chain with a supplied callback receiving the return value from the original controller action. In almost every case the callback will want to be the expect statement.
