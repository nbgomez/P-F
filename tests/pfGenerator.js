var debug = require("debug")('pfTest');
var assert = require('assert');
var pfgen = require('../routes/pfGeneration.js');

describe( "pfgenerator", function(){

	it( "initialLimits", function () {

		var pf = new pfgen();

		var quotes = [ {"close":25} ];
		var parsed = pf.parsePrices( quotes );
		//debug( parsed );
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

		limits = pf.fnc( {"close":200 } );
		//debug( limits );
		assert.equal( limits.lower, 200 );
		assert.equal( limits.upper,204 );
		assert.equal( limits.base, 200 );
		assert.equal( limits.increment, 4 );

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

	it( "unknown", function () {

		var pf = new pfgen();

		var quotes = [ {"close":25} ];
		//var parsed = pf.parsePrices( quotes );
		var limits = pf.fnc( {"close":25 } );

		var unk = pf.unk( {"close":21 } );
		//debug( unk );
		assert.equal( unk.lLimit, 20 );
		assert.equal( unk.uuLimit, 23 );

		limits = pf.fnc( {"close":25} );
		unk = pf.unk( {"close":28});
		assert.equal( 24, unk.llLimit );
		assert.equal( 29, unk.uLimit );

		limits = pf.fnc( {"close":25} );
		unk = pf.unk( {"close":26});
		assert.equal( 22, unk.llLimit );
		assert.equal( 28, unk.uuLimit );

	});

	it( "dwnup", function () {

		var pf = new pfgen();
		var limits = pf.fnc( {"close":25 } );
		var unk = pf.unk( {"close":21 } );
		var dwn = pf.dwn( {"close":20.5} );

		//debug( dwn );
		
		dwn = pf.getReversalDistance( { "close":23.5 });
		assert.equal( 19.5, dwn.downward );
		assert.equal( 26, dwn.upward );
		//debug( "reversal",  dwn );
		
		dwn = pf.getReversalDistance( { "close":22.5 });
		assert.equal( 19.0, dwn.downward );
		//debug( "reversal",  dwn );
		
		dwn = pf.getReversalDistance( { "close":20.5 });
		assert.equal( 18.0, dwn.downward );
		assert.equal( 23, dwn.upward );
		//debug( "reversal",  dwn );
		
		dwn = pf.getReversalDistance( { "close":19.75 });
		assert.equal( 17.50, dwn.downward );
		assert.equal( 22, dwn.upward );
		//debug( "reversal",  dwn );
		
		dwn = pf.getReversalDistance( { "close":19.25 });
		assert.equal( 17.0, dwn.downward );
		assert.equal( 21, dwn.upward );

		//assert.equal( 20, unk.lLimit );
		//assert.equal( 23, unk.uuLimit );

		//dwn= pf.dwn( {"close":19.99 } )
		//assert.equal( 19.5, unk.lLimit );
		//assert.equal( 23, unk.uuLimit );

    
	});
});
