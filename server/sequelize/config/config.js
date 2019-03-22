var Sequelize = require('sequelize');
var Op = Sequelize.Op;

var operatorsAliases = {
  $gte: Op.gte,
  $gt: Op.gt
};

// var username = process.envMYSQL_USERNAME;
// var password = process.env.MYSQL_PASSWORD;
var username ='awsahmed';
var password = 'ASD123ASD';

// console.log('the user',username,'the password', password);


module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": "whatsonjordan2",
    "host": "127.0.0.1",
    "dialect": "mysql",
    logging: false,
    operatorsAliases: operatorsAliases,
    pool:{
      max:10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    logging: false,
    operatorsAliases: operatorsAliases,
    pool:{
      max:10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    logging: false,
    operatorsAliases: operatorsAliases,
    pool:{
      max:10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
