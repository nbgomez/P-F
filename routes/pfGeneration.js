var debug = require('debug')('pfgen');
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
var upperLevels = [ 0, 0.25, 		1, 			5, 		20, 100, 200, 500, 1000, 25000 ];
var increments = [ 	0, 0.0625, 	0.125, 	0.25, 0.5, 1, 	2, 	4, 		5, 		50];

var getIncrement = function (value){
	
	var index = 0;
	var check = function( value ){
		//debug( index,value, upperLevels[index] );
		if( value < upperLevels[index] ){
			//debug( "found");
			return { "base":upperLevels[index-1], "increment":increments[index]};
		}
		else {
			index++;
			return check( value );
		}
		
		return check( value );
	}
	
	//debug( "value", value );
	return check( value );
}

var getLimits = function( closePrice ){
	//debug( "getLimits", closePrice );
	 var configValues = getIncrement( closePrice );
	 var curBase = configValues.base, 
	 			upperLimit = curBase+ configValues.increment;
	 			
	 while ( !( (closePrice >= curBase) && (closePrice < upperLimit ) ) ) {
	 		//debug( closePrice, curBase, upperLimit );
	 		curBase = upperLimit;
	 		upperLimit = curBase + configValues.increment;
	 		
	 }
	 
	 return{ "lower": curBase, "upper":upperLimit, "base":configValues.base, "increment":configValues.increment };
};

function pfGen () {
	this.chartData = [];
	var curSeries;
	var uLimit = -1;
	var uuLimit = uLimit
	var lLimit = 10000;
	var llLimit = lLimit;
	var increment;
	var base;
	var startPrice;
	var dir = 0;
	
	this.fnc = initialLimits;
	 
	function initialLimits ( price ){
		var limits = getLimits( price.close );
		debug("initial limits", getLimits( price.close ));
		
		uLimit = limits.upper;
		lLimit = limits.lower;
		startPrice = lLimit;
		uuLimit = uLimit + 2*limits.increment;
		llLimit = lLimit - 3*limits.increment;
		increment = limits.increment;
		base = limits.base;
		//console.log( "initialLimits" );
		this.pfFunction = unknown;
		
		return limits;
		
	};
	
	this.unk = unknown;
	function unknown( price ){
		//console.log( "unkown", price.close );
		
		if( price.close >= uuLimit ){
			console.log( "unknown", uuLimit );
			
			curSeries = { 'start': startPrice, 'count': 3 };
			uLimit = Math.floor(price.close) + increment;
			llLimit = uLimit - increment*5;
			
			this.pfFunction = upward;
		}
		else if( price.close < llLimit ) {
			curSeries = {start:startPrice, count: -3 };
			lLimit = Math.floor(price.close) - increment;
			uuLimit = lLimit + 3*increment;
			this.pfFunction = downward;
		}
		
		return { "llLimit":llLimit, "lLimit":lLimit, "uLimit":uLimit, "uuLimit":uuLimit };
	}

	this.dwn = downward;	
	function downward( price ){
		
		if(price.close < lLimit ){
			lLimit = lLimit-increment;
			uuLimit = lLimit + 4;
			curSeries.count--;
			//debug("down", price.close, curSeries );
		}
		else if ( price.close > uuLimit ) {
			//debug( curSeries );
			this.chartData.push( curSeries )
			curSeries = { 'start': lLimit , 'count': 3 };
			uLimit = Math.ceil(price.close );
			llLimit = uLimit-3*increment;
			this.pfFunction = upward;
		}
	
		return { "llLimit":llLimit, "lLimit":lLimit, "uuLimit":uuLimit, "uLimit":uLimit, "curSeries":curSeries };	
	}
	
	function upward( price ){
		
		if(price.close > uLimit ){
			uLimit = uLimit + increment;
			llLimit = uLimit - 3*increment;
			curSeries.count++;
			//debug( curSeries );
			//debug("down", price.close, curSeries );
		}
		else if ( price.close < lLimit ) {
			//debug( curSeries );
			this.chartData.push( curSeries )
			curSeries = { 'start': uLimit -increment, 'count': -3 };
			lLimit = Math.floor(price.close );
			uuLimit = lLimit+4;
			this.pfFunction = downward;
		}
		
	}
	
	this.pfFunction = initialLimits;
};

pfGen.prototype.parsePrices = function(quotes){
	var self = this;
	quotes.forEach( function( val){ 
		debug( val );
  	self.pfFunction( val );
  });
  
  return this.chartData;
};
  	
module.exports = pfGen;