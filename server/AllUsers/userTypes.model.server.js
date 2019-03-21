
var db = require('../databse');
// var role = require('../models/userType.model');
var userTypesDB = db.UserType; //require('../models/userType.model');

db.sequelize.sync();


module.exports = userTypesDB;

userTypesDB.getAllUserTypes = getAllUserTypes;




function getAllUserTypes(){
    return userTypesDB
			.findAll({attributes: ['id', 'userType']});
}