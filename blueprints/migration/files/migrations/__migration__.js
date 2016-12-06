exports.up = function(knex, Promise) {
  var operations = [];
  operations.push(knex.schema.createTable('<%= schemaName %>', table => {
    table.increments();<% for (var m in migrationData) { %>
    <%= migrationData[m] %>;<% } %>
  }));
  <% for (var t in throughRelationships) { var through = throughRelationships[t]; %>
  operations.push(knex.schema.createTableIfNotExists('<%= through.table %>', table => {
    table.integer('<%= through.key %>');
    table.foreign('<%= through.key %>').references('id').inTable('<%= through.keyTable %>');
    table.integer('<%= through.foreignKey %>');
    table.foreign('<%= through.foreignKey %>').references('id').inTable('<%= through.foreignKeyTable %>');
  }));<% } %>
  return Promise.all(operations);
};

exports.down = function(knex, Promise) {
  var operations = [];
  operations.push(knex.schema.dropTable('<%= schemaName %>'));
  return Promise.all(operations);
};
