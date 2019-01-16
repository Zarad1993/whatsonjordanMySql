var Sequelize = require('sequelize');
var db = require('../databse');

var Events = db.define('event', {
    name: {
        type: Sequelize.STRING,
        allowNull = false
    },
    details: {
        type: Sequelize.STRING
    },
    startingDate:{
        type: Sequelize.DATE
    },
    expiryDate:{
        type: Sequelize.DATE
    },
    sessionStartTime: {
        type: Sequelize.TIME
    },
    sessionEndTime: {
        type: Sequelize.TIME
    },
    daysPerWeek: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
    termsAndConditions: {
        type: Sequelize.STRING
    },
    approved: {
        type: Sequelize.BOOLEAN
    },
    special:{
        type: Sequelize.BOOLEAN
    }
});

module.exports = Events;