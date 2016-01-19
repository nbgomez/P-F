(function() {
  
  var app=angular.module('myApp');
  
  app.controller( 'inputCtrl', ['$scope','$routeParams','$http', 'ngTableParams', '$filter', function($scope,$routeParams, $http, ngTableParams, $filter){//,'$http', '$resource','NgTableParams','$filter', '$timeout',function($scope,$routeParams, $http, $resource, NgTableParams, $filter, $timeout){
  	$scope.symbol = "aapl";
		
		var chartData = [];
		var curSeries;
		var uLimit = -1;
		var uuLimit = uLimit
		var lLimit = 10000;
		var llLimit = lLimit;
		var startPrice;
		var dir = 0;
		function initialLimits ( price ){
			
			uLimit = Math.ceil( price.close );
			lLimit = Math.floor( price.close );
			startPrice = lLimit;
			
			uuLimit = uLimit + 3;
			llLimit = lLimit - 1;
			console.log( "initialLimits" );
			pfFunction = unknown;
			
		};
		function unknown( price ){
			console.log( "unkown", price.close );
			if( price.close > uuLimit ){
				curSeries = { 'start': startPrice, 'count': 3 };
				uLimit = uLimit + 1;
				llimit = uLimit - 4;
				pfFunction = upward;
			}
			else if( price.close < llLimit ) {
				curSeries = {start:startPrice, count: -3 };
				lLimit = lLimit + 1;
				uuLimit = lLimit + 4;
				pfFunction = downward;
			}
		}
		
		function downward( price ){
			
			if(price.close < lLimit ){
				lLimit--;
				uuLimit = lLimit + 4;
				curSeries.count--;
				debug("down", price.close, curSeries );
			}
			else if ( price.close > uuLimit ) {
				debug( curSeries );
				chartData.push( curSeries )
				curSeries = { 'start': lLimit , 'count': 3 };
				uLimit = Math.ceil(price.close );
				llLimit = uLimit-4;
				pfFunction = upward;
			}
			
		}
		
		function upward( price ){
			
			if(price.close > uLimit ){
				uLimit++;
				llLimit = uLimit - 4;
				curSeries.count++;
				debug( curSeries );
				debug("down", price.close, curSeries );
			}
			else if ( price.close < lLimit ) {
				debug( curSeries );
				chartData.push( curSeries )
				curSeries = { 'start': uLimit -1, 'count': -3 };
				lLimit = Math.floor(price.close );
				uuLimit = lLimit+4;
				pfFunction = downward;
			}
			
		}
		
  	var pfFunction = initialLimits;
  	
  	$scope.getPrices = function () {
  		
  		//console.log( $scope.symbol );	
  		$http.get( '/getPrices/:'+$scope.symbol ).success( function (response) {
  			response.forEach( function( val){ 
  			pfFunction( val ); 
  			});
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