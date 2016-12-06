import JSONAPIMirageModel from 'ember-jsonapi/JSONAPIMirageModel';
import <%= camelizedSchemaName %> from '<%= schemaPath %>';

export default new JSONAPIMirageModel(<%= camelizedSchemaName %>);
