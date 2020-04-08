const connection = require('../database/connection');

module.exports = {
  //List Tasks
  async index(req,res){
    const tasks = await connection('tasks').select('*');
    
    return res.json(tasks);
  },
  //Create Tasks
  async create(req, res){
      const { type, description, department_id } = req.body;
      const user_id = req.headers.authorization;
      const created_at = Date();
    
      const [id] = await connection('tasks').insert({
        type,
        description,
        user_id,
        department_id,
        created_at
      });

      return res.json({ id });
  },
  //Edit Tasks
  async edit(req, res){
      const { type, description, department_id, started_at, finished_at } = req.body;
      const { id } = req.params;
      const user_id = req.headers.authorization;

      const task = await connection('tasks').where('id', id).select('*').first();

      if(task.user_id !== user_id){
        return res.status(401).json({
          error: 'Operation not permitted.'
        })
      }
      await connection('tasks').update({
        type,
        description,
        department_id,
        started_at,
        finished_at
      }).where('id', id);
        
      return res.status(204).send();
  },
  async delete(req, res){
    const { id } = req.params;    
    const user_id = req.headers.authorization;

    const task = await connection('tasks').where('id', id).select('*').first();

    if(task.user_id !== user_id){
      return res.status(401).json({
        error: 'Operation not permitted.'
      })
    }

    await connection('tasks').where('id', id).delete();
    
    return res.status(204).send();
  }
}