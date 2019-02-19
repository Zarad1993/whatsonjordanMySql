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
    }
});

module.exports = AgeGroup;