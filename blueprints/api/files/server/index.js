var morgan = require('morgan');
var bodyParser = require('body-parser');
var pkg = require('../package.json');

module.exports = function(app) {
  // Logging
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  // Support for jsonAPI header
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

  // Ping and version endpoints
  app.all('/ping', (req, res) => res.send('PONG'));
  app.all('/version', (req, res) => res.send(pkg.version));

  app.use('/api', require('./api'));

  /**
   * API Error Handler
   */
   app.use('/api', (err, req, res, next) => {
     console.log(err.stack);
     res.status(500).json({ error: err.message });
   });
};
