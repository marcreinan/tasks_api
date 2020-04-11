/*
* create_departments - Migration que cria a tabela departments no banco de dados 
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
exports.up = function(knex) {
  return knex.schema.createTable('departments', function(table){ //Cria a tabela departments
    table.increments('id').primary(); // ID - primary key
    table.string('name').notNullable(); // name - Nome do departamento

    table.string('user_id').notNullable(); // user_id - id o usuario que criou o departamento
    //Chave estrangeira para a tabela users
    table.foreign('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('departments'); //Deleta a tabela departments
};
