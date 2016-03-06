angular.module('open-vitae', [
		// Global Dependencies
		'ui.router',
		// Templates
		'templates-app',
		'templates-directives',

		'ngMaterial',
		'open-vitae.intro',
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
				template: '<div intro layout="column" layout-fill></div>'
			})
			.state('user', {
				url: '/user?redirect',
				template: '<div user layout="column" layout-fill></div>'
			});

	});
