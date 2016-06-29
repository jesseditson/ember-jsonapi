// TODO:
// update auth.js to be driver agnostic

var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');
// TODO: add validation, use this to throw when options are wrong
// var SilentError = require('silent-error');
var addPackagesToProject = require('../../lib/addPackagesToProject');

module.exports = {
  description: 'Adds an API layer to the express router, using a specified JSONAPIOperations module.',

  // allow running without a name
  normalizeEntityName: function() {},

  availableOptions: [
    // {
    //   name: 'driver',
    //   type: String,
    //   description: 'Driver to use for JSONAPI operations. Valid values are (knex)',
    //   default: 'knex'
    // }
  ],

  addPackagesToProject: addPackagesToProject,

  locals: function(options) {
    var driver = 'knex'; // TODO: support more
    var includeSessions = true; // TODO: allow turning off

    return {
      driver: driver,
      includeSessions: includeSessions
    };
  },

  fileMapTokens: function(options) {
    return {
      __session_path__: function(options) {
        return options.pod ? 'session' : 'services';
      },
      __service__: function(options){
        return options.pod ? 'service' : 'session';
      }
    }
  },

  beforeInstall: function(options) {
    // TODO: don't run if server/index.js already exists
    // but warn if it doesn't include api.js
    var task = this.taskFor('generate-from-blueprint', {
      ui:         this.ui,
      analytics:  this.analytics,
      project:    this.project,
      testing:    this.testing
    })
    return task.run({
      args: ['server']
    })
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

    installIfMissing(this, 'jsonapi-express', '^0.1.0');
    installIfMissing(this, 'jsonapi-schema', '^0.1.0');

    var hasSecrets = false
    if (locals.driver === 'knex') {
      installIfMissing(this, 'jsonapi-knex', '^0.0.2');
      installIfMissing(this, 'knex', '^0.11.5');
      installIfMissing(this, 'pg', '^5.1.0');
      installIfMissing(this, 'sqlite3', '^3.1.4', true);
      ignores.push('/dev.sqlite3');
      hasSecrets = true
    }

    if (locals.includeSessions) {
      installIfMissing(this, 'jsonwebtoken', '^7.0.1');
      installIfMissing(this, 'bcryptjs', '^2.3.0');
      installIfMissing(this, 'ember-cookies', '^0.0.7', true);
      hasSecrets = true;
    }

    if (hasSecrets) {
      ignores.push('/secrets.json');
    }

    if (!options.dryRun && (libsToInstall.length || libsToInstallDev.length)) {
      var _this = this;
      return Promise.all([
        this.addPackagesToProject(libsToInstall, true),
        this.addPackagesToProject(libsToInstallDev)
      ].concat(ignores.map(function(p) {
        return _this.insertIntoFile('.gitignore', p);
      })));
    }
  }
};