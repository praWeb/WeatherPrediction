"use strict";

define(['babelPolyfill', "approuter"], function (babelPolyfill, approuter) {

	var app = angular.module("WeatherPrediction", ["routes"]);

	app.controller("AppController", function () {
		var ctrl = this;

		ctrl.data = "prasanna";

		return ctrl;
	});

	return app;
});