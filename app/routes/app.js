var express = require('express');

module.exports = function(connection, models) {
  var router = express.Router();

  router.get('/', function(req, res, next){
    res.render('../views/app/index', {
     title: 'Leah | Work'
    });
  });

  return(router);
}
