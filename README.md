# ember-jsonapi
Create automatic, database-backed JSONAPI endpoints based on incredibly simple JSON schemas.

[![Build Status](https://travis-ci.org/jesseditson/ember-jsonapi.svg?branch=master)](https://travis-ci.org/jesseditson/ember-jsonapi)

### current setup how-to

```
ember init
# (switch to pods if you so choose)
ember install ember-jsonapi
ember g api
ember g login
npm run migrate
npm run seed
npm start
```

### show user info how-to:

```
ember g route index
ember g controller index
# (hyperterm only)
# vi app/controllers/index.js
# add:
# session: Ember.inject.service()
# vi app/template/index.hbs
# <h1>Logged in as {{this.session.user.email}}</h1>
# vi app/styles/app.css
# add:
# body { background-color: oldlace; }
```

### add db-backed model how-to:

```
# add a new model & schema
ember g schema post name:string user:belongsTo:user
ember g migration posts
npm run migrate
# open http://localhost:4200/api/posts/, see that posts are automatically there

# now add the relationship to the user
vi app/schemas/user.json
# add: "posts": { "type": "posts", "relationship": "hasMany" }
# open http://localhost:4200/api/users/1?include=posts, see that posts are now sidechained.
```

# TODO:

[] integration tests for models/schemas & api endpoints
