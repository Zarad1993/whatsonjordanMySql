var Sequelize = require('sequelize');
var db = require('../databse');
var User = db.define('users', {
	// firstName: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false
	// },
	// middleName:{
	// 	type: Sequelize.STRING
	// },
	// lastName: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false
	// },
	// DOB:{
	// 	type: Sequelize.DATE,
	// 	allowNull: false
	// },
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	// profileImage: {
	// 	type: Sequelize.STRING
	// },
	// gender: {
	// 	type: Sequelize.STRING
	// },
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