var db_config = {
  test: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    driver: "mysql",
    multipleStatements: true
  },

  dev: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    driver: "mysql",
    multipleStatements: true
  },

  staging: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    driver: "mysql",
    multipleStatements: true
  }
};

module.exports = db_config;
