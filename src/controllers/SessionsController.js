/*
* SessionsControler - Controller responsável pela autenticação dos usuários (admin, agent) e pela
* criação/remoção do primeiro admin (admin inicial)
* 
* @author: Marc Reinan Gomes Dantas do Nascimento
*/

const connection = require('../database/connection'); //Import conexão ao Banco de Dados
const jwt = require('jsonwebtoken'); //Import JWT
const encryption = require('../encryption'); //Import encryption
const UsersController = require('./UsersController'); //Import UsersController

module.exports = {  
  /*
  * Create - Recebe um email e uma senha, verifica se existe o usuário e realiza o login
  */
  async create(req,res){
    const { email, password } = req.body; //Pega os parametros Email e Password
    const hash = encryption.encrypt(password); //Monta o hash de acordo com a senha informada
    //Busca o usuario de acordo com o email e o hash da senha
    const user = await connection('users')
      .where({email: email, password: hash}).select('*').first();
    //Caso o usuario nao seja encontrado, retorna o erro 500 
    if(!user){return res.status(500).json({error: 'Login/Password is invalid.'})}
    //AUTH ok
    const id = user.id; //pega o id do usuario
    const role = user.role; //pega o role do usuario logado
    const expires = 3600 //tempo de duração do token - 3600 = 1 hora
    //Cria um token JWT com o payload ID e ROLE
    var token = jwt.sign({ id , role }, process.env.SECRET, {
      expiresIn: expires //Pega o valor de expiracao do token, ou seta 3600(1 hora)
    });
    //retorna auth: true e o token gerado
    return res.status(200).send({ auth: true, token: token });
  },
  /*
  * Cria o primeiro admin para inicializar a API
  */
  async createfirstadmin(req,res){
    //verifica se existe algum usuario cadastrado no banco de dados
    const users = await connection('users').select('*').first();
    //caso não exista nenhum usuario, cria um admin padrao
    if(!users){
      req.headers["x-role"] = "admin"; //Header x-role
      req.body.name = 'ADMIN'; //Name
      req.body.password = 'ADMIN'; //password
      req.body.email = 'admin@admin.com'; //Email
      req.body.role = 'admin'; //Role
      //Passa os parametros para o controller dos Users
      UsersController.create(req, res);
    }else{ //Caso exista algum usuario, retorna erro forbidden
      return res.status(403).json({error: 'Users already exists.'});
    }
  },
  /*
  * Deleta o usuario admin padrao
  */
  async deletefirstadmin(req, res){
    if(req.headers["x-role"] === "admin"){ //verifica se o usuario é admin
      //busca o usuario padrao pelo email
      const user = await connection('users').select('id').where('email','admin@admin.com').first();
      //monta a requisicao com o id do usuario encontrado
      req.params.id = user.id;
      //caso o usuario seja encontrado
      if(user){
        //deleta usando o delete do UsersController
        UsersController.delete(req, res);
      }else{
        //caso não encontre o usuario, retorna o erro 404
        return res.status(404).json({error: 'User not found.'});
      }

    }
  }
}