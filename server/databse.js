// var mongoose = require('mongoose');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var operatorsAliases = {
	$gte: Op.gte,
	$gt: Op.gt
};

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var db = new Sequelize('whatsonjordan', username, password, {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: operatorsAliases,
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
var Address = require('./models/address.model');
var GeoLocation = require('./models/geoLocation.model');
var Nationality = require('./models/nationality.model');
var Event = require('./models/event.model');
var Category = require('./models/category.model');
var SubCategory = require('./models/subCategory.model');
var AgeGroup = require('./models/ageGroup.model');
var Grade = require('./models/grade.model');
var School = require('./models/school.model');
var Feedback = require('./models/feedback.model');
var Expense = require('./models/expense.model');
// var ExpenseType = require('./models/expenseType.model');

User.belongsTo(Role);
User.belongsTo(Member);
User.belongsTo(Maker);

// Address.belongsTo(GeoLocation);

Member.belongsTo(School);
Member.belongsTo(Contact);
Member.belongsTo(Address);
Member.belongsTo(Nationality);
Member.belongsTo(Grade);
// Member.hasMany(Event);

Maker.belongsTo(Contact);
Maker.belongsTo(Address);
Maker.hasMany(Event);

SubCategory.belongsTo(Category);

Event.belongsTo(Category);
Event.belongsTo(AgeGroup);
Event.belongsTo(Maker);
Event.belongsTo(Address);
Event.belongsTo(Category);
Event.belongsTo(SubCategory);
// Event.belongsTo(Expense);
// Event.hasMany(Expense);

// Event.belongsTo(GeoLocation);

// Many to Many relationship (members register for many event And Events has many members)
Member.belongsToMany(Event, {through: 'MemberEvent'});
Event.belongsToMany(Member, {through: 'MemberEvent'});

// Connect the address with the geolocation
Address.belongsTo(GeoLocation);


// One to Many relationship between member and feedback each member has many feedbacks and each feedback belongsto member
// feedback table (memberId, eventId, feedback)
// Member.hasMany(Feedback);
// will add to member .getFeedbacks .setFeedbacks .createFeedback .addFeedbacks .removeFeedback .removeFeedbacks .hasFeedback .hasFeedbacks .counFeedbacks
Feedback.belongsTo(Member);
// will create feedback .getMember .setMember .createMember
Feedback.belongsTo(Event);
// will create feedback .getEvent .setEvent .createEvent




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
