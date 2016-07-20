'use strict';
var Promise = require('rsvp');

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var requireFromCLI = require('ember-cli-blueprint-test-helpers/lib/helpers/require-from-cli');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe.only('Acceptance: ember generate and destroy login', function() {
  // We have to override this because otherwise taskFor is completely overridden here:
  // https://github.com/ember-cli/ember-cli-internal-test-helpers/blob/master/lib/helpers/disable-npm-on-blueprint.js
  // TODO: Should probably migrate this to the ember-cli-internal-test-helpers repo
  // var Blueprint = requireFromCLI('lib/models/blueprint');
  // var taskFor = Blueprint.prototype.taskFor;
  // beforeEach(function() {
  //   Blueprint.prototype.taskFor = function(taskName) {
  //     if (taskName === 'npm-install') {
  //       return { run: () => Promise.resolve() }
  //     } else {
  //       return taskFor.apply(this, arguments);
  //     }
  //   };
  // });
  //
  // afterEach(function() {
  //   Blueprint.prototype.taskFor = taskFor;
  // });
  setupTestHooks(this);

  it('login files (legacy)', function() {
    var args = ['login'];

    return emberNew()
      .then(() => emberGenerate(args));
  });
});
