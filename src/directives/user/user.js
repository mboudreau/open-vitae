angular.module('open-vitae.user', [
		// Global Dependencies
		'ui.router',
		// Templates
		'templates-app',
		'templates-directives',

		'ngMaterial',

		// Services
		'codinghitchhiker.restate'
	])
	.directive('user', function () {
		return {
			restrict: 'A',
			templateUrl: 'user/user.tpl.html',
			scope: {},
			link: function ($scope, $element, $attrs) {
				$scope.data = ['item 1', 'item 2'];
			}
		}
	});
