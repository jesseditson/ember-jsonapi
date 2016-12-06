// TODO:
// update auth.js to be driver agnostic

var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');
// TODO: add validation, use this to throw when options are wrong
// var SilentError = require('silent-error');
var addProductionPackagesToProject = require('../../lib/addProductionPackagesToProject');
var addPackageScript = require('../../lib/addPackageScript');

module.exports = {
  description: 'Adds an API layer to the express router, using a specified JSONAPIOperations module.',

  // allow running without a name
  normalizeEntityName: function() {},

  anonymousOptions: [],

  availableOptions: [
    // {
    //   name: 'driver',
    //   type: String,
    //   description: 'Driver to use for JSONAPI operations. Valid values are (knex)',
    //   default: 'knex'
    // }
  ],

  addProductionPackagesToProject: addProductionPackagesToProject,

  locals: function(options) {
    var driver = 'knex'; // TODO: support more?

    return {
      driver: driver
    };
  },

  fileMapTokens: function(options) {
    return {
      __adapter__: function(options){
        return options.pod ? 'adapter' : 'application';
      },
      __application_path__: function(options) {
        return options.pod ? 'application' : 'adapters';
      }
    }
  },

  files: function() {
    var files = this._super.files.apply(this, arguments);
    if (!this.hasJSHint()) files = files.filter(f => f !== 'server/.jshintrc');
    return files;
  },

  hasJSHint: function() {
    if (this.project) {
      return 'ember-cli-jshint' in this.project.dependencies();
    }
  },

  afterInstall: function(options) {
    var locals = this.locals(options);
    var libsToInstall = [];
    var libsToInstallDev = [];
    var ignores = [];
    function installIfMissing(ctx, packageName, version, dev) {
      if (isPackageMissing(ctx, packageName)) {
        (dev ? libsToInstallDev : libsToInstall).push({ name: packageName, target: version })
      }
    }

    installIfMissing(this, 'morgan', '^1.7.0');
    installIfMissing(this, 'express', '^4.14.0');

    installIfMissing(this, 'jsonapi-express');
    installIfMissing(this, 'body-parser');
    installIfMissing(this, 'jsonapi-schema');

    var hasSecrets = false
    if (locals.driver === 'knex') {
      installIfMissing(this, 'jsonapi-knex');
      installIfMissing(this, 'knex', '^0.11.5');
      installIfMissing(this, 'pg', '^5.1.0');
      installIfMissing(this, 'sqlite3', '^3.1.4', true);
      ignores.push('/dev.sqlite3');
      hasSecrets = true
    }

    if (hasSecrets) {
      ignores.push('/secrets.json');
    }

    if (!options.dryRun && locals.driver === 'knex') {
      addPackageScript.call(this, 'migrate', 'knex migrate:latest')
      addPackageScript.call(this, 'rollback', 'knex migrate:rollback')
      addPackageScript.call(this, 'seed', 'knex seed:run')
    }

    if (!options.dryRun && (libsToInstall.length || libsToInstallDev.length)) {
      return Promise.all([
        this.addProductionPackagesToProject(libsToInstall, true),
        this.addPackagesToProject(libsToInstallDev),
        this.insertIntoFile('.gitignore', ignores.join('\n'))
      ]);
    }
  }
};
