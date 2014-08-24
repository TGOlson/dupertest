var Request = require('../lib/request'),
	request,
	Entity,
	defaults;

describe('request', function() {
	beforeEach(function() {
		Entity = {
			wasCalled: false,
			action: function(req, res) {
				res.send(req.params.id + 1);
			}
		};

		request = new Request(Entity.action);
	});

	describe('initialization', function() {
		beforeEach(function() {
			defaults = {
				req: {
					params: 123
				},
				res: {
					set: function() {}
				}
			};
		});

		it('should initialize with an action', function() {
			expect(request.action).toEqual(Entity.action);
		});

		it('should initialize with an empty req object if no defaults are passed in', function() {
			expect(request.req).toEqual({});
		});

		it('should initialize with an empty res object if no defaults are passed in', function() {
			expect(request.res).toEqual({});
		});

		it('should accept a default object to set req', function() {
			request = new Request(Entity.action, defaults);
			expect(request.req).toEqual(defaults.req);
		});

		it('should accept a default object to set res', function() {
			request = new Request(Entity.action, defaults);
			expect(request.res).toEqual(defaults.res);
		});
	});

	describe('params', function() {
		it('should set the params property of a request', function() {
			var params = {id: 123};
			request.params(params);
			expect(request.req.params).toEqual(params);
		});
	});

	describe('user', function() {
		it('should set the user property of a request', function() {
			var user = {id: 123};
			request.user(user);
			expect(request.req.user).toEqual(user);
		});
	});

	describe('body', function() {
		it('should set the body property of a request', function() {
			var body = {entity: {}};
			request.body(body);
			expect(request.req.body).toEqual(body);
		});
	});

	describe('extendReq', function() {
		it('should extend the req object', function() {
			var extension = {
				somethingElse: function() {}
			};

			request.extendReq(extension);
			expect(request.req.somethingElse).toBeDefined();
		});
	});

	describe('extendRes', function() {
		it('should extend the res object', function() {
			var extension = {
				somethingElse: function() {}
			};

			request.extendRes(extension);
			expect(request.res.somethingElse).toBeDefined();
		});
	});

	describe('expect', function() {
		beforeEach(function() {
			request.params({id: 1});
		});

		it('should assert an expectation', function() {
			request.expect(2);
		});

		it('should assert an expectation', function() {
			var SomeObj = {
				callback: function() {}
			};

			spyOn(SomeObj, 'callback');
			request.expect(2, SomeObj.callback);
			expect(SomeObj.callback).toHaveBeenCalled();
		});
	});

	describe('end', function() {
		var callback;

		beforeEach(function() {
			request.params({id: 1});
			callback = function() {};
		});

		it('should set res.send to a callback', function() {
			request.end(callback);
			expect(request.res.send).toEqual(callback);
		});
	});
});
