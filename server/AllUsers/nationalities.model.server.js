var db = require('../sequelize/models/index');
// console.log('the db object:', Object.keys(db));
var nationalitiesDB = db.nationality; //require('../models/nationality.model');

db.sequelize.sync();

module.exports = nationalitiesDB;

nationalitiesDB.getAllNationalities = getAllNationalities;


function getAllNationalities() {
    return nationalitiesDB
        .findAll({})
}