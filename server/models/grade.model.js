var Sequelize = require('sequelize');
var db = require('../databse');

var Grade = db.define('grade', {
    grade: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    }
});

module.exports = Grade;