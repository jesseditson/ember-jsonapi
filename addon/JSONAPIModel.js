import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import relationships from 'ember-data/relationships';
import { singularize } from 'ember-inflector';

export default function JSONAPIModel(schema, configs) {
  return Model.extend(schemaParser(schema, configs || {}));
}

function parseConfig(config) {
  if (config === undefined) { return; }
  if (typeof config === 'object') { return config; }
  return { defaultValue: config };
}

function schemaParser(schema, configs) {
  return Object.keys(schema).reduce((model, key) => {
    var info = schema[key];
    var config = parseConfig(configs[key]);
    if (typeof info === 'string') {
      model[key] = attr(info, config);
    } else if (info === null) {
      model[key] = attr(null, config);
    } else if (info.relationship) {
      model[key] = relationships[info.relationship](singularize(info.type), config);
    } else {
      model[key] = attr(info.type, config);
    }
    return model;
  }, {});
}
