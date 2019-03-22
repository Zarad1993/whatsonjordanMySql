'use strict';
module.exports = (sequelize, DataTypes) => {
  const userType = sequelize.define('userType', {
    userType: DataTypes.STRING
  }, {});
  userType.associate = function(models) {
    // associations can be defined here
  };
  return userType;
};