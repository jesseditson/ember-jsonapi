import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import relationships from 'ember-data/relationships';
import { singularize } from 'ember-inflector';
// TODO: instead of requiring that the model provides a schema, just import our own and use model names.
// import schemas from 'schemas';

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
