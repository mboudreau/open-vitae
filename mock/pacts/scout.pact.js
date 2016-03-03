var path = require('path');
var pact = require(path.resolve(__dirname, '../mock-service.js'));
var extend = require('util')._extend;

function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function uid() {
	// Math.random should be unique because of its seeding algorithm.
	// Convert it to base 36 (numbers + letters), and grab the first 9 characters
	// after the decimal.
	return Math.random().toString(36).substr(2, 9);
}

// Create mock with beta.json-generator.com and this template:
//
//[
//	{
//		'repeat:10': {
//			id: '{{objectId()}}',
//			img: 'http://api.randomuser.me/portraits/{{random("men", "women")}}/{{integer(0, 96)}}.jpg',
//			age: '{{integer(20, 40)}}',
//			name: '{{firstName()}} {{surname()}}',
//			company: '{{company()}}',
//			role: '{{lorem(2, "words")}}',
//			email: function (tags) {
//				return (this.name.split(' ').join('.') + '@' + this.company + tags.domainZone()).toLowerCase();
//			},
//			phone: '+61{{phone("xxxxxxxxx")}}',
//			location: {
//				address: '{{integer(100, 999)}} {{street()}}',
//				city: '{{city()}}',
//				state: '{{state()}}',
//				postalcode: '{{integer(100, 10000)}}',
//				country: '{{country()}}',
//				latitude: '{{floating(-90.000001, 90)}}',
//				longitude: '{{floating(-180.000001, 180)}}'
//			},
//			tags: [
//				{
//					'repeat:7': '{{lorem(1, "words")}}'
//				}
//			],
//			resume: 'http://placehold.it/1240x1754?text=Resume',
//			notes: [
//				{
//					'repeat:3': {
//						by: '{{firstName()}} {{surname()}}',
//						date: '{{date().getTime()}}',
//						message:'{{lorem(2, "sentences")}}'
//					}
//				}
//			]
//		}
//	}
//]

var mockWithoutResults = {
	"took": 32,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 0,
		"max_score": null,
		"hits": []
	}
};


var mockWithResults = {
	"took": 14,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 2,
		"max_score": 0.057534903,
		"hits": []
	}
};

var hit = {
	"_index": "543",
	"_type": "candidate",
	"_id": "8725",
	"_score": 0.057534903,
	"_source": {
		"id": 43470,
		"personId": 43470,
		"applicantId": 24990109,
		"lastUpdated": "2016-02-24T01:39:25.484388+00:00",
		"firstName": "Chris",
		"lastName": "McDermott",
		"street1": "91 William St",
		"street2": "",
		"suburb": "Melbourne",
		"postcode": "3000",
		"state": "Victoria",
		"country": "Australia",
		"emails": [
			"chrism@pageuppeople.co.uk"
		],
		"experience": [
			{
				"company": "PageUp",
				"responsibilities": "Development",
				"currency": "AUD",
				"salary": "",
				"role": "Senior developer",
				"country": "",
				"city": "",
				"startDate": "2014-12-01T00:00:00",
				"endDate": "2015-04-01T00:00:00"
			},
			{
				"company": "PageUp",
				"responsibilities": "Development",
				"currency": "AUD",
				"salary": "",
				"role": "Senior developer",
				"country": "",
				"city": "",
				"startDate": "2014-12-01T00:00:00",
				"endDate": "2015-04-01T00:00:00"
			},
			{
				"company": "PageUp",
				"responsibilities": "Development",
				"currency": "AUD",
				"salary": "",
				"role": "Senior developer",
				"country": "",
				"city": "",
				"startDate": "2014-12-01T00:00:00",
				"endDate": "2015-04-01T00:00:00"
			}
		]
	}
};

for (var i = 0; i < 25; i++) {
	var gender;
	switch (Math.floor(Math.random() * 5)) {
		case 0:
			gender = undefined;
			break;
		case 1:
			gender = '';
			break;
		case 2:
			gender = 'U';
			break;
		case 3:
			gender = 'F';
			break;
		case 4:
			gender = 'M';
			break;
	}
	var value = JSON.parse(JSON.stringify(hit)); // deep copy object
	value._source.gender = gender;
	mockWithResults.hits.hits.push(value);
}

