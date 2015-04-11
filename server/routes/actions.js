var express = require('express');
var router = express.Router();

var glob = require('glob');
var path = require('path');
var _ = require('underscore');
var jf = require('jsonfile')
var exec = require('child_process').exec;
var fs = require('fs');

var cached_config = null;
var config_folder = path.join(__dirname, '..', 'configurations');
var config_pattern = '**/*.json';


function createAction( filepath, cb ){
	
	var obj = jf.readFileSync( filepath );
	var folders = path.dirname( path.join( '..', filepath )).split( path.sep );
	var type = folders[ folders.length-1 ];
	
	cb( type, obj );
}

function getAction( cb ){
	

	glob( config_pattern, { cwd: config_folder }, function ( err, files ) {

		var data = [];
			
		for( var i=0; i<files.length; i++ ){
			
			createAction( path.join( config_folder, files[i] ), function( type, obj ){
				
				if( ! data[ type ])
					data[ type ] = [];
				
				data[ type ].push( obj );
			});
		}
		
		cb( err, data );
	});	
}

router.get('/', function( req, res, next ){
	
	res.render( 'actions', { title: "Loaded actions", data: cached_config } );
});

router.post('/run/:act', function( req, res, next ){

	var act = req.params.act;
	
	var actionConfig = _.find( cached_config.actions, function( action ){
		
		return action.name == act;
	});
	
	console.log( 'act:' + act );
	console.log( 'name:' + actionConfig.name );
	console.log( 'cmd :' + actionConfig.cmd );
	
	var relPath = path.join( __dirname, '..', actionConfig.cmd );
	fs.exists( relPath, function( exists ) { 
	  
		var options = { cwd : path.join( __dirname, '..') };
		var command = exists ? relPath : actionConfig.cmd;
		
		console.log( 'exec:' + command);
		var child = exec( command, options);
		res.redirect( '/actions' );
	}); 
});


getAction( function( err, data ){ cached_config = data; } );

module.exports = router;
