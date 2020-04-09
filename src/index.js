//Importando Express e as Rotas
const express = require('express');
const routes = require('./routes');
//Iniciando o app Express
const app = express();
//Setando json e as rotas
app.use(express.json());
app.use(routes);
//Listen
app.listen(process.env.PORT);
