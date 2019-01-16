var Sequelize = require('sequelize');
var db = require('../databse');

var Nationality = db.define('nationality', {
    nationality: {
        type: Sequelize.STRING
    }
});

module.exports = Nationality;