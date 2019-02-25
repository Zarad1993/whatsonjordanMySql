var Sequelize = require('sequelize');
var db = require('../databse');
var Contact = db.define('contact', {
    phone:{
        type: Sequelize.STRING
    },
    fatherPhone:{
        type: Sequelize.STRING
    },
    motherPhone: {
        type: Sequelize.STRING
    },
    emergency:{
        type: Sequelize.STRING
    },
    phone1: {
        type: Sequelize.STRING
    },
    phone2: {
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
module.exports = Contact;