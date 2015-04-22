

module.exports.response = function( res, viewName, viewModel ){
    
    if( process.env.DEV )
        res.send( viewModel );
    else
        res.render(viewName, viewModel);
};
