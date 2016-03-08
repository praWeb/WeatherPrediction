define(['babelPolyfill',"moment","momentTimezone","momentUtil","approuter"], function(babelPolyfill,moment,momentTimezone,momentUtil,approuter){

	var app = angular.module("WeatherPrediction", ["routes"]);

	app.controller("AppController",function($scope){
		let wp = this;
		wp.search={
			"input": null,
			"output" : null,
			"fetching" : false,
			"service":{
				"issue" : false,
				"message" : null
			}
		};
		class AppController{
			constructor(){
				wp.search.service.message = null;
				wp.search.service.issue = false;
			}

		}

		wp.app = new AppController();
	   	
 		let generator = {};

 		AppController.prototype.wrapperOnFetch = (url) =>{
 			var headers = new Headers();
			headers.append('Accept', 'application/json');
			var request = new Request(url, {headers: headers});
			return fetch(request).then(function(res){
			    return res.json();
			});
 		}
	    AppController.prototype.processInput = function(){
	    	var check = /^[a-zA-Z][a-zA-Z ]+$/.test(wp.search.input);
	    	if(check){
	    		return{
	    			"keyName" : "q",
	    			"keyValue" : wp.search.input,
	    			"location" : true,
	    			"valid" 	: true
	    		}
	    	}else{
	    		var test  = /^([0-9]{5})(?:[-\s]*([0-9]{4}))?$/.test(wp.search.input);
	    		return{
	    			"keyName" : "zip",
	    			"keyValue" : wp.search.input,
	    			"location" : false,
	    			"valid"		: test
	    		}
	    	}
	    }

	    AppController.prototype.getDetails = function* (url){
	    	yield wp.app.wrapperOnFetch(url);
	    }

	    AppController.prototype.handleError = (state, message) =>{
	    	wp.search.service.message = message;
			wp.search.service.issue = state;
	    }

		AppController.prototype.getWeatherInformation = () => {
			wp.app.handleError(false,null);
			wp.search.fetching = true;
			let keyInfo = wp.app.processInput();
			let baseUrl = null;
			console.debug(keyInfo);
			if(!keyInfo.valid ){
				//handle error condition
				wp.search.fetching = false;
				wp.search.output = null;
				wp.app.handleError(true,"Please check the input. It seems an invalid postcode.");
				wp.search.service.issue = true;
			}else{
				baseUrl = "http://api.openweathermap.org/data/2.5/weather?"+keyInfo.keyName+'='+keyInfo.keyValue+',us&type=accurate&units=metric&appid=44db6a862fba0b067b1930da0d769e98';
				wp.app.fetchDetails(baseUrl);
			}
			return baseUrl;
		}

	    AppController.prototype.fetchDetails = (url) =>{
	    	wp.search.output = null;
	    	wp.search.fetching = true;
	    	generator = wp.app.getDetails(url);
	    	generator.next().value.then((userData) => {
			  //Update UI
			  	wp.search.fetching = false;
			  	
			  	if(userData.cod!==200){
			  		wp.app.handleError(true, userData.message);
			  		wp.search.output = null;
			  	}else{
			  		wp.search.output = userData;
			  		wp.app.handleError(false, null);
			  	}
			  	$scope.$apply();
			    return userData;
			});
	    }
	    return wp;
	});

	app.filter("dateFormat", function(){
		return function(date){
			if(date){
				var moments = moment.tz(date*1000, "America/New_York").format('hh:mm a');
				date = moments;
			}
			return date;
		}
	});

	app.service("AppService", function(){

	});
  	return app;
});


