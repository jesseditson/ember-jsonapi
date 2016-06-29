var isPackageMissing = require('ember-cli-is-package-missing');
var addPackagesToProject = require('../../lib/addPackagesToProject');

module.exports = {
  description: 'Generates a JSONAPI server.',

  addPackagesToProject: addPackagesToProject,

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addPackagesToProject([
      { name: 'morgan', target: '^1.7.0'},
      { name: 'express', target: '^4.14.0'}
    ], true)
  },

  files: function() {
    return this.hasJSHint() ? ['server/index.js', 'server/.jshintrc'] : ['server/index.js'];
  },

  hasJSHint: function() {
    if (this.project) {
      return 'ember-cli-jshint' in this.project.dependencies();
    }
  }
};
