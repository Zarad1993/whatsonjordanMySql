var Sequelize = require('sequelize');
var db = require('../databse');

var AgeGroup = db.define('ageGroup', {
    ageGroup: {
        type: Sequelize.STRING
    },
})

module.exports = AgeGroup;