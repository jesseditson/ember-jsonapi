import JSONAPIMirageModel from 'ember-jsonapi/JSONAPIMirageModel';
import <%= schemaName %> from '<%= schemaPath %>';

export default new JSONAPIMirageModel(<%= schemaName %>);
