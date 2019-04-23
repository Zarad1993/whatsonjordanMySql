var db = require('../databse');
var ageGroupsDB = db.AgeGroup;  // require('../models/ageGroup.model');

db.sequelize.sync();

module.exports = ageGroupsDB;

ageGroupsDB.getAllAgeGroups = getAllAgeGroups;


function getAllAgeGroups() {
    return ageGroupsDB
        .findAll({ raw: true })
        .then(function (ageGroups) {
            var allAgeGroups = { allAgeGroups: ageGroups };
            return allAgeGroups;
            //     // console.log('the categories on the model:', allCategories);

        })
}