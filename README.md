# Tasks_api
Tasks_API v1.0.0
>API para cadastramento de tarefas e consulta de indicadores(nº de tarefas concluidas, tempo médio, etc)

Link para a API online: https://blooming-harbor-88519.herokuapp.com/

## Rotas
Ao realizar o login, a API gera um token JWT válido por 1 hora.
É necessário enviar o JWT em todas as rotas(exceto na /sessions) através do header[x-access-token].

Através do token a API descobre o cargo do usuário logado e libera o acesso a rota, algumas rotas estão disponiveis apenas para usuários com cargo admin.

Todas as rotas são precedidas por /api/v1/, assim é necessário incluir esse trecho nas requisições. ex: para acessar a rota /users utilize o endereço /api/v1/users, para acessar a rota /sessions utilize o endereço /api/v1/sessions.

### Rota Sessions
- **POST /sessions {email, password}** - Rota de autenticação, checa as informações, realiza o login e retorna um JWT.  
Resposta: 200 {auth: true, token: JWT}
Exemplo de resposta:
```sh 
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViNzJiNTIwIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTg2NjIwMTgyLCJleHAiOjE1ODY2MjM3ODJ9.30-m6oSuqYLvXO7ltuXPFv6BYyINqqUSu3qEhG1FVEU"
}
```

- **POST /sessions/firstadmin** - Cria um usuário admin padrão caso não exista nenhum usuário cadastrado, utilizada para iniciar a api em uma nova instalação. 
Resposta: 200 {id: id do usuario criado}
Exemplo de resposta:
```sh 
{
  "id": "e6300e74"
}
```
- **DELETE /sessions/firstadmin** - Deleta o usuário admin padrão
Resposta: 204 - No Content

### Rota Users

- **GET /users {id, page}** - Lista todos os usuários cadastrados no sistema, a resposta é paginada e exibe 5 resultados por vez, para acessar a próxima página inclua o parametro page na chamada ex: /users?page=2 para listar um unico usuário inclua o parametro id contendo o id do usuário a ser listado ex: /users?id=eb72b520
Resposta: 200 - {"id": id do user,"name": nome do user,"email": email do user,"password": senha encriptada,"role": cargo do user},
Exemplo de resposta: /users
```sh 
[
  {
    "id": "eb72b520",
    "name": "Marc Reinan",
    "email": "admin@tasksapi.com",
    "password": "d0b7be22ffcc21f483f950b43f79fa428cb592c37f028549",
    "role": "admin"
  },
  {
    "id": "08359243",
    "name": "João Arthur",
    "email": "agent@tasksapi.com",
    "password": "d0b7be22ffcc21f483f950b43f79fa428cb592c37f028549",
    "role": "agent"
  }
]
```
Exemplo de resposta: /users?id=eb72b520
```sh 
{
  "id": "eb72b520",
  "name": "Marc Reinan",
  "email": "admin@tasksapi.com",
  "password": "d0b7be22ffcc21f483f950b43f79fa428cb592c37f028549",
  "role": "admin"
}
```

- **POST /users {name, email, password, role}** - Cria um novo usuário com os parametros informados
Resposta: 200 - {id: id gerado para o novo usuário}
Exemplo de requisição:
```sh 
{
	"name": "Marc Reinan",
	"email": "admin2@tasksapi.com",
	"password": "123456",
	"role": "admin"
}
```
Exemplo de resposta:
```sh 
{
  "id": "566dd1fd"
}
```
- **PUT /users/:id** - Edita um usuário de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /users/566dd1fd
```sh 
{
	"name": "Usuario 2",
	"email": "user2@reinan.com",
	"password": "654321",
	"role": "agent"
}
```
- **DELETE /users/:id** - Deleta um usuário de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /users/366ab50d


### Rota TypeTasks

- **GET /typestasks {id, page}** - Lista todos os tipos de tarefas, a resposta é paginada e exibe 5 resultados por vez, para acessar a próxima página inclua o parametro page na chamada ex: /typestasks?page=2 para listar um unico tipo de tarefa inclua o parametro id contendo o id a ser listado ex: /typestasks?id=1
Resposta: 200 - {"id": id da typetask,"name": nome do user},
Exemplo de resposta: /typestasks
```sh
[
  {
    "id": 1,
    "name": "Abstrata"
  },
  {
    "id": 2,
    "name": "Execução"
  },
  {
    "id": 3,
    "name": "Comunicação"
  }
]
```
Exemplo de resposta: /typestasks?id=3  
```sh
{
  "id": 3,
  "name": "Comunicação"
}
```

- **POST /typestasks {name}** - Cria um novo tipo de tarefa com os parametros informados
Resposta: 200 - {id: id gerado para o novo tipo de tarefa}
Exemplo de requisição:  
```sh
{
	"name": "Tipo de tarefa 2"
}  
```
Exemplo de resposta:  
```sh
{
  "id": "2"
}
```
- **PUT /typestasks/:id** - Edita um tipo de tarefa de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /users/5
```sh
{
	"name": "Tipo de tarefa 3"
}
```
- **DELETE /typestasks/:id** - Deleta um tipo de tarefa de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /typestasks/3


