const connection = require('../database/connection');

module.exports = {
  //List of Departments and Tasks from Users
  async index(req,res){
    const user_id = req.headers.authorization;
    const { type } = req.params;

    if(type === "departments"){
      const departments = await connection('departments').where('user_id', user_id).select('*');      
      return res.json({ departments });
    }
    if(type === "tasks"){
      const tasks = await connection('tasks').where('user_id', user_id).select('*');      
      return res.json({ tasks });
    }
  }
}