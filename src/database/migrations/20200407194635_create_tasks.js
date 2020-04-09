
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table){
    table.increments('id').primary();
    table.text('description', 'longtext').notNullable();

    table.integer('type_id').notNullable();
    table.foreign('type_id').references('id').inTable('typesTasks').onUpdate('CASCADE').onDelete('CASCADE');

    table.string('created_by').notNullable();
    table.foreign('created_by').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
    
    table.string('responsible_id').notNullable();
    table.foreign('responsible_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
   
    table.integer('department_id').notNullable();
    table.foreign('department_id').references('id').inTable('departments').onUpdate('CASCADE').onDelete('CASCADE');
    
    //1- aberto, 2 - em andamento, 3 - finalizado
    table.integer('status').notNullable().defaultTo(1).comment('1- aberto, 2 - em andamento, 3 - finalizado');

    table.datetime('created_at');
    table.datetime('started_at');
    table.datetime('finished_at');
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
