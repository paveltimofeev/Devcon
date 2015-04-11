var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs');

module.exports.executeAction = function( actionConfig ){
	
	var relPath = path.join( __dirname, '..', actionConfig.cmd );
	fs.exists( relPath, function( exists ) { 
	  
		var options = { cwd : path.join( __dirname, '..') };
		var command = exists ? relPath : actionConfig.cmd;
		
		console.log( 'execute [%s] : %s', actionConfig.name, actionConfig.cmd );
		var child = exec( command, options);
	});
}
