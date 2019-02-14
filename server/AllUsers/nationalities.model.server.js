var db = require('../databse');
var nationalitiesDB = require('../models/nationality.model');

db.sync();

module.exports = nationalitiesDB;

nationalitiesDB.getAllNationalities = getAllNationalities;


function getAllNationalities() {
    return nationalitiesDB
        .findAll({})
}