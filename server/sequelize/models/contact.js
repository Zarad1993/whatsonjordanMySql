'use strict';
module.exports = (sequelize, DataTypes) => {
  const contact = sequelize.define('contact', {
    phone: DataTypes.STRING,
    fatherPhone: DataTypes.STRING,
    motherPhone: DataTypes.STRING,
    emergency: DataTypes.STRING,
    phone1: DataTypes.STRING,
    phone2: DataTypes.STRING
  }, {});
  contact.associate = function(models) {
    // associations can be defined here
  };
  return contact;
};