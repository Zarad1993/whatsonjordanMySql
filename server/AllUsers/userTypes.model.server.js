
var db = require('../databse');
// var role = require('../models/userType.model');
var userTypesDB = require('../models/userType.model');

db.sync();


module.exports = userTypesDB;

userTypesDB.getAllUserTypes = getAllUserTypes;




function getAllUserTypes(){
    return userTypesDB
			.findAll({attributes: ['id', 'userType']});
}