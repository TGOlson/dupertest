var Request = require('../lib/request'),
		request,
		Entity;

describe('request', function() {
	beforeEach(function() {
		Entity = {
			wasCalled: false,
			action: function(req, res) {
				req.params = req.params || {};
				res.send(req.params.id + 1);
			}
		};

		request = new Request(Entity.action);
	});

	describe('initialization', function() {
		it('should initialize with an action', function() {
			expect(request.action).toEqual(Entity.action);
		});

		it('should initialize with an empty req object if no defaults are passed in', function() {
			expect(request.req).toEqual({});
		});

		it('should initialize with an empty res object if no defaults are passed in', function() {
			expect(request.res).toEqual({});
		});
	});

	describe('params', function() {
		it('should set the params property of a request', function() {
			var params = {id: 123};

			request.params(params);
			expect(request.req.params).toEqual(params);
		});
	});

	describe('body', function() {
		it('should set the body property of a request', function() {
			var body = {entity: {}};

			request.body(body);
			expect(request.req.body).toEqual(body);
		});
	});
	
	describe('swagger', function() {
		it('should set the swagger property of a request', function() {
			var params = {id: 123};

			request.swagger(params);
			expect(request.req.swagger).toEqual(params);
		});
	});

	describe('headers', function() {
		it('should set the headers property of a request', function() {
			var headers = {authorization: {}};

			request.headers(headers);
			expect(request.req.headers).toEqual(headers);
		});
	});

	describe('extendReq', function() {
		it('should extend the req object', function() {
			var data = {
				additionalFn: function() {}
			};

			request.extendReq(data);
			expect(request.req.additionalFn).toBe(data.additionalFn);
		});
	});

	describe('extendRes', function() {
		it('should extend the res object', function() {
			var data = {
				additionalFn: function() {}
			};

			request.extendRes(data);
			expect(request.res.additionalFn).toBe(data.additionalFn);
		});
	});

	describe('next', function() {
		it('should not fail the test if no nextFn was added', function() {
			expect(function(){
				request.end();
			}).not.toThrow();
		});

		it('should add the next callback as a parameter', function() {
			var fn = function(req, res) {};

			request.next(fn);
			expect(request.nextFn).not.toBeUndefined();
		});

		it('should send the nextFn as a parameter to the controller', function() {
			var fn = function(req, res) {};

			request.action = function (req, res, next) {
				expect(next).not.toBeUndefined();
			};
			request.next(fn)
				.end();
		});

		it('should call the nextFn if next callback is called in the controller', function() {
			var wrapper = {
				fn: function(req, res) {}
			};

			spyOn(wrapper, 'fn');

			request.action = function (req, res, next) {
				next();
			};
			request.next(wrapper.fn)
				.end(function(){
					expect(wrapper.fn).toHaveBeenCalled();
				});
		});

		it('should call the nextFn with req, res parameters', function() {
			request.action = function (req, res, next) {
				next();
			};
			request.next(function(req, res) {
				expect(req).not.toBeUndefined();
				expect(res).not.toBeUndefined();
				expect(req).toBe(request.req);
				expect(res).toBe(request.res);
			}).end();
		});
	});

	describe('errNext', function() {
		it('should not fail the test if no errNextFn was added', function() {
			expect(function(){
				request.end();
			}).not.toThrow();
		});

		it('should add the errNextFn callback as a parameter', function() {
			var fn = function(err, req, res) {};

			request.errNext(fn);
			expect(request.errNextFn).not.toBeUndefined();
		});

		it('should send the errNextFn as a parameter to the controller', function() {
			var fn = function(req, res) {};

			request.action = function (req, res, next) {
				expect(next).not.toBeUndefined();
			};
			request.errNext(fn)
			.end();
		});

		it('should call the errNextFn if next callback is called in the controller with a parameter',
			function() {
				var wrapper = {
					fn: function(err, req, res) {}
				};

				spyOn(wrapper, 'fn');

				request.action = function (req, res, next) {
					next(new Error('Test callback'));
				};
				request.errNext(wrapper.fn)
				.end(function(){
					expect(wrapper.fn).toHaveBeenCalled();
				});
		});

		it('should call the errNextFn with err, req, res parameters', function() {
			request.action = function (req, res, next) {
				next(new Error('Test callback'));
			};
			request.errNext(function(err, req, res) {
				expect(err).not.toBeUndefined();
				expect(req).not.toBeUndefined();
				expect(res).not.toBeUndefined();
				expect(req).toBe(request.req);
				expect(res).toBe(request.res);
			}).end();
		});
	});


	describe('beforeSend', function() {
		it('should set a transformer property on the request', function() {
			function transformer() {}

			request.beforeSend(transformer);
			expect(request.transformer).toBe(transformer);
		});

		it('should be invoked before the response is sent', function() {
			var Container = {
				transformer: function() {}
			};

			spyOn(Container, 'transformer');

			request.beforeSend(Container.transformer);
			request.end();

			expect(Container.transformer).toHaveBeenCalled();
		});

		it('should be allowed to modify the req object', function() {
			function transformer() {
				this.req.isModified = true;
			}

			request.beforeSend(transformer);
			request.end();

			expect(request.req.isModified).toBe(true);
		});
	});

	describe('expect', function() {
		beforeEach(function() {
			request.params({id: 1});
		});

		it('should assert an expectation', function() {

			// will automatically test assertion
			// note: action was defined at top of spec (returns id + 1)
			request.expect(2);
		});

		it('should call the provided callback if one is supplied', function() {
			var Container = {
				callback: function() {}
			};

			spyOn(Container, 'callback');
			request.expect(2, Container.callback);
			expect(Container.callback).toHaveBeenCalled();
		});
	});

	describe('end', function() {
		it('should set res.send to the provided callback', function() {
			function callback() {}

			request.end(callback);
			expect(request.res.send).toEqual(callback);
		});
	});
});
