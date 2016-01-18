(function() {
  
  var app=angular.module('myApp');
  
  app.controller( 'inputCtrl', ['$scope','$routeParams','$http', 'ngTableParams', '$filter', function($scope,$routeParams, $http, ngTableParams, $filter){//,'$http', '$resource','NgTableParams','$filter', '$timeout',function($scope,$routeParams, $http, $resource, NgTableParams, $filter, $timeout){
  	$scope.symbol = "aapl";
  	
  	$scope.getPrices = function () {
  		
  		console.log( $scope.symbol );	
  		$http.get( '/getPrices/:'+$scope.symbol ).success( function (response) {
  			console.log( response );
  		});
  	}
  	
  	var data = [{name: "Moroni", age: 50,add:{coun:'USA',state:'sd'}},
                {name: "Tiancum", age: 43,add:{coun:'UK',state:'sda'}},
               ];
  	
  	 $scope.columns = [
          { title: 'Name', field: 'name', visible: true, filter: { 'name': 'text' } },
          { title: 'Age', field: 'age', visible: true },
          { title: 'country', field: 'add', visible: true,subfield:'coun' }
      ];
      $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: {
              name: 'M'       // initial filter
          }
      }, {
          total: data.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var orderedData = params.sorting() ?
                      $filter('orderBy')(data, params.orderBy()) :
                      data;

              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
      });
  
  }]);
})();