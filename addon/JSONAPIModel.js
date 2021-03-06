import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import relationships from 'ember-data/relationships';
import { singularize } from 'ember-inflector';

export default function JSONAPIModel(schema, configs) {
  return Model.extend(schemaParser(schema, configs || {}, attr));
}

export function parseConfig(config) {
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
export function schemaParser(schema, configs, attr) {
  return Object.keys(schema).reduce((model, key) => {
    var info = schema[key];
    var config = parseConfig(configs[key]);
    if (typeof info === 'string' || info === null) {
      model[key] = attr(info, config);
    } else if (info.relationship) {
      model[key] = relationships[info.relationship](singularize(info.type), config);
    } else {
      model[key] = attr(info.type, config);
    }
    return model;
  }, {});
}
