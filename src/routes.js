/*
* Routes - Rotas da API: Direciona a requisição pro controller correspondente verificando a 
* validade do JWT informado.
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/

const express = require('express'); // Import Express.js
const jwt = require('jsonwebtoken'); //Import JWT

//Importação dos Controllers
const SessionsController = require('./controllers/SessionsController');
const UsersController = require('./controllers/UsersController');
const DepartmentsController = require('./controllers/DepartmentsController');
const TypesTasksController = require('./controllers/TypesTasksController');
const TasksController = require('./controllers/TasksController');
const IndicatorsController = require('./controllers/IndicatorsController');

//Importação do Router padrão do Express
const routes = express.Router();

/*
* verifyJWT - Verifica se o JWT enviado na requisição é válido, caso seja válido prossegue para a próxima
* função do pipeline, caso negativo, informa um erro correspondente
*/
function verifyJWT(req, res, next){
  //Recebe o JWT 
  var token = req.headers['x-access-token'];
  //Caso não exista o JWT retorna erro 401
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  //Verifica se o token recebido é válido
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    //Caso o token não seja válido, retorna erro 500
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    //Caso o token seja valido, codifica o id do usuário no header authorization
    req.headers['authorization'] = decoded.id;
    //Codifica o role(admin, agent) do usuario no header x-role
    req.headers['x-role'] = decoded.role;
    //Invoca a próxima função do pipeline
    next();
  });
}

  /*
  * Rotas da API
  *
  */

  //Rota padrão '/'
  routes.get('/', function (req, res) {
    res.send('Tasks API - Online');
  });
  
  //Sessions - Create: Login dos usuarios
  routes.post('/api/v1/sessions', SessionsController.create);
  //Sessions - Create First Admin: Cria um admin inicial, caso não exista usuários no banco
  routes.post('/api/v1/sessions/firstadmin', SessionsController.createfirstadmin);
  //Sessions - Delete First Admin: Deleta o usuário admin inicial
  routes.delete('/api/v1/sessions/firstadmin', verifyJWT, (req, res, next) => { SessionsController.deletefirstadmin(req, res)});

  //Users - Index: Lista todos os usuarios, caso seja passado o id como query, lista um usuario único
  routes.get('/api/v1/users', verifyJWT, (req, res, next) => { UsersController.index(req, res)});
  //Users - Create: Cria um novo usuario
  routes.post('/api/v1/users', verifyJWT, (req, res, next) => { UsersController.create(req, res)});
  //Users - Edit: Edita um usuario de acordo com o id informado
  routes.put('/api/v1/users/:id', verifyJWT, (req, res, next) => { UsersController.edit(req, res)});
  //Users - Delete: Deleta um usuário de acordo com o id informado
  routes.delete('/api/v1/users/:id', verifyJWT, (req, res, next) => { UsersController.delete(req, res)});
  
  //Departments - Index: Lista todos os departamentos, caso seja passado um id como query, lista um departamento unico
  routes.get('/api/v1/departments', verifyJWT, (req, res, next) => { DepartmentsController.index(req, res)});
  //Departments - Create: Cria um novo departamento
  routes.post('/api/v1/departments', verifyJWT, (req, res, next) => { DepartmentsController.create(req, res)});
  //Departments - Edit: Edita um departamento de acordo com o id informado
  routes.put('/api/v1/departments/:id', verifyJWT, (req, res, next) => { DepartmentsController.edit(req, res)});
  //Departments - Delete: Deleta um departamento de acordo com o id informado
  routes.delete('/api/v1/departments/:id', verifyJWT, (req, res, next) => { DepartmentsController.delete(req, res)});
  
  //TypesTasks - Index: Lista todos os tipos de tarefas, caso seja passado um id como query lista um tipo de tarefa unico
  routes.get('/api/v1/typestasks', verifyJWT, (req, res, next) => { TypesTasksController.index(req, res)});
  //TypesTasks - Create: Cria um novo tipo de tarefa
  routes.post('/api/v1/typestasks', verifyJWT, (req, res, next) => { TypesTasksController.create(req, res)});
  //TypesTasks - Edit: Edita um tipo de tarefa de acordo com o id informado 
  routes.put('/api/v1/typestasks/:id', verifyJWT, (req, res, next) => { TypesTasksController.edit(req, res)});
  //TypesTasks - Delete: Deleta um tipo de tarefa de acordo com o id informado
  routes.delete('/api/v1/typestasks/:id', verifyJWT, (req, res, next) => { TypesTasksController.delete(req, res)});
  
  //Tasks - Index: Lista todas as tarefas, caso seja passado um id como query lista uma tarefa unica
  routes.get('/api/v1/tasks', verifyJWT, (req, res, next) => { TasksController.index(req, res)});
  //Tasks - Index: Lista todas as tarefas de acordo com o tipo e o termo passado no params
  routes.get('/api/v1/tasks/:type/:term/', verifyJWT, (req, res, next) => { TasksController.index(req, res)});
  //Tasks - Create: Cria uma nova tarefa
  routes.post('/api/v1/tasks', verifyJWT, (req, res, next) => { TasksController.create(req, res)});
  //Tasks - Edit: Edita uma tarefa de acordo com o id informado 
  routes.put('/api/v1/tasks/:id', verifyJWT, (req, res, next) => { TasksController.edit(req, res)});
  //Tasks - Delete: Deleta uma tarefa de acordo com o id informado
  routes.delete('/api/v1/tasks/:id', verifyJWT, (req, res, next) => { TasksController.delete(req, res)});
  
  //Indicatos - Index: lista os indicadores de acordo com o tipo, id e o termo informado
  routes.get('/api/v1/indicators/:type/:id/:term', verifyJWT, (req, res, next) => { IndicatorsController.index(req, res)});
  
module.exports = routes; //Exporta as rotas