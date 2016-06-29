var express = require('express')
var path = require('path')
var emberServer = require('./server')
var pkgInfo = require('./package.json')

var app = module.exports = express()

var env = process.env.NODE_ENV || 'development'
app.locals.ENV = env
app.locals.ENV_DEVELOPMENT = env == 'development'
app.locals.package = pkgInfo

emberServer(app)

app.use(express.static(path.join(process.cwd(), 'dist')))
var indexFile = path.join(__dirname, 'dist/index.html')
app.use((req, res) => res.sendFile(indexFile))

app.serve = function() {
  this.set('port', this.get('port') || process.env.PORT || 3000)
  this.set('host', this.get('host') || process.env.HOST || '0.0.0.0')

  var server = this.listen(this.get('port'), this.get('host'), function() {
    console.log(`Server running on port ${server.address().port}`)
  })
  return server
}

// if called directly, just serve.
if (require.main === module) app.serve()
