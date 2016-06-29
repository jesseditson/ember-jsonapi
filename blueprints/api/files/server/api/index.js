var express = require('express');
var router = module.exports = express.Router();
var JSONAPI = require('jsonapi-express');
var schema = require('jsonapi-schema');
var path = require('path');
var schemas = schema.loadSchemas(path.join(process.cwd(), 'app'));
<% if (driver === 'knex') { %>
var db = require('../lib/db');
var JSONAPIOperations = require('jsonapi-knex')(db, schemas);
<% } else { %>
var JSONAPIOperations = {};
<% } %>

JSONAPIOperations.sideEffects = {
  /**
   * Add side effects here in the format of:
  [schemaName]: {
    [operation]: {
      query(qb) {
        // hook to modify the query of an operation
        return qb
      },
      records(records) {
        // hook to modify the response of an operation
        return records
      }
    }
  }
   */
};

JSONAPIOperations.authorize = auth.middleware;

router.use(auth);
router.use('/', JSONAPI(JSONAPIOperations, schemas, '/api'));
