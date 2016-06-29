var path = require('path');
var jsonModule = require('broccoli-json-module');

module.exports = {
  name: 'ember-jsonapi',

  isDevelopingAddon: function() { return true; },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  treeForApp: function() {
    return jsonModule(this.app.trees.app);
  },

  treeForTestSupport: function() {
    return jsonModule(this.app.trees.tests);
  }
}
