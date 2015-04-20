var util = require('util');
var os = require('os');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var express = require('express');
var router = express.Router();

var configService 	 = require( path.join( __dirname, '..', 'devcon', 'configService.js' ));
var executionService = require( path.join( __dirname, '..', 'devcon', 'executionService.js' ));
var monitoringService = require( path.join( __dirname, '..', 'devcon', 'monitoringService.js' ));


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
		tasks:
		[
			{ name : "Add actions", progress: 95 },
			{ name : "Add links",   progress: 100 },
			{ name : "Add hosts monitoring",  progress:  15 },
			{ name : "Add system monitoring", progress:   0 },
			{ name : "Add proc monitoring",   progress:   1 },
			{ name : "Add files monitoring",  progress:   0 },
			{ name : "Edit configurations",  progress:   0 }
		],
		data : configService.getCachedActionSync(),
		error: null // new Error('Danger alert preview. This alert is dismissable. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.');
	};
	
	monitoringService.setMonitoredResources( 
		configService.getCachedActionSync().monitoring_url, 
		monitoringService.processor );
	
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
