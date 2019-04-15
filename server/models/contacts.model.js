var Sequelize = require('sequelize');
var db = require('../databse');
var Contacts = db.sequelize.define('contact', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    type: {
        type: Sequelize.ENUM(['Individual', 'Organization']),
        defaultValue: 'Individual'
    },
    name: {
        type: Sequelize.STRING
    },
    DOB: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    profileImage: {
        type: Sequelize.STRING,
        defaultValue: 'https://image.flaticon.com/icons/svg/145/145867.svg'
    },
    gender: {
        type: Sequelize.STRING,
        defaultValue: null
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
    
    // phone:{
    //     type: Sequelize.STRING
    // },
    // fatherPhone:{
    //     type: Sequelize.STRING
    // },
    // motherPhone: {
    //     type: Sequelize.STRING
    // },
    // emergency:{
    //     type: Sequelize.STRING
    // },
    // phone1: {
    //     type: Sequelize.STRING
    // },
    // phone2: {
    //     type: Sequelize.STRING
    // },
    // createdAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW
    // },
    // updatedAt: {
    //     type: Sequelize.DATE,
    //     defaultValue: Sequelize.NOW
    // }
});
module.exports = Contacts;