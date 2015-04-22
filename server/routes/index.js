var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var info = [

        "process.env.DEV   :" + process.env.DEV,
        "process.env.PORT  :" + process.env.PORT,
        "process.env.DEBUG :" + process.env.DEBUG
    ];
    
    
  res.render('index', { title: 'Express', info: info });
});

module.exports = router;
