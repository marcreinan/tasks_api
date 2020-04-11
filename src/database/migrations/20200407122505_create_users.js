/*
* create_users - Migration que cria a tabela users no banco de dados 
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/

exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){ //cria a tabela users
    table.string('id').primary(); //ID - primary key
    table.string('name').notNullable();// name - nome do usuario
    table.string('email').notNullable().unique(); // email - email do usuario
    table.string('password').notNullable(); //password - senha do usuario
    table.string('role').notNullable(); //role - papel do usuario (admin,agent)
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('users'); //Deleta a tabela users
};
