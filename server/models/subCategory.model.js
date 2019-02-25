var Sequelize = require('sequelize')
var db = require('../databse')

var SubCategory = db.define('subCategory', {
    subcategory: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
})

module.exports = SubCategory;