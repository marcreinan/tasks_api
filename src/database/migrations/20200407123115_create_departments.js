
exports.up = function(knex) {
  return knex.schema.createTable('departments', function(table){
    table.increments('id').primary();
    table.string('name').notNullable();

    table.string('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('departments');
};
