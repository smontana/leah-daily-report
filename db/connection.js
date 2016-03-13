var db_config = require('./database');
var Sequelize = require('sequelize');
var env = process.env.ENV;



// !!! This rewrites the database !!!
// sequelize.sync();

// module.exports = function(logging) {
//   logging = typeof logging !== 'undefined' ? logging : true;
//   var sequelize = new Sequelize(db_config[env].database
//     , db_config[env].user
//     , db_config[env].password
//     , {host: db_config[env].host, logging: logging});
//   return sequelize
// }


var sequelize = new Sequelize(db_config[env].database, db_config[env].user, db_config[env].password, {host: db_config[env].host});

module.exports = sequelize;