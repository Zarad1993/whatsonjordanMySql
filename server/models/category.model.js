var Sequelize = require('sequelize')
var db = require('../databse')

var Category = db.define('category', {
    category: {
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

module.exports = Category;