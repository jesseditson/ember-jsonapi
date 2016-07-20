var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var EmberRouterGenerator = require('ember-router-generator');

module.exports = {
  description: 'Creates a login route and controller.',

  // allow running without a name
  normalizeEntityName: function() {},

  anonymousOptions: [],

  locals: function(options) {
    options.entity.name = 'login';
    return {};
  },

  fileMapTokens: function(options) {
    return {
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
      }
    }
  },

  shouldTouchRouter(name, options) {
    return !options.dryRun && !options.inRepoAddon;
  },

  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);
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
