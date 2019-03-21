var db = require('../sequelize/models/index');
// console.log('the db object:', Object.keys(db));
var subCategoriesDB = db.subCategory; //require('../models/subCategory.model');

db.sequelize.sync();

module.exports = subCategoriesDB;

subCategoriesDB.getAllSubCategories = getAllSubCategories;


function getAllSubCategories() {
    return subCategoriesDB
        .findAll();
        // .then(function (allSubCategories) {
        //     return allSubCategories;
        // })
}