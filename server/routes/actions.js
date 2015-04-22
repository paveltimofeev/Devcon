var util = require('util');
var os = require('os');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var express = require('express');
var router = express.Router();

var devcon = path.join( __dirname, '..', 'devcon');
var configService 	  = require( path.join( devcon, 'configService.js' ));
var executionService  = require( path.join( devcon, 'executionService.js' ));
var monitoringService = require( path.join( devcon, 'monitoringService.js' ));
var taskService       = require( path.join( devcon, 'taskService.js' ));
var u                 = require( path.join( devcon, 'utility.js' ));


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
		tasks: taskService.getTasks(),
		data : configService.getCachedActionSync(),
		error: null // new Error('Danger alert preview. This alert is dismissable. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.');
	};
	
	monitoringService.setMonitoredResources( 
		configService.getCachedActionSync().monitoring_url,
        function( resource ){

            request.head(resource.url, function( err, res, body ){

                if( err ){

                    configService.setMonitoringUrlState( resource.name, err.code, 'red', 0 , function(){
                        ///rpc
                    });
                    util.log( '[Monitoring] ' + err.code + ' ' + resource.name );
                }

                if( res ){

                    configService.setMonitoringUrlState( resource.name, 'STATUS ' + res.statusCode,  res.statusCode == 200 ? 'green' : 'yellow', 75, function(){
                        ///rpc
                    });
                    util.log( '[Monitoring] ' + res.statusCode + ' ' + resource.name );
                }
            });
        }
    );

    u.response( res, view, viewModel);
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
