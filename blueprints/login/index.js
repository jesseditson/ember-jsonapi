var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var EmberRouterGenerator = require('ember-router-generator');
var isPackageMissing = require('ember-cli-is-package-missing');
var addProductionPackagesToProject = require('../../lib/addProductionPackagesToProject');

module.exports = {
  description: 'Creates a login route and controller.',

  // allow running without a name
  normalizeEntityName: function() {},

  anonymousOptions: [],

  addProductionPackagesToProject: addProductionPackagesToProject,

  locals: function(options) {
    options.entity.name = 'login';
    return {};
  },

  fileMapTokens: function(options) {
    return {
      __session_path__: function(options) {
        return options.pod ? 'session' : 'services';
      },
      __service__: function(options){
        return options.pod ? 'service' : 'session';
      },
      __route__: function(options){
        return options.pod ? 'route' : 'login';
      },
      __controller__: function(options){
        return options.pod ? 'controller' : 'login';
      },
      __template__: function(options) {
        return options.pod ? 'template' : 'login';
      },
      __controller_path__: function(options) {
        return options.pod ? 'login' : 'controllers';
      },
      __route_path__: function(options) {
        return options.pod ? 'login' : 'routes';
      },
      __template_path__: function(options) {
        return options.pod ? 'login' : 'templates';
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

  shouldTouchRouter(name, options) {
    return !options.dryRun && !options.inRepoAddon;
  },

  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);
    var locals = this.locals(options);
    var libsToInstall = [];
    var libsToInstallDev = [];
    function installIfMissing(ctx, packageName, version, dev) {
      if (isPackageMissing(ctx, packageName)) {
        (dev ? libsToInstallDev : libsToInstall).push({ name: packageName, target: version })
      }
    }

    installIfMissing(this, 'jsonwebtoken', '^7.0.1');
    installIfMissing(this, 'bcryptjs', '^2.3.0');
    installIfMissing(this, 'ember-cookies', '^0.0.7', true);

    if (!options.dryRun && (libsToInstall.length || libsToInstallDev.length)) {
      return Promise.all([
        this.addProductionPackagesToProject(libsToInstall, true),
        this.addPackagesToProject(libsToInstallDev)
      ]);
    }
  },
  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};

/**
 * Cribbed directly from https://github.com/emberjs/ember.js/blob/master/blueprints/route/index.js
 * Should subclass route blueprint if/when possible.
 */

function updateRouter(action, options) {
  var entity = options.entity;
  var actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  var color = actionColorMap[action] || 'gray';

  if (this.shouldTouchRouter(entity.name, options)) {
    writeRoute(action, entity.name, options);

    this.ui.writeLine('updating router');
    this._writeStatusToUI(chalk[color], action + ' route', entity.name);
  }
}

function findRouter(options) {
  var routerPathParts = [options.project.root];

  if (options.dummy && options.project.isEmberCLIAddon()) {
    routerPathParts = routerPathParts.concat(['tests', 'dummy', 'app', 'router.js']);
  } else {
    routerPathParts = routerPathParts.concat(['app', 'router.js']);
  }

  return routerPathParts;
}

function writeRoute(action, name, options) {
  var routerPath = path.join.apply(null, findRouter(options));
  var source = fs.readFileSync(routerPath, 'utf-8');

  var routes = new EmberRouterGenerator(source);
  var newRoutes = routes[action](name, options);

  fs.writeFileSync(routerPath, newRoutes.code());
}
