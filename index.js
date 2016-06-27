// var Funnel = require('broccoli-funnel');
// var JSONModule = require('broccoli-json-module');
// var MergeTrees = require('broccoli-merge-trees');
// var WatchedDir = require('broccoli-source').WatchedDir;

module.exports = {
  name: 'ember-jsonapi',

  isDevelopingAddon: function() { return true; },

  // TODO: figure out how to add the schemas to the resolver via `import schemas`
  // included: function included(app, parentAddon) {
  //   this._super.included(app);
  //
  //
  //   // var target = (parentAddon || app);
  //   //
  //   // target.import(this.schemas);
  // },
  // treeForAddon(tree) {
  //   tree = this._super.treeForAddon.call(this, tree);
  //
  // },
  // treeForApp(tree) {
  //   var schemasFolder = new WatchedDir('schemas');
  //   return mergeTrees([tree, jsonModule(schemasFolder)]);
  // }
}
