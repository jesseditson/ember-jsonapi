// TODO:
// update auth.js to be driver agnostic

var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');
// TODO: add validation, use this to throw when options are wrong
// var SilentError = require('silent-error');
var addProductionPackagesToProject = require('../../lib/addProductionPackagesToProject');

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

  locals: function(options) {
    var driver = 'knex'; // TODO: support more?
    var includeSessions = true; // TODO: allow turning off?

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
      },
      __adapter__: function(options){
        return options.pod ? 'adapter' : 'application';
      },
      __application_path__: function(options) {
        return options.pod ? 'application' : 'adapters';
      },
      __models_path__: function(options) {
        return options.pod ? 'user' : 'models';
      },
      __schemas_path__: function(options) {
        return options.pod ? 'user' : 'schemas';
      },
      __user_schema__: function(options) {
        return options.pod ? 'schema' : 'users';
      },
      __user__: function(options) {
        return options.pod ? 'model' : 'user';
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
      return Promise.all([
        addProductionPackagesToProject.call(this, libsToInstall, true),
        this.addPackagesToProject(libsToInstallDev),
        this.insertIntoFile('.gitignore', ignores.join('\n'))
      ]);
    }
  }
};
