var _ = require('underscore');
require('waitjs');

var monitoredResources = [];
var monitorInterval = '1s';

var _monitoredResourceIndex = 0;




repeat( monitorInterval, function() {
	
	if(monitoredResources.length > 0)
	{
		_monitoredResourceIndex++;
		if(_monitoredResourceIndex >= monitoredResources.length)
			_monitoredResourceIndex = 0;
		
		var res = monitoredResources[ _monitoredResourceIndex ];
		if( res.processor )
			res.processor( res.resource );
	}
	
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
