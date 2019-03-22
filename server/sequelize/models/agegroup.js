'use strict';
module.exports = (sequelize, DataTypes) => {
  const ageGroup = sequelize.define('ageGroup', {
    name: DataTypes.STRING,
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER
  }, {});
  ageGroup.associate = function(models) {
    // associations can be defined here
  };
  return ageGroup;
};