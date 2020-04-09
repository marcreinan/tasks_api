const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const encryption = require('../encryption');
const UsersController = require('./UsersController');

module.exports = {  
  async create(req,res){
    const { email, password } = req.body;

    const hash = encryption.encrypt(password);

    const user = await connection('users')
      .where({email: email, password: hash}).select('id','name','email','role').first();

    if(!user){
      return res.status(500).json({error: 'Login/Password is invalid.'});
    }
    //AUTH ok
    const id = user.id; 
    const role = user.role;
    var token = jwt.sign({ id , role }, process.env.SECRET, {
      //expiresIn: 300 // expires in 5min
      expiresIn: 3600 // expires in 1hour
    });
    return res.status(200).send({ auth: true, token: token });
  },
  async createfirstadmin(req,res){
    const users = await connection('users').select('*').first();

    if(!users){
      req.headers["x-role"] = "admin";
      req.body.name = 'ADMIN';
      req.body.password = 'ADMIN';
      req.body.email = 'admin@admin.com';
      req.body.role = 'admin';

      UsersController.create(req, res);
    }else{
      return res.status(403).json({error: 'Users already exists.'});
    }
  },
  async deletefirstadmin(req, res){
    if(req.headers["x-role"] === "admin"){
      const user = await connection('users').select('id').where('email','admin@admin.com').first();
      
      req.params.id = user.id;
      
      if(user){
        UsersController.delete(req, res);
      }else{
        return res.status(403).json({error: 'User not found.'});
      }

    }
  }
}