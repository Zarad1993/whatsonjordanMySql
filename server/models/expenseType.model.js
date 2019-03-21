var Sequelize = require('sequelize');
var db = require('../databse');

var ExpenseType = db.define('expenseType', {
    type: {
        type: Sequelize.INTEGER
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = ExpenseType;