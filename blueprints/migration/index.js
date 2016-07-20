var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');
var fs = require('fs');
var path = require('path');
var SilentError = require('silent-error');

const migrationPadding = 6

function pad(n, padding) {
  var s = String(n)
  return Array(padding - s.length + 1).join('0') + s;
}

module.exports = {
  description: 'Creates a knex migration based on a schema.',

  anonymousOptions: [
    'schema'
  ],

  schemaName: function() {
    return inflection.pluralize(this.options.entity.name);
  },

  schemaFile: function() {
    var schemaName = this.schemaName();
    var modelName = inflection.singularize(this.options.entity.name);
    var schemaPath = this.options.pod ? path.join(modelName, 'schema.json') : path.join('schemas', `${schemaName}.json`);
    var appPath = this.options.target;
    return path.join(appPath, 'app', schemaPath);
  },

  migrationsPath: function() {
    return path.join(this.options.target, 'migrations');
  },

  locals: function(options) {
    var schemaName = this.schemaName();
    var migrationsPath = this.migrationsPath();
    try { fs.mkdirSync(migrationsPath); } catch (e) {};
    var currentNumber = fs.readdirSync(migrationsPath).reduce((n, f) => {
      var number = parseInt(f, 10);
      return !isNaN(number) && number > n ? number : n;
    }, 0);
    try {
      var schema = JSON.parse(fs.readFileSync(this.schemaFile()));
    } catch (e) { throw new SilentError(`Migration ${schemaName} was not valid JSON: ${e.message}`); }

    var migrationData = Object.keys(schema).reduce((a, k) => {
      var val = schema[k];
      if (!val) {
        console.error(`WARNING: The attribute "${k}" does not define a type. If you would like to create a column for this key, you must manually add it to the migration.`);
        return a;
      }
      if (val.relationship && val.relationship === 'belongsTo') {
        var key = val.idKey || `${k}_id`;
        var foreignKey = val.foreignKey || 'id';
        var table = val.through || val.type;
        a.push(`table.integer('${key}')`);
        a.push(`table.foreign('${key}').references('${foreignKey}').inTable('${table}')`);
      } else if (!val.relationship) {
        var type = typeof val === 'string' ? val : val.type;
        if (type === 'number') {
          // TODO: need to prompt for type here.
          console.warn(`WARNING: Attribute "${k}" was of an ambigous type "number". Using "integer", the migration will need to be manually updated if this number is not an integer.`);
          type = 'integer';
        }
        a.push(`table.${type}('${k}')`);
      }
      return a;
    }, [])

    return {
      number: currentNumber,
      schemaName: schemaName,
      migrationData: migrationData
    };
  },

  fileMapTokens: function(options) {
    return {
      __migration__: function(options){
        var prefix = pad(++options.locals.number, migrationPadding)
        return `${prefix}_${options.locals.schemaName}`
      }
    }
  },

  beforeInstall(options) {
    if (!fs.existsSync(this.schemaFile())) {
      var schemaName = this.schemaName();
      throw new SilentError(`Schema for ${schemaName} not found.`);
    }
  },

  afterUninstall(options) {
    // Manually remove migration since the name is not static
    var mp = this.migrationsPath();
    var files = fs.readdirSync(mp);
    var filePattern = new RegExp(`^\\d+_${this.schemaName()}\\.js$`);
    var fileName = files.find(f => filePattern.test(f));
    var file = path.join(mp, fileName);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
};
