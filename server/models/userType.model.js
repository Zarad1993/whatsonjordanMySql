var Sequelize = require('sequelize');
var db = require('../databse');
var UserType = db.define('user_type', {
    userType : {
        type: Sequelize.STRING,
        allowNull : false
    }
});
module.exports = UserType;
