/*
* create_tasks - Migration que cria a tabela tasks no banco de dados 
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table){
    table.increments('id').primary(); // ID - primary key
    table.text('description', 'longtext').notNullable(); // description - Descricao da tarefa

    table.integer('type_id').notNullable(); // type_id - id do tipo de tarefa
    //Chave estrangeira para o tipo de tarefa
    table.foreign('type_id').references('id').inTable('typesTasks').onUpdate('CASCADE').onDelete('CASCADE');

    table.string('created_by').notNullable(); //created_by - id do usuario que criou a tarefa
    //chave estrangeira para o usuario que criou a tarefa
    table.foreign('created_by').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
    
    table.string('responsible_id').notNullable(); // responsible_id - id do usuario responsavel pela tarefa
    //chave estrangeira para o usuario responsavel pela tarefa
    table.foreign('responsible_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
   
    table.integer('department_id').notNullable(); // department_id - id do departamento da tarefa
    //chave estrangeira para o departamento responsavel pela tarefa
    table.foreign('department_id').references('id').inTable('departments').onUpdate('CASCADE').onDelete('CASCADE');
    
    //status -  status atual da tarefa (1- aberto, 2 - em andamento, 3 - finalizado)
    table.integer('status').notNullable().defaultTo(1).comment('1- aberto, 2 - em andamento, 3 - finalizado');

    table.datetime('created_at'); //created_at - data e hora de criação da tarefa
    table.datetime('started_at'); //started_at - data e hora do inicio da tarefa
    table.datetime('finished_at'); //finished_at - data e hora de finalizacao da tarefa
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks'); //Deleta a tabela tasks
};
