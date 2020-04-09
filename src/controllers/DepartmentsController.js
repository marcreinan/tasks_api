//Conexão ao Banco
const connection = require('../database/connection');

module.exports = {
  //Listar Departments
  async index(req,res){
    if(req.headers["x-role"] === "admin"){
      const { page = 1} = req.query;

      const departments = await connection('departments').limit(5).offset((page - 1) * 5).select('*');
      return res.json(departments);
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Criar Departments
  async create(req, res){
    if(req.headers["x-role"] === "admin"){
      const {name} = req.body;
      const user_id = req.headers.authorization;
    
      const [id] = await connection('departments').insert({
        name,
        user_id
      });

      return res.json({ id });
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Editar Departments
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){
      const { name } = req.body;
      const { id } = req.params;

      await connection('departments').update({
        name
      }).where('id', id);
        
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  async delete(req, res){
    if(req.headers["x-role"] === "admin"){
      const { id } = req.params;    
  
      await connection('departments').where('id', id).delete();      
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  }
}