### Rota Departments

- **GET /departments {id, page}** - Lista todos os departamentos, a resposta é paginada e exibe 5 resultados por vez, para acessar a próxima página inclua o parametro page na chamada ex: /typestasks?page=2 para listar um unico departamento inclua o parametro id contendo o id a ser listado ex: /departments?id=1
Resposta: 200 - {"id": id do departamento,"name": nome do departamento,"user_id": id o usuário que criou o departamento},
Exemplo de resposta: /departments
```sh
[
  {
    "id": 1,
    "name": "Departamento T.I",
    "user_id": "eb72b520"
  },
  {
    "id": 2,
    "name": "Departamento R.H",
    "user_id": "eb72b520"
  },
  {
    "id": 3,
    "name": "Departamento Financeiro",
    "user_id": "eb72b520"
  }
]
```
Exemplo de resposta: /departments?id=3
```sh
{
  "id": 3,
  "name": "Departamento Financeiro",
  "user_id": "eb72b520"
}
```
- **POST /departments {name}** - Cria um novo departamento com os parametros informados
Resposta: 200 - {id: id gerado para o novo departamento}
Exemplo de requisição:
```sh
{
	"name": "Novo Departamento"
}
```
Exemplo de resposta:  
```sh
{
  "id": "4"
}  
```

- **PUT /departments/:id** - Edita um departamento de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /users/3  
```sh
{
	"name": "Departamento editado"
}  
```

- **DELETE /departments/:id** - Deleta um departamento de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /departments/3


### Rota Tasks

- **GET /tasks {id, page}** - Lista todos as tarefas, a resposta é paginada e exibe 5 resultados por vez, para acessar a próxima página inclua o parametro page na chamada ex: /tasks?page=2 para listar uma unica tarefa inclua o parametro id contendo o id a ser listado ex: /tasks?id=1
Resposta: 200 - {"id": id da tarefa,"description": descrição da tarefa,"type_id": id do tipo da tarefa associado,"created_by":id do usuário que criou a tarefa,"responsible_id": id do usuário responsável pela tarefa,"department_id": id do departamento associado a tarefa,"status": código de status da tarefa 1- aberto 2- em andamento 3- finalizado,"created_at": data e hora da criação,"started_at": data e hora de inicio,"finished_at": data e hora de finalização}
Exemplo de resposta: /tasks
```sh
[
  {
    "id": 18,
    "description": "Descrição da tarefa 1",
    "type_id": 1,
    "created_by": "eb72b520",
    "responsible_id": "08359243",
    "department_id": 2,
    "status": 3,
    "created_at": "2020-04-09 19:06:50",
    "started_at": "2020-05-08 00:05:01",
    "finished_at": "2020-06-09 00:05:01"
  },
  {
    "id": 19,
    "description": "lorem lorem lorem",
    "type_id": 1,
    "created_by": "eb72b520",
    "responsible_id": "08359243",
    "department_id": 2,
    "status": 2,
    "created_at": "2020-04-09 19:07:06",
    "started_at": "2020-05-09 00:05:01",
    "finished_at": null
  }
]
```
Exemplo de resposta: /tasks?id=3
```sh
{
  "id": 3,
  "description": "lorem lorem lorem",
  "type_id": 1,
  "created_by": "eb72b520",
  "responsible_id": "08359243",
  "department_id": 2,
  "status": 2,
  "created_at": "2020-04-09 19:07:06",
  "started_at": "2020-05-09 00:05:01",
  "finished_at": null
}
```
- **GET /tasks/:type/:term {page}** - Lista todos as tarefas de acordo com tipo(type) e o termo(informado), a resposta é paginada e exibe 5 resultados por vez, para acessar a próxima página inclua o parametro page na chamada ex: /tasks?page=2 
Os tipos{:type} possiveis são: created_by, responsible_id, department, status, description, created_at, started_at, finished_at, type_id
Os termos podem ser o id, string e datas, dependendo do tipo utilizado, ver abaixo os exemplos de chamadas.
Resposta: 200 - {"id": id da tarefa,"description": descrição da tarefa,"type_id": id do tipo da tarefa associado,"created_by":id do usuário que criou a tarefa,"responsible_id": id do usuário responsável pela tarefa,"department_id": id do departamento associado a tarefa,"status": código de status da tarefa 1- aberto 2- em andamento 3- finalizado,"created_at": data e hora da criação,"started_at": data e hora de inicio,"finished_at": data e hora de finalização}

Exemplos de requisição:
**/tasks/created_by/eb72b520** - type: created_by | term: id do usuário que criou a tarefa
**/tasks/responsible_id/08359243** - type: responsible_id | term: id do usuário responsável pela tarefa
**/tasks/department/2** - type: department | term: id do departamento da tarefa
**/tasks/status/2** - type: status | term: 1 (em aberto), 2 (em andamento), 3 (finalizados)
**/tasks/type_id/2** - type: type_id | term: id do tipo de tarefa anexado a tarefa
**/tasks/description/lorem** - type: description | term: string, trecho de texto que esteja na descrição
**/tasks/created_at/2020-04-09** - type: created_at | term: date(YYYY-MM-DD) data de criação 
**/tasks/started_at/2020-04-09** - type: started_at | term: date(YYYY-MM-DD) data de inicio 
**/tasks/finished_at/2020-04-09** - type: created_at | term: date(YYYY-MM-DD) data de finalização

