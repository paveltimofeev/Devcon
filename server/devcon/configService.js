var glob = require('glob');
var path = require('path');
var _ = require('underscore');
var jf = require('jsonfile')

var config_folder = __dirname;
var config_pattern = '**/*.json';
var cached_config = null;

function createAction( filepath, cb ){
	
	var obj = jf.readFileSync( filepath );
	var folders = path.dirname( path.join( '..', filepath )).split( path.sep );
	var type = folders[ folders.length - 1 ];
	
	cb( type, obj );
}

module.exports.getCachedActionSync = function(){
	
	return cached_config;
};

module.exports.findCachedAction = function( name, cb ){
	
	var foundconfig = _.find( cached_config.actions, function( action ){
		
		return action.name == name;
	});
	
	console.log( 'found: %j', foundconfig );	
			
	cb( !foundconfig ?  new Error( name + ' not found' ) : null, foundconfig );
};

module.exports.setMonitoringUrlState = function( name, status, color, responseTime, changedCallback){
	
	for(var i=0;i<cached_config.monitoring_url.length;i++)
	{
		if( cached_config.monitoring_url[i].name === name )
		{
			var hasChanges = false;

			if( cached_config.monitoring_url[i].state != color | cached_config.monitoring_url[i].status != status )
				hasChanges = true;
			
			cached_config.monitoring_url[i].state = color;
			cached_config.monitoring_url[i].status = status;
			cached_config.monitoring_url[i].responseTime = responseTime;
			
			if( changedCallback && hasChanges )
				changedCallback( name );
		}
	}
};

module.exports.init = function ( folder, pattern ){

	config_folder  = folder;
	config_pattern = pattern;
};

module.exports.getActions = function ( ){
	
	glob( config_pattern, { cwd: config_folder }, function ( err, files ){

		var data = [];
			
		for( var i=0; i<files.length; i++ ){
			
			createAction( path.join( config_folder, files[i] ), function( type, obj ){
				
				if( ! data[ type ])
					data[ type ] = [];
				
				data[ type ].push( obj );
			});
		}
		
		cached_config = data;
	});	
};
