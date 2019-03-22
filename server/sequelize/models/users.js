'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.STRING
  }, {});
  users.associate = function(models) {
    // associations can be defined here
    users.belongsTo(models.userType, { onDelete: 'cascade' });
    users.belongsTo(models.member, { onDelete: 'cascade' });
    users.belongsTo(models.maker, { onDelete: 'cascade' });
  };
  return users;
};