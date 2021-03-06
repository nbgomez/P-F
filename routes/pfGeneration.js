var debug = require('debug')('pfgen');
var fs = require('fs');
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
var upperLevels = [ 0, 0.25, 		1, 			5, 		20, 100, 200, 500, 1000, 25000, 1000000 ];//should never get here
var increments = [ 	0.0625, 	0.125, 	0.25, 0.5, 1, 	2, 	4, 		5, 		50];

var getBox = function(  value ) {

  var index = upperLevels.length-1;
  //debug( index );
  while( value < upperLevels[index] ){
    index --;
    //debug( index, upperLevels[index] );
  };

  var iCount = 0;
  while( value > upperLevels[index] + iCount * increments[index] ){
    debug( "while", index, iCount, increments[index] );
    iCount ++;
  };
  iCount --;

  debug( "getBox", value, index,iCount, upperLevels[index] + iCount * increments[index] );

  return upperLevels[index] + iCount * increments[index];

};

var getIncrement = function (value){

	var index = 0;
	var check = function( value ){
		//debug( index,value, upperLevels[index] );
		if( value < upperLevels[index] ){
			//debug( "found");
      return { "base":upperLevels[index-1], "increment":increments[index], "nextBase":upperLevels[index] };
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

	 return{ "lower": curBase, "upper":upperLimit, "base":configValues.base, "increment":configValues.increment, "nextBase":configValues.nextBase };
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
	var nextBase;
	var startPrice;
	var dir = 0;

	this.fnc = initialLimits;
	this.fs = "./pflog.log";
	fs.open( this.fs , 'w', function (err,fd) {} );

	function initialLimits ( price ){
		var limits = getLimits( price.close );
		//debug("initial limits", getLimits( price.close ));


		fs.appendFile( this.fs, "Initial " + price.close + JSON.stringify( limits ) + "\n" , function (err, fd) {} );

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

		fs.appendFile( this.fs, "unknown " + price.close + uuLimit +" " + llLimit + "\n" , function (err, fd) {} );

		if( price.close >= uuLimit ){
			//console.log( "unknown", uuLimit );

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
			curSeries = { 'start': lLimit+increment , 'count': 3 };
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

	this.getReversalDistance = function ( quote ){

		//debug( quote.close );
		var limits = getLimits( quote.close );

    var reversals = {};

    if( limits.base > (limits.lower - limits.increment*4) ){
    	//debug( "4x", quote.close );
    	if( limits.base > (limits.lower - limits.increment *3) ){
      	//debug( "3x" );
      	if( limits.base > (limits.lower - limits.increment*2 ) ){
        	//debug( "2x" );
        	var tempLimits = getLimits( limits.lower - limits.increment*2 -.01);
        	reversals.downward = limits.lower - limits.increment - tempLimits.increment*2;

				}
				else {
					var tempLimits = getLimits( limits.lower - limits.increment*2 -.01);
					//debug( Math.floor( quote.close ), tempLimits );
					reversals.downward = limits.lower - limits.increment*2 - tempLimits.increment*2;
				}

      }
      else {

      	var tempLimits = getLimits( limits.lower - limits.increment*3 - .01);
      	//debug( "23",tempLimits );
				reversals.downward = limits.lower - limits.increment*3  - tempLimits.increment;

				//debug( Math.floor( quote.close ), limits.increment*3, tempLimits.increment );

			}
    }
    else{
      //debug( limits, limits.lower, limits.lower - limits.increment*4 );
			reversals.downward = limits.lower - limits.increment*4 ;

    }

		//debug (limits);
		if( limits.nextBase < (limits.lower + limits.increment*3)){
			if( limits.nextBase < (limits.lower + limits.increment * 2 ) ){
				if( limits.nextBase < (limits.lower + limits.increment ) ) {

					var tempLimits = getLimits( limits.lower + limits.increment );
					//debug( limits );
					//debug( tempLimits );
					reversals.upward = limits.lower + limits.increment + tempLimits.increment*2;

				}
				else {

					var tempLimits = getLimits( limits.lower + limits.increment );
					//debug( limits );
					//debug( tempLimits );
					reversals.upward = limits.lower + limits.increment + tempLimits.increment*2;

				}
			}
			else {

				var tempLimits = getLimits( limits.lower + limits.increment*2 );
					//debug( limits );
					//debug( tempLimits );
					reversals.upward = limits.lower + limits.increment*2 + tempLimits.increment;

			}

		}
		else{
			//debug( limits );
			//debug( limits.lower + limits.increment*3 );
			reversals.upward = (limits.lower + limits.increment*3);
		}

    //debug( "reversal", reversals );
    return reversals;
  };

	this.pfFunction = initialLimits;
};

pfGen.prototype.parsePrices = function(quotes){
	var self = this;
	quotes.forEach( function( val){
		//debug( val );
  	self.pfFunction( val );
  });

  return this.chartData;
};

pfGen.prototype.isInBox = function( quote, boxPrice ){

  var curBox = getBox( quote.close );

  return curBox == boxPrice;
};


module.exports = pfGen;
