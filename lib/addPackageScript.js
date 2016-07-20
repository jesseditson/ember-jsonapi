var Promise = require('rsvp');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

module.exports = function(name, content) {
  // TODO: possible better error checking here.
  var pkgPath = path.join(this.project.root, 'package.json');
  var pkgContent = JSON.parse(fs.readFileSync(pkgPath));
  pkgContent.scripts = pkgContent.scripts || {}
  // TODO: this should prompt if it is going to overwrite
  this._writeStatusToUI(chalk.green, `adding ${name} script to package.json`, content);
  pkgContent.scripts[name] = content;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgContent, null, 2), 'utf8');
}
