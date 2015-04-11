var os = require('os');
var path = require('path');
var _ = require('underscore');
var express = require('express');
var router = express.Router();

var configService 	 = require( path.join( __dirname, '..', 'devcon', 'configService.js' ));
var executionService = require( path.join( __dirname, '..', 'devcon', 'executionService.js' ));

configService.init( path.join( __dirname, '..', 'configurations' ), '**/*.json' );
configService.getActions();	

var view = 'devcon';



router.get('/', function( req, res, next ){
	
	var viewModel = 
	{ 
		title: 'Developer console', 
		host : os.hostname(),
		messages:[],
		notifications:[],
		tasks:[],
		data : configService.getCachedActionSync() 
	};
	
	/* immitation of resonse time */
	for(var i=0;i<viewModel.data.monitoring_url.length;i++){
		viewModel.data.monitoring_url[i].responseTime = _.random( 100 ); 
	}
	
	res.render( view, viewModel );
});

router.get('/refresh/', function( req, res, next ){
	
	configService.getActions();	
	res.redirect( '/devcon' );
});

router.get('/edit/:config', function( req, res, next ){
	
	var config = req.params.config;
	console.log( 'edit:' + config );
	res.redirect( '/devcon' );
});

router.post('/run/:act', function( req, res, next ){

	var act_name = req.params.act;
	console.log( 'run:' + act_name );
	
	configService.findCachedAction( act_name, function(err, action ){
		
		if( err ){
			
			console.error( err );
			res.redirect( '/devcon' );
		}
		else {
			
			executionService.executeAction( action );
			res.redirect( '/devcon' );
		}
	});
});


module.exports = router;
