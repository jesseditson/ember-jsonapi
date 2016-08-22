var inflection  = require('inflection');
var SilentError = require('silent-error');
var fs = require('fs');
var path = require('path');

function getFakerPath(field) {
  var type = field ? field.type || field : null;
  if (type === 'number') {
    return 'random.number';
  } else if (type === 'string') {
    return 'random.words';
  } else if (type === 'date') {
    return 'date.recent';
  } else if (type === 'boolean') {
    return 'random.boolean';
  }
};

module.exports = {
  description: 'Creates a mirage factory and model for a JSONAPI schema',

  anonymousOptions: [
    'schema'
  ],

  schemaName: function() {
    return inflection.pluralize(this.options.entity.name);
  },
  modelName() {
    return inflection.singularize(this.options.entity.name);
  },

  schemaFile: function() {
    var schemaName = this.schemaName();
    var modelName = this.modelName();
    var schemaPath = this.options.pod ? path.join(modelName, 'schema.json') : path.join('schemas', `${schemaName}.json`);
    var appPath = this.options.target;
    return path.join(appPath, 'app', schemaPath);
  },

  locals: function(options) {
    try {
      var schema = JSON.parse(fs.readFileSync(this.schemaFile()));
    } catch (e) { throw new SilentError(`Migration ${schemaName} was not valid JSON: ${e.message}`); }
    var hasFaker = false;
    var fields = Object.keys(schema).reduce((a, k) => {
      var field = schema[k];
      if (!field || !field.relationship) {
        var fakerPath = getFakerPath(field, k);
        if (fakerPath) hasFaker = true;
        a.push({
          name: k,
          fakerPath: fakerPath
        });
      }
      return a;
    }, []);

    var schemaName = this.schemaName();
    var modelName = this.modelName();
    var schemaPath = '../../app/' + (options.pod ? modelName : 'schemas') + '/' + (options.pod ? 'schema' : schemaName);

    return {
      fields: fields,
      hasFaker: hasFaker,
      schemaPath: schemaPath,
      schemaName: schemaName,
      modelName: modelName
    };
  },

  __name__: function(options) {
    return options.pod ? 'model' : options.locals.modelName;
  }
};
