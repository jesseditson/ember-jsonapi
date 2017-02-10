import { default as JSONAPIModel /*, schemaParser, parseConfig*/ } from 'ember-jsonapi/JSONAPIModel';
import { module, test } from 'qunit';

module('Unit | Utility | JSONAPIModel');

const personSchema = {
  name: 'string',
  age: 'number',
  vegetarian: 'boolean',
  birthday: 'date',
  meta: null
};

test('can be called to create an instance', function(assert) {
  let Model = new JSONAPIModel(personSchema);
  assert.ok(Model);
});

// test('schemaParser', function(assert) {
//   console.log()
//   let result = schemaParser(personSchema, {}, (type, config) => {
//
//   });
// });

// test('parseConfig', function() {
//
// });
