/*
* Index - Index da API
*
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const express = require('express'); //Import Express.js
const routes = require('./routes'); //Import Routes

const app = express(); //Iniciando o app Express

app.use(express.json()); //Setando json 
app.use(routes); //Setando as rotas

const port = process.env.PORT || 3333; //Setando a porta para Listen

app.listen(port, function () { //Listen
  console.log(`Tasks API - listening on port ${port}!`); //Mensagem de boas vindas
});
