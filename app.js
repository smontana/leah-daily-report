require('dotenv').load();

var express = require('express');
var app = express();

app.locals._ = require('lodash');
app.locals.moment = require('moment');

require('./lib/logging')(app);
require('./lib/request_parsing')(app);
require('./lib/static')(app);
require('./lib/views')(app);

var connection = require('./db/connection');
var models = require('./app/models')(connection);

require('./lib/routing')(app, connection, models);
require('./lib/errors')(app); // error handles must load after app routes

module.exports = app;