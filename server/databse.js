var Sequelize = require('sequelize');
var Op = Sequelize.Op;
var operatorsAliases = {
	$gte: Op.gte,
	$gt: Op.gt
};

var username = process.env.MYSQL_USERNAME;
var password = process.env.MYSQL_PASSWORD;

var db = {};
db.sequelize = new Sequelize('whatsonjordan3', username, password, {
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
		console.error('Unable to connect to whatsonjordan3 DB', err);
	});
 
module.exports = db;

// new structure
db.Auth = require('./models/auths.model');
db.Role = require('./models/Roles.model');
db.X_Auth_Role = require('./models/x_auths_roles.model');
db.Contact = require('./models/contacts.model'); // hold the (type: [individual, organizatio], name) connected to Auths
db.Phone = require('./models/phones.model'); // holds the (contactId, number)
db.Address = require('./models/address.model');
db.Nationality = require('./models/nationality.model');
db.Grade = require('./models/grade.model');
db.School = require('./models/school.model');
db.MedicalIssue = require('./models/medicalIssue.model');

db.Category = require('./models/category.model');
db.SubCategory = require('./models/subCategory.model');
db.Event = require('./models/event.model');
db.ProgramDetails = require('./models/programDetails.model');


// db.Member = require('./models/member.model');
// db.Maker = require('./models/maker.model');
db.GeoLocation = require('./models/geoLocation.model');
db.AgeGroup = require('./models/ageGroup.model');
db.Feedback = require('./models/feedback.model');
db.Expense = require('./models/expense.model');
db.ExpenseType = require('./models/expenseType.model');



/* ****************************************************
				 	Relations
   **************************************************** */
// new structure:
db.Auth.belongsToMany(db.Role, { through: db.X_Auth_Role });
db.Auth.hasMany(db.Contact);

// Contact
db.Contact.hasMany(db.Phone);
db.Contact.belongsTo(db.Nationality);
db.Contact.belongsTo(db.Grade);
db.Contact.belongsTo(db.School);
db.Contact.hasMany(db.Address);
db.Contact.hasMany(db.MedicalIssue);

// Event
db.SubCategory.belongsTo(db.Category);
db.Contact.hasMany(db.Event);
db.Event.belongsTo(db.Category);
db.Event.belongsTo(db.SubCategory);
db.Event.belongsTo(db.AgeGroup);
db.Event.belongsTo(db.Address);
db.Address.belongsTo(db.GeoLocation);
db.ProgramDetails.belongsTo(db.Event);








// db.Member.belongsToMany(db.Event, {through: 'MemberEvent'});
// db.Event.belongsToMany(db.Member, {through: 'MemberEvent'});
// db.Expense.belongsToMany(db.Event, {through: 'EventExpense'});
// db.Expense.belongsTo(db.ExpenseType);

// Connect the address with the geolocation


// One to Many relationship between member and feedback each member has many feedbacks and each feedback belongsto member
// feedback table (memberId, eventId, feedback)

// will add to member .getFeedbacks .setFeedbacks .createFeedback .addFeedbacks .removeFeedback .removeFeedbacks .hasFeedback .hasFeedbacks .counFeedbacks
// db.Feedback.belongsTo(db.Member);
// will create feedback .getMember .setMember .createMember
// db.Feedback.belongsTo(db.Event);
// will create feedback .getEvent .setEvent .createEvent


// When drop the database recreate fixed data
// Expense types
// addExpenseTypes();
// createRoles();
// addNationalities();
// addGrades();
// addSchools();
// addCategories();
// addSubCategories();
// addAgeGroups();

db.sequelize.sync();



function addExpenseTypes() {
	var exTypes = ['Salary', 'Rent', 'Hospitality', 'Misc'];
	for (var i in exTypes) {
		console.log(exTypes[i]);
		var id = i + 1;
		ExpenseType.create({ id: id, type: exTypes[i] });
	}
}


function createRoles(){
	var roles = ['Member', 'Organizer', 'Coach', 'Employee', 'Admin'];
	for (var i in roles){
		db.Role.create({name: roles[i]});
	}

}

function addNationalities() {
	var nationalities = ['Jordanian', 'Iraqi', 'Syrian'];
	for (var i in nationalities) {
		db.Nationality.create({nationality: nationalities[i] });
	}
}

function addSchools(){
	var schools = ['Alruwad', 'Almohammadiya', 'Amman Academy', 'American co,,unity school', 'Modern American school'];
	for(var i in schools){
		// var id = Number(i)+1;
		db.School.create({name: schools[i]});
	}
}

function addGrades(){
	var grades = ['KG1', 'KG2', '1','2','3','4','5','6','7','8','9','10','11','12'];
	for(var i in grades){
		// var id = Number(i) + 1;
		// console.log('id is: ', id);
		db.Grade.create({grade: grades[i]});
	}
}

function addCategories(){
	var categories = ['Sport', 'Art', 'Fair'];
	for(var i in categories){
		var id = Number(i) + 1;
		db.Category.create({id: id, category: categories[i]});
	}
}

function addSubCategories(){
	var subCategories = [{name: 'Soccer', categoryId: 1}, {name: 'Basketball', categoryId: 1}, {name: 'Swimming', categoryId: 1}, {name: 'Painting', categoryId: 2}, {name: 'Foodfair', categoryId: 3}];
	for(var i in subCategories){
		var id = Number(i) + 1;
		db.SubCategory.create({ id: id, subcategory: subCategories[i].name, categoryId: subCategories[i].categoryId});
	}
}

function addAgeGroups(){
	var ages = [
		{ name: 'From 4 to 6', from: '4', to: '6' },
		{ name: 'From 7 to 9', from: '7', to: '9' },
		{ name: 'From 10 to 12', from: '10', to: '12' },
		{ name: 'From 13 to 15', from: '13', to: '15' },
		{ name: 'From 16 to 18', from: '16', to: '18' }
	];
	for(var i in ages){
		var id = Number(i)+1;
		ages[i].id = id;
		db.AgeGroup.create(ages[i]);
	}
}