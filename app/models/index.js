module.exports = function(connection) {
  require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/\.js$/) && file !== 'index.js') {
      var name = file.replace('.js', '');
      var model_ref = require(require('path').join(__dirname, name))(connection);
      model_ref.model.sync()
      exports[model_ref.model_name] = model_ref.model
    }
  });

  return exports;
}
