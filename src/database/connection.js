/*
* connection - Conexão ao banco de dados
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const knex = require('knex'); //Import knex
const configuration = require('../../knexfile'); //Import da configuracao do knex
//Seta a conexão de acordo com o ambiente DEV ou PROD
const connection = knex(configuration.development || configuration.production);
//Exporta a conexao
module.exports = connection;