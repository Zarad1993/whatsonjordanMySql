// var mongoose = require('mongoose');
var Sequelize = require('sequelize');

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var sequelize = new Sequelize('whatsonjordan', username, password, {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,
	pool:{
		max:10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

sequelize
	.authenticate()
	.then(function(){
		console.log('Connected successfully');

	})
	.catch(function(err){
		console.error('Unable to connect to DB', err);
	});

// sequelize
// 	.sync()
// 	.then(function(){
// 		console.log('whatsonjordan db and user table created successfully');
// 	});

var db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// db.user = require('./models/user.model.js')(sequelize, Sequelize);
// console.log(db); 
 
module.exports = db;

db.User = require('./models/user.model');
db.UserType = require('./models/userType.model');

db.User.belongsTo(db.UserType);