var Sequelize = require('sequelize');
var db = require('../databse');

var AgeGroup = db.define('ageGroup', {
    name: {
        type: Sequelize.STRING
    },
    from: {
        type: Sequelize.INTEGER
    },
    to: {
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

module.exports = AgeGroup;