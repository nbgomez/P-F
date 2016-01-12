var express = require('express');
var router = express.Router();

var yahooFinance = require('yahoo-finance');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function(req, res, next) {
	
	yahooFinance.historical({
	  symbol: 'AAPL',
	  from: '2012-01-01',
	  to: '2012-12-31',
	  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
	}, function (err, quotes) {
	  //...
	  console.log( quotes.toString() );
	  res.render('helloworld', { title: 'Hello world!', 'quotes':quotes });
	});
	
	/*yahooFinance.snapshot({
		  symbol: 'AAPL',
		  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
		}, function (err, snapshot) {
		  //...
		});*/
  
});

module.exports = router;
