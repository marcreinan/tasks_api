const express = require('express');
const jwt = require('jsonwebtoken');

const SessionsController = require('./controllers/SessionsController');
const UsersController = require('./controllers/UsersController');
const DepartmentsController = require('./controllers/DepartmentsController');
const TypesTasksController = require('./controllers/TypesTasksController');
const TasksController = require('./controllers/TasksController');
const IndicatorsController = require('./controllers/IndicatorsController');

const routes = express.Router();

function verifyJWT(req, res, next){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    req.headers['authorization'] = decoded.id;
    req.headers['x-role'] = decoded.role;
    next();
  });
}

  routes.get('/', function (req, res) {
    res.send('Tasks API - Online');
  });
  
  //Session
  routes.post('/api/v1/sessions', SessionsController.create);
  //Create First Admin
  routes.post('/api/v1/sessions/firstadmin', SessionsController.createfirstadmin);
  //Delete First Admin
  routes.delete('/api/v1/sessions/firstadmin', verifyJWT, (req, res, next) => { SessionsController.deletefirstadmin(req, res)});

  
  //List Users
  routes.get('/api/v1/users', verifyJWT, (req, res, next) => { UsersController.index(req, res)});
  //Create Users
  routes.post('/api/v1/users', verifyJWT, (req, res, next) => { UsersController.create(req, res)});
  //Edit Users
  routes.put('/api/v1/users/:id', verifyJWT, (req, res, next) => { UsersController.edit(req, res)});
  //Delete Users
  routes.delete('/api/v1/users/:id', verifyJWT, (req, res, next) => { UsersController.delete(req, res)});
  
  //List Departments
  routes.get('/api/v1/departments', verifyJWT, (req, res, next) => { DepartmentsController.index(req, res)});
  //Create Departments
  routes.post('/api/v1/departments', verifyJWT, (req, res, next) => { DepartmentsController.create(req, res)});
  //Edit Departments
  routes.put('/api/v1/departments/:id', verifyJWT, (req, res, next) => { DepartmentsController.edit(req, res)});
  //Delete Departments
  routes.delete('/api/v1/departments/:id', verifyJWT, (req, res, next) => { DepartmentsController.delete(req, res)});
  
  //List TypesTasks
  routes.get('/api/v1/typestasks', verifyJWT, (req, res, next) => { TypesTasksController.index(req, res)});
  //Create TypesTasks
  routes.post('/api/v1/typestasks', verifyJWT, (req, res, next) => { TypesTasksController.create(req, res)});
  //Edit TypesTasks
  routes.put('/api/v1/typestasks/:id', verifyJWT, (req, res, next) => { TypesTasksController.edit(req, res)});
  //Delete TypesTasks
  routes.delete('/api/v1/typestasks/:id', verifyJWT, (req, res, next) => { TypesTasksController.delete(req, res)});
  
  //List Tasks
  routes.get('/api/v1/tasks', verifyJWT, (req, res, next) => { TasksController.index(req, res)});
  routes.get('/api/v1/tasks/:type/:term/', verifyJWT, (req, res, next) => { TasksController.index(req, res)});
  routes.get('/api/v1/tasks/:type/:term/:term2', verifyJWT, (req, res, next) => { TasksController.index(req, res)});
 //Create Tasks
  routes.post('/api/v1/tasks', verifyJWT, (req, res, next) => { TasksController.create(req, res)});
  //Edit Tasks
  routes.put('/api/v1/tasks/:id', verifyJWT, (req, res, next) => { TasksController.edit(req, res)});
  //Delete Tasks
  routes.delete('/api/v1/tasks/:id', verifyJWT, (req, res, next) => { TasksController.delete(req, res)});
  
  //List Tasks from Users
  routes.get('/api/v1/indicators/:type/:id/:term', verifyJWT, (req, res, next) => { IndicatorsController.index(req, res)});
  

module.exports = routes;