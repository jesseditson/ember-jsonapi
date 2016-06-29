var chalk = require('chalk');
/**
 * override addPackagesToProject to allow 'save' instead of 'save-dev'
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

  return task.run({
    'save-dev': !prod,
    save: prod,
    verbose: false,
    packages: packageArray
  });
};
