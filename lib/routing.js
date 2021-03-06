module.exports = function(app, connection, models) {
  var dashboards_routes = require('../app/routes/dashboards')(connection, models);
  app.use('/dashboards', dashboards_routes);

  var reports_routes = require('../app/routes/reports')(connection, models);
  app.use('/reports', reports_routes);

  // var emp_login_routes = require('../app/routes/emp_login')(connection, models);
  // app.use('/emp_login', emp_login_routes);

  var app_routes = require('../app/routes/app')(connection, models);
  app.use('/', app_routes);
}
