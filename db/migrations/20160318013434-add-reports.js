var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

function set_db(db) {
  Migration.DB = db
}

function create_table(table_name, schema, callback) {
  Migration.DB.createTable(table_name, schema, callback)
}

exports.up = function(db, callback) {
  set_db(db);
  table_name = 'Reports'
  schema = {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    report_id: { type: 'string', notNull: true },
    name: { type: 'string', notNull: true },
    description: { type: 'text' },
    x_axis: { type: 'string' },
    y_axis: { type: 'string' },
    created_at: { type: 'timestamp' },
    updated_at: { type: 'timestamp' }
  }

  create_table(table_name, schema, callback);
};

exports.down = function(db, callback) {
  callback();
};