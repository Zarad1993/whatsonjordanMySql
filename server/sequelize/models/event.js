'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    name: DataTypes.STRING,
    details: DataTypes.STRING,
    startingDate: DataTypes.DATE,
    expiryDate: DataTypes.DATE,
    sessionStartTime: DataTypes.DATE,
    sessionEndTime: DataTypes.DATE,
    daysPerWeek: DataTypes.JSON,
    dailyDetails: DataTypes.JSON,
    images: DataTypes.JSON,
    price: DataTypes.STRING,
    termsAndConditions: DataTypes.STRING,
    originalEventId: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    special: DataTypes.BOOLEAN
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    event.belongsTo(models.category, { foreignKey: 'categoryId' });
    event.belongsTo(models.ageGroup, { foreignKey: 'ageGroupId' });
    event.belongsTo(models.maker, { foreignKey: 'makerId' });
    event.belongsTo(models.address, { foreignKey: 'addressId' });
    event.belongsTo(models.subCategory, { foreignKey: 'subCategoryId' });
    event.belongsToMany(models.member, { through: 'MemberEvent' });
  };
  return event;
};