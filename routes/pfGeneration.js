/*
Price Range	Box Size
Under 0.25	0.0625
0.25 to 1.00	0.125
1.00 to 5.00	0.25
5.00 to 20.00	0.50
20.00 to 100	1.00
100 to 200	2.00
200 to 500	4.00
500 to 1,000	5.00
1,000 to 25,000	50.00
25,000 and up	500.00*/

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