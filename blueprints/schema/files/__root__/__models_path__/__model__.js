import JSONAPIModel from 'ember-jsonapi/JSONAPIModel';
import <%= schemaName %> from '<%= schemaPath %>';

export default new JSONAPIModel(<%= schemaName %>);
