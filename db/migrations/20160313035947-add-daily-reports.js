var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var Migration = {DB: null}

function set_db(db) {
  Migration.DB = db
}

function create_table(table_name, schema, callback) {
  Migration.DB.createTable(table_name, schema, callback)
}

exports.up = function(db, callback) {
  set_db(db);
  table_name = 'DailyReports'
  schema = {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    uid: { type: 'string', notNull: false },
    report_date: { type: 'date', notNull: true },
    prelease_percentage_prv_year: { type: 'decimal', notNull: true },
    traffic_count_today:{ type: 'int', notNull: true },
    traffic_count_week: { type: 'int', notNull: true },
    guarantor_received_count: { type: 'int', notNull: true },
    new_lease_count_today: { type: 'int', notNull: true },
    new_lease_count_week: { type: 'int', notNull: true },
    new_lease_count_YTD: { type: 'int', notNull: true },
    renewal_count_today: { type: 'int', notNull: true },
    renewal_count_week: { type: 'int', notNull: true },
    renewal_count_YTD: { type: 'int', notNull: true },
    leased_floorplan_1x1: { type: 'int', notNull: true },
    leased_floorplan_2x2a: { type: 'int', notNull: true },
    leased_floorplan_2x2b: { type: 'int', notNull: true },
    leased_floorplan_4x2: { type: 'int', notNull: true },
    NOT_leased_floorplan_1x1: { type: 'int', notNull: true },
    NOT_leased_floorplan_2x2a: { type: 'int', notNull: true },
    NOT_leased_floorplan_2x2b: { type: 'int', notNull: true },
    NOT_leased_floorplan_4x2: { type: 'int', notNull: true },
    created_at: { type: 'timestamp' },
    updated_at: { type: 'timestamp', notNull: false }
  }

  create_table(table_name, schema, callback);
};

exports.down = function(db, callback) {
  table_name = 'DailyReports'
  // callback();
  db.dropTable(table_name, callback);

};