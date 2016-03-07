routes = angular.module("routes",['ngRoute']);

routes.config(['$routeProvider', function($routeProvider){

$routeProvider.
	/*have to configure controller loading to avoid multiple controll calls*/
	when("/test",{
		"templateUrl" : 'view/home.html',
		"controller" : "AppController"
	}).otherwise({redirectTo:'/test'});

}]);

