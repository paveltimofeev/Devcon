var http = require('http');
var util = require('util');

var names = [ 'Ios', 'Pthahi', 'Hora', 'Akrotiri', 'Thira', 'Oia' ];

function argv( index, def ){
	
	return process.argv[ index ] ? process.argv[ index ] : def;
}

function rand( min, max ){
	
	return min + Math.floor( Math.random() * (min + max) );
}

var config = {
		port : argv( 2, 8000 ),
		name : argv( 3, names[ rand( 0, names.length ) ] ),	
		hello: ' is OK',
		responsedelayMin: 10,
		responsedelayMax: 3000,
		responseCode: 200,
		responseFormat : 'text/plain',
	};

http.createServer( function( req, res ){
	
	setTimeout( function(){
		
		util.log( config.name + config.hello );
		res.writeHead( config.responseCode, { 'Content-Type' : config.responseFormat } );
		res.end( config.name + config.hello );
		
	}, rand( config.responsedelayMin, config.responsedelayMax ));
})
	.listen( config.port, '127.0.0.1' );

console.log( 'Stub server %s started at %d port', config.name, config.port );
