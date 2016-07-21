var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');

module.exports = {
  description: 'Creates a JSONAPI schema and model.',

  anonymousOptions: [
    'name',
    'attr:type'
  ],

  locals: function(options) {
    var needs = [];
    var entityOptions = options.entity.options;
    var schemaName = inflection.pluralize(options.entity.name);
    var modelName = inflection.singularize(options.entity.name);
    var schema = {};

    for (var name in entityOptions) {
      var type = entityOptions[name] || '';
      var foreignModel = name;
      if (type.indexOf(':') > -1) {
        foreignModel = type.split(':')[1];
        type = type.split(':')[0];
      }
      var dasherizedName = stringUtils.dasherize(name);
      var camelizedName = stringUtils.camelize(name);
      var dasherizedForeignModel = stringUtils.dasherize(foreignModel);
      var dasherizedForeignModelSingular = inflection.singularize(dasherizedForeignModel);

      var camelizedType = stringUtils.camelize(type);
      if (!type) {
        schema[dasherizedName] = null;
      } else if (/hasMany|belongsTo/.test(camelizedType)) {
        var foreignModel = stringUtils.dasherize(inflection.pluralize(foreignModel));
        needs.push("'model:" + dasherizedForeignModelSingular + "'");
        schema[dasherizedName] = {
          type: foreignModel,
          relationship: camelizedType
        };
      } else {
        schema[dasherizedName] = camelizedType;
      }
    }

    var needsDeduplicated = needs.filter(function(need, i) {
      return needs.indexOf(need) === i;
    });

    needs = '[' + needsDeduplicated.join(', ') + ']';

    var schemaPath = options.pod ? './schema' : '../schemas/' + schemaName;

    return {
      schema: JSON.stringify(schema, null, 2),
      schemaName: schemaName,
      modelName: modelName,
      needs: needs,
      schemaPath: schemaPath
    };
  },

  fileMapTokens: function(options) {
    return {
      __schema__: function(options){
        return options.pod ? 'schema' : options.locals.schemaName;
      },
      __schema_path__: function(options) {
        return options.pod ? options.locals.modelName : 'schemas';
      },
      __models_path__: function(options) {
        return options.pod ? options.locals.modelName : 'models';
      },
      __model__: function(options) {
        return options.pod ? 'model' : options.locals.modelName;
      }
    }
  }
};
