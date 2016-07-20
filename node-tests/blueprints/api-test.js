'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var setupPodConfig = blueprintHelpers.setupPodConfig;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

describe('Acceptance: ember generate and destroy api', function() {
  setupTestHooks(this);

  it('api files (legacy)', function() {
    var args = ['api'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/adapters/application.js')).to.contain("namespace: 'api'");
        expect(file('server/api/index.js')).to.exist;
        expect(file('index.js')).to.exist;
        // may not be created in the future (under driver type)
        expect(file('knexfile.js')).to.exist;
        expect(file('server/lib/db.js')).to.exist;
        expect(file('seeds/seed_users.js')).to.exist;
        // may not be created in the future (under optional sessions)
        expect(file('secrets.json')).to.exist;
        expect(file('app/models/user.js')).to.exist;
        expect(file('app/schemas/users.json')).to.exist;
        expect(file('app/services/session.js')).to.exist;
        expect(file('server/api/auth.js')).to.exist;
        expect(file('migrations/000000_users.js')).to.exist;
        expect(file('tests/unit/models/user-test.js')).to.exist;
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
        expect(file('seeds/seed_users.js')).to.exist;
        // may not be created in the future (under optional sessions)
        expect(file('secrets.json')).to.exist;
        expect(file('app/user/model.js')).to.exist;
        expect(file('app/user/schema.json')).to.exist;
        expect(file('app/session/service.js')).to.exist;
        expect(file('server/api/auth.js')).to.exist;
        expect(file('migrations/000000_users.js')).to.exist;
        expect(file('tests/unit/user/model-test.js')).to.exist;
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
        // See https://github.com/ember-cli/ember-cli-internal-test-helpers/blob/master/lib/helpers/disable-npm-on-blueprint.js for where the npm-install task is clobbered.

        // dependencies
        // var pkg = JSON.parse(file('package.json').content)
        // expect(pkg.dependencies).to.include.keys([
        //   // required
        //   'morgan',
        //   'express',
        //   'jsonapi-express',
        //   'jsonapi-schema',
        //   // may be optional in the future (under driver type)
        //   'jsonapi-knex',
        //   'knex',
        //   'pg',
        //   'sqlite3',
        //   // may be optional in the future (under optional session)
        //   'jsonwebtoken',
        //   'bcryptjs',
        //   'ember-cookies'
        // ])
        // // devDependencies
        // expect(pkg.devDependencies).to.include.keys([
        //   // may be optional in the future (under driver type)
        //   'sqlite3',
        //   // may be optional in the future (under optional session)
        //   'ember-cookies'
        // ])
    });
  });
});
