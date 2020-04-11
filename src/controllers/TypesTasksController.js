/*
* TypeTasksController - Responsavel pelo CRUD dos Tipos das Tarefas
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const connection = require('../database/connection');

module.exports = {
  //List Types of Tasks
  async index(req,res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id = '', page = 1} = req.query; //pega os parametros da query
      let typetasks; //inicia a variavel de retorno dos valores
      
      if(id !== ''){//caso seja informado o id, retorna um unico TypeTask
        typetasks = await connection('typesTasks').where('id', id).select('*');
      }else{       
        //retorna os TypeTasks  
        typetasks = await connection('typesTasks').limit(5).offset((page - 1) * 5).select('*');
      }
      return res.status(200).json(typetasks); //Retorna os typestasks e o codigo 200
    }else{//caso o usuario não seja admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'})}
  },
  //Create Types of Tasks
  async create(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { name } = req.body; //pega o parametro do body
      const [id] = await connection('typesTasks').insert({ //insere um typetask no banco
        name //nome do tipo da tarefa
      });
      return res.status(200).json({ id });//retorna o id do tipo da tarefa criado

    }else{//caso o usuario não seja admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'})}
  },
  //Edit Types of Tasks
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id } = req.params; //pega o parametro ID
      const { name } = req.body; //pega o parametro name do body
      try{ //tenta fazer o update no tipo da tarefa
        await connection('typesTasks').update({
          name //nome do tipo
        }).where('id', id);
        return res.status(204).send();
      }catch(err){
        return res.status(404).json({error: 'TypeTask not found.'});
      }      
    }else{//caso o usuario não seja admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  },
  //Delete Types of Tasks
  async delete(req, res){
    if(req.headers["x-role"] === "admin"){ //Verifica se o usuario é admin
      const { id } = req.params; //pega o parametro ID    
      try{ //tenta deletar o typetask de acordo com o id informado
        await connection('typesTasks').where('id', id).delete();
        return res.status(204).send(); //retorna sucesso 204- No Content
      }catch(err){
        return res.status(404).json({error: 'TypeTask not found.'});
      }      
    }else{ //caso o usuario não seja admin, retorna o erro forbidden
      return res.status(403).json({error: 'Operation not authorized.'});
    }
  }
}