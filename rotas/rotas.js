const { response } = require("express");
const path = require('path');
module.exports = app => {
    const controlador = require("../controladores/controller.js");
  
    var router = require("express").Router();


    // Cria um novo utilizador
    router.post("/registar", controlador.registar);

    // Rota para login - tem de ser POST para não vir user e pass na URL
    router.post("/login", controlador.login);


    //para info de todos os updates
    router.get('/news', controlador.news)


    //router.get('/news/:webpageID', controlador.



    app.use('/api', router);
  };