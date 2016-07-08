import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
  namespace: 'api'
});
