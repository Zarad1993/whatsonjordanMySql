var db = require('../sequelize/models/index');
// console.log('the db object:', Object.keys(db));
var ageGroupsDB = db.ageGroup; //require('../models/ageGroup.model');

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