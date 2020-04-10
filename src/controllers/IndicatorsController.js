const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
  //List of Departments and Tasks from Users
  async index(req,res){
    const { type, id, term } = req.params;
    //years, months, weeks, days, hours, minutes, and seconds
    let { unity = 'days', status = 3} = req.query;

    if(type === "departments"){
      if(term === "tasks"){
        const [ count ] = await connection('tasks').where('department_id', id).andWhere('status', status).select('*').count();      
        
        return res.json({
          "department_id": id,
          "status": status,
          "total_tasks": count['count(*)']
        });
      }
      if(term === "avgcreatedstarted"){
        const tasks = await connection('tasks').where('department_id', id).andWhere('status', status).select('*');      
        var total = 0;
        var i = 0;
        tasks.forEach( t =>{
          var a = moment(t.started_at);
          var b = moment(t.created_at);
          total += a.diff(b,unity);
          i++;
        });

        return res.status(200).json({
          "department_id": id,
          "total_tasks": i,
          "status": status,
          "avg_created_started": Math.trunc(total /= i),
          "unity": unity
        });
      }
      if(term === "avgstartedfinished"){
        const tasks = await connection('tasks').where('department_id', id).andWhere('status', status).select('*');      
        var total = 0;
        var i = 0;
        tasks.forEach( t =>{
          var a = moment(t.finished_at);
          var b = moment(t.started_at);
          total += a.diff(b,unity);
          i++;
        });

        return res.status(200).json({
          "department_id": id,
          "total_tasks": i,
          "status": status,
          "avg_started_finished": Math.trunc(total /= i),
          "unity": unity
        });
      }
    }
    
    
    if(type === "user"){
      if(term === "tasks"){
        const [ count ] = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*').count();      
  
        return res.json({
          "responsible_id": id,
          "status": status,
          "total_tasks": count['count(*)']
        });
      }
      if(term === "avgcreatedstarted"){
        const tasks = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*');      
        var total = 0;
        var i = 0;
        tasks.forEach( t =>{
          var a = moment(t.started_at);
          var b = moment(t.created_at);
          total += a.diff(b,unity);
          i++;
        });

        return res.status(200).json({
          "responsible_id": id,
          "total_tasks": i,
          "status": status,
          "avg_created_started": Math.trunc(total /= i),
          "unity": unity
        });
      }
      if(term === "avgstartedfinished"){
        const tasks = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*');      
        var total = 0;
        var i = 0;
        tasks.forEach( t =>{
          var a = moment(t.finished_at);
          var b = moment(t.started_at);
          total += a.diff(b,unity);
          i++;
        });

        return res.status(200).json({
          "responsible_id": id,
          "total_tasks": i,
          "avg_started_finished": Math.trunc(total /= i),
          "unity": unity
        });
      }

    }
  }
}