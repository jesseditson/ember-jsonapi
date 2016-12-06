import JSONAPIModel from 'ember-jsonapi/JSONAPIModel';
import <%= camelizedSchemaName %> from '<%= schemaPath %>';

export default new JSONAPIModel(<%= camelizedSchemaName %>);
