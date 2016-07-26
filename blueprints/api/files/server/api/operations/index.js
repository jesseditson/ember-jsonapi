var db = require('../../lib/db');
var JSONAPIOperations = require('jsonapi-knex');
var path = require('path');
var fs = require('fs');

// Require all js files in the local directory.
var applicationOps = fs.readdirSync(__dirname).reduce((o, f) => {
  if (/\.js$/.test(f) && f != 'index.js') {
    o[f.basename(f, '.js')] = require(path.join(__dirname, f));
  }
  return o;
}, {});

/**
 * operations - creates a jsonapi-express compatible operations object
 * @param  {object} schemas - key:value pairs of schemaName:schema
 * @param  {object} tables  - key:value pairs of schemaName:tableName
 * @return {object}         - an object to pass to jsonapi-express
 */
module.exports = function(schemas, tables) {
  var ops = JSONAPIOperations(db, schemas, tables);

  Object.keys(ops).forEach(op => {
    var original = ops[op];
    ops[op] = function(type) {
      var appOperation = applicationOps[type] && applicationOps[type][op];
      if (appOperation) {
        return appOperation.call(this, db, ...arguments, original);
      } else {
        return original.apply(this, arguments);
      }
    }
  })
  ops.transforms = {};
  Object.keys(applicationOps).forEach(k => {
    var o = applicationOps[k];
    if (o.transform) ops.transforms[k] = o.transform;
  })
  return ops;
}
