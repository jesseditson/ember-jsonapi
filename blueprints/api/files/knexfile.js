var secrets = require('./secrets')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
    debug: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgres',
    connection: {
      host: secrets.database_host,
      database: secrets.database_name,
      user: secrets.database_user,
      password: secrets.database_password
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
