var db = require('../databse');
var subCategoriesDB = db.SubCategory; // require('../models/subCategory.model');

db.sequelize.sync();

module.exports = subCategoriesDB;

subCategoriesDB.getAllSubCategories = getAllSubCategories;


function getAllSubCategories() {
    return subCategoriesDB
        .findAll({raw: true})
        .then(function (subCategories) {
            var allSubCategories = { allSubCategories: subCategories};
            return allSubCategories;
        })
}