
var db = require('../databse');
// console.log('the db object:', Object.keys(db));
var roleDB = db.Roles;

db.sequelize.sync();


module.exports = roleDB;

roleDB.getAllRoles = getAllRoles;




function getAllRoles(){
    return roleDB
			.findAll({attributes: ['id', 'name']});
}