'use strict';
module.exports = (sequelize, DataTypes) => {
  const geoLocation = sequelize.define('geoLocation', {
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING
  }, {});
  geoLocation.associate = function(models) {
    // associations can be defined here
    geoLocation.hasOne(models.address);
  };
  return geoLocation;
};