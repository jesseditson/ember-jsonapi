var inflection  = require('inflection');
var stringUtils = require('ember-cli-string-utils');
var isPackageMissing = require('ember-cli-is-package-missing');

module.exports = {
  description: 'Adds a new operation to the server/api folder',
  normalizeEntityName: function(n) {
    // schema names should be in the format of "my-objects"
    return inflection.pluralize(stringUtils.dasherize(n)).toLowerCase();
  },

  locals: function(o) {
    return {
      name: inflection.singularize(o.entity.name)
    };
  },

  fileMapTokens: function() {
    return {
      __schemaName__: function(o) {
        return o.dasherizedModuleName;
      }
    };
  }
};
