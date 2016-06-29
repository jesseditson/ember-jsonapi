<grey>You may generate models with as many attrs as you would like to pass. The following attribute types are supported:</grey>
  <yellow><attr-name></yellow>
  <yellow><attr-name></yellow>:array
  <yellow><attr-name></yellow>:boolean
  <yellow><attr-name></yellow>:date
  <yellow><attr-name></yellow>:object
  <yellow><attr-name></yellow>:number
  <yellow><attr-name></yellow>:string
  <yellow><attr-name></yellow>:belongs-to:<yellow><model-name></yellow>
  <yellow><attr-name></yellow>:has-many:<yellow><model-name></yellow>

For instance: <green>\`ember generate schema taco filling:belongsTo:protein toppings:hasMany:toppings name:string price:number misc\`</green>
would result in the following schema (tacos.js):

```json
{
  "filling": { "type": "proteins", "relationship": "belongsTo" },
  "toppings": { "type": "toppings", "relationship": "hasMany" },
  "name": "string",
  "price": "number",
  "misc": null
}
```

and the following model (taco.js):

```js
import JSONAPIModel from 'ember-jsonapi/JSONAPIModel';
import tacos from '../schemas/tacos';

export default JSONAPIModel(tacos);
```
