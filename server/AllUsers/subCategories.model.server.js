var db = require('../databse');
var subCategoriesDB = require('../models/subCategory.model');

db.sync();

module.exports = subCategoriesDB;

subCategoriesDB.getAllSubCategories = getAllSubCategories;


function getAllSubCategories() {
    return subCategoriesDB
        .findAll();
        // .then(function (allSubCategories) {
        //     return allSubCategories;
        // })
}