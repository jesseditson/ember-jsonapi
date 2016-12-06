import { Model, belongsTo, hasMany } from 'ember-cli-mirage';
import { singularize } from 'ember-inflector';

export default function JSONAPIMirageModel(schema, configs) {
  return Model.extend(schemaParser(schema, configs || {}));
}

function parseConfig(config) {
  if (config === undefined) { return; }
  if (typeof config === 'object') { return config; }
  return { defaultValue: config };
}

/**
 * schemaParser
 * @param  {Object} schema  - a schema object defining a model
 * @param  {Object} configs - per-property config/default objects
 * @return {DS.Model}       - An ember model
 */
function schemaParser(schema, configs) {
  return Object.keys(schema).reduce((model, key) => {
    var info = schema[key] || {};
    var config = parseConfig(configs[key]);
    var type = singularize(info.type);
    if (info.relationship === 'hasMany') {
      console.log(key, type, config);
      model[key] = hasMany(type, config);
    } else if (info.relationship === 'belongsTo') {
      model[key] = belongsTo(type, config);
    }
    return model;
  }, {});
}
