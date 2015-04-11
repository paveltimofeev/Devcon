var _ = require('underscore');
require('waitjs');

var monitoredResources = [];
var monitorInterval = '10s';

repeat( monitorInterval, function() {
	
    _.each( monitoredResources, function( res ){
		
		if( res.processor )
			res.processor( res.resource );
	});	
}, true );


function addMonitoredResource( res, proc ) {
	
	monitoredResources.push( 
		{ 
			resource : res, 
			processor: proc 
		});
}

module.exports.setMonitoredResources = function( resources, processor ) {
	
	console.log( 'set resources: %d', resources.length );

	monitoredResources = [];
	
	_.each( resources, function( resource ){
		addMonitoredResource( resource, processor );
	});
};
