angular.module('open-vitae', [
		// Global Dependencies
		'ui.router',
		// Templates
		'templates-app',
		'templates-directives',
		// directives
		'ui.bootstrap.modal',

		// Services
		'codinghitchhiker.restate'
	])
	.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);

		// Setting things for bootstrap compatibility
		var nua = navigator.userAgent;
		if (nua.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement('style');
			msViewportStyle.appendChild(
				document.createTextNode(
					'@-ms-viewport{width:auto!important}'
				)
			);
			document.querySelector('head').appendChild(msViewportStyle);
		}

		var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
		if (isAndroid) {
			var els = angular.element('select.form-control');
			angular.forEach(els, function (el) {
				el.removeClass('form-control').css('width', '100%');
			});
		}

		// API Authentication
		/*$httpProvider.interceptors.push(function (api, auth, $cookies) {
			return {
				request: function (config) {
					if (api.url && auth.token && config.url.indexOf(api.url) === 0) {
						config.headers.Authorization = 'Bearer ' + auth.token;
					}
					return config;
				}
			};
		});
*/
		$stateProvider
			.state('app', {
				abstract: true,
				controller: function ($scope) {
					$scope.showFeatureToggle = window.showFeatureToggle || false;

					$scope.features = {
						'card-layout': {
							enabled: true,
							version: '1'
						},
						'result-layout': {
							enabled: true,
							version: '1'
						}
					};
				},
				templateUrl: 'app.tpl.html'
			})
			.state('app.intro', {
				url: '/',
				template: '<div intro></div>'
			});
	});
