angular.module('open-vitae', [
		// Global Dependencies
		'ui.router',
		// Templates
		'templates-app',
		'templates-directives',

		'ngMaterial',
		'open-vitae.user',

		// Services
		'codinghitchhiker.restate'
	])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);

		$stateProvider
			.state('app', {
				url: '/',
				templateUrl: 'app.tpl.html'
			})
			.state('user', {
				url: '/user?redirect',
				template: '<div user></div>'
			});

	});
