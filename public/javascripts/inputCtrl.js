(function() {
  
  var app=angular.module('myApp');
  
  app.controller( 'inputCtrl', ['$scope','$routeParams','$http', function($scope,$routeParams, $http){//,'$http', '$resource','NgTableParams','$filter', '$timeout',function($scope,$routeParams, $http, $resource, NgTableParams, $filter, $timeout){
  	$scope.symbol = "aapl";
  	
  	$scope.getPrices = function () {
  		
  		console.log( $scope.symbol );	
  		$http.get( '/getPrices/:'+$scope.symbol ).success( function (response) {
  			console.log( response );
  		});
  	}
  	
  	
  
  }]);
})();