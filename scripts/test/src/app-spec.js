'use strict';
define(['app','angularRoute','babelPolyfill'],function(app,angularRoute, babelPolyfill){
	describe("weather predictor", function(){
		beforeEach(module('WeatherPrediction'));

		var $controller,controller;
		var $scope = {};

		beforeEach(inject(function(_$controller_){
		    $controller = _$controller_;
		    controller = $controller('AppController', { $scope: $scope });
		}));

        describe('Weather Predictor', function() {
		    it('on page load input value should be null', function() {
		      	controller.app.processInput();
		      	expect(controller.search.input).toBeNull();
		    });

		    it('minimum length of the input should be three characaters', function(){
		    	controller.search.input="12";
		    	var res = controller.app.processInput();
		    	expect(res.valid).toBe(false);
		    });

		    it('should not accept special characaters', function(){
		    	controller.search.input = "@@@";
		    	var res = controller.app.processInput();
		    	expect(res.valid).toBe(false);
		    });

		    it('should return location url', function(){
		    	controller.search.input = "texas";
		    	var res = controller.app.getWeatherInformation();
		    	expect(res).toMatch(/[?q=]/);
		    });

		    it('should return zip code url', function(){
		    	controller.search.input = "99999";
		    	var res = controller.app.getWeatherInformation();
		    	expect(res).toMatch(/[?zip=]/);
		    });

		    it('function should give an error', function(){
		    	controller.search.input = "00000";
		    	var res = controller.app.getWeatherInformation();
		    	expect(controller.search.output).toBeNull();
		    });
		});
	});
});
