var _ = require('underscore');
var util = require('util');
var request = require('request');
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


module.exports.processor = function( resource ){ 
			
			request.head(resource.url, function( err, res, body ){
				
				if( err ){
					
					configService.setMonitoringUrlState( resource.name, err.code, 'red', 0 , function(){
						///rpc
					});
					util.log( '[Monitoring] ' + err.code + ' ' + resource.name );
				}
				
				if( res ){
					
					console.log( res );
					
					configService.setMonitoringUrlState( resource.name, 'STATUS ' + res.statusCode,  res.statusCode == 200 ? 'green' : 'yellow', 75, function(){
						///rpc
					});
					util.log( '[Monitoring] ' + res.statusCode + ' ' + resource.name );
				}
			});
};
