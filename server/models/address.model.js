var Sequelize = require('sequelize');
var db = require('../databse');

var Address = db.sequelize.define('address', {
    country: {
        type: Sequelize.STRING
    },
    province: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    street: {
        type: Sequelize.STRING
    },
    building: {
        type: Sequelize.STRING
    },
    note: {
        type: Sequelize.STRING
    },
    createdBy: {
        type: Sequelize.STRING
    }
});

module.exports = Address;