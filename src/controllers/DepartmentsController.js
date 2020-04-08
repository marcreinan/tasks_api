const connection = require('../database/connection');

module.exports = {
  //List Departments
  async index(req,res){
    const departments = await connection('departments').select('*');
    return res.json(departments);
  },
  //Create Departments
  async create(req, res){
      const {name} = req.body;
      const user_id = req.headers.authorization;
    
      const [id] = await connection('departments').insert({
        name,
        user_id
      });

      return res.json({ id });
  },
  //Edit Departments
  async edit(req, res){
      const { name } = req.body;
      const { id } = req.params;
      const user_id = req.headers.authorization;

      const department = await connection('departments').where('id', id).select('*').first();

      console.log(department.user_id);

      if(department.user_id !== user_id){
        return res.status(401).json({
          error: 'Operation not permitted.'
        })
      }
      await connection('departments').update({
        name
      }).where('id', id);
        
      return res.status(204).send();
  },
  async delete(req, res){
    const { id } = req.params;    
    const user_id = req.headers.authorization;

    const department = await connection('departments').where('id', id).select('*').first();

    if(department.user_id !== user_id){
      return res.status(401).json({
        error: 'Operation not permitted.'
      })
    }

    await connection('departments').where('id', id).delete();
    
    return res.status(204).send();
  }
}