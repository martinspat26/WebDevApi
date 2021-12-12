require("dotenv").config();

const db = require("../models/nedb"); // Define o MODEL que vamos usar
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const axios = require('axios');  //added
const cheerio = require('cheerio');
const cors = require('cors');

const webpages = [
    {
        name: 'eurogamer',
        adress: 'https://www.eurogamer.net/authors/1460',
        base:'http://www.eurogamer.net',
    },
    {
        name: 'steam',
        adress: 'https://store.steampowered.com/app/739630/Phasmophobia/',
        base: '',
    },
    {
        name: 'gamesradar',
        adress: 'https://www.gamesradar.com/uk/search/?searchTerm=phasmophobia',
        base: '',
    }
]


exports.authenticateToken = (req, res, next)  => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        console.log("Null Token")
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


const { response } = require("express");
const { next } = require("cheerio/lib/api/traversing");




exports.verificaUtilizador = async (req, res) => {
    const confirmationCode = req.params.confirmationCode;
    db.crUd_ativar(confirmationCode);
    const resposta = { message: "User activated!" };
    console.log(resposta);
    return res.send(resposta);
  };


// REGISTAR - cria um novo utilizador
exports.registar = async (req, res) => {
    console.log("Register new user");
    if (!req.body) {
      return res.status(400).send({
        message: "Cannot be null!",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;

    db.Crud_registar(email, password) // C: Create
      .then((dados) => {
        res.status(201).send({
          message:
            "User created, check your inbox to activate!",
        });
        console.log("Controller - user registered: ");
        console.log(JSON.stringify(dados)); // para debug
      })
      .catch((response) => {
        console.log("controller - register:");
        console.log(response);
        return res.status(400).send(response);
      });
  };

  // LOGIN - autentica um utilizador
exports.login = async (req, res) => {
    console.log("Auntenticate user");
    if (!req.body) {
      return res.status(400).send({
        message: "Cannot be null!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const password = hashPassword;
    db.cRud_login(email) //
      .then(async (dados) => {
        if (await bcrypt.compare(req.body.password, dados.password)) {
          const user = { name: email };
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autorização
          console.log("Database response: ");
          console.log(JSON.stringify(dados)); // para debug
        } else {
          console.log("Wrong password!");
          return res.status(401).send({ erro: "Wrong password!" });
        }
      })
      .catch((response) => {
        console.log("controller:");
        console.log(response);
        return res.status(400).send(response);
      });
  };


  
// CREATE - cria um novo registo
exports.create = (req, res) => {
    console.log("Create");
    if (!req.body) {
      return res.status(400).send({
        message: "Cannot be null!",
      });
    }
    const data = req.body;
    db.Crud(data); // C: Create
    const resposta = { message: "Register complete!" };
    console.log(resposta);
    return res.send(resposta);
  };


//api
exports.news = async (req,res) => {
  
 
    const articles = []
    await Promise.all(webpages.map(async (webpage) => {
      await axios.get(webpage.adress)
      .then(reponse => {
          const html = reponse.data
          const $ = cheerio.load(html)
         
          $('a:contains("update")', html).each(function (){
              const title = $(this).text().replace(/(\r\n|\n|\r|\"|\t)/gm, "");
              const url = $(this).attr('href')
              //console.log(title + webpage.base + url + webpage.name);
              articles.push({
                  title,
                  url: webpage.base + url,
                  source: webpage.name
              })
          })
      })
    }))
    return res.send(articles);

 
}


