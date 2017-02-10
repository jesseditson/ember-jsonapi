import { moduleForModel, test } from 'ember-qunit';

moduleForModel('author', 'Unit | Model | author', {
  needs: [],
  unit: true
});

test('should have the same definition as the author schema', function(assert) {
  const authorJSON = { name: 'Jesse', meta: { foo: 'bar' } };
  const author = this.subject(authorJSON);
  assert.deepEqual(author.toJSON(), authorJSON);
});
