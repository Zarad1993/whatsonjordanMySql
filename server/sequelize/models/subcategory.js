'use strict';
module.exports = (sequelize, DataTypes) => {
  const subCategory = sequelize.define('subCategory', {
    subcategory: DataTypes.STRING
  }, {});
  subCategory.associate = function(models) {
    // associations can be defined here
    subCategory.belongsTo(models.category, { onDelete: 'cascade' });
  };
  return subCategory;
};