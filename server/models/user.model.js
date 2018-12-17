module.exports = function(sequelize, Sequelize){
	var User = sequelize.define('users', {
	  // user_id: {
   //      type: Sequelize.INTEGER,
   //      primaryKey: true,
   //      autoIncrement: true
   //    },
	  firstName: {
		  type: Sequelize.STRING
	  },
	  middleName:{
	  	type: Sequelize.STRING
	  },
	  lastName: {
		  type: Sequelize.STRING
	  },
	  email: {
	  	type: Sequelize.STRING,
	  	allowNull: false
	  },
	  password: {
	  	type: Sequelize.STRING,
	  	allowNull: false
	  },
	  userType: {
		type: Sequelize.STRING, 
		defaultValue: 'user'
	  }
	},
	{timestamps: false});	
	return User;
};