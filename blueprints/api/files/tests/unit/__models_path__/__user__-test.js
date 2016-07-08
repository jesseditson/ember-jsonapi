import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: []
});

test('test', function(assert) {
  // this.subject aliases the createRecord method on the model
  const user = this.subject({});
});
