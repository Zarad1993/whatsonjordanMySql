var Sequelize = require('sequelize');
var db = require('../databse');
var X_Auth_Role = db.sequelize.define('x_auth_role', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    freezeTableName: true,
    tableName: 'x_auth_role'});
module.exports = X_Auth_Role;
