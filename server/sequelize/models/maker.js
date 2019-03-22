'use strict';
module.exports = (sequelize, DataTypes) => {
  const maker = sequelize.define('maker', {
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    organizationName: DataTypes.STRING,
    profileImage: DataTypes.STRING
  }, {});
  maker.associate = function(models) {
    // associations can be defined here
    maker.belongsTo(models.contact, { onDelete: 'cascade' });
    maker.belongsTo(models.address, { onDelete: 'cascade' });
    maker.hasMany(models.event, { onDelete: 'cascade' });
  };
  return maker;
};