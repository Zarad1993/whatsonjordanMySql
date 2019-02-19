// var mongoose = require('mongoose');
var Sequelize = require('sequelize');

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var db = new Sequelize('whatsonjordan', username, password, {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,
	logging: false,
	pool:{
		max:10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

db
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

// var db = {};
 
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.user = require('./models/user.model.js')(sequelize, Sequelize);
// console.log(db); 
 
module.exports = db;

var User = require('./models/user.model');
var Role = require('./models/userType.model');
var Member = require('./models/member.model');
var Maker = require('./models/maker.model');
var Contact = require('./models/contact.model');
var Addrress = require('./models/address.model');
var Nationality = require('./models/nationality.model');
var Event = require('./models/event.model');
var Category = require('./models/category.model');
var SubCategory = require('./models/subCategory.model');
var AgeGroup = require('./models/ageGroup.model');
var Grade = require('./models/grade.model');
var School = require('./models/school.model');


User.belongsTo(Role);
User.belongsTo(Member);
User.belongsTo(Maker);

Member.belongsTo(School);
Member.belongsTo(Contact);
Member.belongsTo(Addrress);
Member.belongsTo(Nationality);
Member.belongsTo(Grade);
Member.hasMany(Event);

Maker.belongsTo(Contact);
Maker.belongsTo(Addrress);
Maker.hasMany(Event);

SubCategory.belongsTo(Category);

Event.belongsTo(Category);
Event.belongsTo(AgeGroup);
Event.belongsTo(Maker);
Event.belongsTo(Addrress);
Event.belongsTo(Category);
Event.belongsTo(SubCategory);

db.sync();


// Eager loading iclude all associated models
// db.sync().then(function(){
// 	User
// 		.findById(1, { include: [{ all: true }] })
// 		.then(function (user) {
// 			console.log('Eager loading..............................', user.dataValues.user_type.dataValues);
// 		});
// });


// change the user_type for particular user
// db.sync().then(function(){
// 	User
// 		.findById(3)
// 		.then(function(foundUser){
// 			// console.log(foundUser.dataValues);
// 			foundUser.setUser_type(3);
// 			foundUser.save();
// 		});
// });
