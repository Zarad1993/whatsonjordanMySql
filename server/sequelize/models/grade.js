'use strict';
module.exports = (sequelize, DataTypes) => {
  const grade = sequelize.define('grade', {
    grade: DataTypes.STRING
  }, {});
  grade.associate = function(models) {
    // associations can be defined here
  };
  return grade;
};