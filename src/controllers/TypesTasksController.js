const connection = require('../database/connection');

module.exports = {
  //List Types of Tasks
  async index(req,res){
    if(req.headers["x-role"] === "admin"){
      const { page = 1} = req.query;

      const tasks = await connection('typesTasks').limit(5).offset((page - 1) * 5).select('*');
      
      return res.json(tasks);
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Create Types of Tasks
  async create(req, res){
    if(req.headers["x-role"] === "admin"){
      const { name } = req.body;
    
      const [id] = await connection('typesTasks').insert({
        name
      });

      return res.json({ id });
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Edit Types of Tasks
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){
      const { id } = req.params;
      const { name } = req.body;

      await connection('typesTasks').update({
        name
      }).where('id', id);
        
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Delete Types of Tasks
  async delete(req, res){
    if(req.headers["x-role"] === "admin"){
      const { id } = req.params;    
  
      await connection('typesTasks').where('id', id).delete();
      
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  }
}