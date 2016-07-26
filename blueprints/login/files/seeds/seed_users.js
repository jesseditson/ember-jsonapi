var secrets = require('../secrets.json')
var bcrypt = require('bcryptjs')

exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() => {
      return Promise.all(secrets.users.map(u => {
        return knex('users').insert({
          email: u.email,
          password: bcrypt.hashSync(u.password, 10)
        })
      }))
    })
};
