/*
* UsersController - Responsavel pelo CRUD dos usuarios
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const crypto = require('crypto');
const connection = require('../database/connection');
const encryption = require('../encryption');

module.exports = {
  //List Users
  async index(req,res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id = '', page = 1 } = req.query; //pega os parametros da query
      let users; //inicia a variavel de retorno dos valores
        if(id !== ''){ //verifica se o parametro ID foi informado na query
          //Retorna o usuario de acordo com o ID informado
          users = await connection('users').where('id', id).select('*');
        }else{
          //Retorna todos os usuarios
          users = await connection('users').limit(5).offset((page - 1) * 5).select('*');            
        }
        //Caso não encontre o(s) usuario(s), informa erro
        if(!users){return res.status(404).json({error: 'User(s) not found.'});}
        //Retorna os usuarios no json
        return res.status(200).json(users);
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  //Create Users
  async create(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const {name, email, role} = req.body; //pega os parametros da query
      const password = encryption.encrypt(req.body.password); //encripta a senha
      const id = crypto.randomBytes(4).toString('HEX'); //gera um id randomico
      //insere o usuario na tabela
      await connection('users').insert({
        id,
        email,
        name,
        password,
        role
      });
      //retorna o id do usuario criado
      return res.status(200).json({id});
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id } = req.params; //pega os parametros da query
      const { name, email, password, role } = req.body; //pega os parametros do body
      try{ //tenta fazer o update no usuario pelo id
        await connection('users').update({
          name,
          email,
          password,
          role
        }).where('id', id);
      }catch(err){
        return res.status(404).json({error: 'User not found'});
      }
      //Retorna 204 - No Content
      return res.status(204).send();
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  async delete(req, res){    
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id } = req.params; //pega os parametros da query     
      try{ //tenta deletar o usuario pelo id
        await connection('users').where('id', id).delete();
      }catch(err){
        return res.status(404).json({error: 'User not found'});
      }    
      //Retorna 204 - No Content
      return res.status(204).send();
    }else{ //Caso o usuario não seja do tipo admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  }  
}