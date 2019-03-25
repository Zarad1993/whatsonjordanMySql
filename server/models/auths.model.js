var Sequelize = require('sequelize');
var db = require('../databse');
var Auths = db.sequelize.define('auths', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV1,
		primaryKey: true
	},
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
module.exports = Auths;