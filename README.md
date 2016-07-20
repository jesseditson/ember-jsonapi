# ember-jsonapi
Create automatic, database-backed JSONAPI endpoints based on incredibly simple JSON schemas.

### current setup how-to

```
ember init
# (switch to pods if you so choose)
ember install ember-jsonapi
# npm link ember-jsonapi
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
# vi app/styles/app.css
# add:
# body { background-color: oldlace; }
# vi app/controllers/index.js
# add:
# session: Ember.inject.service()
# vi app/template/index.hbs
# <h1>Logged in as {{this.session.user.email}}</h1>
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

current lint errors:

```
adapters/application.js: line 1, col 8, 'Ember' is defined but never used.

1 error

controllers/login.js: line 12, col 42, Missing semicolon.
controllers/login.js: line 14, col 33, Missing semicolon.
controllers/login.js: line 15, col 11, Missing semicolon.

3 errors

models/user.js: line 4, col 16, Missing 'new' prefix when invoking a constructor.

1 error

services/session.js: line 15, col 30, Missing semicolon.
services/session.js: line 16, col 32, Missing semicolon.
services/session.js: line 17, col 47, Missing semicolon.
services/session.js: line 18, col 23, Missing semicolon.
services/session.js: line 21, col 34, Missing semicolon.
services/session.js: line 22, col 17, Expected '{' and instead saw 'return'.
services/session.js: line 22, col 23, Missing semicolon.
services/session.js: line 26, col 29, Missing semicolon.
services/session.js: line 28, col 29, Missing semicolon.
services/session.js: line 27, col 14, 'err' is defined but never used.
services/session.js: line 29, col 7, Missing semicolon.
services/session.js: line 38, col 36, Missing semicolon.
services/session.js: line 39, col 76, Missing semicolon.
services/session.js: line 40, col 25, Missing semicolon.
services/session.js: line 41, col 7, Missing semicolon.
services/session.js: line 44, col 28, Missing semicolon.
services/session.js: line 45, col 38, Missing semicolon.
services/session.js: line 46, col 23, Missing semicolon.

18 errors

===== 4 JSHint Errors


unit/models/user-test.js: line 11, col 9, 'user' is defined but never used.
unit/models/user-test.js: line 9, col 23, 'assert' is defined but never used.
unit/models/user-test.js: line 2, col 8, 'Ember' is defined but never used.

3 errors

===== 1 JSHint Error
```