mockWithResults.hits.total = mockWithResults.hits.hits.length;

function term(matcher, generate) {
	if ((typeof matcher === 'undefined') || (typeof generate === 'undefined')) {
		throw 'Matcher and Generate arguments must be specified to use Term';
	}
	return {
		"json_class": "Pact::Term",
		"data": {
			"generate": generate,
			"matcher": {
				"json_class": "Regexp",
				"o": 0,
				"s": matcher
			}
		}
	};
}

function somethingLike(value) {
	return {
		"json_class": "Pact::SomethingLike",
		"contents": value
	};
}

module.exports = function (done) {

	var requestHeaders = {
		/*'Accept': 'application/vnd.formsbuilderapi-v1+json',
		 'Authorization': 'Bearer locksmith_user_id=user_34567|locksmith_instance_id=34567'*/
	};
	var responseHeaders = {
		'Content-Type': 'application/json;charset=utf-8'
	};
	var jsonRequestHeaders = {
		'Content-Type': term('application/json', 'application/json;charset=utf-8')/*,
		 'Accept': requestHeaders.Accept,
		 'Authorization': requestHeaders.Authorization*/
	};

	var guidRegex = '/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';

	function wrapRegex(value) {
		return '^' + value + '$';
	}

	pact(function (mockService) {

		mockService
			.given('a search query')
			.uponReceiving('a search GET request with a query')
			.withRequest({method: 'get', path: '/_search', query: term('q=.*', 'q=test'), headers: requestHeaders})
			.willRespondWith({
				status: 200,
				headers: responseHeaders,
				body: mockWithResults
			});

		mockService
			.given('a search query')
			.uponReceiving('a search GET request with a query')
			.withRequest({method: 'get', path: '/_search', query: 'q=nothing', headers: requestHeaders})
			.willRespondWith({
				status: 200,
				headers: responseHeaders,
				body: mockWithoutResults
			});

		mockService
			.given('a search query')
			.uponReceiving('a search GET request with no query')
			.withRequest({method: 'get', path: '/_search', query: '', headers: requestHeaders})
			.willRespondWith({
				status: 200,
				headers: responseHeaders,
				body: mockWithResults
			});

		mockService
			.given('a document query')
			.uponReceiving('a document GET with id in path and query of search result')
			.withRequest({method: 'get', path: term('/[A-Za-z0-9]+$', '/8234'), query: '', headers: requestHeaders})
			.willRespondWith({
				status: 200,
				headers: responseHeaders,
				body: mockWithResults.hits.hits[0]
			});


		// Commenting this out for now, not sure if we'll actually need it
		// Get form instance from form context and instance id
		/*mockService
		 .given('a form context id and an instance id')
		 .uponReceiving('a GET request with a valid id for both')
		 .withRequest('get', term(wrapRegex(guidRegex + guidRegex), '/' + contextId + '/' + instanceId), requestHeaders)
		 .willRespondWith({
		 status: 200,
		 headers: responseHeaders,
		 body: mock
		 });

		 // Save form in progress
		 mockService
		 .given('a form context id and an instance id')
		 .uponReceiving('a PUT request with a form json')
		 .withRequest('put', term(wrapRegex(guidRegex + guidRegex), '/' + contextId + '/' + instanceId), jsonRequestHeaders, somethingLike(saveMock))
		 .willRespondWith({
		 status: 200
		 });

		 // Submit form
		 mockService
		 .given('a form context id and an instance id')
		 .uponReceiving('a POST request with a form json')
		 .withRequest('post', term(wrapRegex(guidRegex + guidRegex), '/' + contextId + '/' + instanceId), jsonRequestHeaders, somethingLike(saveMock))
		 .willRespondWith({
		 status: 200
		 });*/


		done();
	});
};
