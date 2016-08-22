import { Model, belongsTo, hasMany } from 'ember-cli-mirage';
import { singularize } from 'ember-inflector';

export default function JSONAPIMirageModel(schema) {
  return Model.extend(schemaParser(schema));
}

function schemaParser(schema) {
  return Object.keys(schema).reduce((model, key) => {
    var info = schema[key] || {};
    var type = singularize(info.type);
    if (info.relationship === 'hasMany') {
      model[key] = hasMany(type);
    } else if (info.relationship === 'belongsTo') {
      model[key] = belongsTo(type);
    }
    return model;
  }, {});
}
