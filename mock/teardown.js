module.exports = function (grunt, options, async) {
	var done = async();
	var path = require('path');

	var pact = require(path.resolve(__dirname, 'mockService.js'));

	pact(function (mockService) {
		mockService.write(function (error) {
			if (error) {
				grunt.warn('Pact wasn\'t able to verify the interactions: \n' + error);
			} else {
				done();
			}
		});
	});
};