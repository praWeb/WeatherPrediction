"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['babelPolyfill', "moment", "momentTimezone", "momentUtil", "approuter"], function (babelPolyfill, moment, momentTimezone, momentUtil, approuter) {

	var app = angular.module("WeatherPrediction", ["routes"]);

	app.controller("AppController", function ($scope) {
		var wp = this;
		wp.search = {
			"input": null,
			"output": null,
			"fetching": false,
			"service": {
				"issue": false,
				"message": null
			}
		};

		var AppController = function AppController() {
			_classCallCheck(this, AppController);

			wp.search.service.message = null;
			wp.search.service.issue = false;
		};

		wp.app = new AppController();

		var generator = {};

		AppController.prototype.wrapperOnFetch = function (url) {
			var headers = new Headers();
			headers.append('Accept', 'application/json');
			var request = new Request(url, { headers: headers });
			return fetch(request).then(function (res) {
				return res.json();
			});
		};
		AppController.prototype.processInput = function () {
			var check = /^[a-zA-Z][a-zA-Z ]+$/.test(wp.search.input);
			if (check) {
				return {
					"keyName": "q",
					"keyValue": wp.search.input,
					"location": true,
					"valid": true
				};
			} else {
				var test = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/.test(wp.search.input);
				return {
					"keyName": "zip",
					"keyValue": wp.search.input,
					"location": false,
					"valid": test
				};
			}
		};

		AppController.prototype.getDetails = regeneratorRuntime.mark(function callee$2$0(url) {
			return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
				while (1) switch (context$3$0.prev = context$3$0.next) {
					case 0:
						context$3$0.next = 2;
						return wp.app.wrapperOnFetch(url);

					case 2:
					case "end":
						return context$3$0.stop();
				}
			}, callee$2$0, this);
		});

		AppController.prototype.handleError = function (state, message) {
			wp.search.service.message = message;
			wp.search.service.issue = state;
		};

		AppController.prototype.getWeatherInformation = function () {
			wp.app.handleError(false, null);
			wp.search.fetching = true;
			var keyInfo = wp.app.processInput();
			var baseUrl = null;
			console.debug(keyInfo);
			if (!keyInfo.valid) {
				//handle error condition
				wp.search.fetching = false;
				wp.search.output = null;
				wp.app.handleError(true, "Please check the input. It seems an invalid postcode.");
				wp.search.service.issue = true;
			} else {
				baseUrl = "http://api.openweathermap.org/data/2.5/weather?" + keyInfo.keyName + '=' + keyInfo.keyValue + ',us&type=accurate&units=metric&appid=44db6a862fba0b067b1930da0d769e98';
				wp.app.fetchDetails(baseUrl);
			}
			return baseUrl;
		};

		AppController.prototype.fetchDetails = function (url) {
			wp.search.output = null;
			wp.search.fetching = true;
			generator = wp.app.getDetails(url);
			generator.next().value.then(function (userData) {
				//Update UI
				wp.search.fetching = false;

				if (userData.cod !== 200) {
					wp.app.handleError(true, userData.message);
					wp.search.output = null;
				} else {
					wp.search.output = userData;
					wp.app.handleError(false, null);
				}
				$scope.$apply();
				return userData;
			});
		};
		return wp;
	});

	app.filter("dateFormat", function () {
		return function (date) {
			if (date) {
				var moments = moment.tz(date * 1000, "America/New_York").format('hh:mm a');
				date = moments;
			}
			return date;
		};
	});

	app.service("AppService", function () {});
	return app;
});