var debug = require("debug")('pfTest');
var assert = require('assert');
var pfgen = require('../routes/pfGeneration.js');

describe( "pfgenerator", function(){
	
	it( "test 1", function () {

		var pf = new pfgen();
		
		var quotes = [ {"close":25} ];
		var parsed = pf.parsePrices( quotes );
		debug( parsed );	
		assert.equal( true, true );

		var limits = pf.fnc( {"close":25 } );
		//debug( limits );
		assert.equal( limits.lower, 25 );
		assert.equal( limits.upper,26 );
		assert.equal( limits.base, 20 );
		assert.equal( limits.increment, 1 );
		
		limits = pf.fnc( {"close":125 } );
		//debug( limits );
		assert.equal( limits.lower, 124 );
		assert.equal( limits.upper,126 );
		assert.equal( limits.base, 100 );
		assert.equal( limits.increment, 2 );
		
		limits = pf.fnc( {"close":0.12 } );
		//debug( limits );
		assert.equal( limits.increment, 0.0625 );
		assert.equal( limits.lower, 0.0625 );
		assert.equal( limits.upper,0.125 );
		assert.equal( limits.base, 0 );
		
		limits = pf.fnc( {"close":0.38 } );
		//debug( limits );
		assert.equal( limits.increment, 0.125 );
		assert.equal( limits.lower, 0.375 );
		assert.equal( limits.upper,0.5 );
		assert.equal( limits.base, 0.25 );
		
		limits = pf.fnc( {"close":1.27 } );
		//debug( limits );
		assert.equal( limits.increment, 0.25 );
		assert.equal( limits.lower, 1.25 );
		assert.equal( limits.upper,1.5 );
		assert.equal( limits.base, 1 );
		
		limits = pf.fnc( {"close":5 } );
		//debug( limits );
		assert.equal( limits.increment, 0.5 );
		assert.equal( limits.lower, 5 );
		assert.equal( limits.upper,5.5 );
		assert.equal( limits.base, 5 );
		
	});
});