'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var setupPodConfig = blueprintHelpers.setupPodConfig;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy schema', function() {
  setupTestHooks(this);

  it('schema taco (legacy)', function() {
    var args = ['schema', 'taco'];

    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('app/models/taco.js');
        expect(model).to.contain("import tacos from '../schemas/tacos';");
        expect(model).to.contain("export default JSONAPIModel(tacos)");
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain("{}");
        var test = file('tests/unit/models/taco-test.js');
        expect(test).to.contain("moduleForModel('taco', 'Unit | Model | taco', {");
        expect(test).to.contain("const taco = this.subject({});");
    }));
  });

  it('schema taco (pods)', function() {
    var args = ['schema', 'taco'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('app/taco/model.js');
        expect(model).to.contain("import tacos from './schema';");
        expect(model).to.contain("export default JSONAPIModel(tacos)");
        var schema = file('app/taco/schema.json');
        expect(schema).to.contain("{}");
        var test = file('tests/unit/taco/model-test.js');
        expect(test).to.contain("moduleForModel('taco', 'Unit | Model | taco', {");
        expect(test).to.contain("const taco = this.subject({});");
    }));
  });

  it('schema taco misc', function() {
    return emberNew()
      .then(() => emberGenerateDestroy(['schema', 'taco', 'misc'], (file) => {
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain('"misc": null');
      }));
  });

  it('schema taco name:string', function() {
    return emberNew()
      .then(() => emberGenerateDestroy(['schema', 'taco', 'name:string'], (file) => {
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain('"name": "string"');
      }));
  });

  it('schema taco price:number', function() {
    return emberNew()
      .then(() => emberGenerateDestroy(['schema', 'taco', 'price:number'], (file) => {
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain('"price": "number"');
      }));
  });

  it('schema taco filling:belongsTo:protein', function() {
    return emberNew()
      .then(() => emberGenerateDestroy(['schema', 'taco', 'filling:belongsTo:protein'], (file) => {
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain('"filling": {\n    "type": "proteins",\n    "relationship": "belongsTo"\n  }');
      }));
  });

  it('schema taco toppings:hasMany:toppings', function() {
    return emberNew()
      .then(() => emberGenerateDestroy(['schema', 'taco', 'toppings:hasMany:toppings'], (file) => {
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain('"toppings": {\n    "type": "toppings",\n    "relationship": "hasMany"\n  }');
      }));
  });
});
