define(['babelPolyfill',"moment","momentTimezone","approuter"], function(babelPolyfill,moment,momentTimezone,approuter){

	/**
	* @ngDoc Module
	* @name WeatherPrediction
	*
	* @description 
	* This is the main module of the application.
	* @returns returns this module refernece
	*/

	var app = angular.module("WeatherPrediction", ["routes"]);
	app.config([
    '$controllerProvider',
    '$compileProvider', 
    '$filterProvider', 
    '$provide',
    function($controllerProvider, $compileProvider, $filterProvider, $provide) {
	      app.controller = $controllerProvider.register;
	      app.directive = $compileProvider.directive;
	      app.filter = $filterProvider.register;
	      app.factory = $provide.factory;
	      app.service = $provide.service;
	     }
	]);

	/**
	* @ngDoc controller
	* @name AppController
	*
	* @description  
	* This is the only controller of this application, 
	* 
	* @returns controller reference will be returned
	*/
	app.controller("AppController",["$scope",function($scope){
		
		let wp = this;
		wp.search={
			"input": null,
			"output" : null,
			"fetching" : false,
			"service":{
				"issue" : false,
				"message" : null,
				"status" : null
			}
		};

		/**
		* @ngDoc class
		* @name AppController
		*
		*/
		class AppController{
			constructor(){
				wp.search.service.message = null;
				wp.search.service.issue = false;
				wp.search.service.status = null;
				wp.search.fetching = false;
			};
		};

		wp.app = new AppController();
	   	
 		let generator = {};
 		/**
		* @ngDoc method
		* @name wrapperOnFetch
		*
		* @description
		* This method will set the headers for the request and will request for the data
		* Once the data is received, it will be converted into json format.
		*
		* @returns request service output will be returned
 		*/
 		AppController.prototype.wrapperOnFetch = (url) =>{
 			var headers = new Headers();
			headers.append('Accept', 'application/json');
			var request = new Request(url, {headers: headers});
			return fetch(request).then(function(res){
			    return res.json();
			});
 		};

 		/**
		* @ngDoc method
		* @name procesInput
		* @description 
		* This method will process the input. It validates the input given by
		* the user and check if it valid or not. 
		* 
		* @returns returns about the validity of input and also the type of the input
		*		   @param {string} keyName url param value for the input. Possible values are "q, zip", for location and zip code respectivelu
		*			@param {string}	keyValue input value given by the user
		*			@param {boolean} location true indicates, input given is a location. false indicates, input given is a zipcode
		*			@param {boolean} valid true indicates, input is a valid one, whereas false indicates input as a not valid one
 		*/
	    AppController.prototype.processInput = function(){
	    	if(wp.search.input==null || wp.search.input==null || wp.search.input.length<4){
	    		return{
	    			"keyName" : "q",
	    			"keyValue" : wp.search.input,
	    			"location" : true,
	    			"valid" 	: false
	    		}
	    	}else{
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
	    };

	    /**
		* @ngDoc method
		* @name getDetails
		* @description
		* This method is a generator function. It requests the wrapperOnFetch() for the data
		* 
		* @param {string} url url of the service which has to be requested.
		*
	    */

	    AppController.prototype.getDetails = function* (url){
	    	yield wp.app.wrapperOnFetch(url);
	    };

	    /**
		* @ngDoc method
		* @name handleError
		* 
		* @description
		* This is a common method which sets the error variables
		*
		* @param {number} status status code of the service. Possible values are 0- invalid input, 404- service error, 200- service success
		* @param {boolean} state true indicates an error, false indicates a success/valid state
		* @param {string} message message which has to be shown to the user
	    */
	    AppController.prototype.handleError = (status,state, message) =>{
	    	wp.search.service.message = message;
			wp.search.service.issue = state;
			wp.search.service.status = status;
	    };

		/**
		* @ngDoc method
		* @name getWeatherInformation
		*
		* @description
		* This is the method to be called from html page to get weather information
		*
		* @returns url to hit the service
		*/	    

		AppController.prototype.getWeatherInformation = () => {
			wp.app.handleError(null,false,null);
			wp.search.fetching = true;
			let keyInfo = wp.app.processInput();
			let baseUrl = null;
			if(!keyInfo.valid){
				//handle error condition
				wp.search.fetching = false;
				wp.search.output = null;
				if(wp.search.input=='' || wp.search.input==null || wp.search.input.length<4){
					wp.app.handleError(0,true,"Search engine is looking for your input.Minimum of four characters are expected");	
				}else{
					wp.app.handleError(0,true,"Please check the input. It seems an invalid postcode.");	
				}
				
				wp.search.service.issue = true;
			}else{
				baseUrl = "http://api.openweathermap.org/data/2.5/weather?"+keyInfo.keyName+'='+keyInfo.keyValue+',us&type=like&units=metric&appid=44db6a862fba0b067b1930da0d769e98';
				wp.app.fetchDetails(baseUrl);
			}
			return baseUrl;
		};


		/**
		* @ngDoc method
		* @name fetchDetails
		*
		* @description
		* This method is being called getWeatherInformation() to get the weather information
		* This method will be using generators to yield the data
		* 
		* @param {string} url service url to fetch the data
		*/
		

	    AppController.prototype.fetchDetails = (url) =>{
	    	wp.search.output = null;
	    	wp.search.fetching = true;
	    	generator = wp.app.getDetails(url);
	    	generator.next().value.then((userData) => {
			  //Update UI
			  	wp.search.fetching = false;
			  	
			  	if(userData.cod!==200){
			  		wp.app.handleError(userData.cod, true, userData.message);
			  		wp.search.output = null;
			  	}else{
			  		wp.search.output = userData;
			  		wp.app.handleError(null,false, null);
			  	}
			  	$scope.$apply();
			    return userData;
			});
	    };
	    return wp;
	}]);


	/**
	* @ngDoc filter
	* @name dateFormat
	* 
	*@description
	* This filter is to set the time to US timezone
	* This filter uses the 'moment.js','moment-timezone-with-data.js' 
	* to convert the unix timestamp to US timezone time
	*
	* @returns time in EST timezone
	*/
	app.filter("dateFormat", function(){
		return function(date){
			if(date){
				var moments = moment.tz(date*1000, "America/New_York").format('hh:mm a');
				date = moments;
			}
			return date;
		}
	});
  	return app;
});


