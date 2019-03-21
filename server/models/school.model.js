var Sequelize = require('sequelize');
var db = require('../databse');

var School = db.sequelize.define('school', {
    name: {
        type: Sequelize.STRING
    },
    address:{
        type: Sequelize.STRING
    },
    phone1:{
        type: Sequelize.STRING
    },
    phone2: {
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING
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

module.exports = School;