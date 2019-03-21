var Sequelize = require('sequelize')
var db = require('../databse')

var Expense = db.define('expense', {
    // type: {
    //     type: Sequelize.STRING
    // },
    details: {
        type: Sequelize.STRING
    },
    amount: {
        type: Sequelize.DECIMAL
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

module.exports = Expense;