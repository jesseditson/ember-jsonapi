
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
      __controller__: function(options){
        return options.pod ? 'controller' : 'login';
      },
      __template__: function(options) {
        return options.pod ? 'template' : 'login';
      }
    }
  },
  // TODO: would be nice if we could just call parent blueprints, but that seems like it's not gonna work right now.
  // Instead, we just create the same stuff by copying files.
  // beforeInstall: function(options) {
    // var task = this.taskFor('generate-from-blueprint', {
    //   ui:         this.ui,
    //   analytics:  this.analytics,
    //   project:    this.project,
    //   testing:    this.testing
    // });
    // return Promise.all([
    //   task.run({ args: ['route', 'login'] })
    // ]);
  // }
};
