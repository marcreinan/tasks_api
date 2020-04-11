/*
* DepartmentsController - Responsavel pelo CRUD dos departamentos
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const connection = require('../database/connection'); //Import conexao ao banco de dados

module.exports = {
  //Listar Departments
  async index(req,res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id = '', page = 1} = req.query; //pega os parametros da query
      let departments; //inicia a variavel de retorno dos valores
      if(id !== ''){ //verifica se o parametro ID foi informado na query
        //Retorna o departamento de acordo com o ID informado
        departments = await connection('departments').where('id', id).select('*');
      }else{          
        //Retorna todos os departamentos
        departments = await connection('departments').limit(5).offset((page - 1) * 5).select('*');
      }
      //Caso não encontre o(s) departamento(s), informa erro ao usuario
      if(!departments){return res.status(404).json({error: 'Department(s) not found.'});}
      //Retorna os departamentos no json
      return res.status(200).json(departments);
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  //Criar Departments
  async create(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const {name} = req.body; //pega os parametros da query
      const user_id = req.headers.authorization;//pega o user_id do header
      //Insere um department no banco
      const [id] = await connection('departments').insert({
        name, //Nome do department
        user_id //Usuario que criou o department
      });
      //Retorna o id do departamento criado
      return res.status(201).json({ id });
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  //Editar Departments
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){//Verifica se o usuario é admin
      const { name } = req.body; //pega os parametros da query
      const { id } = req.params; //pega o id do departamento a ser editado
      //Faz o update no departamento
      await connection('departments').update({
        name //Nome do department
      }).where('id', id);      
      return res.status(204).send(); //Retorna 204 - No Content
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  async delete(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id } = req.params; //pega os parametros da query    
      //Deleta o department de acordo com o id 
      await connection('departments').where('id', id).delete();      
      return res.status(204).send(); //Retorna 204 - No Content
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  }
}