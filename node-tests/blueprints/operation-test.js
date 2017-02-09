'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy operation', function() {
  setupTestHooks(this);

  it('operation foo', function() {
    var args = ['operation', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        var operation = file('server/api/operations/foos.js');
        expect(operation).to.exist;
        expect(operation).to.contain('foo operations');
        expect(operation).to.contain('module.exports.create');
        expect(operation).to.contain('module.exports.delete');
        expect(operation).to.contain('module.exports.findAll');
        expect(operation).to.contain('module.exports.findOne');
        expect(operation).to.contain('module.exports.update');
        expect(operation).to.contain('module.exports.updateRelationship');
    }));
  });

  it('operation TestCapitalization', function() {
    var args = ['operation', 'TestCapitalization'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        var operation = file('server/api/operations/test-capitalizations.js');
        expect(operation).to.exist;
    }));
  });
});
