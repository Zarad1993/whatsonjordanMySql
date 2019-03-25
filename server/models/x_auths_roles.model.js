var Sequelize = require('sequelize');
var db = require('../databse');
var X_Auths_Roles = db.sequelize.define('x_auths_roles', {
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
});
module.exports = X_Auths_Roles;
