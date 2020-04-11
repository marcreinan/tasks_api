/*
* create_typetasks - Migration que cria a tabela typetasks no banco de dados 
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
exports.up = function(knex) {
  return knex.schema.createTable('typesTasks', function(table){ //Cria a tabela typetasks
    table.increments('id').primary(); //ID - primary key
    table.string('name').notNullable();//name - nome do tipo da tarefa    
  });  
};

exports.down = function(knex) {
  return knex.schema.dropTable('typesTasks'); //Deleta o tipo da tarefa
};
