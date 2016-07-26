'use strict';
var Promise = require('rsvp');

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var setupPodConfig = blueprintHelpers.setupPodConfig;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

describe('Acceptance: ember generate login', function() {
  setupTestHooks(this);

  it('login files (legacy)', function() {
    var args = ['login'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/controllers/login.js')).to.exist;
        expect(file('app/routes/login.js')).to.exist;
        expect(file('app/templates/login.hbs')).to.exist;
        expect(file('tests/unit/controllers/login-test.js')).to.exist;
        expect(file('seeds/seed_users.js')).to.exist;
        expect(file('app/models/user.js')).to.exist;
        expect(file('app/schemas/users.json')).to.exist;
        expect(file('app/services/session.js')).to.exist;
        expect(file('server/api/auth.js')).to.exist;
        expect(file('migrations/000000_users.js')).to.exist;
        expect(file('tests/unit/models/user-test.js')).to.exist;
      })
  });

  it('login files (pods)', function() {
    var args = ['login'];

    return emberNew()
      .then(() => setupPodConfig({ usePods: true }))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('app/login/controller.js')).to.exist;
        expect(file('app/login/route.js')).to.exist;
        expect(file('app/login/template.hbs')).to.exist;
        expect(file('tests/unit/login/controller-test.js')).to.exist;
        expect(file('seeds/seed_users.js')).to.exist;
        expect(file('app/user/model.js')).to.exist;
        expect(file('app/user/schema.json')).to.exist;
        expect(file('app/session/service.js')).to.exist;
        expect(file('server/api/auth.js')).to.exist;
        expect(file('migrations/000000_users.js')).to.exist;
        expect(file('tests/unit/user/model-test.js')).to.exist;
      })
  });

  it('adds an entry to the router', function() {
    var args = ['login'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        var router = file('app/router.js');
        expect(router).to.contain("this.route('login');");
      })
  });

// NOTE: install --save[-dev] doesn't run in dev, see note in api-test.js

  // it('installs packages', function() {
  //   var args = ['login'];
  //
  //   return emberNew()
  //     .then(() => emberGenerate(args))
  //     .then(() => {
  //       // dependencies
  //       var pkg = JSON.parse(file('package.json').content);
  //       expect(pkg.dependencies).to.include.keys([
  //         'jsonwebtoken',
  //         'bcryptjs'
  //       ]);
  //       // devDependencies
  //       expect(pkg.devDependencies).to.include.keys([
  //         'ember-cookies'
  //       ])
  //     });
  // });
});
