var configs = require('../../knexfile.js')
var env = process.env.NODE_ENV || 'development'
var config = configs[env]
if (!config) throw new Error(`No db config defined for environment ${env}`)
module.exports = require('knex')(config)
