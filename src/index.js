//Importando Express e as Rotas
const express = require('express');
const routes = require('./routes');
//Iniciando o app Express
const app = express();
//Setando json e as rotas
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3333;
//Listen
app.listen(port, function () {
  console.log(`Tasks API - listening on port ${port}!`);
});
