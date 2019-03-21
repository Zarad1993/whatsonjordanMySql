'use strict';
module.exports = (sequelize, DataTypes) => {
  const school = sequelize.define('school', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone1: DataTypes.STRING,
    phone2: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  school.associate = function(models) {
    // associations can be defined here
  };
  return school;
};