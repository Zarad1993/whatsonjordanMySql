var Sequelize = require('sequelize');
var db = require('../databse');

var MedicalIssue = db.sequelize.define('medicalIssue', {
    title: {
        type: Sequelize.STRING
    },
    details:{
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

module.exports = MedicalIssue;