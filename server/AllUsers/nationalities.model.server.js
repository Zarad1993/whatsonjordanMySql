var db = require('../databse');
var nationalitiesDB = db.Nationality; //require('../models/nationality.model');

db.sequelize.sync();

module.exports = nationalitiesDB;

nationalitiesDB.getAllNationalities = getAllNationalities;


function getAllNationalities() {
    return nationalitiesDB
        .findAll({raw: true})
        .then(function(nationalities){
            var allNationalities = { allNationalities: nationalities };
            return allNationalities;
        })
}