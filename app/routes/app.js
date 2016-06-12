var express = require('express');

module.exports = function(connection, models) {
  var router = express.Router();

  router.get('/', function(req, res, next){
    var title = 'Home'
    // res.redirect('/dashboards');
    res.render('../views/app/index', {
      title: title
    });


  });

  return(router);
}