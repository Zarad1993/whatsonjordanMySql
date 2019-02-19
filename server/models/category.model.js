var Sequelize = require('sequelize')
var db = require('../databse')

var Category = db.define('category', {
    category: {
        type: Sequelize.STRING
    }
})

module.exports = Category;