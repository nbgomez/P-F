var debug = require('debug')('index');
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
	
	config = { symbol: ticker,
						from: '2014-01-01',
						to: '2016-01-16' 
						// period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
						};
						
	debug( config );
	
	yahooFinance.historical(config
	  
	, function (err, quotes) {
	  //...
	  debug( "yahooFinance" );
	  if( err ){ debug( err) ; }
	  //quotes.forEach( function (item) { console.log( item ) } );
	  //console.log( quotes.toString() );
	  var pf = new pfgen();
	  debug( pf.parsePrices( quotes ) );
	  
	  res.writeHead( 200, { 'content-type':'x-application/json'});
	  res.end( JSON.stringify( quotes ) );
	  
	});
	
	/*yahooFinance.snapshot({
		  symbol: 'AAPL',
		  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
		}, function (err, snapshot) {
		  //...
		});*/
  
});

module.exports = router;
