const crypto = require('crypto');
const connection = require('../database/connection');
const encryption = require('../encryption');

module.exports = {
  //List Users
  async index(req,res){
    if(req.headers["x-role"] === "admin"){
      const users = await connection('users').select('*');
      return res.json(users);
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  //Create Users
  async create(req, res){
    if(req.headers["x-role"] === "admin"){
      const {name, email, role} = req.body;
      const password = encryption.encrypt(req.body.password);
      const id = crypto.randomBytes(4).toString('HEX');      
      
      await connection('users').insert({
        id,
        email,
        name,
        password,
        role
      });

      return res.json({id});
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  async edit(req, res){
    if(req.headers["x-role"] === "admin"){
      const { id } = req.params;
      const { name, email, password, role } = req.body;
      
      const user = await connection('users').where('id', id).select('*').first();

      await connection('users').update({
        name,
        email,
        password,
        role
      }).where('id', id);

      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  },
  async delete(req, res){
    const { id } = req.params;    

    if(req.headers["x-role"] === "admin"){
      const task = await connection('users').where('id', id).select('*').first();
      await connection('users').where('id', id).delete();
    
      return res.status(204).send();
    }else{
      return res.status(401).json({
        error: 'Operation not authorized.'
      });
    }
  }  
}