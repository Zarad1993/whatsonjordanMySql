var Sequelize = require('sequelize');
var db = require('../databse');
var Roles = db.sequelize.define('roles', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    name : {
        type: Sequelize.STRING,
        allowNull : false
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
module.exports = Roles;
