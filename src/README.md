# ember-json

### introduction

ember-jsonapi is an ember-cli addon for creating automatic [JSON API](http://jsonapi.org/) endpoints based on shared schemas written in JSON.

JSON schemas are formatted to be familiar to ember developers, and include the ability to specify ember primitive types as strings, and ember relationship types as objects. A simple schema would look like this:

**articles.json**
```JSON
{
  "title": "string",
  "comments": {
    "type": "comments",
    "relationship": "hasMany"
  }
}
```

ember-jsonapi comes with blueprints for the following types:

- **schema** (`ember generate schema <name> <attr:type>`)

This creates a schema file and an associated ember model and model unit test. For detailed usage instructions, run `ember help generate schema`.

- **migration** (`ember generate migration <schema>`)

Generates a knex migration based on a schema.

- **api** (`ember generate api`)

This generates ember-jsonapi server and api files, along with a session service and auth endpoint for authenticating users via [JSON web tokens](https://jwt.io/). This API automatically loads schemas from the application and sets up fully JSON API compatible endpoints under the `/api` endpoint. Additionally, this blueprint prepares the `/server` folder to be production-compatible, so you may deploy the ember application as an express application.

- **login** (`ember generate login`)

This generates a route, controller, and template for a super simple login view that uses the service and endpoints create by the `ember generate api` command.
