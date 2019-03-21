'use strict';
module.exports = (sequelize, DataTypes) => {
  const expenseType = sequelize.define('expenseType', {
    type: DataTypes.STRING
  }, {});
  expenseType.associate = function(models) {
    // associations can be defined here
  };
  return expenseType;
};