import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import relationships from 'ember-data/relationships';
import { singularize } from 'ember-inflector';

export default function JSONAPIModel(schema) {
  return Model.extend(schemaParser(schema));
}

function schemaParser(schema) {
  return Object.keys(schema).reduce((model, key) => {
    var info = schema[key];
    if (typeof info === 'string') {
      model[key] = attr(info);
    } else if (info === null) {
      model[key] = attr();
    } else if (info.relationship) {
      model[key] = relationships[info.relationship](singularize(info.type));
    } else {
      model[key] = attr(info.type);
    }
    return model;
  }, {});
}