- **POST /tasks {description, type_id, responsible_id, department_id}** - Cria uma nova tarefa com os parametros informados
Resposta: 200 - {id: id gerado para a nova tarefa}
Exemplo de requisição:
```sh
{
  "description": "lorem lorem lorem",
  "type_id": 1,
  "responsible_id": "08359243",
  "department_id": 2,
}
```
Exemplo de resposta:
```sh
{
  "id": "4"
}
```
- **PUT /tasks/:id {description, type_id, responsible_id, department_id, started_at, finished_at}** - Edita uma tarefa de acordo o id informado e os parametros informados
Resposta: 204 - No Content
Exemplo de requisição: /tasks/19
```sh
{
	"description": "tarefa editada",
  "started_at: "2020-04-08 19:20:23"
}
```
- **DELETE /tasks/:id** - Deleta um tarefa de acordo o id informado
Resposta: 204 - No Content
Exemplo de requisição: /tasks/19


### Rota Indicators

- **GET /indicators/:type/:id/:term {unity, status}** - Lista os indicadores dos departamentos e dos usuários de acordo com o tipo(type), o id(id do usuário ou do departamento) e o termo. por padrão os indicadores retornam as tarefas finalizadas (status = 3), caso queira indicadores de outras status basta incluir o parametro status na chamada ex: /indicators/departments/2/tasks?status=2. por padrão a unidade da media de desempenho é contada em dias(days), para realizar o cálculo com outras unidades inclua o parametro unity na chamada ex: /indicators/departments/2/avgcreatedstarted?unity=hours

  Os tipos{:type} possiveis são: departments, user
  O id(:id) é referente ao departamento ou ao usuário de acordo com o tipo(type) informado
  Os termos(:term) possiveis são: tasks, avgcreatedstarted, avgstartedfinished
  As unidades(?unity) possiveis são: years, months, weeks, days, hours, minutes, and seconds
  Os status(?status) possiveis são: 1 (em aberto), 2 (em andamento) e 3 (finalizado)

Respostas: 200 - {"department_id": id do departamento,"responsible_id": id do responsavel da tarefa,"status": status das tarefas,"total_tasks": numero de tarefa, "avg_created_started": media entre criação e inicio,"avg_started_finished": media entre inicio e finalização, "unity": unidade de medida da média(padrão dias)}
Exemplos de requisição: **/indicators/departments/2/tasks**
```sh
{
  "department_id": "2",
  "status": 3,
  "total_tasks": 2
}
```
**/indicators/departments/2/avgcreatedstarted** (media entre criação e inicio)  
```sh
{
  "department_id": "2",
  "total_tasks": 2,
  "status": "3",
  "avg_created_started": 28, //nº de dias
  "unity": "days"
}  
```
**/indicators/departments/2/avgcreatedstarted?unity=hours** (media entre criação e inicio, unidade horas)  
```sh
{
  "department_id": "2",
  "total_tasks": 2,
  "status": "3",
  "avg_created_started": 688, //nº de horas
  "unity": "hours"
}
```
**/indicators/departments/2/avgstartedfinished** (media entre inicio e finalização)  
```sh
{
  "department_id": "2",
  "total_tasks": 2,
  "status": 3,
  "avg_started_finished": 31,
  "unity": "days"
}  
```
**/indicators/departments/2/avgstartedfinished?unity=seconds** (media entre inicio e finalização, unidade hosegundosras)  
```sh
{
  "department_id": "2",
  "total_tasks": 2,
  "status": 3,
  "avg_started_finished": 2721600,
  "unity": "seconds"
}  
```
**/indicators/user/08359243/tasks**  
```sh
{
  "responsible_id": "08359243",
  "status": 3,
  "total_tasks": 2
}  
```
**/indicators/user/08359243/avgcreatedstarted** (media entre criação e inicio)  
```sh
{
  "responsible_id": "08359243",
  "total_tasks": 2,
  "status": 3,
  "avg_created_started": 28,
  "unity": "days"
}  
```
**/indicators/user/08359243/avgcreatedstarted?unity=hours** (media entre criação e inicio, unidade horas)  
```sh
{
  "responsible_id": "08359243",
  "total_tasks": 2,
  "status": 3,
  "avg_created_started": 688,
  "unity": "hours"
}  
```
**/indicators/user/08359243/avgstartedfinished** (media entre inicio e finalização)  
```sh
{
  "responsible_id": "08359243",
  "total_tasks": 2,
  "status": 3,
  "avg_started_finished": 31,
  "unity": "days"
}  
```
**/indicators/user/08359243/avgstartedfinished?unity=seconds** (media entre inicio e finalização, unidade segundos)  
```sh
{
  "responsible_id": "08359243",
  "total_tasks": 2,
  "status": 3,
  "avg_started_finished": 2721600,
  "unity": "seconds"
}  
```

