angular.module('pageup.search-service', [
		'codinghitchhiker.restate',
		'pageup.saved-queries-service'
	])
	.service('SearchService', function ($location, Restate, api, $q, SavedQueriesService) {
		function SearchService() {
			this.query = $location.search().q;
			this.results = [];
			this.total = 0;
			this.time = 0;
			this.size = 50;
			this.page = 0;
			this.recents = SavedQueriesService.fetchQueries();

			var match;
			if (match = /.*\.(dc\d)\.pageuppeople\.com$/.exec($location.host())) {
				api.url = 'https://scout-api.' + match[1] + '.pageuppeople.com';
			} else if (!api.url) {
				api.url = "https://scout-api.dc0.pageuppeople.com"
			}

			Restate.baseUrl(api.url);
		}

		var scriptDomain = 'https://ui.pageuppeople.com';

		function getScriptDomain() {
			if(!scriptDomain) {
				var scripts = document.getElementsByTagName('script');
				for(var i = scripts.length-1; i>0 ; i--) {
					var matches =  scripts[i].src.match(/^(http:|https:).*pageuppeople.com/i);
					if(matches) {
						scriptDomain = matches[0];
						break;
					}
				}
				scriptDomain = '';
			}

			return scriptDomain;
		}

		function call(query, size, from) {
			var deferred = $q.defer();
			if (query) {

				// TODO: fix this query logic
				var boolObj = {
					"query": {
						"bool": {
							"must": [],
							"should": []
						}
					}
				};

				var match = /location:(\w*)/.exec(query);
				if (match && match[1]) {
					boolObj.query.bool.should.push({
						"multi_match": {
							"query": match[1],
							"fields": ["country", "state", "postcode", "street1", "street2", "suburb"]
						}
					});

					query = query.replace(match[0], ''); // Removing matched regex from full text
				}

				if (query.length !== 0) {
					boolObj.query.bool.must.push({
						"multi_match": {
							"query": query,
							"fields": ["firstName", "lastName", "email", "phone1", "phone2", "phone3", "experience.company", "experience.role"],
							"boost": 2
						}
					});
				}

				return Restate.create('search', '_search').$get({
					q: query,
					size: size,
					from: from
				}).then((function (data) {
					var results = data.hits.hits;
					angular.forEach(results, function (val) {
						// ignore some of the results so no picture appears
						if (!val._source.image) {
							if(val._source.gender) {
								val._source.gender = val._source.gender.toUpperCase();
							}
							switch(val._source.gender) {
								case 'M':
									val._source.image = '/scout/assets/male.png';
									break;
								case 'F':
									val._source.image = '/scout/assets/female.png';
									break;
								default:
									val._source.image = '/scout/assets/person.png';
									break;
							}
							val._source.image = getScriptDomain() + val._source.image;
						}
						if (val._source.social) {
							for (var i = val._source.social.length - 1; i >= 0; i--) {
								if (!/Facebook|LinkedIn/.test(val._source.social[i].title)) {
									val._source.social.splice(i, 1);
								}
							}
						}
					});
					return data;
				}).bind(this));
			}

			deferred.reject(null);
			return deferred.promise;
		}

		SearchService.prototype.search = function (query) {
			console.log('SearchService.search invoked.');
			query = query && query.length !== 0 ? query : null; // Query must be non-empty or return null
			$location.search('q', query); // Set query within URL params
			this.query = query;

			// Call service to get search results
			return call(query, this.size, this.page * this.size)
				.then((function (data) {
					if (data) {
						this.total = data.hits.total;
						this.time = data.took;
						this.results = data.hits.hits;

						// If the query produced results, save it so the user can repeat the search without typing it in.
						if (this.results && this.results.length !== 0) {
							SavedQueriesService.saveQuery(this.query, {q: this.query});
							this.recents = SavedQueriesService.fetchQueries();
						}
					}
					return this.results;
				})
				.bind(this));
		};

		SearchService.prototype.next = function () {
			this.page++;
			return call(this.query, this.size, this.page * this.size)
				.then((function (data) {
					if (data) {
						this.total = data.hits.total;
						this.time = data.took;
						this.results.push.apply(this.results, data.hits.hits);
					}

					return this.results;
				}).bind(this));
		};

		SearchService.prototype.previous = function () {

		};

		return new SearchService();
	});