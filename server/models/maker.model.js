var Sequelize = require('sequelize');
var db = require('../databse');
var Maker = db.sequelize.define('maker', {
    firstName: {
        type: Sequelize.STRING
    },
    middleName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    },
    organizationName:{
        type: Sequelize.STRING
    },
    // DOB: {
    //     type: Sequelize.DATE
    // },
    profileImage: {
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
module.exports = Maker;