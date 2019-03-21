var db = require('../databse');
var ageGroupsDB = db.AgeGroup;  // require('../models/ageGroup.model');

db.sequelize.sync();

module.exports = ageGroupsDB;

ageGroupsDB.getAllAgeGroups = getAllAgeGroups;


function getAllAgeGroups() {
    return ageGroupsDB
        .findAll({})
        // .then(function (allCategories) {
        //     return allCategories.map(function (category) { return category.get({ plain: true }) });;
        // })
}