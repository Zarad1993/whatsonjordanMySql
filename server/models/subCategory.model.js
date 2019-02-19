var Sequelize = require('sequelize')
var db = require('../databse')

var SubCategory = db.define('subCategory', {
    subcategory: {
        type: Sequelize.STRING
    }
})

module.exports = SubCategory;