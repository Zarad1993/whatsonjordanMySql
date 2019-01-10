var Sequelize = require('sequelize');
var db = require('../databse').sequelize;
var UserType = db.define('user_type', {
    userType : {
        type: Sequelize.STRING,
        allowNull : false
    }
});
module.exports = UserType;
