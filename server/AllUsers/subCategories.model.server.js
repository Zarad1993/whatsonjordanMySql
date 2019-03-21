var db = require('../databse');
var subCategoriesDB = db.SubCategory; // require('../models/subCategory.model');

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