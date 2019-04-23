var db = require('../databse');
var categoriesDB = db.Category; // require('../models/category.model');

db.sequelize.sync();

module.exports = categoriesDB;

categoriesDB.getAllCategories = getAllCategories;


function getAllCategories() {
    return categoriesDB.findAll({raw: true})
        .then(function (categories) {
            var allCategories = { allCategories: categories};
            return allCategories;
        //     // console.log('the categories on the model:', allCategories);
            
        })
}