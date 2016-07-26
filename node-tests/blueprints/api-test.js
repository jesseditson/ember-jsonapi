'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var setupPodConfig = blueprintHelpers.setupPodConfig;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

describe('Acceptance: ember generate api', function() {
  setupTestHooks(this);

  it('api files (legacy)', function() {
    var args = ['api'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/adapters/application.js')).to.contain("namespace: 'api'");
        expect(file('server/api/index.js')).to.exist;
        expect(file('server/api/operations/index.js')).to.exist;
        expect(file('index.js')).to.exist;
        // may not be created in the future (under driver type)
        expect(file('knexfile.js')).to.exist;
        expect(file('server/lib/db.js')).to.exist;
        expect(file('secrets.json')).to.exist;
    });
  });

  it('api files (pods)', function() {
    var args = ['api'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/application/adapter.js')).to.contain("namespace: 'api'");
        expect(file('server/api/index.js')).to.exist;
        expect(file('index.js')).to.exist;
        // may not be created in the future (under driver type)
        expect(file('knexfile.js')).to.exist;
        expect(file('server/lib/db.js')).to.exist;
        expect(file('secrets.json')).to.exist;
    });
  });

  it('installs scripts', function() {
    var args = ['api'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        var pkg = JSON.parse(file('package.json').content)
        expect(pkg).to.include.keys('scripts');
        expect(pkg.scripts.migrate).to.exist;
        expect(pkg.scripts.rollback).to.exist;
        expect(pkg.scripts.seed).to.exist;
    });
  });

  it('installs packages', function() {
    var args = ['api'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('.gitignore')).to.contain('/secrets.json');
        // may not be added in the future (under driver type)
        expect(file('.gitignore')).to.contain('/dev.sqlite3');

        // TODO: task for npm-install doesn't seem to run in blueprint tests. Should verify these get added to package, but this won't run them.
        // See https://github.com/ember-cli/ember-cli-internal-test-helpers/blob/master/lib/helpers/disable-npm-on-blueprint.js for where the npm-install task is clobbered, and https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/npm-task.js for where it's being run (and why we can't add to package.json without running real installs, which is a non-starter because it'll slow the test suite down an incredible amount)

        // dependencies
        // var pkg = JSON.parse(file('package.json').content);
        // expect(pkg.dependencies).to.include.keys([
        //   // required
        //   'morgan',
        //   'express',
        //   'jsonapi-express',
        //   'jsonapi-schema',
        //   // may be optional in the future (under driver type)
        //   'jsonapi-knex',
        //   'knex',
        //   'pg'
        // ]);
        // // devDependencies
        // expect(pkg.devDependencies).to.include.keys([
        //   // may be optional in the future (under driver type)
        //   'sqlite3'
        // ])
    });
  });
});
