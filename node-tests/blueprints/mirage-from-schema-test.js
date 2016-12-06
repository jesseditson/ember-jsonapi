'use strict';
var path = require('path');
var fs = require('fs');

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;
var setupPodConfig = blueprintHelpers.setupPodConfig;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var file = chai.file;
var expect = chai.expect;

describe('Acceptance: ember generate and destroy mirage from schema', function() {
  setupTestHooks(this);

  it('mirage-from-schema taco (simple)', function() {
    var args = ['mirage-from-schema', 'taco'];

    return emberNew()
      .then(() => emberGenerate(['schema', 'taco', 'name:string', 'price:number', 'time:date', 'cheese:boolean', 'misc']))
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('mirage/models/taco.js');
        expect(model).to.contain("import tacos from 'my-app/schemas/tacos';");
        expect(model).to.contain("export default new JSONAPIMirageModel(tacos);");
        var factory = file('mirage/factories/taco.js');
        expect(factory).to.contain("import { Factory, faker } from 'ember-cli-mirage';");
        expect(factory).to.contain("\"name\": function() { return faker.random.words(); }");
        expect(factory).to.contain("\"price\": function() { return faker.random.number(); }");
        expect(factory).to.contain("\"time\": function() { return faker.date.recent(); }");
        expect(factory).to.contain("\"cheese\": function() { return faker.random.boolean(); }");
        expect(factory).to.contain("\"misc\": null");
    }));
  });

  it('mirage-from-schema taco (with pods)', function() {
    var args = ['mirage-from-schema', 'taco'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerate(['schema', 'taco', 'name:string', 'price:number', 'misc']))
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('mirage/models/taco.js');
        expect(model).to.contain("import tacos from 'my-app/taco/schema';");
        expect(model).to.contain('new JSONAPIMirageModel(tacos)');
    }));
  });

  it('migration taco (relationships)', function() {
    var args = ['migration', 'taco'];

    return emberNew()
      .then(() => emberGenerate(['schema', 'taco', 'filling:belongsTo:protein', 'toppings:hasMany:toppings']))
      .then(() => emberGenerateDestroy(args, (file) => {
        var migration = file('migrations/000001_tacos.js');
        // we create foreign keys for our belongsTo relationships
        expect(migration).to.contain("table.integer('filling_id');");
        expect(migration).to.contain("table.foreign('filling_id').references('id').inTable('proteins');");
        // we do not create keys for hasMany relationships, as they are defined by the child or in a join table.
        expect(migration).to.not.contain("toppings");
    }));
  });

  it('mirage-from-schema dasherization (pods)', function() {
    var args = ['mirage-from-schema', 'tickleMeDaddy'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerate(['schema', 'tickleMeDaddy', 'name:string', 'price:number', 'misc']))
      .then(() => emberGenerateDestroy(args, (file) => {
        var model = file('mirage/models/tickle-me-daddy.js');
        expect(model).to.contain("import tickleMeDaddies from 'my-app/tickle-me-daddy/schema';");
        expect(model).to.contain('new JSONAPIMirageModel(tickleMeDaddies)');
    }));
  });
});
