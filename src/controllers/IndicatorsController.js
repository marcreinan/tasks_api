/*
* IndicatorsController - Responsavel pelos indicadores dos departamentos e dos usuarios
* 
* @author Marc Reinan Gomes Dantas do Nascimento
*/
const connection = require('../database/connection'); //Import conexao ao banco de dados
const moment = require('moment'); //Import Moment.js

module.exports = {
  //Listar indicadores
  async index(req,res){
    const { type, id, term } = req.params; //Pega os parametros principais
    //unity: years, months, weeks, days, hours, minutes, and seconds
    let { unity = 'days', status = 3} = req.query; //Pega os parametros opcionais
    //Indicadores dos Departamentos
    if(type === "departments"){
      //Quantidade de tarefas do status informado
      if(term === "tasks"){
        //pega a quantidade de tarefas de acordo com o status | status padrão: 3 (finalizado)
        const [ count ] = await connection('tasks').where('department_id', id).andWhere('status', status).select('*').count();      
        //retorna a resposta do contador
        return res.status(200).json({
          "department_id": id, //departamento
          "status": status, //status das tarefas
          "total_tasks": count['count(*)'] //contador de tarefas
        });
      }
      //Media de tempo das tarefas: Criadas e Iniciadas
      if(term === "avgcreatedstarted"){
        //Pega as tarefas de acordo com id do departamento e o status informado | status padrao: 3 (finalizado)
        const tasks = await connection('tasks').where('department_id', id).andWhere('status', status).select('*');      
        var total = 0; //contador de tempo total
        var i = 0; //contador de tarefas
        tasks.forEach( t =>{ //Percorre as tarefas 
          var a = moment(t.started_at); //Pega a data e hora de inicio
          var b = moment(t.created_at); //Pega a data e hora da criação
          total += a.diff(b,unity); //Adiciona ao total a diferença entre as datas
          i++; //incrementa o contador de tarefas
        });
        //Retorna a resposta 200 - Ok
        return res.status(200).json({
          "department_id": id,//Id do departamento
          "total_tasks": i, //total de tarefas encontradas
          "status": status, //status informado
          "avg_created_started": Math.trunc(total /= i), //media do tempo (total de tempo/qtd de tarefas)
          "unity": unity //unidade de medidas usada na media
        });
      }
      //Media de tempo das tarefas: Iniciadas e Finalizadas
      if(term === "avgstartedfinished"){
        //Pega as tarefas de acordo com id do departamento e o status informado | status padrao: 3 (finalizado)
        const tasks = await connection('tasks').where('department_id', id).andWhere('status', status).select('*');      
        var total = 0; //contador de tempo total
        var i = 0; //contador de tarefas
        tasks.forEach( t =>{ //Percorre as tarefas 
          var a = moment(t.finished_at); //Pega a data e hora de finalizacao
          var b = moment(t.started_at); //Pega a data e hora de inicio
          total += a.diff(b,unity); //Adiciona ao total a diferença entre as datas
          i++; //incrementa o contador de tarefas
        });
        //Retorna a resposta 200 - Ok
        return res.status(200).json({
          "department_id": id, //Id do departamento
          "total_tasks": i, //total de tarefas encontradas
          "status": status, //status informado
          "avg_started_finished": Math.trunc(total /= i), //media do tempo (total de tempo/qtd de tarefas)
          "unity": unity //unidade de medidas usada na media
        });
      }
    }
    //Indicadores dos Usuarios
    if(type === "user"){
      //Quantidade de tarefas do status informado
      if(term === "tasks"){
        //pega a quantidade de tarefas de acordo com o status | status padrão: 3 (finalizado)
        const [ count ] = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*').count();      
        //retorna a resposta do contador
        return res.status(200).json({
          "responsible_id": id, //responsavel
          "status": status, //status das tarefas
          "total_tasks": count['count(*)'] //contador de tarefas
        });
      }
      //Media de tempo das tarefas: Criadas e Iniciadas
      if(term === "avgcreatedstarted"){
        //Pega as tarefas de acordo com id do usuario responsavel e o status informado | status padrao: 3 (finalizado)
        const tasks = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*');      
        var total = 0; //contador de tempo total
        var i = 0; //contador de tarefas
        tasks.forEach( t =>{ //Percorre as tarefas
          var a = moment(t.started_at);  //Pega a data e hora de inicio
          var b = moment(t.created_at);  //Pega a data e hora de criacao
          total += a.diff(b,unity); //Adiciona ao total a diferença entre as datas
          i++; //incrementa o contador de tarefas
        });
        //Retorna a resposta 200 - Ok
        return res.status(200).json({
          "responsible_id": id, //responsavel
          "total_tasks": i, //total de tarefas encontradas
          "status": status, //status informado
          "avg_created_started": Math.trunc(total /= i), //media do tempo (total de tempo/qtd de tarefas)
          "unity": unity //unidade de medidas usada na media
        });
      }
      //Media de tempo das tarefas: Iniciadas e Finalizadas
      if(term === "avgstartedfinished"){
        //Pega as tarefas de acordo com id do departamento e o status informado | status padrao: 3 (finalizado)
        const tasks = await connection('tasks').where('responsible_id', id).andWhere('status', status).select('*');      
        var total = 0; //contador de tempo total
        var i = 0; //contador de tarefas
        tasks.forEach( t =>{ //Percorre as tarefas
          var a = moment(t.finished_at); //Pega a data e hora de finalizacao
          var b = moment(t.started_at); //Pega a data e hora de inicio
          total += a.diff(b,unity); //Adiciona ao total a diferença entre as datas
          i++; //incrementa o contador de tarefas
        });
        //Retorna a resposta 200 - Ok
        return res.status(200).json({
          "responsible_id": id, //responsavel
          "total_tasks": i, //total de tarefas encontradas
          "status": status, //status informado
          "avg_started_finished": Math.trunc(total /= i), //media do tempo (total de tempo/qtd de tarefas)
          "unity": unity //unidade de medidas usada na media
        });
      }
    }
  }
}