const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
  //List Tasks
  async index(req,res){
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      let { type, term } = req.params
      let { page = 1, order = 'asc', order_by = 'id'} = req.query;

      let tasks, term2;

      switch(type){
        case 'created_by':
          tasks = await connection('tasks').orderBy(order_by, order).where('created_by',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'responsible':
          tasks = await connection('tasks').orderBy(order_by, order).where('responsible_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'department':
          tasks = await connection('tasks').orderBy(order_by, order).where('department_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'status':
          tasks = await connection('tasks').orderBy(order_by, order).where('status',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'description':
          tasks = await connection('tasks').orderBy(order_by, order).where('description', 'like', `%${term}%`).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'created_at':
          term2 = moment(term).add(1,'d').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('created_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'started_at':
          term2 = moment(term).add(1,'d').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('started_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'finished_at':
          term2 = moment(term).add(1,'d').format('YYYY-MM-DD HH:mm:ss');
          tasks = await connection('tasks').orderBy(order_by, order).whereBetween('finished_at', [term, term2]).limit(5).offset((page - 1) * 5).select('*');
          break;
        case 'type':
          tasks = await connection('tasks').orderBy(order_by, order).where('type_id',term).limit(5).offset((page - 1) * 5).select('*');
          break;
        default:
          tasks = await connection('tasks').orderBy(order_by, order).limit(5).offset((page - 1) * 5).select('*');
          break;
      }
      return res.json(tasks);

    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Create Tasks
  async create(req, res){
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      const { description, department_id, type_id, responsible_id } = req.body;
      const created_by = req.headers.authorization;
      let now = moment();
      const created_at = now.format("YYYY-MM-DD HH:mm:ss");
    
      const [id] = await connection('tasks').insert({
        description,
        created_by,
        type_id,
        department_id,
        responsible_id,
        created_at
      });

      return res.json({ id });
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Edit Tasks
  async edit(req, res){
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      const { type, description, type_id, responsible_id, department_id, status } = req.body;
      let { started_at, finished_at } = req.body;
      const { id } = req.params;

      if(req.body.hasOwnProperty('started_at') && (!!started_at)){ started_at = moment(started_at).format("YYYY-MM-DD HH:mm:ss")}
      if(req.body.hasOwnProperty('finished_at') && (!!finished_at)){ finished_at = moment(req.body.finished_at).format("YYYY-MM-DD HH:mm:ss")}

      await connection('tasks').update({
        type,
        description,
        type_id,
        responsible_id,
        department_id,
        status,
        started_at,
        finished_at
      }).where('id', id);
        
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  async delete(req, res){
    if(req.headers["x-role"] === "admin" || req.headers["x-role"] === "agent"){
      const { id } = req.params;    
  
      await connection('tasks').where('id', id).delete();
      
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  }
}