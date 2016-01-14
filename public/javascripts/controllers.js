(function(){

	var myApp = angular.module( "myApp", ['ngRoute']);//'ngRoute', 'nvd3ChartDirectives','ngResource','ngTable','ngSanitize', 'ngCsv', 'ui.bootstrap','angular-loading-bar','nvd3', 'angularjs-datetime-picker', 'ui.bootstrap.datetimepicker' ]);
	
	myApp.config(['$routeProvider',function( $routeProvider ){
    $routeProvider.
    when('/', {
      templateUrl:"/partials/input.html",
      controller:"inputCtrl"
    } ).
    otherwise({
      redirectTo: '/'
    });
  }]);
})();