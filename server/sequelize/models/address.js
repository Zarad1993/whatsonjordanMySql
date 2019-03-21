'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address', {
    country: DataTypes.STRING,
    province: DataTypes.STRING,
    city: DataTypes.STRING,
    srteet: DataTypes.STRING,
    building: DataTypes.STRING,
    note: DataTypes.STRING,
    createdBy: DataTypes.STRING
  }, {});
  address.associate = function(models) {
    // associations can be defined here
    address.belongsTo(models.geoLocation, { foreignKey: 'geoLocationId' });
  };
  return address;
};