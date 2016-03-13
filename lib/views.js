var path = require('path');

module.exports = function(app) {
  app.set('views', './app/views');
  app.set('view engine', 'jade');
}
