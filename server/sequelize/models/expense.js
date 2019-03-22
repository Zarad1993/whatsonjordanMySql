// 'use strict';
module.exports = function(sequelize, DataTypes){
  var expense = sequelize.define('expense', {
    type: DataTypes.STRING,
    details: DataTypes.STRING,
    amount: DataTypes.DECIMAL
  }, {});
  expense.associate = function(models) {
    // associations can be defined here
  };
  return expense;
};