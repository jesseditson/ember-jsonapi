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
        expect(model).to.contain("export default new JSONAPIModel(tacos);");
        var schema = file('app/schemas/tacos.json');
        expect(schema).to.contain("{}");
        var test = file('tests/unit/models/taco-test.js');
        expect(test).to.contain("moduleForModel('taco', 'Unit | Model | taco', {");
        expect(test).to.contain("const taco = this.subject({});");
        expect(test).to.contain("assert.ok(!!taco);");
    }));
  });

  it('schema taco (pods)', function() {
    var args = ['schema', 'taco'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('app/taco/model.js');
        expect(model).to.contain("import tacos from './schema';");
        expect(model).to.contain("export default new JSONAPIModel(tacos);");
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

  describe('pods: uses singular names regardless of pluralization', function() {
    function runTests(args) {
      return emberNew()
        .then(() => setupPodConfig({ usePods: true }))
        .then(() => emberGenerateDestroy(args, (file) => {
          expect(file('app/taco/model.js')).to.exist;
          expect(file('app/taco/schema.json')).to.exist;
      }));
    }
    it('when specifying plural', function() {
      return runTests(['schema', 'tacos'])
    })
    it('when specifying singular', function() {
      return runTests(['schema', 'taco'])
    })
  });

  it('legacy: uses singular model and plural schema', function() {
    function runTests(args) {
      return emberNew()
        .then(() => emberGenerateDestroy(args, (file) => {
          expect(file('app/models/taco.js')).to.exist;
          expect(file('app/schemas/tacos.json')).to.exist;
      }));
    }
    it('when specifying plural', function() {
      return runTests(['schema', 'tacos'])
    })
    it('when specifying singular', function() {
      return runTests(['schema', 'taco'])
    })
  });

  describe('dasherization & camelization', function() {

    it('pods: dasherizes and camelizes paths correctly', function() {
      return emberNew()
        .then(() => setupPodConfig({ usePods: true }))
        .then(() => emberGenerateDestroy(['schema', 'flimmerFlammer'], (file) => {
          var model = file('app/flimmer-flammer/model.js');
          var schema = file('app/flimmer-flammer/schema.json');
          var test = file('tests/unit/flimmer-flammer/model-test.js');
          expect(model).to.exist;
          expect(schema).to.exist;
          expect(test).to.exist;
          expect(model).to.contain("import flimmerFlammers from './schema';");
          expect(model).to.contain('new JSONAPIModel(flimmerFlammers)')
          expect(test).to.contain("moduleForModel('flimmer-flammer', 'Unit | Model | flimmer flammer', {");
          expect(test).to.contain("const flimmerFlammer = this.subject({});");
      }));
    });

    it('legacy: dasherizes and camelizes paths correctly', function() {
      return emberNew()
        .then(() => emberGenerateDestroy(['schema', 'flimmerFlammer'], (file) => {
          var model = file('app/models/flimmer-flammer.js');
          var schema = file('app/schemas/flimmer-flammers.json');
          var test = file('tests/unit/models/flimmer-flammer-test.js');
          expect(model).to.exist;
          expect(schema).to.exist;
          expect(test).to.exist;
          expect(model).to.contain("import flimmerFlammers from '../schemas/flimmer-flammers';");
          expect(model).to.contain('new JSONAPIModel(flimmerFlammers)')
          expect(test).to.contain("moduleForModel('flimmer-flammer', 'Unit | Model | flimmer flammer', {");
          expect(test).to.contain("const flimmerFlammer = this.subject({});");
      }));
    });

    it('dasherizes relationship model names (pods)', function() {
      var args = ['schema', 'flimmerFlammer', 'flimmerToppings:hasMany:flimmerToppings', 'flammerThing:belongsTo:tickleMeDaddy'];

      return emberNew()
        .then(() => setupPodConfig({ usePods: true }))
        .then(() => emberGenerateDestroy(args, (file) => {
          var schema = file('app/flimmer-flammer/schema.json');
          expect(schema).to.contain('"flammerThing": {\n    "type": "tickle-me-daddies",\n    "relationship": "belongsTo"\n  }');
          expect(schema).to.contain('"flimmerToppings": {\n    "type": "flimmer-toppings",\n    "relationship": "hasMany"\n  }');
      }));
    });

    it('dasherizes relationship model names (legacy)', function() {
      var args = ['schema', 'flimmerFlammer', 'flimmerToppings:hasMany:flimmerToppings', 'flammerThing:belongsTo:tickleMeDaddy'];

      return emberNew()
        .then(() => emberGenerateDestroy(args, (file) => {
          var schema = file('app/schemas/flimmer-flammers.json');
          expect(schema).to.contain('"flammerThing": {\n    "type": "tickle-me-daddies",\n    "relationship": "belongsTo"\n  }');
          expect(schema).to.contain('"flimmerToppings": {\n    "type": "flimmer-toppings",\n    "relationship": "hasMany"\n  }');
      }));
    });
  });
});
