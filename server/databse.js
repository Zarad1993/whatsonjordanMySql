// var mongoose = require('mongoose');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var operatorsAliases = {
	$gte: Op.gte,
	$gt: Op.gt
};

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var db = {};
db.sequelize = new Sequelize('whatsonjordan', username, password, {
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

db.sequelize
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

db.User = require('./models/user.model');
db.UserType = require('./models/userType.model');
db.Member = require('./models/member.model');
db.Maker = require('./models/maker.model');
db.Contact = require('./models/contact.model');
db.Address = require('./models/address.model');
db.GeoLocation = require('./models/geoLocation.model');
db.Nationality = require('./models/nationality.model');
db.Event = require('./models/event.model');
db.Category = require('./models/category.model');
db.SubCategory = require('./models/subCategory.model');
db.AgeGroup = require('./models/ageGroup.model');
db.Grade = require('./models/grade.model');
db.School = require('./models/school.model');
db.Feedback = require('./models/feedback.model');
db.Expense = require('./models/expense.model');
db.ExpenseType = require('./models/expenseType.model');

db.User.belongsTo(db.UserType);
db.User.belongsTo(db.Member);
db.User.belongsTo(db.Maker);

// Address.belongsTo(GeoLocation);

db.Member.belongsTo(db.School);
db.Member.belongsTo(db.Contact);
db.Member.belongsTo(db.Address);
db.Member.belongsTo(db.Nationality);
db.Member.belongsTo(db.Grade);
// Member.hasMany(Event);

db.Maker.belongsTo(db.Contact);
db.Maker.belongsTo(db.Address);
db.Maker.hasMany(db.Event);

db.SubCategory.belongsTo(db.Category);

db.Event.belongsTo(db.Category);
db.Event.belongsTo(db.AgeGroup);
db.Event.belongsTo(db.Maker);
db.Event.belongsTo(db.Address);
db.Event.belongsTo(db.Category);
db.Event.belongsTo(db.SubCategory);
// Event.belongsTo(GeoLocation);

// Many to Many relationship (members register for many event And Events has many members)
db.Member.belongsToMany(db.Event, {through: 'MemberEvent'});
db.Event.belongsToMany(db.Member, {through: 'MemberEvent'});
db.Expense.belongsToMany(db.Event, {through: 'EventExpense'});
db.Expense.belongsTo(db.ExpenseType);

// Connect the address with the geolocation
db.Address.belongsTo(db.GeoLocation);


// One to Many relationship between member and feedback each member has many feedbacks and each feedback belongsto member
// feedback table (memberId, eventId, feedback)
// Member.hasMany(Feedback);
// will add to member .getFeedbacks .setFeedbacks .createFeedback .addFeedbacks .removeFeedback .removeFeedbacks .hasFeedback .hasFeedbacks .counFeedbacks
db.Feedback.belongsTo(db.Member);
// will create feedback .getMember .setMember .createMember
db.Feedback.belongsTo(db.Event);
// will create feedback .getEvent .setEvent .createEvent


// When drop the database recreate fixed data
// Expense types
// addExpenseTypes();

db.sequelize.sync();



// function addExpenseTypes() {
// 	var exTypes = ['Salary', 'Rent', 'Hospitality', 'Misc'];
// 	for (var i in exTypes) {
// 		console.log(exTypes[i]);
// 		var id = i + 1;
// 		ExpenseType.create({ id: id, type: exTypes[i] })
// 	}
// }
