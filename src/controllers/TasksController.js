/*
* TasksController - Responsavel pelo CRUD das Tarefas
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const connection = require('../database/connection'); //Import conexao ao banco de dados
const moment = require('moment'); //Import Moment.js

module.exports = {
  //Listar Tasks
  async index(req,res){
    //Verifica o x-role do usuario
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      let { type, term } = req.params //pega os parametros
      //pega os parametros opcionais
      let { id = '', page = 1, order = 'asc', order_by = 'id'} = req.query;
      let tasks, term2; //inicia as variaveis de retorno

      switch(type){ //descobre o tipo informado, para realizar a listagem
        case 'created_by': //pega as tarefas pelo 'created_by'
          tasks = await connection('tasks').orderBy(order_by, order).where('created_by',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'responsible_id': //pega as tarefas pelo 'responsible_id'
          tasks = await connection('tasks').orderBy(order_by, order).where('responsible_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'department': //pega as tarefas pelo 'department'
          tasks = await connection('tasks').orderBy(order_by, order).where('department_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'status': //pega as tarefas pelo 'status'
          tasks = await connection('tasks').orderBy(order_by, order).where('status',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'description': //pega as tarefas pelo 'description'
          tasks = await connection('tasks').orderBy(order_by, order).where('description', 'like', `%${term}%`).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'created_at': //pega as tarefas pelo 'created_at'
          //pega a data e hora informada e adiciona 23:59:59 para formar a faixa de data
          term2 = moment(term).add(23,'hours').add(59,'minutes').add(59,'seconds').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('created_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'started_at':
          //pega a data e hora informada e adiciona 23:59:59 para formar a faixa de data
          term2 = moment(term).add(23,'hours').add(59,'minutes').add(59,'seconds').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('started_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'finished_at':
          //pega a data e hora informada e adiciona 23:59:59 para formar a faixa de data
          term2 = moment(term).add(23,'hours').add(59,'minutes').add(59,'seconds').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('finished_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'type_id': //pega as tarefas pelo tipo da tarefa
          tasks = await connection('tasks').orderBy(order_by, order).where('type_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        default: //caso padrão
          if(id !== ''){ //se for informado o id, retorna uma única tarefa
            tasks = await connection('tasks').where('id', id).orderBy(order_by, order).select('*');
          }else{ //caso não seja informado, retorna todas as tarefas com a config padrao          
            tasks = await connection('tasks').orderBy(order_by, order).limit(5).offset((page - 1) * 5).select('*');
          }
          break;
      }
      //retorna as tarefas e o status 200 - OK
      return res.status(200).json(tasks);

    }else{ //caso o x-role não esteja presenta na requisição, informa erro 403 forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  //Create Tasks
  async create(req, res){
    //verifica o x-role do usuario que esta fazendo a requisicao
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      //pega os parametros obrigatorios do body
      const { description, department_id, type_id, responsible_id } = req.body;
      //pega o id do usuario logado
      const created_by = req.headers.authorization;
      let now = moment(); //pega a data e hora atual
      const created_at = now.format("YYYY-MM-DD HH:mm:ss"); //formata a data
      //insere a tarefa no banco
      const [id] = await connection('tasks').insert({
        description,//descricao
        created_by,//id do usuario que criou a tarefa
        type_id,//tipo da tarefa
        department_id,//departamento da tarefa
        responsible_id,//responsavel pela tarefa
        created_at//data e hora da criacao da tarefa
      });
      //retorna o id da tarefa criada
      return res.status(201).json({ id });
    }else{//caso o x-role não esteja presente na requisicao, informa o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'})}
  },
  //Edit Tasks
  async edit(req, res){
    //verifica o x-role do usuario que esta fazendo a requisicao
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
       //pega os parametros do body
      const { type_id, description, responsible_id, department_id, status } = req.body;
      let { started_at, finished_at } = req.body;
      const { id } = req.params; //pega o id da tarefa
      //formata as datas, caso sejam informadas no body
      if(req.body.hasOwnProperty('started_at') && (!!started_at)){ started_at = moment(started_at).format("YYYY-MM-DD HH:mm:ss")}
      if(req.body.hasOwnProperty('finished_at') && (!!finished_at)){ finished_at = moment(req.body.finished_at).format("YYYY-MM-DD HH:mm:ss")}
      //faz o update da task
      await connection('tasks').update({
        type_id,//tipo da tarefa
        description,//descriçao
        responsible_id,//usuario responsavel pela tarefa
        department_id,//departamento da tarefa
        status,//status
        started_at,//data e hora do inicio da tarefa
        finished_at//data e hora da finalizacao da tarefa
      }).where('id', id);
      //retorna o codigo de sucesso
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Delete Task
  async delete(req, res){
    //verifica o x-role do usuario que esta fazendo a requisicao
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      const { id } = req.params; //pega o id informado no params    
      try{        
        await connection('tasks').where('id', id).delete(); //tenta deletar a tarefa
        return res.status(204).send(); //retorna o codigo 204
      }catch(err){
        //caso não consiga deletar, informa o erro
        return res.status(404).json({error: 'Task not found.'})}      
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  }
}