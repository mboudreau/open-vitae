angular.module('open-vitae.intro', [
		// Global Dependencies
		'ui.router',
		// Templates
		'templates-app',
		'templates-directives',

		'ngMaterial',

		// Services
		'codinghitchhiker.restate'
	])
	.directive('intro', function (Restate) {
		return {
			restrict: 'A',
			templateUrl: 'intro/intro.tpl.html',
			scope: {},
			link: function ($scope, $element, $attrs) {
				$scope.selectedIndex = 0;
				$scope.loading = false;
				$scope.onNext = function () {
					$scope.loading = true;
					switch ($scope.selectedIndex) {
						case 0:
							Restate.baseUrl('http://api.openvitae.org');
							Restate.create('getUser', 'user/' + $scope.email).$get().then(function (data) {
								if (data) {
									$scope.selectedIndex = 1;
									$scope.loading = false;
								} else {
									schema.webhook_submit_url += '/' + $scope.email;
									Restate.baseUrl('http://api.openvitae.org').create('getForm', 'form').$get().then(function(data){

										$scope.selectedIndex = 2;
										$scope.loading = false;
									});
								}
							});
							break;
						case 1:
							$scope.selectedIndex = 3;
							$scope.loading = false;
							break
					}
				};


				var schema = {
					"webhook_submit_url": "http://api.openvitae.org/user",
					"title": "OpenVitae Profile Creation",
					"fields": [
						{
							"type": "statement",
							"question": "Welcome to **OpenVitae**! Let's fill out your profile so you can get to work."
						},
						{
							"type": "short_text",
							"question": "What is your name?",
							"required": true,
							"tags": ["name"]
						},
						{
							"type": "statement",
							"question": "Please tell us your address details.",
							"required": true
						},
						{
							"type": "short_text",
							"question": "Street address:",
							"required": true,
							"tags": ["address", "street"]
						},
						{
							"type": "short_text",
							"question": "City/suburb:",
							"required": true,
							"tags": ["address", "suburb"]
						},
						{
							"type": "short_text",
							"question": "State/region:",
							"required": true,
							"tags": ["address", "state"]
						},
						{
							"type": "number",
							"question": "Post code:",
							"required": true,
							"tags": ["address", "postcode"]
						},
						{
							"type": "statement",
							"question": "Please tells us about your current or most recent employer; if you want, you can add more previous employers afterwards."
						},
						{
							"type": "short_text",
							"question": "What is the business name of your employer?",
							"required": true,
							"tags": ["employer", "emp_name"]
						},
						{
							"type": "short_text",
							"question": "When did you start work?",
							"required": true,
							"tags": ["employer", "startdate"]
						},
						{
							"type": "short_text",
							"question": "When did you finish with this employer? Please enter 'current' if this is your current role.",
							"required": true,
							"tags": ["employer", "enddate"]
						},
						{
							"type": "long_text",
							"question": "Please describe the role.",
							"required": true,
							"tags": ["employer", "description"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another employer?",
							"ref": "addemp2",
							"required": true
						},
						{
							"type": "short_text",
							"question": "What is the business name of your employer?",
							"ref": "emp2name",
							"tags": ["employer", "emp_name"]
						},
						{
							"type": "short_text",
							"question": "When did you start work?",
							"tags": ["employer", "startdate"]
						},
						{
							"type": "short_text",
							"question": "When did you finish with this employer?",
							"tags": ["employer", "enddate"]
						},
						{
							"type": "long_text",
							"question": "Please describe the role.",
							"tags": ["employer", "description"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another employer?",
							"ref": "addemp3",
							"required": true
						},
						{
							"type": "short_text",
							"question": "What is the business name of your employer?",
							"ref": "emp3name",
							"tags": ["employer", "emp_name"]
						},
						{
							"type": "short_text",
							"question": "When did you start work?",
							"tags": ["employer", "startdate"]
						},
						{
							"type": "short_text",
							"question": "When did you finish with this employer?",
							"tags": ["employer", "enddate"]
						},
						{
							"type": "long_text",
							"question": "Please describe the role.",
							"tags": ["employer", "description"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another employer?",
							"ref": "addemp4",
							"required": true
						},
						{
							"type": "short_text",
							"question": "What is the business name of your employer?",
							"ref": "emp4name",
							"tags": ["employer", "emp_name"]
						},
						{
							"type": "short_text",
							"question": "When did you start work?",
							"tags": ["employer", "startdate"]
						},
						{
							"type": "short_text",
							"question": "When did you finish with this employer?",
							"tags": ["employer", "enddate"]
						},
						{
							"type": "long_text",
							"question": "Please describe the role.",
							"tags": ["employer", "description"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another employer?",
							"ref": "addemp5",
							"required": true
						},
						{
							"type": "short_text",
							"question": "What is the business name of your employer?",
							"ref": "emp5name",
							"tags": ["employer", "emp_name"]
						},
						{
							"type": "short_text",
							"question": "When did you start work?",
							"tags": ["employer", "startdate"]
						},
						{
							"type": "short_text",
							"question": "When did you finish with this employer?",
							"tags": ["employer", "enddate"]
						},
						{
							"type": "long_text",
							"question": "Please describe the role.",
							"tags": ["employer", "description"]
						},
						{
							"type": "statement",
							"question": "Tell us about your education and qualifications.",
							"ref": "edu_start"
						},
						{
							"type": "short_text",
							"question": "Which school or institution did you attend?",
							"tags": ["education", "school_name"]
						},
						{
							"type": "number",
							"question": "Which year did you graduate? If you're still studying, please enter your expected year of graduation.",
							"tags": ["education", "grad_year"]
						},
						{
							"type": "short_text",
							"question": "What qualification or certificate did you attain?",
							"tags": ["education", "award"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another qualification?",
							"ref": "addedu2",
							"required": true
						},
						{
							"type": "short_text",
							"question": "Which school or institution did you attend?",
							"tags": ["education", "school_name"]
						},
						{
							"type": "number",
							"question": "Which year did you graduate? If you're still studying, please enter your expected year of graduation.",
							"tags": ["education", "grad_year"]
						},
						{
							"type": "short_text",
							"question": "What qualification or certificate did you attain?",
							"tags": ["education", "award"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another qualification?",
							"ref": "addedu3",
							"required": true
						},
						{
							"type": "short_text",
							"question": "Which school or institution did you attend?",
							"tags": ["education", "school_name"]
						},
						{
							"type": "number",
							"question": "Which year did you graduate? If you're still studying, please enter your expected year of graduation.",
							"tags": ["education", "grad_year"]
						},
						{
							"type": "short_text",
							"question": "What qualification or certificate did you attain?",
							"tags": ["education", "award"]
						},
						{
							"type": "yes_no",
							"question": "Would you like to add another qualification?",
							"ref": "addedu4",
							"required": true
						},
						{
							"type": "short_text",
							"question": "Which school or institution did you attend?",
							"tags": ["education", "school_name"]
						},
						{
							"type": "number",
							"question": "Which year did you graduate? If you're still studying, please enter your expected year of graduation.",
							"tags": ["education", "grad_year"]
						},
						{
							"type": "short_text",
							"question": "What qualification or certificate did you attain?",
							"tags": ["education", "award"]
						},
						{
							"type": "statement",
							"question": "Thank you for completing your **OpenVitae** profile.",
							"ref": "finish"
						}
					],
					"logic_jumps": [
						{
							"from": "addemp2",
							"to": "edu_start",
							"if": false
						},
						{
							"from": "addemp3",
							"to": "edu_start",
							"if": false
						},
						{
							"from": "addemp4",
							"to": "edu_start",
							"if": false
						},
						{
							"from": "addemp5",
							"to": "edu_start",
							"if": false
						},
						{
							"from": "addedu2",
							"to": "finish",
							"if": false
						},
						{
							"from": "addedu3",
							"to": "finish",
							"if": false
						},
						{
							"from": "addedu4",
							"to": "finish",
							"if": false
						}
					]
				};


			}
		}
	});
