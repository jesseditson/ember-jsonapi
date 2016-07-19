/* Generates a static version of the site */
var Handlebars = require('handlebars')
var fs = require('fs')
var path = require('path')
var readdir = require('fs-readdir-recursive')
var mkdirp = require('mkdirp')
var marked = require('marked')
var pkg = require('../package.json')

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value
  }
})

var paths = ['modules', 'guide']
var templates = paths.reduce(function(o, path) {
  var fullPath = __dirname + '/' + path
  o[path] = { content: fs.readFileSync(fullPath + '.hbs', 'utf8'), path: fullPath }
  return o
}, {})

var partialsDir = __dirname + '/partials/'
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

var destDir = path.join(process.cwd(), 'dist', 'tutorials')
mkdirp.sync(destDir)
var config = {}
paths.forEach(function(p) {
  delete config.body
  var t = templates[p]
  var destPath = destDir
  // base path on gh-pages will be the same as the package name
  config.basePath = '/' + pkg.name
  var out = config.body = marked(Handlebars.compile(t.content)(config))
  fs.writeFileSync(path.join(destPath, p + '.html'), out, 'utf8')
})
