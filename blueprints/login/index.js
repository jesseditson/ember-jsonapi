
module.exports = {
  description: 'Creates a login route and controller.',

  // allow running without a name
  normalizeEntityName: function() {},

  anonymousOptions: [],

  locals: function(options) {
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
  }
};
