'use strict';
var path = require('path');
var fs = require('fs');

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var file = chai.file;
var expect = chai.expect;

describe('Acceptance: ember generate and destroy migration', function() {
  setupTestHooks(this);

  it('migration taco (simple)', function() {
    var args = ['migration', 'taco'];

    return emberNew()
      .then(() => emberGenerate(['schema', 'taco', 'name:string', 'price:number', 'misc']))
      .then(() => emberGenerateDestroy(args, (file) => {
        var migration = file('migrations/000001_tacos.js');
        expect(migration).to.contain("knex.schema.createTable('tacos', table => {");
        expect(migration).to.contain('table.increments();');
        expect(migration).to.contain("table.string('name');");
        // all numbers default to integer since we don't have a more specific type notation.
        expect(migration).to.contain("table.integer('price');");
        // we don't do anything with null values for now, as we can't detect type.
        expect(migration).to.not.contain("misc");
        expect(migration).to.contain("knex.schema.dropTable('tacos');");
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
});

describe('Acceptance: auto increment migration numbers', function() {
  setupTestHooks(this);

  it('should increment migration prefix when creating new migrations', function() {
    return emberNew()
      .then(() => emberGenerate(['schema', 'taco1']))
      .then(() => emberGenerate(['schema', 'taco2']))
      .then(() => emberGenerate(['migration', 'taco1']))
      .then(() => emberGenerate(['migration', 'taco2']))
      .then(() => {
        expect(file('migrations/000001_taco1s.js')).to.exist;
        expect(file('migrations/000002_taco2s.js')).to.exist;
      });
  });

  it('should always increment the most recent migration', function() {
    return emberNew()
      .then(() => {
        // tests set this before they start, so we can safely assume process.cwd() is the root of our test app
        var migrationPath = path.join(process.cwd(), 'migrations')
        fs.mkdirSync(migrationPath)
        fs.writeFileSync(path.join(migrationPath, '09090_garbage.js'), 'garbage', 'utf-8');
      })
      .then(() => emberGenerate(['schema', 'taco']))
      .then(() => emberGenerate(['migration', 'taco']))
      .then(() => {
        expect(file('migrations/009091_tacos.js')).to.exist;
      })
  })

  it('should be fairly resistant to garbage names in the same folder', function() {
    return emberNew()
      .then(() => {
        // tests set this before they start, so we can safely assume process.cwd() is the root of our test app
        var migrationPath = path.join(process.cwd(), 'migrations')
        fs.mkdirSync(migrationPath)
        fs.writeFileSync(path.join(migrationPath, '000001_butts.js'), 'garbage', 'utf-8');
        fs.writeFileSync(path.join(migrationPath, 'garbage_25.js'), 'garbage', 'utf-8');
      })
      .then(() => emberGenerate(['schema', 'taco']))
      .then(() => emberGenerate(['migration', 'taco']))
      .then(() => {
        expect(file('migrations/000002_tacos.js')).to.exist;
      })
  })
});
