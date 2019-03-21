var db = require('../databse');
var categoriesDB = db.Category; // require('../models/category.model');

db.sequelize.sync();

module.exports = categoriesDB;

categoriesDB.getAllCategories = getAllCategories;


function getAllCategories() {
    return categoriesDB
        .findAll()
        // .then(function (allCategories) {
        //     // return allCategories.map(function (category) { return category.get({ plain: true }) });;
        //     console.log('the categories on the model:', allCategories);
            
        // })
}