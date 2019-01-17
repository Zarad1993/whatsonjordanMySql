var Sequelize = require('sequelize');
var db = require('../databse');

var School = db.define('school', {
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
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    }
});

module.exports = School;