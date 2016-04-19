var debug = require('debug')('index');
var moment = require('moment')
var express = require('express');
var router = express.Router();
var pfgen = require('./pfGeneration' );

var yahooFinance = require('yahoo-finance');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Point & Figure' });
});

router.get('/getPrices/:symbol', function(req, res, next) {
	
	var ticker = req.params.symbol.substring(1);
	var dToday = new Date();
	var sToday = moment( dToday ).format( "YYYY-MM-DD" );
	var sLastYear = moment().subtract(1,'year').format( "YYYY-MM-DD" );
	
	config = { symbol: ticker,
						from: sLastYear,
						to: sToday 
						// period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
						};
						
	console.log( config );
	
	yahooFinance.historical(config
	  
	, function (err, quotes) {
	  //...
	  debug( "yahooFinance" );
	  if( err ){ debug( err) ; }
	  //quotes.forEach( function (item) { console.log( item ) } );
	  //console.log( quotes.toString() );
	  var pf = new pfgen();
	  var pfData = pf.parsePrices( quotes );
	  debug( pfData );
	  
	  res.writeHead( 200, { 'content-type':'x-application/json'});
	  res.end( JSON.stringify( pfData ) );
	  
	});
	
	/*yahooFinance.snapshot({
		  symbol: 'AAPL',
		  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
		}, function (err, snapshot) {
		  //...
		});*/
  
});

module.exports = router;
