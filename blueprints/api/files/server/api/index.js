var express = require('express');
var router = module.exports = express.Router();
var JSONAPI = require('jsonapi-express');
var schema = require('jsonapi-schema');
var path = require('path');
var schemas = schema.loadSchemas(path.join(process.cwd(), 'app'));
<% if (driver === 'knex') { %>
var operations = require('./operations')(schemas, {});
<% } else { %>
var operations = {};
<% } %>
// Add your authorize operation here:
// operations.authorize = auth.middleware;

// Add your login middleware here
// router.use(auth);

router.use('/', JSONAPI(operations, schemas, '/api'));
