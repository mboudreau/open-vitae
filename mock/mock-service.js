var Pact = require('pact-consumer-js-dsl');
var http = require('http');
var ready = false, amount = 0, port = 9700;
var service = Pact.mockService({
	consumer: 'webapp-scout',
	port: port,
	provider: 'forms-api',
	done: function () {}
});

module.exports = function (callback) {

	// Wait for pact-mock-service to be initialized and ready
	function check() {
		amount++;
		http.request({
			port: port,
			path: '/',
			method: 'GET',
			headers: {
				'X-Pact-Mock-Service': true,
				'Content-Type': 'application/json'
			}
		}, done).on('error', function () {
			if (amount >= 10) {
				throw "Pact setup failed; tried calling service 3 times with no result.";
			}
			setTimeout(check, 1000);
		}).end();
	}

	function done() {
		ready = true;
		callback(service);
	}

	ready ? done() : check();
};
