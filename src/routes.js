const express = require('express');

const UsersController = require('./controllers/UsersController');
const DepartmentsController = require('./controllers/DepartmentsController');
const TasksController = require('./controllers/TasksController');
const ProfileController = require('./controllers/ProfileController');

const routes = express.Router();



  //List Users
  routes.get('/api/v1/users', UsersController.index)
  //Create Users
  routes.post('/api/v1/users', UsersController.create);
  
  //List Departments
  routes.get('/api/v1/departments', DepartmentsController.index);
  //Create Departments
  routes.post('/api/v1/departments', DepartmentsController.create);
  //Edit Departments
  routes.put('/api/v1/departments/:id', DepartmentsController.edit);
  //Delete Departments
  routes.delete('/api/v1/departments/:id', DepartmentsController.delete);
  
  //List Tasks
  routes.get('/api/v1/tasks', TasksController.index);
  //Create Tasks
  routes.post('/api/v1/tasks', TasksController.create);
  //Edit Tasks
  routes.put('/api/v1/tasks/:id', TasksController.edit);
  //Delete Tasks
  routes.delete('/api/v1/tasks/:id', TasksController.delete);
  
  //List Tasks from Users
  routes.get('/api/v1/profile/:type', ProfileController.index);
  



module.exports = routes;