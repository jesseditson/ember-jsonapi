var chalk = require('chalk');
var npm = require('ember-cli/lib/utilities/npm');
/**
 * override addPackagesToProject to allow 'save' instead of 'save-dev'
 * Partially cribbed from https://github.com/ember-cli/ember-cli/blob/master/lib/models/blueprint.js because we can't install with --save with the built in method
 * Short circuits the task functionality to use the npm util directly because the `save` option is not passed through in the npm-task task: https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/npm-task.js
 */
module.exports = function addPackagesToProject(packages, prod) {
  var task = this.taskFor('npm-install');
  var installText = (packages.length > 1) ? 'install packages' : 'install package';
  var packageNames = [];
  var packageArray = [];

  for (var i = 0; i < packages.length; i++) {
    packageNames.push(packages[i].name);

    var packageNameAndVersion = packages[i].name;

    if (packages[i].target) {
      packageNameAndVersion += '@' + packages[i].target;
    }

    packageArray.push(packageNameAndVersion);
  }

  this._writeStatusToUI(chalk.green, installText, packageNames.join(', '));

  var npmOptions = {
    loglevel: 'error',
    logstream: this.ui.outputStream,
    color: 'always',
    'optional': true,
    'save-dev': !prod,
    save: !!prod
  };

  if (!this.options.testing) {
    // disable logger as per https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/npm-task.js#L38
    var oldLog = console.log;
    console.log = function() {};

    return npm('install', packageArray, npmOptions).finally(() => {
      console.log = oldLog;
    });
  }
};
