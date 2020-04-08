const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  //List Users
  async index(req,res){
    const users = await connection('users').select('*');
    return res.json(users);
  },
  //Create Users
  async create(req, res){
      const {name, email, password, role} = req.body;
      const id = crypto.randomBytes(4).toString('HEX');
    
      await connection('users').insert({
        id,
        email,
        name,
        password,
        role
      });

      return res.json({id});
  }
}