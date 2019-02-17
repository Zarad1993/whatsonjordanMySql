var Sequelize = require('sequelize');
var db = require('../databse');
var Maker = db.define('maker', {
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
    // gender: {
    //     type: Sequelize.STRING
    // },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
    }
});
module.exports = Maker;