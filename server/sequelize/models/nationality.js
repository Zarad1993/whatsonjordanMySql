'use strict';
module.exports = (sequelize, DataTypes) => {
  const nationality = sequelize.define('nationality', {
    nationality: DataTypes.STRING
  }, {});
  nationality.associate = function(models) {
    // associations can be defined here
  };
  return nationality;
};