
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table){
    table.increments();
    table.string('type').notNullable();
    table.text('description', 'longtext').notNullable();

    table.string('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
   
    table.integer('department_id').notNullable();
    table.foreign('department_id').references('id').inTable('departments');
    //1- aberto, 2 - em andamento, 3 - finalizado
    table.integer('status').notNullable().defaultTo(1);

    table.datetime('created_at');
    table.datetime('started_at');
    table.datetime('finished_at');
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
