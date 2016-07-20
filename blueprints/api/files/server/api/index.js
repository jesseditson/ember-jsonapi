var express = require('express');
var router = module.exports = express.Router();
var JSONAPI = require('jsonapi-express');
var schema = require('jsonapi-schema');
var path = require('path');
var schemas = schema.loadSchemas(path.join(process.cwd(), 'app'));
<% if (includeSessions) { %>var auth = require('./auth');<% } %>
<% if (driver === 'knex') { %>
var db = require('../lib/db');
var JSONAPIOperations = require('jsonapi-knex')(db, schemas);
<% } else { %>
var JSONAPIOperations = {};
<% } %>

JSONAPIOperations.transforms = {
  /**
   * Add transforms here in the format of:
  [schemaName]: function(records, req) {
    return [Promise returning records, or transformed records]
  }
   */
};
<% if (includeSessions) { %>
JSONAPIOperations.authorize = auth.middleware;
<% } %>
router.use(auth);
router.use('/', JSONAPI(JSONAPIOperations, schemas, '/api'));
