var Sequelize = require('sequelize');
var db = require('../databse');
var User = db.sequelize.define('users', {
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	resetPasswordToken:{
		type: Sequelize.STRING
	},
	resetPasswordExpires:{
		type: Sequelize.DATE
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
module.exports = User;