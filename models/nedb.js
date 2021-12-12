const Datastore = require("nedb");
let db = {};
db.users = new Datastore("users.db");

db.users.loadDatabase();





// Retorna o utilizador e sua password encriptada
exports.cRud_login = (email) => {
    return new Promise((resolve, reject) => {
      // busca os registos que contêm a chave
      db.users.findOne(
        {
          _id: email,
        },
        (err, user) => {
          if (err) {
            reject({ msg: "Problema database!" });
          } else {
            if (user == null) {
              reject({ msg: "User doesnt exist!" });
            } else {
              resolve(user);
            }
          }
        }
      );
    });
  };


exports.Crud_registar = (email, password) => {
    // insere um novo utilizador
    return new Promise((resolve, reject) => {
      data = {
        _id: email,
        confirm: 0,
        password: password,
      };
      db.users.insert(data, (err, dados) => {
        if (err) {
          reject(null);
        } else {
          resolve(dados);
        }
      });
    });
  };