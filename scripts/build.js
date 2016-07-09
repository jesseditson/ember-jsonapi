/* Generates a static version of the site */
var Handlebars = require('handlebars')
var fs = require('fs')
var path = require('path')
var readdir = require('fs-readdir-recursive')
var mkdirp = require('mkdirp')
var marked = require('marked')

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})

var paths = ['index', 'modules', 'guide']
var layout = fs.readFileSync(__dirname + '/../src/layouts/layout.hbs', 'utf8')
var templates = paths.reduce(function(o, path) {
  o[path] = fs.readFileSync(__dirname + '/../src/' + path + '.hbs', 'utf8')
  return o
}, {})

var partialsDir = __dirname + '/../src/partials/'
var partials = readdir(partialsDir).filter(f => /\.hbs$/.test(f)).forEach(f => {
  var folder = f.replace(path.basename(f), '')
  var name = folder + path.basename(f, '.hbs')
  var file = fs.readFileSync(partialsDir + f, 'utf8')
  var partial = Handlebars.compile(file)
  Handlebars.registerPartial(name, partial)
})

function titleCase(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

var destDir = process.cwd()
var config = {}
paths.forEach(function(p) {
  delete config.body
  var destPath = destDir
  if (p !== 'index') {
    var destPath = path.join(destDir, p)
    mkdirp.sync(destPath)
  }
  config.body = marked(Handlebars.compile(templates[p])(config))
  config.title = titleCase(p)
  var out = Handlebars.compile(layout)(config)
  fs.writeFileSync(path.join(destPath, 'index.html'), out, 'utf8')
})
