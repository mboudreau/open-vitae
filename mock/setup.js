module.exports = function (grunt, options, async) {

	// get the callback
	var done = async();
	var path = require('path');

	var pact = require('./mock-service.js');

	try {
		pact(function(mockService){
			// Clean service first
			mockService.clean(function(){

				// Require all pacts, send mockService
				var glob = require('glob');
				glob(path.resolve(__dirname, 'pacts/*.pact.js'), function (er, files) {
					var called = 0;
					files.forEach(function (val) {
						require(val)(onDone);
					});

					function onDone() { // Check if all requires are done
						called++;
						if(called === files.length) {
							// Send all interactions to pact service, call done when finished and ready to continue
							mockService.setup(done);
						}
					}
				});

			});
		});
	} catch (e) {
		grunt.warn('Couldn\'t setup Pact files');
	}
};

