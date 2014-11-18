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

			expect(Container.transformer).toHaveBeenCalledWith(request);
		});

		it('should be allowed to modify the req object', function() {
			function transformer(request) {
				request.req = {isModified: true};
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
