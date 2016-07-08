exports.up = function(knex, Promise) {
  return knex.schema.createTable('<%= schemaName %>', table => {
    table.increments();
    <% for (m in migrationData) { %><%= migrationData[m] %>;
    <% } %>
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('<%= schemaName %>');
};
