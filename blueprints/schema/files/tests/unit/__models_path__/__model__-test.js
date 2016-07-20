import { moduleForModel, test } from 'ember-qunit';

moduleForModel('<%= modelName %>', 'Unit | Model | <%= modelName %>', {
  // Specify the other units that are required for this test.
  needs: <%= needs %>
});

test('test', function(assert) {
  // this.subject aliases the createRecord method on the model
  const <%= modelName %> = this.subject({});
  assert.ok(!!<%= modelName %>);
});
